import React from 'react';
import disabledOnEdit from '../config/disabled-on-edit';
import { getInstance } from 'd2/lib/d2';
import modelToEditStore from './modelToEditStore';
import objectActions from './objectActions';
import snackActions from '../Snackbar/snack.actions';
import SaveButton from './SaveButton.component';
import CancelButton from './CancelButton.component';
import { isString } from 'd2-utilizr';
import SharingNotification from './SharingNotification.component';
import FormButtons from './FormButtons.component';
import log from 'loglevel';
import extraFields from './extraFields';
import CircularProgress from 'd2-ui/lib/circular-progress/CircularProgress';
import Translate from 'd2-ui/lib/i18n/Translate.mixin';
import FormBuilder from 'd2-ui/lib/forms/FormBuilder.component';
import appState from '../App/appStateStore';
import { Observable } from 'rxjs';
import { createFieldConfigForModelTypes, addUniqueValidatorWhenUnique, getAttributeFieldConfigs } from './formHelpers';
import { applyRulesToFieldConfigs, getRulesForModelType } from './form-rules';

const currentSection$ = appState
    .filter(state => state.sideBar && state.sideBar.currentSection)
    .map(state => state.sideBar.currentSubSection)
    .filter(state => state)
    .distinctUntilChanged();

const editFormFieldsForCurrentSection$ = currentSection$
    .flatMap((modelType) => Observable.fromPromise(createFieldConfigForModelTypes(modelType)));

const isAddOperation = (model) => {
    return model.id === 'add';
};

const d2$ = Observable.fromPromise(getInstance());

const modelToEditAndModelForm$ = Observable.combineLatest(modelToEditStore, editFormFieldsForCurrentSection$, currentSection$, d2$)
    .filter(([modelToEdit, formFields, currentType]) => {
        if (modelToEdit && modelToEdit.modelDefinition && modelToEdit.modelDefinition.name) {
            return modelToEdit.modelDefinition.name === currentType;
        }
        return false;
    })
    .map(([modelToEdit, editFormFieldsForCurrentModelType, modelType, d2]) => {
        const fieldConfigs = editFormFieldsForCurrentModelType
        // TODO: When switching to the FormBuilder that manages state this function for all values
        // would need to be executed only for the field that actually changed and/or the values that
        // change because of it.
            .map(fieldConfig => {
                fieldConfig.fieldOptions.model = modelToEdit;

                if (!isAddOperation(modelToEdit) && disabledOnEdit.for(modelType).indexOf(fieldConfig.name) !== -1) {
                    fieldConfig.props.disabled = true;
                }

                // The value is passes through a converter before being set onto the field config.
                // This is useful for when a value is a number and might have to be translated to a
                // value of the type Number.
                if (fieldConfig.beforePassToFieldConverter) {
                    fieldConfig.value = fieldConfig.beforePassToFieldConverter(modelToEdit[fieldConfig.name]);
                } else {
                    fieldConfig.value = modelToEdit[fieldConfig.name];
                }

                return fieldConfig;
            });

        const fieldConfigsAfterRules = applyRulesToFieldConfigs(getRulesForModelType(modelToEdit.modelDefinition.name), fieldConfigs, modelToEdit);
        const fieldConfigsWithAttributeFields = [].concat(
            fieldConfigsAfterRules,
            getAttributeFieldConfigs(d2, modelToEdit),
            (extraFields[modelType] || []).map(config => {
                config.props = config.props || {};
                config.props.modelToEdit = modelToEdit;
                return config;
            })
        );

        const fieldConfigsWithAttributeFieldsAndUniqueValidators = fieldConfigsWithAttributeFields
            .map(fieldConfig => addUniqueValidatorWhenUnique(fieldConfig, modelToEdit));

        return {
            fieldConfigs: fieldConfigsWithAttributeFieldsAndUniqueValidators,
            modelToEdit: modelToEdit,
            isLoading: false,
        };
    });


export default React.createClass({
    propTypes: {
        modelId: React.PropTypes.string.isRequired,
        modelType: React.PropTypes.string.isRequired,
        onSaveSuccess: React.PropTypes.func.isRequired,
        onSaveError: React.PropTypes.func.isRequired,
        onCancel: React.PropTypes.func.isRequired,
    },

    mixins: [Translate],

    getInitialState() {
        return {
            modelToEdit: undefined,
            isLoading: true,
            formState: {
                validating: false,
                valid: true,
            },
        };
    },

    isAddOperation() {
        return this.props.modelId === 'add';
    },

    componentWillMount() {
        this.subscription = modelToEditAndModelForm$
            .subscribe((newState) => {
                this.setState(newState);
            }, (errorMessage) => {
                snackActions.show({ message: errorMessage, action: 'ok' });
            });
    },

    componentWillUnmount() {
        this.subscription && this.subscription.unsubscribe();
    },

    renderSharingNotification() {
        const formPaperStyle = {
            width: '100%',
            margin: '0 auto 3rem',
            position: 'relative',
        };

        if (this.isAddOperation()) {
            return (<SharingNotification style={formPaperStyle} modelType={this.props.modelType} />);
        }

        return null;
    },

    renderForm() {
        const formPaperStyle = {
            width: '100%',
            margin: '0 auto 2rem',
            padding: '2rem 5rem 4rem',
            position: 'relative',
        };

        if (this.state.isLoading) {
            return (
                <CircularProgress />
            );
        }

        const backButtonStyle = {
            position: 'absolute',
            left: 5,
            top: 5,
        };

        return (
            <div style={formPaperStyle}>
                {this.renderSharingNotification()}
                <FormBuilder
                    fields={this.state.fieldConfigs}
                    onUpdateField={this._onUpdateField}
                    onUpdateFormStatus={this._onUpdateFormStatus}
                />
                <FormButtons>
                    <SaveButton onClick={this._saveAction}
                                isValid={this.state.formState.valid && !this.state.formState.validating}
                                isSaving={this.state.isSaving}/>
                    <CancelButton onClick={this._closeAction}/>
                </FormButtons>
            </div>
        );
    },

    render() {
        if (this.state.loading) {
            return (<div>Loading data....</div>);
        }

        return this.renderForm();
    },

    _onUpdateField(fieldName, value) {
        const fieldConfig = this.state.fieldConfigs.find(fieldConfig => fieldConfig.name == fieldName);

        if (fieldConfig && fieldConfig.beforeUpdateConverter) {
            return objectActions.update({ fieldName, value: fieldConfig.beforeUpdateConverter(value) });
        }

        return objectActions.update({ fieldName, value });
    },

    _onUpdateFormStatus(formState) {
        this.setState({
            formState,
        });
    },

    _saveAction(event) {
        event.preventDefault();
        // Set state to saving so forms actions are being prevented
        this.setState({ isSaving: true });

        objectActions.saveObject({ id: this.props.modelId, modelType: this.props.modelType })
            .subscribe(
                (message) => {
                    this.setState({ isSaving: false });

                    snackActions.show({ message, translate: true });

                    this.props.onSaveSuccess(this.state.modelToEdit);
                },
                (errorMessage) => {
                    // TODO: d2 queries require a JSON body on 200 OK, an empty body is not valid JSON
                    if (errorMessage.httpStatusCode === 200) {
                        log.warn('Save errored due to empty 200 OK body');

                        snackActions.show({ message: 'success', action: 'ok', translate: true });

                        return this.props.onSaveSuccess(this.state.modelToEdit);
                    }

                    log.error(errorMessage);

                    this.setState({ isSaving: false });

                    if (isString(errorMessage)) {
                        log.debug(errorMessage);
                        snackActions.show({ message: errorMessage, action: 'ok' });
                    }

                    this.props.onSaveError(errorMessage);
                }
            );
    },

    _closeAction(event) {
        event.preventDefault();

        this.props.onCancel();
    },
});
