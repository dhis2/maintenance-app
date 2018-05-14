import React from 'react';
import fieldGroups from '../config/field-config/field-groups';
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

import { Step, Stepper, StepButton } from 'material-ui/Stepper';

const currentSection$ = appState
    .filter(state => state.sideBar && state.sideBar.currentSection)
    .map(state => state.sideBar.currentSubSection)
    .filter(state => state)
    .distinctUntilChanged();

const editFormFieldsForCurrentSection$ = currentSection$
    .flatMap(modelType => Observable.fromPromise(createFieldConfigForModelTypes(modelType)));

const isAddOperation = model => model.id === undefined;

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
            .map((fieldConfig) => {
                fieldConfig.fieldOptions.model = modelToEdit;

                if (!isAddOperation(modelToEdit) && disabledOnEdit.for(modelType).indexOf(fieldConfig.name) !== -1) {
                    fieldConfig.props.disabled = true;
                }

                // Check if value is an attribute
                if (Object.keys(modelToEdit.attributes || []).indexOf(fieldConfig.name) >= 0) {
                    // console.log(fieldConfig.name, ' is an attribute');
                    fieldConfig.value = modelToEdit.attributes[fieldConfig.name];
                    return fieldConfig;
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
            // getAttributeFieldConfigs(d2, modelToEdit),
            (extraFields[modelType] || []).map((config) => {
                config.props = config.props || {};
                config.props.modelToEdit = modelToEdit;
                return config;
            })
        );

        const fieldConfigsWithAttributeFieldsAndUniqueValidators = fieldConfigsWithAttributeFields
            .map(fieldConfig => addUniqueValidatorWhenUnique(fieldConfig, modelToEdit));

        return {
            fieldConfigs: fieldConfigsWithAttributeFieldsAndUniqueValidators,
            modelToEdit,
            isLoading: false,
        };
    });

function PlaceholderComponent(props) {
    return null;
}

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
                pristine: true,
            },
            activeStep: 0,
        };
    },

    isAddOperation() {
        return this.props.modelId === 'add';
    },

    componentWillMount() {
        this.subscription = modelToEditAndModelForm$
            .subscribe((newState) => {
                this.setState(newState);
                this.setActiveStep(this.state.activeStep);
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

    renderStepper() {
        const steps = fieldGroups.for(this.props.modelType);
        const stepCount = steps.length;

        return stepCount > 1 ? (
            <Stepper activeStep={this.state.activeStep} linear={false} style={{ margin: '0 -16px' }}>
                {steps.map((step, s) => (
                    <Step key={s}>
                        <StepButton onClick={() => this.setActiveStep(s)}>{this.getTranslation(step.label)}</StepButton>
                    </Step>
                ))}
            </Stepper>
        ) : null;
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
                {this.renderStepper()}
                {this.renderSharingNotification()}
                <FormBuilder
                    fields={this.state.fieldConfigs}
                    onUpdateField={this._onUpdateField}
                    onUpdateFormStatus={this._onUpdateFormStatus}
                />
                <FormButtons>
                    <SaveButton
                        onClick={this._saveAction}
                        isValid={this.state.formState.valid && !this.state.formState.validating}
                        isSaving={this.state.isSaving}
                    />
                    <CancelButton onClick={this._closeAction} />
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

    setActiveStep(step) {
        const stepsByField = fieldGroups.groupsByField(this.props.modelType);
        if (stepsByField) {
            this.setState({
                activeStep: step,
                fieldConfigs: this.state.fieldConfigs.map((field) => {
                    if (stepsByField[field.name] === step) {
                        if (field.hiddenComponent) {
                            field.component = field.hiddenComponent;
                            field.hiddenComponent = undefined;
                        }
                        field.props.style = { display: 'inline-block' };
                    } else {
                        if (!field.hiddenComponent) {
                            field.hiddenComponent = field.component;
                            field.component = PlaceholderComponent;
                        }
                        field.props.style = { display: 'none' };
                    }

                    return field;
                }),
            });
        }
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
