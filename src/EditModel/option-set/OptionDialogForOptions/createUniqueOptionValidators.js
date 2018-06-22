import { optionsForOptionSetStore } from '../stores';
import { createValidatorFromValidatorFunction } from '../../../forms/fields';
import { isFieldCode, isFieldName } from '../../form-helpers/fieldChecks';

/*
 * Since this is custom for option sets and requires stuff from the option store
 * the validator for unique fields is created here rather than in
 * forms/fields.
 */
const getValidatorFoField = (state, fieldName, d2) => {
    const optionValues = state.options.map(option => option[`${fieldName}`]);

    const uniqueValueValidator = fieldValue => !optionValues.includes(fieldValue);
    uniqueValueValidator.message = d2.i18n.getTranslation(`option_${fieldName}_must_be_unique`);
    return uniqueValueValidator;
};

async function addUniqueValidator(fieldConfig, d2, fieldName) {
    optionsForOptionSetStore.subscribe((state) => {
        if (!state.isLoading) {
            const uniqueValueValidator = getValidatorFoField(state, fieldName, d2);

            fieldConfig.validators
                .push(createValidatorFromValidatorFunction(uniqueValueValidator));
        }
    });
}

/* Add fields that should be unique within an option here */
export default async function addValidatorForUniqueField(fieldConfig, d2) {
    if (isFieldCode(fieldConfig)) {
        addUniqueValidator(fieldConfig, d2, 'code');
    }
    if (isFieldName(fieldConfig)) {
        addUniqueValidator(fieldConfig, d2, 'name');
    }
}
