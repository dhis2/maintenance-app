import React from 'react';
import fieldOverrides from '../config/field-overrides/index';
import fieldOrderNames from '../config/field-config/field-order';
import disabledOnEdit from '../config/disabled-on-edit';
import FormFieldsForModel from '../forms/FormFieldsForModel';
import FormFieldsManager from '../forms/FormFieldsManager';
import { config, getInstance as getD2 } from 'd2/lib/d2';
import modelToEditStore from './modelToEditStore';
import objectActions from './objectActions';
import snackActions from '../Snackbar/snack.actions';
import SaveButton from './SaveButton.component';
import CancelButton from './CancelButton.component';
import Paper from 'material-ui/lib/paper';
import { isString, camelCaseToUnderscores } from 'd2-utilizr';
import SharingNotification from './SharingNotification.component';
import FormButtons from './FormButtons.component';
import log from 'loglevel';
import FormHeading from './FormHeading';
import extraFields from './extraFields';
import CircularProgress from 'material-ui/lib/circular-progress';
import BackButton from './BackButton.component';
import Translate from 'd2-ui/lib/i18n/Translate.mixin';
import FormBuilder from 'd2-ui/lib/forms/FormBuilder.component';
import { goToRoute, goBack } from '../router';
import { createFieldConfig, typeToFieldMap } from '../forms/fields';
import appState from '../App/appStateStore';
import { Observable } from 'rx';
import TextField from '../forms/form-fields/text-field';

config.i18n.strings.add('name');
config.i18n.strings.add('code');
config.i18n.strings.add('short_name');

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

async function createFieldConfigForModelTypes(modelType) {
    const d2 = await getD2();

    const formFieldsManager = new FormFieldsManager(new FormFieldsForModel(d2.models));
    formFieldsManager.setFieldOrder(fieldOrderNames.for(modelType));

    for (const [fieldName, overrideConfig] of fieldOverrides.for(modelType)) {
        formFieldsManager.addFieldOverrideFor(fieldName, overrideConfig);
    }

    return formFieldsManager.getFormFieldsForModel({ modelDefinition: d2.models[modelType] })
        .map(fieldConfig => {
            // Translate the sync validator messages if there are any validators
            if (fieldConfig.validators) {
                fieldConfig.validators
                    .forEach(validator => {
                        validator.message = d2.i18n.getTranslation(validator.message);
                    });
            }

            // Get translation for the field label
            fieldConfig.props.labelText = d2.i18n.getTranslation(fieldConfig.props.labelText);

            // Add required indicator when the field is required
            if (fieldConfig.props.isRequired) {
                fieldConfig.props.labelText = `${fieldConfig.props.labelText} (*)`;
            }

            if (fieldConfig.component === TextField) {
                fieldConfig.props.changeEvent = 'onBlur';
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

const modelToEditStoreFilteredByCurrentType$ = modelToEditStore

const modelToEditAndModelForm$ = Observable.combineLatest(modelToEditStoreFilteredByCurrentType$, editFormFieldsForCurrentSection$, currentSection$)
    .filter(([modelToEdit, formFields, currentType]) => {
        if (modelToEdit && modelToEdit.modelDefinition && modelToEdit.modelDefinition.name) {
            return modelToEdit.modelDefinition.name === currentType;
        }
        return false;
    });

// TODO: Gives a flash of the old content when switching models (Should probably display a loading bar)
export default React.createClass({
    propTypes: {
        modelId: React.PropTypes.string.isRequired,
        modelType: React.PropTypes.string.isRequired,
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

        getD2().then(d2 => {
            const formFieldsManager = new FormFieldsManager(new FormFieldsForModel(d2.models));
            formFieldsManager.setFieldOrder(fieldOrderNames.for(modelType));

            for (const [fieldName, overrideConfig] of fieldOverrides.for(modelType)) {
                formFieldsManager.addFieldOverrideFor(fieldName, overrideConfig);
            }

            this.disposable = modelToEditAndModelForm$
                .subscribe(([modelToEdit, editFormFieldsForCurrentModelType]) => {
                    const fieldConfigs = editFormFieldsForCurrentModelType
                            .map(fieldConfig => {
                                fieldConfig.fieldOptions.model = modelToEdit;

                                if (!this.isAddOperation() && disabledOnEdit.for(modelType).indexOf(fieldConfig.name) !== -1) {
                                    fieldConfig.props.disabled = true;
                                }

                                if (fieldConfig.beforePassToFieldConverter) {
                                    fieldConfig.value = fieldConfig.beforePassToFieldConverter(modelToEdit[fieldConfig.name]);
                                } else {
                                    fieldConfig.value = modelToEdit[fieldConfig.name];
                                }

                                return fieldConfig;
                            });

                    this.setState({
                        fieldConfigs: [].concat(
                            fieldConfigs,
                            getAttributeFieldConfigs.call(this, modelToEdit),
                            (extraFields[modelType] || []).map(config => {
                                config.props = config.props || {};
                                config.props.modelToEdit = modelToEdit;
                                return config;
                            })
                        )
                            .map(fieldConfig => {
                                // TODO: Take this code out to a sort of formRulesRunner, that can modify the fieldConfigs before the render
                                if (modelToEdit.modelDefinition.name === 'dataElement') {
                                    // Disable the categoryCombo field when working with a tracker dataElement
                                    if (fieldConfig.name === 'categoryCombo' && modelToEdit.domainType === 'TRACKER') {
                                        fieldConfig.props.disabled = true;
                                    }
                                    // Disable aggregationOperator when working with a tracker dataElement
                                    if (fieldConfig.name === 'aggregationType' && modelToEdit.domainType === 'TRACKER') {
                                        fieldConfig.props.disabled = true;
                                    }
                                    // Disable valueType when an optionSet is selected
                                    if (fieldConfig.name === 'valueType' && modelToEdit.optionSet) {
                                        fieldConfig.props.disabled = true;
                                    }
                                }

                                if (fieldConfig.unique) {
                                    fieldConfig.asyncValidators = [createUniqueValidator(fieldConfig, modelToEdit.modelDefinition, modelToEdit.id)];
                                }

                                return fieldConfig;
                            }),
                        modelToEdit: modelToEdit,
                        isLoading: false,
                    });
                }, (errorMessage) => {
                    snackActions.show({ message: errorMessage });
                });

            this.setState({
                formFieldsManager: formFieldsManager,
            });
        });
    },

    componentWillReceiveProps() {
        this.setState({
            isLoading: true,
        });
    },

    componentWillUnmount() {
        this.disposable && this.disposable.dispose();
    },

    getTranslatedPropertyName(propertyName) {
        return this.getTranslation(camelCaseToUnderscores(propertyName));
    },

    renderSharingNotification(formPaperStyle) {
        if (this.isAddOperation()) {
            return (<SharingNotification style={formPaperStyle} modelType={this.props.modelType} />);
        }

        return null;
    },

    render() {
        const formPaperStyle = {
            width: '100%',
            margin: '0 auto 2rem',
            padding: '0 5rem 4rem',
            position: 'relative',
        };

        const renderForm = () => {
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
                <div>
                    <Paper style={formPaperStyle}>
                        <div style={backButtonStyle}>
                            <BackButton onClick={this._goBack} toolTip="back_to_list" />
                        </div>
                        <FormBuilder
                            fields={this.state.fieldConfigs}
                            onUpdateField={this._onUpdateField}
                            onUpdateFormStatus={this._onUpdateFormStatus}
                        />
                        <FormButtons>
                            <SaveButton onClick={this._saveAction} isValid={this.state.formState.valid && !this.state.formState.validating} isSaving={this.state.isSaving} />
                            <CancelButton onClick={this._closeAction} />
                        </FormButtons>
                    </Paper>
                </div>
            );
        };

        return (
            <div>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '2rem' }}>
                    <FormHeading>{camelCaseToUnderscores(this.props.modelType)}</FormHeading>
                </div>
                {this.renderSharingNotification(formPaperStyle)}
                {this.state.isLoading ? 'Loading data...' : renderForm()}
            </div>
        );
    },

    _goBack() {
        goBack();
    },

    _registerValidator(attributeValidator) {
        this.setState({
            attributeValidatorRunner: attributeValidator,
        });
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

        objectActions.saveObject({ id: this.props.modelId })
            .subscribe(
            (message) => {
                this.setState({ isSaving: false });

                snackActions.show({ message, action: 'ok', translate: true });

                goToRoute(`/list/${this.props.groupName}/${this.props.modelType}`);
            },
            (errorMessage) => {
                this.setState({ isSaving: false });

                if (isString(errorMessage)) {
                    log.debug(errorMessage);
                    snackActions.show({ message: errorMessage });
                }

                if (errorMessage.messages && errorMessage.messages.length > 0) {
                    log.debug(errorMessage.messages);

                    snackActions.show({ message: errorMessage.messages[0].message });
                }

                if (errorMessage === 'No changes to be saved') {
                    goToRoute(`/list/${this.props.groupName}/${this.props.modelType}`);
                }
            }
        );
    },

    _closeAction(event) {
        event.preventDefault();

        goToRoute(`/list/${this.props.groupName}/${this.props.modelType}`);
    },
});
