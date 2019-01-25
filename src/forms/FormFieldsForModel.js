import { identity, mapValues } from 'lodash/fp';
import log from 'loglevel';
import camelCaseToUnderscores from 'd2-utilizr/lib/camelCaseToUnderscores';
import { typeToFieldMap, createFieldConfig } from './fields';

const fieldNamesToIgnoreOnDisplay = ['id', 'publicAccess', 'created', 'lastUpdated', 'user', 'userGroupAccesses', 'attributeValues'];
const assignToClone = (original, ...assignments) => Object.assign(
  Object.create(original),
  ...assignments,
);

const addNameToFieldConfig = modelValidations =>
    Object.keys( modelValidations )
        .map(fieldName => assignToClone(
            modelValidations[fieldName],
            {
                name: fieldName,
                fieldOptions: { labelText: camelCaseToUnderscores(fieldName) },

                // @TODO: This is a horrible horrible hack that has to go... As soon as the API is fixed!
                ...(fieldName === 'orgUnitLevel' ? { persisted: true, required: true } : {}),
            },
        ))
;

const shouldFieldBeDisplayed = fieldNamesToIgnoreOnDisplay => field => 
    fieldNamesToIgnoreOnDisplay.indexOf(field.fieldName) === -1;
const onlyUsableFieldTypes = modelValidation => typeToFieldMap.get(modelValidation.type);
const isFieldWritable = field => field.writable;
const isFieldPersisted = field => field.persisted;

class FormFieldsForModel {
    constructor(models, FIELDS_TO_IGNORE_ON_DISPLAY = fieldNamesToIgnoreOnDisplay) {
        if (!models) {
            log.warn('Warning: `models` passed to FormFieldsForModel is undefined, therefore async select boxes ' +
                'and references fields might not work.');
        }

        this.fieldNamesToIgnoreOnDisplay = FIELDS_TO_IGNORE_ON_DISPLAY;
        this.fieldOrder = [];
        this.models = models;
    }

    setDefaultFieldOrder(fieldNames) {
        this.fieldOrder = fieldNames || [];
    }

    checkForInvalidModel(model) {
        if (!(model && model.modelDefinition && model.modelDefinition.modelValidations)) {
            throw new TypeError('Passed model does not seem to adhere to the d2 model structure ' +
                '(model.modelDefinition.modelValidations is not available)');
        }
    }

    getFormFieldRulesForModel(model, fieldOverrides) {
        this.checkForInvalidModel(model);

        const fields = addNameToFieldConfig(model.modelDefinition.modelValidations)
            .filter(isFieldWritable)
            .filter(isFieldPersisted)
            .filter(shouldFieldBeDisplayed(this.fieldNamesToIgnoreOnDisplay))
            .filter(onlyUsableFieldTypes)
            .map(mergeOverridesIntoModelValidation(this.models, model, fieldOverrides))
            .filter(identity)
            .reduce(
                (collection, currentValidation) => ({
                    ...collection,
                    [currentValidation.name]: currentValidation,
                }),
                {},
            )
        ;

        return fields;
    }

    getFormFieldsForModel(model, fieldOverrides = {}, customFieldOrderName) {
        this.checkForInvalidModel(model);

        const removeFieldsThatShouldNotBeDisplayed = modelValidation => this.fieldNamesToIgnoreOnDisplay.indexOf(modelValidation.fieldName) === -1;
        const onlyUsableFieldTypes = modelValidation => typeToFieldMap.get(modelValidation.type);
        const onlyWritableProperties = modelValidation => modelValidation.writable;
        const onlyPersistedProperties = modelValidation => modelValidation.persisted;
        const toArrayOfFieldConfigurations = (fieldName) => {
            const modelValidationForField = model.modelDefinition.modelValidations[fieldName];
            // TODO: This is a horrible horrible hack that has to go... As soon as the API is fixed!
            const fieldConfig = Object.create(Object.assign(modelValidationForField, fieldName === 'orgUnitLevel' ? { persisted: true, required: true } : {}));
            // const fieldConfig = Object.create(modelValidationForField);

            fieldConfig.name = fieldName;
            fieldConfig.fieldOptions = {
                labelText: camelCaseToUnderscores(fieldName),
            };

            return fieldConfig;
        };

        const fieldInstances = Object.keys(model.modelDefinition.modelValidations)
            .map(toArrayOfFieldConfigurations)
            .filter(onlyWritableProperties)
            .filter(onlyPersistedProperties)
            .filter(removeFieldsThatShouldNotBeDisplayed)
            .filter(onlyUsableFieldTypes)
            .map(modelValidation => getFieldClassInstance.bind(this)(modelValidation, model.modelDefinition)) // eslint-disable-line no-use-before-define
            .filter(field => field);

        if (!this.fieldOrder || !this.fieldOrder.length) {
            return fieldInstances;
        }

        return fieldInstances
                .filter(field => this.fieldOrder.indexOf(field.name) !== -1)
                .sort((left, right) => this.fieldOrder.indexOf(left.name) > this.fieldOrder.indexOf(right.name) ? 1 : -1);

        function getFieldClassInstance(modelValidation, modelDefinition) {
            const overrideConfig = fieldOverrides[modelValidation.name];
            const isOverridden = !!overrideConfig;
            let fieldType = typeToFieldMap.get(modelValidation.type);

            if (isOverridden) {
                if (overrideConfig.type) {
                    fieldType = overrideConfig.type;
                }

                Object.keys(overrideConfig)
                    .forEach((key) => {
                        if (key === 'fieldOptions') {
                            modelValidation[key] = Object.assign({}, modelValidation[key], overrideConfig[key]);
                        } else {
                            modelValidation[key] = overrideConfig[key];
                        }
                    });
            }
            modelValidation.type = fieldType;
            return createFieldConfig(modelValidation, modelDefinition, this.models, customFieldOrderName);
        }
    }
}

const overrideModelValidationKey = (modelValidation, overrideKey) => ({
    ...modelValidation,
    [overrideKey]: overrideKey === 'fieldOptions'
        ? { ...modelValidation[overrideKey], ...overrideConfig[overrideKey] }
        : overrideConfig[overrideKey],
});

const mergeOverridesIntoModelValidation = (models, model, fieldOverrides) => modelValidation => {
    const overrideConfig = fieldOverrides[modelValidation.name];
    const isOverridden = !!overrideConfig;
    const fieldType = isOverridden && overrideConfig.type
        ? overrideConfig.type
        : typeToFieldMap.get(modelValidation.type);

    const modelValidationWithOverrides = isOverridden
        ? Object.keys(overrideConfig)
            .reduce(overrideModelValidationKey, modelValidation)
        : modelValidation
    ;

    return assignToClone(
        modelValidationWithOverrides,
        { type: fieldType },
    );
}

export default FormFieldsForModel;
