import PeriodTypeDropDown from '../../forms/form-fields/period-type-drop-down';

export default new Map([
    ['periodType', {
        component: PeriodTypeDropDown,
    }],
    ['dataApprovalLevels', {
        referenceType: 'dataApprovalLevels',
        fieldOptions: {
            queryParamOrder: 'level:asc',
        },
    }],
]);
