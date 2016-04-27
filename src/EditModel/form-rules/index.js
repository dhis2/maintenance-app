import noop from 'd2-utilizr/lib/noop';
import log from 'loglevel';

const fieldRules = new Map([['dataElement',
    [
        {
            field: 'domainType',
            when: {
                operator: 'EQUALS',
                value: 'TRACKER',
            },
            operations: [{
                field: 'categoryCombo',
                type: 'SET_PROP',
                propName: 'disabled',
                thenValue: true,
                elseValue: false,
            }, {
                field: 'aggregationType',
                type: 'SET_PROP',
                propName: 'disabled',
                thenValue: true,
                elseValue: false,
            }],
        },
        {
            field: 'valueType',
            when: {
                field: 'optionSet',
                operator: 'HAS_VALUE',
            },
            operations: [
                {
                    type: 'SET_PROP',
                    propName: 'disabled',
                    thenValue: true,
                    elseValue: false,
                },
                {
                    type: 'CHANGE_VALUE',
                    setValue: (model, fieldConfig) => {
                        // TODO: This is not an immutable modification. It is more efficient this way however it might
                        // collide and is not very transparent. Especially the fact that the new value needs to be set
                        // on both the model and the fieldConfig is not very clear.
                        // It would probably make sense to run the model modification rules before.
                        fieldConfig.value = model[fieldConfig.property] = model.optionSet.valueType;
                    },
                }
            ],
        }
    ],
], ['attribute', [
    {
        field: 'valueType',
        when: {
            field: 'optionSet',
            operator: 'HAS_VALUE',
        },
        operations: [
            {
                type: 'SET_PROP',
                propName: 'disabled',
                thenValue: true,
                elseValue: false,
            },
            {
                type: 'CHANGE_VALUE',
                setValue: (model, fieldConfig) => {
                    fieldConfig.value = model[fieldConfig.property] = model.optionSet.valueType;
                },
            }
        ]
    }
]]]);

const whenOperatorMap = new Map([
    ['EQUALS', equalsOperator],
    ['HAS_VALUE', hasValueOperator],
]);

const operationsMap = new Map([
    ['SET_PROP', setProp],
    ['CHANGE_VALUE', changeValue],

]);

export function getRulesForModelType(fieldName) {
    if (fieldRules.has(fieldName)) {
        return fieldRules.get(fieldName);
    }

    return [];
}

function changeValue(fieldConfig, operationParams, ruleResult, model) {
    if (ruleResult) {
        operationParams.setValue(model, fieldConfig);
    }
}

function setProp(fieldConfig, operationParams, ruleResult) {
    if (ruleResult) {
        return fieldConfig.props[operationParams.propName] = operationParams.thenValue;
    }

    return fieldConfig.props[operationParams.propName] = operationParams.elseValue;
}

function getOperation(operationType) {
    return operationsMap.has(operationType) ? operationsMap.get(operationType) : noop;
}

function getWhenOperator(operatorType) {
    return whenOperatorMap.has(operatorType) ? whenOperatorMap.get(operatorType) : noop;
}

function hasValueOperator(value) {
    return value !== undefined && value !== null;
}

function equalsOperator(left, right) {
    return left === right;
}

function ruleRunner(rule, fieldConfig, model) {
    const whenFieldName = rule.when.field ? rule.when.field : rule.field;
    const operatorFn = getWhenOperator(rule.when.operator);
    const whenValue = rule.when.value;

    return operatorFn(model[whenFieldName], whenValue)
}

export function applyRulesToFieldConfigs(rules, fieldConfigs, modelToEdit) {
    rules
        .map((rule) => {
            log.debug(`For ${rule.field} run the rule where when ${rule.when.field || rule.field} ${getWhenOperator(rule.when.operator).name} ${rule.when.value || ''} then run`);
            const fieldConfigForRule = fieldConfigs.find(fieldConfig => fieldConfig.name === (rule.when.field || rule.field));
            const rulePassed = ruleRunner(rule, fieldConfigForRule, modelToEdit);

            log.debug(`And the result is`, rulePassed);

            (rule.operations || [rule.operation])
                .forEach((operation) => {
                    const fieldConfigForOperation = fieldConfigs.find(fieldConfig => fieldConfig.name === (operation.field || rule.field));
                    const {field, type, ...operationParams} = operation;

                    log.debug(`---- For field ${field || rule.field} execute ${getOperation(type).name} with`, operationParams);

                    getOperation(type)(fieldConfigForOperation, operationParams, rulePassed, modelToEdit);
                });
        });

    return fieldConfigs;
}
