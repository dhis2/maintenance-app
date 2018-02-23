import ProgramRuleActionList from './program-rules/programRuleActionList.component';
import ProgramRuleConditionField from './program-rules/programRuleConditionField.component';

export default new Map([
    ['condition', {
        component: ProgramRuleConditionField,
    }],
    ['programRuleActions', {
        component: ProgramRuleActionList,
    }],
]);
