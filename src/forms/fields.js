import {isRequired, isUrl, isNumber as isNumberValidator} from 'd2-ui/lib/forms/Validators';
import isNumber from 'lodash.isnumber';
import log from 'loglevel';

// FormField components
import TextField from './form-fields/text-field';
import MultiSelect from './form-fields/multi-select';
import CheckBox from './form-fields/check-box';
import NumberField from './form-fields/number-field';
import DropDown from './form-fields/drop-down';
import DropDownAsync from './form-fields/drop-down-async';
import DateSelect from './form-fields/date-select';

export const CHECKBOX = Symbol('CHECKBOX');
export const INPUT = Symbol('INPUT');
export const SELECT = Symbol('SELECT');
export const SELECTASYNC = Symbol('SELECTASYNC');
export const MULTISELECT = Symbol('MULTISELECT');
export const TEXT = Symbol('TEXT');
export const DATE = Symbol('DATE');
export const INTEGER = Symbol('INTEGER');
export const IDENTIFIER = Symbol('IDENTIFIER');
export const URL = Symbol('URL');

function toInteger(value) {
    return Number.parseInt(value, 10);
}

function isIntegerValidator(value) {
    return Number.parseInt(value, 10) === Number.parseFloat(value);
}
isIntegerValidator.message = 'number_should_not_have_decimals';

function addValidatorForType(type, modelValidation, modelDefinition) {
    function maxNumber(value) {
        return Number(value) <= modelValidation.max;
    }
    maxNumber.message = 'value_not_max';

    function minNumber(value) {
        return Number(value) >= modelValidation.min;
    }
    minNumber.message = 'value_not_min';

    function maxTextOrArray(value) {
        return value.length <= modelValidation.max;
    }
    maxTextOrArray.message = 'value_not_max';

    function minTextOrArray(value) {
        return value.length >= modelValidation.min;
    }
    minTextOrArray.message = 'value_not_min';

    function checkAgainstServer(value, fieldName, formSource) {
        // Don't validate against the server when we have no value
        if (!value || !value.trim()) {
            return Promise.resolve(true);
        }

        if (modelValidation.modelDefinition) {
            log.error('No modelDefintion found on validation object.');

            return Promise.reject('could_not_run_async_validation');
        }

        let modelDefinitionWithFilter = modelDefinition
            .filter().on(modelValidation.fieldOptions.referenceProperty).equals(value);

        if (formSource.id) {
            modelDefinitionWithFilter = modelDefinitionWithFilter.filter().on('id').notEqual(formSource.id);
        }

        return modelDefinitionWithFilter
            .list()
            .then(collection => {
                if (collection.size !== 0) {
                    return Promise.reject('value_not_unique');
                }
                return Promise.resolve(true);
            });
    }

    const validators = [];

    switch (type) {
    case INTEGER:
        validators.push(isNumberValidator);
        validators.push(isIntegerValidator);

        if (isNumber(modelValidation.max)) {
            validators.push(maxNumber);
        }

        if (isNumber(modelValidation.min)) {
            validators.push(minNumber);
        }
        break;
    case IDENTIFIER:
    case INPUT:
        if (isNumber(modelValidation.max)) {
            validators.push(maxTextOrArray);
        }

        if (isNumber(modelValidation.min)) {
            validators.push(minTextOrArray);
        }

        if (modelValidation.unique) {
            validators.push(checkAgainstServer);
        }

        break;
    case URL:
        validators.push(isUrl);
        break;
    default:
        break;
    }

    return validators;
}

function getValidatorsFromModelValidation(modelValidation, modelDefinition) {
    let validators = [];

    if (modelValidation.required) {
        validators.push(isRequired);
    }

    if (modelDefinition) {
        validators = validators.concat(addValidatorForType(modelValidation.type, modelValidation, modelDefinition));
    }

    return validators;
}

function getFieldUIComponent(type) {
    switch (type) {
    case SELECT:
        return DropDown;
    case SELECTASYNC:
        return DropDownAsync;
    case CHECKBOX:
        return CheckBox;
    case MULTISELECT:
        return MultiSelect;
    case DATE:
        return DateSelect;
    case INTEGER:
        return NumberField;
    case INPUT:
    case IDENTIFIER:
    default:
        break;
    }
    return TextField;
}

export function createFieldConfig(fieldConfig, modelDefinition, models) {
    const basicFieldConfig = {
        type: getFieldUIComponent(fieldConfig.type),
        fieldOptions: Object.assign(fieldConfig.fieldOptions || {}, {
            floatingLabelText: fieldConfig.fieldOptions.labelText,
            modelDefinition: modelDefinition,
            models: models,
            referenceType: fieldConfig.referenceType,
            referenceProperty: fieldConfig.name,
            isInteger: fieldConfig.type === INTEGER,
            multiLine: fieldConfig.name === 'description',
            fullWidth: true,
            options: (fieldConfig.fieldOptions.options || fieldConfig.constants || [])
                .map((constant) => {
                    if (constant.name && constant.value) {
                        return {
                            text: constant.name,
                            value: constant.value,
                        };
                    }

                    return {
                        text: constant,
                        value: constant.toString(),
                    };
                }),
        }),
    };

    if (fieldConfig.type === INTEGER) {
        basicFieldConfig.beforeUpdateConverter = toInteger;
    }

    const validators = [].concat(getValidatorsFromModelValidation(fieldConfig, modelDefinition));

    return Object.assign(fieldConfig, {validators}, basicFieldConfig);
}

export const fieldTypeClasses = new Map([
    [CHECKBOX, createFieldConfig],
    [INPUT, createFieldConfig],
    [SELECT, createFieldConfig],
    [MULTISELECT, createFieldConfig],
    [DATE, createFieldConfig],
    [INTEGER, createFieldConfig],
    [IDENTIFIER, createFieldConfig],
    [SELECTASYNC, createFieldConfig],
    [URL, createFieldConfig],
]);

export const typeToFieldMap = new Map([
    ['BOOLEAN', CHECKBOX],
    ['CONSTANT', SELECT],
    ['IDENTIFIER', IDENTIFIER], // TODO: Add identifiers for the type of field...
    ['REFERENCE', SELECTASYNC],
    ['TEXT', INPUT],
    ['COLLECTION', MULTISELECT],
    ['INTEGER', INTEGER], // TODO: Add Numberfield!
    ['DATE', DATE],
    ['URL', URL],
]);
