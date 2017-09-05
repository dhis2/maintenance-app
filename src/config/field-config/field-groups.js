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
            fields: ['programRuleActions'],
        },
    ]],
]);


export default {
    for(modelType) {
        if (modelType && fieldGroupsForModelType.has(modelType)) {
            return fieldGroupsForModelType.get(modelType);
        }

        return [{
            label: 'details',
            fields: fieldOrder.for(modelType),
        }];
    },

    groupsByField(modelType) {
        if (modelType && fieldGroupsForModelType.has(modelType)) {
            return fieldGroupsForModelType.get(modelType)
                .map(g => g.fields)
                .reduce((o, f, s) => { f.forEach(x => o[x] = s); return o; }, {});
        }
    },
};
