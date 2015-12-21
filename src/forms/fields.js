import {isRequired, isNumber as isNumberValidator} from 'd2-ui/lib/forms/Validators';
import isNumber from 'lodash.isnumber';
import log from 'loglevel';

// FormField components
import TextField from './form-fields/text-field';
import MultiSelect from './form-fields/multi-select';
import CheckBox from './form-fields/check-box';
import NumberField from './form-fields/number-field';
import DropDown from './form-fields/drop-down';

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

function toInteger(value) {
    return Number.parseInt(value, 10);
}

function isIntegerValidator(value) {
    console.log(value, Number.parseInt(value, 10) === Number.parseFloat(value));
    return Number.parseInt(value, 10) === Number.parseFloat(value);
}
isIntegerValidator.message = 'number_should_not_have_decimals';

function addValidatorForType(type, modelValidation, modelDefinition) {
    const validators = [];

    switch (type) {
        case 'INTEGER':
            validators.push(isNumberValidator);
            validators.push(isIntegerValidator);

            if (isNumber(modelValidation.max)) {
                function max(value) {
                    return Number(value) <= modelValidation.max;
                }
                max.message = 'value_not_max';
                validators.push(max);
            }

            if (isNumber(modelValidation.min)) {
                function min(value) {
                    return Number(value) >= modelValidation.min;
                }
                min.message = 'value_not_min';
                validators.push(min);
            }

            break;
        case 'IDENTIFIER':
        case 'TEXT':
            if (isNumber(modelValidation.max)) {
                function max(value) {
                    return value.length <= modelValidation.max;
                }
                max.message = 'value_not_max';
                validators.push(max);
            }

            if (isNumber(modelValidation.min)) {
                function min(value) {
                    return value.length >= modelValidation.min;
                }
                min.message = 'value_not_min';
                validators.push(min);
            }

            if (modelValidation.unique) {
                function checkAgainstServer(value) {
                    // Don't validate against the server when we have no value
                    if (!value.trim()) {
                        return Promise.resolve(true);
                    }

                    if (modelValidation.modelDefinition) {
                        log.error('No modelDefintion found on validation object.');

                        return Promise.reject('could_not_run_async_validation')
                    }

                    return modelDefinition
                        .filter().on(modelValidation.fieldOptions.referenceProperty).equals(value)
                        .list()
                        .then(collection => {
                            if (collection.size !== 0) {
                                return Promise.reject('value_not_unique');
                            } else {
                                return Promise.resolve(true);
                            }
                        });
                }

                validators.push(checkAgainstServer);
            }

            break;
    }

    return validators;
}

function getFieldUIComponent(type) {
    switch (type) {
        case 'CONSTANT':
            return DropDown;
            break;
        case 'BOOLEAN':
            return CheckBox;
            break;
        case 'COLLECTION':
            return MultiSelect;
            break;
        case 'INTEGER':
            return NumberField;
            break;
        case 'TEXT':
        case 'IDENTIFIER':
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
            isInteger: fieldConfig.type === 'INTEGER',
            multiLine: fieldConfig.name === 'description',
            fullWidth: true,
            options: fieldConfig.constants
                .map((constant) => {
                    return {
                        text: constant,
                        value: constant,
                    };
                }),
        })
    };

    if (fieldConfig.type === 'INTEGER') {
        basicFieldConfig.beforeUpdateConverter = toInteger;
    }

    const validators = [].concat(getValidatorsFromModelValidation(fieldConfig, modelDefinition));

    return Object.assign(fieldConfig, {validators}, basicFieldConfig);
}

export const CHECKBOX = Symbol('CHECKBOX');
export const INPUT = Symbol('INPUT');
export const SELECT = Symbol('SELECT');
export const SELECTASYNC = Symbol('SELECTASYNC');
export const MULTISELECT = Symbol('MULTISELECT');
export const TEXT = Symbol('TEXT');

export const fieldTypeClasses = new Map([
    [CHECKBOX, createFieldConfig],
    [INPUT, createFieldConfig],
    [SELECT, createFieldConfig],
    //[SELECTASYNC, SelectBoxAsync],
    [MULTISELECT, createFieldConfig],
]);

export const typeToFieldMap = new Map([
    ['BOOLEAN', CHECKBOX],
    ['CONSTANT', SELECT],
    ['IDENTIFIER', INPUT], //TODO: Add identifiers for the type of field...
    // ['REFERENCE', SELECTASYNC],
    ['TEXT', INPUT],
    ['COLLECTION', MULTISELECT],
    ['INTEGER', INPUT], // TODO: Add Numberfield!
    // ['URL', INPUT], // TODO: Add Url field?
]);
