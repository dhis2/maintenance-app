import fieldOrder from '../config/field-config/field-order';
import fieldOverrides from '../config/field-overrides/index';
import FormFieldsManager from './FormFieldsManager';
import FormFieldsForModel from './FormFieldsForModel';

/**
 * @param {Object} d2
 * @param {string[]} fields
 * @return {Object} Rules for the fields by name
 */
const createFieldRules = (d2, modelType, fields) => {
    const modelDefinition = d2.models[modelType];
    const formFieldsManager = new FormFieldsManager(new FormFieldsForModel(d2.models));
    formFieldsManager.setFieldOrder(fields);

    for (const [fieldName, overrideConfig] of fieldOverrides.for(fields)) {
        formFieldsManager.addFieldOverrideFor(fieldName, overrideConfig);
    }

    return formFieldsManager.getFormFieldRulesForModel({ modelDefinition });
};

/**
 * @param {Object} values
 * @param {string[]} fields
 * @param {Object} fieldRules
 * @return {string[]} Missing field names
 */
const getMissingFields = (values, fields, fieldRules) => fields.reduce(
    (missingFields, field) =>
        !values[field] && fieldRules[field] && fieldRules[field].required
            ? [ ...missingFields, field ]
            : missingFields,
    [],
);

/**
 * Creates an array containing all missing fields
 * for a form with required values.
 * It doesn't check if all values required to save
 * a model in the DB are give.
 *
 * @param {Object} d2
 * @param {string} modelType E. g. 'program'
 * @param {string} formFieldOrder Maintenance app specific, to get the displayed fields
 * @param {Object} values Populated d2 model
 * @return {string[]} Missing field names
 */
const getMissingValuesForModelName = (d2, modelType, formFieldOrder, values) => {
    const fields = fieldOrder.for(formFieldOrder);
    const fieldRules = createFieldRules(d2, modelType, fields);
    return getMissingFields(values, fields, fieldRules);
}

export default getMissingValuesForModelName;
export {
    createFieldRules,
    getMissingFields,
    getMissingValuesForModelName,
}
