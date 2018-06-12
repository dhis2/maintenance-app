import { getInstance } from 'd2/lib/d2';

import FormFieldsForModel from '../../forms/FormFieldsForModel';
import FormFieldsManager from '../../forms/FormFieldsManager';

import fieldOrderNames from '../../config/field-config/field-order';
import fieldGroups from '../../config/field-config/field-groups';
import fieldOverrides from '../../config/field-overrides/index';

import { createFieldConfig, typeToFieldMap } from '../../forms/fields';

function createAttributeFieldConfigs(d2, schemaName) {
    const modelDefinition = d2.models[schemaName];

    return Object
        .keys(modelDefinition.attributeProperties)
        .map((attributeName) => {
            const attribute = modelDefinition.attributeProperties[attributeName];
            return createFieldConfig(
                {
                    name: attribute.name,
                    valueType: attribute.valueType,
                    type: typeToFieldMap.get(attribute.optionSet ? 'CONSTANT' : attribute.valueType),
                    required: Boolean(attribute.mandatory),
                    fieldOptions: {
                        labelText: attribute.name,
                        options: attribute.optionSet ? attribute.optionSet.options.map(option => ({
                            name: option.displayName || option.name,
                            value: option.code,
                        })) : [],
                    },
                },
                modelDefinition,
                d2.models,
            );
        });
}

// Add required-indicator '(*)' to label text if the field is required
function getLabelText(labelText, fieldConfig = {}) {
    if (fieldConfig.props && fieldConfig.props.isRequired) {
        return `${labelText} (*)`;
    }
    return labelText;
}

// Translate the sync validator messages if there are any validators
function translateValidators(fieldConfig, d2) {
    if (fieldConfig.validators) {
        fieldConfig.validators = fieldConfig.validators
            .map(validator => ({
                ...validator,
                message: d2.i18n.getTranslation(validator.message),
            }));
    }
}

// Get the field's label with required indicator if the field is required
// Save one translated label for validation messages
function setRequiredFieldsLabelText(fieldConfig, d2) {
    fieldConfig.translatedName = d2.i18n.getTranslation(fieldConfig.props.labelText);
    fieldConfig.props.labelText = getLabelText(
        fieldConfig.translatedName,
        fieldConfig,
    );
}

/* 
 * If the modelType are grouped in field-groups.js, the step number and group/step name 
 * will be added to the fieldConfig. This string can later be used for the validating
 * step in EditModelForm.isRequiredFieldsValid to tell the user which step to find the 
 * non-valid required field.
 */
function setRequiredFieldsStepName(fieldConfig, modelType, d2) {
    // TODO: Find way to fix programNotificationTemplate sending the correct modelType
    if (fieldGroups.isGroupedFields(modelType) && modelType !== 'programNotificationTemplate') {
        const stepNo = fieldGroups.groupNoByName(fieldConfig.name, modelType);
        const stepName = fieldGroups.groupNameByStep(stepNo, modelType);
        fieldConfig.step = `${stepNo + 1}: ${d2.i18n.getTranslation(stepName)}`;
    }
}

/*
 * For the fields that needs *custom* components (not normal componets from form-fields) 
 * these need to be added to the fieldConfig.
 */
function addFieldOverrides(customFieldOrderName, modelType, formFieldsManager) {
    const overrides = fieldOverrides.for(customFieldOrderName || modelType);
    overrides.forEach((overrideConfig, fieldName) => {
        formFieldsManager.addFieldOverrideFor(fieldName, overrideConfig);
    });
}

export async function createFieldConfigForModelTypes(
    modelType,
    forcedFieldOrderNames = fieldOrderNames.for(modelType),
    includeAttributes = true,
    customFieldOrderName,
) {
    const d2 = await getInstance();
    const formFieldsManager = new FormFieldsManager(new FormFieldsForModel(d2.models));

    formFieldsManager.setFieldOrder(forcedFieldOrderNames);
    addFieldOverrides(customFieldOrderName, modelType, formFieldsManager);

    return formFieldsManager
        .getFormFieldsForModel({ modelDefinition: d2.models[modelType] }, customFieldOrderName)
        .map((fieldConfig) => {
            translateValidators(fieldConfig, d2);
            setRequiredFieldsStepName(fieldConfig, modelType, d2);
            setRequiredFieldsLabelText(fieldConfig, d2);
            return fieldConfig;
        })
        .concat(includeAttributes ? createAttributeFieldConfigs(d2, modelType) : []);
}

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
            .then((collection) => {
                if (collection.size !== 0) {
                    return getInstance()
                        .then(d2 => d2.i18n.getTranslation('value_not_unique'))
                        .then(message => Promise.reject(message));
                }
                return Promise.resolve(true);
            });
    };
}

export function addUniqueValidatorWhenUnique(fieldConfig, modelToEdit) {
    if (fieldConfig.unique) {
        fieldConfig.asyncValidators = [createUniqueValidator(fieldConfig, modelToEdit.modelDefinition, modelToEdit.id)];
    }

    return fieldConfig;
}
