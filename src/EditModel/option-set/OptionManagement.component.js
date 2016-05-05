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

const actions = Action.createActionsFromNames(['saveOption', 'setActiveModel', 'closeOptionDialog', 'getOptionsFor', 'deleteOption', 'updateModel'], 'optionSet');
const optionsForOptionSetStore = Store.create({
    getInitialState() {
        return [];
    }
});

const optionDialogStore = Store.create();

actions.updateModel.subscribe(({data: [model, field, value]}) => {
    model[field] = value;

    optionDialogStore.setState({
        ...optionDialogStore.state,
        model,
    });
});

actions.setActiveModel.subscribe(async ({data: model}) => {
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
    .subscribe(({data: [model, parentModel], complete, error}) => {
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

actions.getOptionsFor.subscribe(async ({data: model, complete, error}) => {
    const optionSetModelDefinition = model.modelDefinition;

    if (model.id) {
        const options = await optionSetModelDefinition
            .get(model.id, {fields: 'options[:all,href]'})
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

actions.deleteOption.subscribe(async ({data: [modelToDelete, modelParent], complete, error}) => {
    const d2 = await getInstance();
    const api = d2.Api.getApi();

    if (!modelParent.id && modelToDelete.id) {
        return error('unable_to_delete_due_to_missing_id');
    }

    const deleteMessage = d2.i18n.getTranslation(`option_$$name$$_deleted`, { name: modelToDelete.name });

    api.delete(`${modelParent.modelDefinition.apiEndpoint}/${modelParent.id}/options/${modelToDelete.id}`)
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
        props: {
            floatingLabelText: 'name',
        },
    },
    {
        name: 'code',
        component: TextField,
        props: {
            floatingLabelText: 'code',
        },
    },
];

const optionList$ = Observable.combineLatest(
    optionsForOptionSetStore,
    Observable.just(['name', 'code']),
    (options, columns) => ({
        rows: options,
        columns,
    })
);

optionList$.subscribe(() => console.log('optionList$'));

const optionFormData$ = Observable.combineLatest(
    Observable.just(fieldConfigsForOption)
        .flatMap(async (fieldConfigs) => {
            const d2 = await getInstance();

            return fieldConfigs.map((fieldConfig) => {
                const fieldConfigWithLabel = Object.assign({}, fieldConfig);
                fieldConfigWithLabel.props = Object.assign({}, fieldConfigWithLabel.props, {
                    floatingLabelText: d2.i18n.getTranslation(fieldConfig.props.floatingLabelText),
                });

                return fieldConfigWithLabel;
            });
        }),
    optionDialogStore,
    (fieldConfigs, optionDialogState) => ({
        fieldConfigs,
        model: optionDialogState.model,
        isAdd: !optionDialogState.model.id,
        isDialogOpen: optionDialogState.isDialogOpen,
    }))
    .flatMap(async ({fieldConfigs, model, isAdd, ...other}) => {
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
                position: 'relative',
                paddingTop: '2.5rem',
                marginTop: '2rem',
            },
            addButton: {
                position: 'absolute',
                top: '.5rem',
                right: '.5rem',
            },
        };

        const contextActions = {
            edit: this._onEditOption,
            delete: (modelToDelete) => actions.deleteOption(modelToDelete, this.props.model),
        };

        return (
            <div style={styles.optionManagementWrap}>
                <DataTable
                    rows={this.props.rows}
                    columns={this.props.columns}
                    primaryAction={this._onEditOption}
                    contextMenuActions={contextActions}
                />
                <FloatingActionButton onClick={this._onAddOption} style={styles.addButton}>
                    <ContentAdd />
                </FloatingActionButton>
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
