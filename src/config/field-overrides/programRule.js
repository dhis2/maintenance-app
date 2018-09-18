import ProgramRuleActionList from './program-rules/programRuleActionList.component';
import ProgramRuleConditionField from './program-rules/programRuleConditionField.component';
import ProgramStageField from './program-rules/programRuleProgramStage';

export default new Map([
    ['condition', {
        component: ProgramRuleConditionField,
    }],
    ['programRuleActions', {
        component: ProgramRuleActionList,
    }],
    ['programStage', {
        component: ProgramStageField,
    }],
]);
