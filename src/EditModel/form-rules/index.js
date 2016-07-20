import noop from 'd2-utilizr/lib/noop';
import log from 'loglevel';
import fieldRules from '../../config/field-rules';
import isArray from 'd2-utilizr/lib/isArray';

const whenOperatorMap = new Map([
    ['EQUALS', equalsOperator],
    ['HAS_VALUE', hasValueOperator],
    ['ONEOF', oneOfOperator]
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

function oneOfOperator(value, list) {
    return list.indexOf(value) >= 0;
}

function ruleRunner({whenFieldName, operatorFn, whenValue}, fieldConfig, model) {
    return operatorFn(model[whenFieldName], whenValue)
}

function rulesRunner(rules, rule, modelToEdit, fieldConfigs) {
    return rules.map(whenRule => {
        log.debug(`For ${rule.field} run the rule where when ${whenRule.field || rule.field} ${getWhenOperator(whenRule.operator).name} ${whenRule.value || ''} then run`);
        const fieldConfigForRule = fieldConfigs.find(fieldConfig => fieldConfig.name === (whenRule.field || rule.field));

        const whenFieldName = whenRule.field ? whenRule.field : rule.field;
        const operatorFn = getWhenOperator(whenRule.operator);
        const whenValue = whenRule.value;

        return ruleRunner({whenFieldName, operatorFn, whenValue}, fieldConfigForRule, modelToEdit);
    });
}

export function applyRulesToFieldConfigs(rules, fieldConfigs, modelToEdit) {
    rules
        .forEach((rule) => {
            const rules = isArray(rule.when) ? rule.when : [rule.when];
            const rulePassed = rulesRunner(rules, rule, modelToEdit, fieldConfigs).some(result => result === true);

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
