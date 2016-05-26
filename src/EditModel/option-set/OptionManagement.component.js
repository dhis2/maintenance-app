import React, { Component } from 'react';
import { Observable } from 'rx';
import DataTable from 'd2-ui/lib/data-table/DataTable.component';
import { getInstance } from 'd2/lib/d2';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';
import Dialog from 'material-ui/lib/dialog';
import FormBuilder from 'd2-ui/lib/forms/FormBuilder.component';
import TextField from 'material-ui/lib/text-field';
import Heading from 'd2-ui/lib/headings/Heading.component';
import FormButtons from '../FormButtons.component';
import SaveButton from '../SaveButton.component';
import Action from 'd2-ui/lib/action/Action';
import snackActions from '../../Snackbar/snack.actions';
import Store from 'd2-ui/lib/store/Store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';
import isArray from 'd2-utilizr/lib/isArray';
import CancelButton from '../CancelButton.component';
import modelToEditStore from '../modelToEditStore';
import OptionSorter from './OptionSorter.component';
import { typeToFieldMap, getFieldUIComponent, getValidatorsFromModelValidation } from '../../forms/fields';
import { createFieldConfigForModelTypes } from '../EditModelForm.component';

const actions = Action.createActionsFromNames(['saveOption', 'setActiveModel', 'closeOptionDialog', 'getOptionsFor', 'deleteOption', 'updateModel'], 'optionSet');
export const optionsForOptionSetStore = Store.create({
    getInitialState() {
        return [];
    },
});

const optionDialogStore = Store.create();

actions.updateModel.subscribe(({ data: [modelToEdit, field, value] }) => {
    const model = modelToEdit;
    model[field] = value;

    optionDialogStore.setState({
        ...optionDialogStore.state,
        model,
    });
});

actions.setActiveModel.subscribe(async ({ data: model }) => {
    const d2 = await getInstance();
    let modelToSave = model;

    // When no model is passed we create a new model
    if (isArray(model) && !model.length) {
        modelToSave = d2.models.option.create();
    }

    optionDialogStore.setState({
        ...optionDialogStore.state,
        isDialogOpen: true,
        model: modelToSave,
    });
});

actions.saveOption
    .subscribe(({ data: [model, parentModel], complete, error }) => {
        const isAdd = !model.id;

        model.save()
            .then(() => {
                if (isAdd) {
                    // TODO: Use collection patching to solve this.
                    parentModel.options.add(model);
                    return parentModel.save();
                }
                return true;
            })
            .then(complete)
            .catch(error);
    });

actions.getOptionsFor.subscribe(async ({ data: model, complete }) => {
    const d2 = await getInstance();

    if (model && model.id) {
        const options = await d2.models.optionSet
            .get(model.id, { fields: 'options[:all,href]' })
            .then((optionSet) => optionSet.options.toArray());

        optionsForOptionSetStore.setState(options);
    } else {
        optionsForOptionSetStore.setState([]);
    }

    complete();
});

actions.closeOptionDialog.subscribe(() => {
    optionDialogStore.setState({
        ...optionDialogStore.state,
        isDialogOpen: false,
    });
});

actions.deleteOption.subscribe(async ({ data: [modelToDelete, modelParent], complete, error }) => {
    const d2 = await getInstance();
    const api = d2.Api.getApi();

    if (!modelParent.id && modelToDelete.id) {
        return error('unable_to_delete_due_to_missing_id');
    }

    const deleteMessage = d2.i18n.getTranslation('option_$$name$$_deleted', { name: modelToDelete.name });

    return api.delete(`${modelParent.modelDefinition.apiEndpoint}/${modelParent.id}/options/${modelToDelete.id}`)
        .then(() => modelToDelete.delete())
        .then(() => snackActions.show({ message: deleteMessage}))
        .then(() => actions.getOptionsFor(modelParent))
        .then(complete)
        .catch(error);

});

const fieldConfigsForOption = [
    {
        name: 'name',
        component: TextField,
        fieldOptions: {
            labelText: 'name',
        },
    },
    {
        name: 'code',
        component: TextField,
        fieldOptions: {
            labelText: 'code_value',
        },
    },
];

const optionList$ = Observable.combineLatest(
    optionsForOptionSetStore
        //TODO: Remove when we have server side paging
        .map((options) => {
            if(options.length < 50) {
                return options;
            }
            return options.slice(0, 50);
        }),
    Observable.just(['name', 'code']),
    (options, columns) => ({
        rows: options,
        columns,
    })
);

const optionForm$ = Observable.combineLatest(
    Observable.fromPromise(createFieldConfigForModelTypes('option')),
    modelToEditStore,
)
    .flatMap(async ([fieldConfigs, modelToEdit]) => {
        const d2 = await getInstance();

        return fieldConfigs
            .map(fieldConfig => {
                // Adjust the code when dealing with a different
                if (fieldConfig.name === 'code' && typeToFieldMap.has(modelToEdit.valueType)) {
                    // Get the correct matching Ui component
                    fieldConfig.component = getFieldUIComponent(typeToFieldMap.get(modelToEdit.valueType));
                    // Copy the optionSet value type onto the code field
                    fieldConfig.type = typeToFieldMap.get(modelToEdit.valueType);
                    // Generate the validator and pre-translate their messages
                    fieldConfig.validators = getValidatorsFromModelValidation(fieldConfig, d2.models.option)
                        .map(validator => {
                            validator.message = d2.i18n.getTranslation(validator.message);

                            return validator;
                        });
                }
                // For the code field we replace the fieldConfig with a config that matches the type of the optionSet
                return fieldConfig;
            });
    });

const optionFormData$ = Observable.combineLatest(
    optionForm$,
    optionDialogStore,
    (fieldConfigs, optionDialogState) => ({
        fieldConfigs,
        model: optionDialogState.model,
        isAdd: !optionDialogState.model.id,
        isDialogOpen: optionDialogState.isDialogOpen,
    }))
    .flatMap(async ({ fieldConfigs, model, isAdd, ...other }) => {
        const d2 = await getInstance();

        return Promise.resolve({
            fieldConfigs: fieldConfigs.map((fieldConfig) => {
                fieldConfig.value = model[fieldConfig.name];

                if (fieldConfig.name === 'code' && model.id) {
                    fieldConfig.props.disabled = true;
                } else {
                    fieldConfig.props.disabled = false;
                }

                return fieldConfig;
            }),
            model,
            isAdd,
            title: d2.i18n.getTranslation(isAdd ? 'option_add' : 'option_edit'),
            ...other
        });
    })
    .filter(({fieldConfigs}) => fieldConfigs.length);

class AddOptionDialog extends Component {
    constructor(...args) {
        super(...args);

        this.state = {
            isFormValid: true,
            isSaving: false,
        };

        this._onUpdateField = this._onUpdateField.bind(this);
        this._onSaveOption = this._onSaveOption.bind(this);
    }

    render() {
        return (
            <Dialog open={this.props.isDialogOpen} onRequestClose={this.props.onRequestClose}>
                <Heading>{this.props.title}</Heading>
                <FormBuilder fields={this.props.fieldConfigs} onUpdateField={this._onUpdateField} />
                <FormButtons>
                    <SaveButton
                        isValid={this.state.isFormValid}
                        onClick={this._onSaveOption}
                        isSaving={this.state.isSaving}
                    />
                    <CancelButton onClick={this.props.onRequestClose} />
                </FormButtons>
            </Dialog>
        );
    }

    _onUpdateField(field, value) {
        actions.updateModel(this.props.model, field, value);
    }

    _onSaveOption() {
        this.setState({
            isSaving: true,
        });

        actions.saveOption(this.props.model, this.props.parentModel)
            .subscribe(
                () => {
                    snackActions.show({message: 'option_saved', action: 'ok', translate: true});
                    this.setState({
                        isSaving: false,
                    });
                    this.props.onRequestClose();

                    // After the save was successful we request the options from the server to get the updated list
                    actions.getOptionsFor(this.props.parentModel);
                },
                (e) => {
                    snackActions.show({message: 'option_failed_to_save', translate: true});
                    this.setState({
                        isSaving: false,
                    });
                }
            );
    }
}
AddOptionDialog.defaultProps = {
    fieldConfigs: [],
};

const OptionDialogForOptions = withStateFrom(optionFormData$, AddOptionDialog)

class OptionManagement extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            nameSortedASC: false,
            isSorting: false,
        };

        this._onAddOption = this._onAddOption.bind(this);
        this._onEditOption = this._onEditOption.bind(this);
        this._onAddDialogClose = this._onAddDialogClose.bind(this);
    }

    componentDidMount() {
        this.disposable = actions.getOptionsFor(this.props.model).subscribe(() => this.forceUpdate());
    }

    componentWillUnmount() {
        if (this.disposable && this.disposable.dispose) {
            this.disposable.dispose();
        }
    }

    componentWillReceiveProps(newProps) {
        if (this.props.model !== newProps.model) {
            actions.getOptionsFor(newProps.model);
        }
    }

    render() {
        const styles = {
            optionManagementWrap: {
                paddingTop: '1rem',
            },
            dataTableWrap: {
                padding: '1rem',
                paddingTop: '2.5rem',
                marginTop: '1rem',
                position: 'relative',
            },
            addButton: {
                position: 'absolute',
                top: '.5rem',
                right: '.5rem',
            },
            sortBarStyle: {
                paddingLeft: '1rem',
                display: 'flex',
            },
            sortButtonStyle: {
                flex: '0 0 15rem',
                marginRight: '1rem',
            },
        };

        const contextActions = {
            edit: this._onEditOption,
            delete: (modelToDelete) => actions.deleteOption(modelToDelete, this.props.model),
        };

        return (
            <div style={styles.optionManagementWrap}>
                <OptionSorter style={styles.sortBarStyle} buttonStyle={styles.sortButtonStyle} rows={this.props.rows} />
                <div style={styles.dataTableWrap}>
                    <DataTable
                        rows={this.props.rows}
                        columns={this.props.columns}
                        primaryAction={this._onEditOption}
                        contextMenuActions={contextActions}
                    />
                    <FloatingActionButton onClick={this._onAddOption} style={styles.addButton}>
                        <ContentAdd />
                    </FloatingActionButton>
                </div>
                <OptionDialogForOptions
                    onRequestClose={this._onAddDialogClose}
                    parentModel={this.props.model}
                />
            </div>
        );
    }

    _onAddOption() {
        actions.setActiveModel();
    }

    _onAddDialogClose() {
        actions.closeOptionDialog();
    }

    _onEditOption(model) {
        actions.setActiveModel(model);
    }
}
OptionManagement.contextTypes = {
    d2: React.PropTypes.object,
};
OptionManagement.defaultProps = {
    rows: [],
    columns: ['name', 'code'],
    optionDialogOpen: false,
};

const stateForOptionManagement$ = Observable.combineLatest(modelToEditStore, optionList$, (modelToEdit, optionList) => {
    return {
        ...optionList,
        model: modelToEdit,
    }
});

export default withStateFrom(stateForOptionManagement$, OptionManagement);
