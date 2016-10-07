import React from 'react';
import fieldOverrides from '../config/field-overrides/index';
import fieldOrderNames from '../config/field-config/field-order';
import disabledOnEdit from '../config/disabled-on-edit';
import FormFieldsForModel from '../forms/FormFieldsForModel';
import FormFieldsManager from '../forms/FormFieldsManager';
import { config, getInstance } from 'd2/lib/d2';
import modelToEditStore from './modelToEditStore';
import objectActions from './objectActions';
import snackActions from '../Snackbar/snack.actions';
import SaveButton from './SaveButton.component';
import CancelButton from './CancelButton.component';
import { isString, camelCaseToUnderscores } from 'd2-utilizr';
import SharingNotification from './SharingNotification.component';
import FormButtons from './FormButtons.component';
import log from 'loglevel';
import extraFields from './extraFields';
import CircularProgress from 'material-ui/CircularProgress/CircularProgress';
import Translate from 'd2-ui/lib/i18n/Translate.mixin';
import FormBuilder from 'd2-ui/lib/forms/FormBuilder.component';
import { createFieldConfig, typeToFieldMap } from '../forms/fields';
import appState from '../App/appStateStore';
import { Observable } from 'rx';

import { applyRulesToFieldConfigs, getRulesForModelType } from './form-rules';

function createUniqueValidator(fieldConfig, modelDefinition, uid) {
    return function checkAgainstServer(value) {
        // Don't validate against the server when we have no value
        if (!value || !value.trim()) {
            return Promise.resolve(true);
        }

        let modelDefinitionWithFilter = modelDefinition
            .filter().on(fieldConfig.fieldOptions.referenceProperty).equals(value);

        if (uid) {
            modelDefinitionWithFilter = modelDefinitionWithFilter.filter().on('id').notEqual(uid);
        }

        return modelDefinitionWithFilter
            .list()
            .then(collection => {
                if (collection.size !== 0) {
                    return getInstance()
                        .then(d2 => d2.i18n.getTranslation('value_not_unique'))
                        .then(message => Promise.reject(message));
                }
                return Promise.resolve(true);
            });
    };
}

// TODO: Move this outside of this function as it is used with more than just this component
export async function createFieldConfigForModelTypes(modelType) {
    const d2 = await getInstance();

    const formFieldsManager = new FormFieldsManager(new FormFieldsForModel(d2.models));
    formFieldsManager.setFieldOrder(fieldOrderNames.for(modelType));

    for (const [fieldName, overrideConfig] of fieldOverrides.for(modelType)) {
        formFieldsManager.addFieldOverrideFor(fieldName, overrideConfig);
    }

    return formFieldsManager.getFormFieldsForModel({ modelDefinition: d2.models[modelType] })
        .map(fieldConfig => {
            // Translate the sync validator messages if there are any validators
            if (fieldConfig.validators) {
                fieldConfig.validators = fieldConfig.validators
                    .map(validator => ({
                        ...validator,
                        message: d2.i18n.getTranslation(validator.message),
                    }));
            }

            // Get translation for the field label
            fieldConfig.props.labelText = d2.i18n.getTranslation(fieldConfig.props.labelText);

            // Add required indicator when the field is required
            if (fieldConfig.props.isRequired) {
                fieldConfig.props.labelText = `${fieldConfig.props.labelText} (*)`;
            }

            return fieldConfig;
        });
}

const currentSection$ = appState
    .filter(state => state.sideBar && state.sideBar.currentSection)
    .map(state => state.sideBar.currentSubSection)
    .filter(state => state)
    .distinctUntilChanged();

const editFormFieldsForCurrentSection$ = currentSection$
    .flatMap((modelType) => Observable.fromPromise(createFieldConfigForModelTypes(modelType)));

function getAttributeFieldConfigs(modelToEdit) {
    Object
        .keys(modelToEdit.modelDefinition.attributeProperties)
        .forEach((key) => {
            this.context.d2.i18n.translations[key] = key;
            return key;
        });

    return Object
        .keys(modelToEdit.modelDefinition.attributeProperties)
        .map(attributeName => {
            const attribute = modelToEdit.modelDefinition.attributeProperties[attributeName];

            return createFieldConfig({
                name: attribute.name,
                valueType: attribute.valueType,
                type: typeToFieldMap.get(attribute.optionSet ? 'CONSTANT' : attribute.valueType),
                required: Boolean(attribute.mandatory),
                fieldOptions: {
                    labelText: attribute.name,
                    options: attribute.optionSet ? attribute.optionSet.options.map(option => {
                        return {
                            name: option.displayName || option.name,
                            value: option.code,
                        };
                    }) : [],
                },
            }, modelToEdit.modelDefinition, this.context.d2.models, modelToEdit);
        })
        .map(attributeFieldConfig => {
            attributeFieldConfig.value = modelToEdit.attributes[attributeFieldConfig.name];
            return attributeFieldConfig;
        });
}

const modelToEditAndModelForm$ = Observable.combineLatest(modelToEditStore, editFormFieldsForCurrentSection$, currentSection$)
    .filter(([modelToEdit, formFields, currentType]) => {
        if (modelToEdit && modelToEdit.modelDefinition && modelToEdit.modelDefinition.name) {
            return modelToEdit.modelDefinition.name === currentType;
        }
        return false;
    });

function addUniqueValidatorWhenUnique(fieldConfig, modelToEdit) {
    if (fieldConfig.unique) {
        fieldConfig.asyncValidators = [createUniqueValidator(fieldConfig, modelToEdit.modelDefinition, modelToEdit.id)];
    }

    return fieldConfig;
}

// TODO: Gives a flash of the old content when switching models (Should probably display a loading bar)
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
        const modelType = this.props.modelType;

        getInstance().then(d2 => {
            const formFieldsManager = new FormFieldsManager(new FormFieldsForModel(d2.models));
            formFieldsManager.setFieldOrder(fieldOrderNames.for(modelType));

            for (const fieldOverrideConfig of fieldOverrides.for(modelType)) {
                const [fieldName, overrideConfig] = fieldOverrideConfig;

                formFieldsManager.addFieldOverrideFor(fieldName, overrideConfig);
            }

            this.disposable = modelToEditAndModelForm$
                .subscribe(([modelToEdit, editFormFieldsForCurrentModelType]) => {
                    const fieldConfigs = editFormFieldsForCurrentModelType
                    // TODO: When switching to the FormBuilder that manages state this function for all values
                    // would need to be executed only for the field that actually changed and/or the values that
                    // change because of it.
                        .map(fieldConfig => {
                            fieldConfig.fieldOptions.model = modelToEdit;

                            if (!this.isAddOperation() && disabledOnEdit.for(modelType).indexOf(fieldConfig.name) !== -1) {
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
                        getAttributeFieldConfigs.call(this, modelToEdit),
                        (extraFields[modelType] || []).map(config => {
                            config.props = config.props || {};
                            config.props.modelToEdit = modelToEdit;
                            return config;
                        })
                    );

                    const fieldConfigsWithAttributeFieldsAndUniqueValidators = fieldConfigsWithAttributeFields
                        .map(fieldConfig => addUniqueValidatorWhenUnique(fieldConfig, modelToEdit));

                    this.setState({
                        fieldConfigs: fieldConfigsWithAttributeFieldsAndUniqueValidators,
                        modelToEdit: modelToEdit,
                        isLoading: false,
                    });

                }, (errorMessage) => {
                    snackActions.show({ message: errorMessage, action: 'ok' });
                });

            this.setState({
                formFieldsManager: formFieldsManager,
            });
        });
    },

    componentWillUnmount() {
        this.disposable && this.disposable.dispose();
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
                <CircularProgress mode="indeterminate" />
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
