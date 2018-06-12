import { findIndex } from 'lodash/fp';
import fieldOrder from './field-order';

const fieldGroupsForModelType = new Map([
    ['programRule', [
        {
            label: 'enter_program_rule_details',
            fields: ['program', 'name', 'description', 'priority'],
        },
        {
            label: 'enter_program_rule_expression',
            fields: ['condition'],
        },
        {
            label: 'define_program_rule_actions',
            fields:['programRuleActions'],
        },
    ]]
]);

export default {
    for(modelType) {
        if (this.isGroupedFields(modelType)) {
            return fieldGroupsForModelType.get(modelType);
        }

        return [
            {
                label: 'details',
                fields: fieldOrder.for(modelType),
            },
        ];
    },

    isGroupedFields(modelType) {
        return modelType && fieldGroupsForModelType.has(modelType);
    },

    groupNoByName(fieldName, modelType) {
        if (this.isGroupedFields(modelType)) {
            const modelGroup = fieldGroupsForModelType.get(modelType);
            return findIndex((group => group.fields.includes(fieldName)), modelGroup);
        }
        return 0;
    },

    groupNameByStep(stepNo, modelType) {
        if (this.isGroupedFields(modelType)) {
            const modelGroup = fieldGroupsForModelType.get(modelType);
            return modelGroup[stepNo].label;
        }
        return '';
    },

    groupsByField(modelType) {
        if (this.isGroupedFields(modelType)) {
            return fieldGroupsForModelType
                .get(modelType)
                .map(group => group.fields)
                .reduce((fieldsWithStep, groupFields, stepNo) => {
                    groupFields.map(field => fieldsWithStep[field] = stepNo);
                    return fieldsWithStep;
                }, {});
        }
    },
};