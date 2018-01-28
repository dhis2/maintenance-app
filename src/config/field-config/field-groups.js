import fieldOrder from './field-order';

/*
    The stepper sets the style of the fields of the not active step to "display: none"
    to hide them from view. For this to work the component of the field needs to recieve 
    the style from props. If the fields are not hidden when changing the active step
    then check if the component of the corresponding fields are receiving and using the 
    style from props in its outer div. 
*/

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
