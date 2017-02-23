import { getInstance } from 'd2/lib/d2';
import FormFieldsForModel from '../forms/FormFieldsForModel';
import FormFieldsManager from '../forms/FormFieldsManager';
import fieldOrderNames from '../config/field-config/field-order';
import fieldOverrides from '../config/field-overrides/index';
import { createFieldConfig, typeToFieldMap } from '../forms/fields';

function getLabelText(labelText, fieldConfig = {}) {
    // Add required indicator when the field is required
    if (fieldConfig.props && fieldConfig.props.isRequired) {
        return `${labelText} (*)`;
    }
    return labelText;
}

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

            // Get the field's label with required indicator if the field is required
            fieldConfig.props.labelText = getLabelText(d2.i18n.getTranslation(fieldConfig.props.labelText), fieldConfig);

            return fieldConfig;
        });
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

export function addUniqueValidatorWhenUnique(fieldConfig, modelToEdit) {
    if (fieldConfig.unique) {
        fieldConfig.asyncValidators = [createUniqueValidator(fieldConfig, modelToEdit.modelDefinition, modelToEdit.id)];
    }

    return fieldConfig;
}

export function getAttributeFieldConfigs(d2, modelToEdit) {
    Object
        .keys(modelToEdit.modelDefinition.attributeProperties)
        .forEach((key) => {
            d2.i18n.translations[key] = key;
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
            }, modelToEdit.modelDefinition, d2.models, modelToEdit);
        })
        .map(attributeFieldConfig => {
            attributeFieldConfig.value = modelToEdit.attributes[attributeFieldConfig.name];

            attributeFieldConfig.props.labelText = getLabelText(attributeFieldConfig.props.labelText, attributeFieldConfig);

            return attributeFieldConfig;
        });
}

export function isAttribute(model, fieldConfig) {
    if (model.attributes && new Set(Object.keys(model.attributes)).has(fieldConfig.name)) {
        return true;
    }
    return false;
}
