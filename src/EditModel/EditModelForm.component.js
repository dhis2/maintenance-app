import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash/fp';

import log from 'loglevel';
import { Observable } from 'rxjs';

import { getInstance } from 'd2/lib/d2';
import { isString } from 'd2-utilizr';

import CircularProgress from 'd2-ui/lib/circular-progress/CircularProgress';
import FormBuilder from 'd2-ui/lib/forms/FormBuilder.component';
import SaveButton from './form-buttons/SaveButton.component';
import CancelButton from './form-buttons/CancelButton.component';
import NotificationSharingMessage from './form-components/NotificationSharingMessage.component';
import FormStepper from './form-components/FormStepper.component';
import FormButtons from './form-buttons/FormButtons.component';

import snackActions from '../Snackbar/snack.actions';
import disabledOnEdit from '../config/disabled-on-edit';
import modelToEditStore from './modelToEditStore';
import objectActions from './objectActions';
import extraFields from './extra-fields/extraFields';
import appState from '../App/appStateStore';
import fieldGroups from '../config/field-config/field-groups';

import { createFieldConfigForModelTypes, addUniqueValidatorWhenUnique } from './helpers/formHelpers';
import { applyRulesToFieldConfigs, getRulesForModelType } from './form-rules';

const styles = {
    notificationStyle: {
        width: '100%',
        margin: '0 auto 3rem',
        position: 'relative',
    },
    outerStyle: {
        width: '100%',
        margin: '0 auto 2rem',
        padding: '2rem 5rem 4rem',
        position: 'relative',
    },
};

const showErrorMessage = errorMessage => snackActions.show({ message: errorMessage, action: 'ok' });
const showSuccessMessage = () => snackActions.show({ message: 'success', action: 'ok', translate: true });

const currentSection$ = appState
    .filter(state => state.sideBar && state.sideBar.currentSection)
    .map(state => state.sideBar.currentSubSection)
    .filter(state => state)
    .distinctUntilChanged();

const editFormFieldsForCurrentSection$ = currentSection$
    .flatMap(modelType => Observable.fromPromise(createFieldConfigForModelTypes(modelType)));

const d2$ = Observable.fromPromise(getInstance());

const modelToEditAndModelForm$ = Observable
    .combineLatest(modelToEditStore, editFormFieldsForCurrentSection$, currentSection$, d2$)
    .filter(([modelToEdit, formFields, currentType]) =>
        (get('modelDefinition.name', modelToEdit)
            ? modelToEdit.modelDefinition.name === currentType
            : false),
    )
    .map(([modelToEdit, editFormFieldsForCurrentModelType, modelType, d2]) => {
        const isAddOperation = model => model.id === undefined;

        // TODO: When switching to the FormBuilder that manages state this function for all values
        // would need to be executed only for the field that actually changed and/or the values that
        // change because of it.
        const fieldConfigs = editFormFieldsForCurrentModelType
            .map((fieldConfig) => {
                fieldConfig.fieldOptions.model = modelToEdit;

                if (!isAddOperation(modelToEdit) && disabledOnEdit.for(modelType).indexOf(fieldConfig.name) !== -1) {
                    fieldConfig.props.disabled = true;
                }

                // Check if value is an attribute
                if (Object.keys(modelToEdit.attributes || []).indexOf(fieldConfig.name) >= 0) {
                    fieldConfig.value = modelToEdit.attributes[fieldConfig.name];
                    return fieldConfig;
                }

                // The value is passes through a converter before being set onto the field config.
                // This is useful for when a value is a number and might have to be translated to a
                // value of the type Number.
                fieldConfig.value = fieldConfig.beforePassToFieldConverter
                    ? fieldConfig.beforePassToFieldConverter(modelToEdit[fieldConfig.name])
                    : modelToEdit[fieldConfig.name];
                return fieldConfig;
            });

        const fieldConfigsAfterRules = applyRulesToFieldConfigs(
            getRulesForModelType(modelToEdit.modelDefinition.name),
            fieldConfigs,
            modelToEdit,
        );

        const fieldConfigsWithAttributeFields = [].concat(
            fieldConfigsAfterRules,
            (extraFields[modelType] || []).map((config) => {
                config.props = config.props || {};
                config.props.modelToEdit = modelToEdit;
                return config;
            }),
        );
        const fieldConfigsWithAttributeFieldsAndUniqueValidators = fieldConfigsWithAttributeFields
            .map(fieldConfig => addUniqueValidatorWhenUnique(fieldConfig, modelToEdit));

        return {
            fieldConfigs: fieldConfigsWithAttributeFieldsAndUniqueValidators,
            modelToEdit,
            isLoading: false,
        };
    });

class EditModelForm extends Component {
    state = {
        modelToEdit: undefined,
        isLoading: true,
        formState: {
            validating: false,
            valid: false,
            pristine: true,
        },
        activeStep: 0,
    }

    componentWillMount() {
        this.subscription = modelToEditAndModelForm$
            .subscribe((newState) => {
                this.setState(newState);
                this.setActiveStep(this.state.activeStep);
            },
            (errorMessage) => {
                showErrorMessage(errorMessage);
            });
    }

    componentWillUnmount() {
        this.subscription && this.subscription.unsubscribe();
    }

    onUpdateField = (fieldName, updateValue) => {
        const fieldConfig = this.state.fieldConfigs.find(fieldConf => fieldConf.name === fieldName);
        const value = get('beforeUpdateConverter', fieldConfig)
            ? fieldConfig.beforeUpdateConverter(updateValue)
            : updateValue;
        objectActions.update({ fieldName, value });
    }

    onUpdateFormStatus = formState => this.setState({ formState });

    /*
     *  Sets the style of the fields that are not part of the active steps to 'none'
     *  so that they are "hidden". For this to work, the components needs to have
     *  an outer div that receives the props.style. 
     */
    setActiveStep = (step) => {
        const stepsByField = fieldGroups.groupsByField(this.props.modelType);

        const getField = (field) => {
            const hideField = stepsByField[field.name] === step;
            field.props.style = hideField ? { display: 'block' } : { display: 'none' };
            return field;
        };

        if (stepsByField) {
            const fieldConfigs = this.state.fieldConfigs.map(field => getField(field));
            this.setState({
                activeStep: step,
                fieldConfigs,
            });
        }
    }

    getTranslation = key => this.context.d2.i18n.getTranslation(key);

    saveAction = (event) => {
        event.preventDefault();
        // Set state to saving so forms actions are being prevented
        this.setState({ isSaving: true });

        objectActions
            .saveObject({
                id: this.props.modelId,
                modelType: this.props.modelType,
            })
            .subscribe((message) => {
                this.setState({ isSaving: false });
                snackActions.show({ message, translate: true });
                this.props.onSaveSuccess(this.state.modelToEdit);
            },
            (errorMessage) => {
                // TODO: d2 queries require a JSON body on 200 OK, an empty body is not valid JSON
                if (errorMessage.httpStatusCode === 200) {
                    // if the save errored, why is it showing a success message?
                    log.warn('Save errored due to empty 200 OK body');
                    showSuccessMessage();
                    this.props.onSaveSuccess(this.state.modelToEdit);
                } else {
                    this.setState({ isSaving: false });

                    if (isString(errorMessage)) {
                        log.debug(errorMessage);
                        showErrorMessage(errorMessage);
                    }
                    log.error(errorMessage);
                    this.props.onSaveError(errorMessage);
                }
            });
    }

    closeAction = (event) => {
        event.preventDefault();
        this.props.onCancel();
    }

    renderEditForm = () => {
        const isAddOperation = this.props.modelId === 'add';
        const isValidForm = this.state.formState.valid && !this.state.formState.validating;

        return (
            <div style={styles.outerStyle}>
                <FormStepper
                    modelType={this.props.modelType}
                    fieldConfigs={this.state.fieldConfigs}
                    onChange={this.setActiveStep}
                    activeStep={this.state.activeStep}
                />
                <NotificationSharingMessage
                    show={isAddOperation}
                    style={styles.notificationStyle}
                    modelType={this.props.modelType}
                />
                <FormBuilder
                    fields={this.state.fieldConfigs}
                    onUpdateField={this.onUpdateField}
                    onUpdateFormStatus={this.onUpdateFormStatus}
                />
                <FormButtons>
                    <SaveButton
                        onClick={this.saveAction}
                        isValid={isValidForm}
                        isSaving={this.state.isSaving}
                    />
                    <CancelButton onClick={this.closeAction} />
                </FormButtons>
            </div>
        );
    }

    render() {
        if (this.state.loading) {
            return (<div>Loading data....</div>);
        } else if (this.state.isLoading) {
            return (<CircularProgress />);
        }
        return this.renderEditForm();
    }
}

EditModelForm.propTypes = {
    modelId: PropTypes.string.isRequired,
    modelType: PropTypes.string.isRequired,
    onSaveSuccess: PropTypes.func.isRequired,
    onSaveError: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};
EditModelForm.contextTypes = { d2: PropTypes.object.isRequired };

export default EditModelForm;
