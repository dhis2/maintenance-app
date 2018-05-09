import { get, find } from 'lodash/fp';

/* *
 * The result coming from FormBuilder validateField will contain an error message on fail and 
 * a boolean true if it succeeds. This 
 */
const isInvalidField = validatedResult => validatedResult !== true;

const isRequiredField = field => get('isRequired', field.fieldOptions) === true;

const validateField = (field, formRef, formRefStateClone) => {
    const validateResult = formRef.validateField(formRefStateClone, field.name, field.value);
    return {
        invalid: isInvalidField(validateResult),
        step: field.step,
        name: field.translatedName,
    };
};

/* *
 * Constructs the error message to present to the snackBar.
 * Adds the step the field can be found on if present.
 */
const getErrorMessage = (field) => {
    const fieldStep = field.step ? `On step ${field.step}` : '';

    const errorMessage = `: ${field.name}. ${fieldStep}`;
    return errorMessage;
};

/** 
 * Will filter out all the fields that are required. 
 * The it will validate the fields using the formBuilder
 * and lastly fetch the first field that is required and invalid.
 */
const getFirstInvalidField = (fieldConfigs, formRef, formRefStateClone) =>
    fieldConfigs
        .filter(fieldConfig => isRequiredField(fieldConfig))
        .map(fieldConfig => validateField(fieldConfig, formRef, formRefStateClone))
        .find(field => field.invalid);

/**
 * Validate checks all the fields that are marked as required in the form.
 * The validation will set the fields as invalid in the formbuilder and set
 * the new state of the form.
 * 
 * If any the required fields are not valid not it will create a message string 
 * of the first invalid field.
 * 
 * @returns {string} 
 * The name and step/group of the invalid field.
 * If no invalid field, it will return an empty string.
 */
export default function getFirstInvalidFieldMessage(fieldConfigs, formRef) {
    const formRefStateClone = formRef.getStateClone();

    const firstInvalidField = getFirstInvalidField(fieldConfigs, formRef, formRefStateClone);

    if (!firstInvalidField) {
        return '';
    }
    formRef.setState(formRefStateClone);

    const errorMessage = getErrorMessage(firstInvalidField);
    return errorMessage;
}
