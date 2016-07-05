import React, { Component } from 'react';
import { Observable } from 'rx';
import DataTable from 'd2-ui/lib/data-table/DataTable.component';
import { getInstance } from 'd2/lib/d2';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';
import Dialog from 'material-ui/lib/dialog';
import FormBuilder from 'd2-ui/lib/forms/FormBuilder.component';
import Heading from 'd2-ui/lib/headings/Heading.component';
import FormButtons from '../FormButtons.component';
import SaveButton from '../SaveButton.component';
import snackActions from '../../Snackbar/snack.actions';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';
import CancelButton from '../CancelButton.component';
import modelToEditStore from '../modelToEditStore';
import OptionSorter from './OptionSorter.component';
import { typeToFieldMap, getFieldUIComponent, getValidatorsFromModelValidation } from '../../forms/fields';
import { createFieldConfigForModelTypes } from '../EditModelForm.component';
import Pagination from 'd2-ui/lib/pagination/Pagination.component';
import { calculatePageValue } from '../../List/List.component';
import actions from './actions';
import { optionDialogStore, optionsForOptionSetStore } from './stores.js';
import LinearProgress from 'material-ui/lib/linear-progress';
import AlertIcon from 'material-ui/lib/svg-icons/alert/warning';
import TranslationDialog from 'd2-ui/lib/i18n/TranslationDialog.component';

const optionList$ = Observable.combineLatest(
    optionsForOptionSetStore,
    Observable.just(['name', 'code']),
    ({options, pager, ...other}, columns) => ({
        ...other,
        rows: options,
        pager,
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
            <Dialog
                open={this.props.isDialogOpen}
                onRequestClose={this.props.onRequestClose}
                autoScrollBodyContent
            >
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
            modelToTranslate: null,
        };

        this._onAddOption = this._onAddOption.bind(this);
        this._onEditOption = this._onEditOption.bind(this);
        this._onAddDialogClose = this._onAddDialogClose.bind(this);

        this.i18n = context.d2.i18n;
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
            translate: (modelToTranslate) => {
                this.setState({
                    modelToTranslate,
                })
            }
        };

        return (
            <div style={styles.optionManagementWrap}>
                <OptionSorter style={styles.sortBarStyle} buttonStyle={styles.sortButtonStyle} rows={this.props.rows} />
                {this.props.pager && this.props.pager.total > 50 ? this.displayInCorrectOrderWarning() : undefined}
                {this.renderPagination()}
                <div style={styles.dataTableWrap}>
                    {this.props.isLoading ? <LinearProgress indeterminate /> : undefined}
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
                {this.state.modelToTranslate ? <TranslationDialog
                    objectToTranslate={this.state.modelToTranslate}
                    objectTypeToTranslate={this.state.modelToTranslate && this.state.modelToTranslate.modelDefinition}
                    open={Boolean(this.state.modelToTranslate)}
                    onTranslationSaved={this._translationSaved}
                    onTranslationError={this._translationErrored}
                    onRequestClose={() => this.setState({ modelToTranslate: null, })}
                    fieldsToTranslate={['name']}
                /> : null }
            </div>
        );
    }

    renderPagination() {
        if (!this.props.pager) {
            return null;
        }

        const styles = {
            paginationWrap: {
                padding: '0 1rem',
            },
        };

        const paginationProps = {
            hasNextPage: () => Boolean(this.props.pager.hasNextPage) && this.props.pager.hasNextPage(),
            hasPreviousPage: () => Boolean(this.props.pager.hasPreviousPage) && this.props.pager.hasPreviousPage(),
            onNextPageClick: () => {
                this.setState({isLoading: true});
                this.props.getNextPage();
            },
            onPreviousPageClick: () => {
                this.setState({isLoading: true});
                this.props.getPreviousPage();
            },
            total: this.props.pager.total,
            currentlyShown: calculatePageValue(this.props.pager),
        };

        return (
            <div style={styles.paginationWrap}>
                <Pagination {...paginationProps} />
            </div>
        );
    }

    displayInCorrectOrderWarning() {
        const style = {
            color: 'orange',
            display: 'flex',
            padding: '0.5rem',
            border: '1px dotted orange',
            borderRadius: '0.5rem',
            margin: '2rem 1rem 0',
        };

        const textStyle = {
            lineHeight: '2rem',
            paddingLeft: '1rem',
        };

        return (
            <div style={style}>
                <AlertIcon color="orange" />
                <div style={textStyle}>{this.i18n.getTranslation('list_might_not_represent_the_accurate_order_of_options_due_the_availability_of_pagination')}</div>
            </div>
        );
    }

    _translationSaved() {
        snackActions.show({ message: 'translation_saved', action: 'ok', translate: true });
    }

    _translationErrored(errorMessage) {
        log.error(errorMessage);
        snackActions.show({ message: 'translation_save_error', translate: true });
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
