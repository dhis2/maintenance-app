import PeriodTypeDropDown from '../../forms/form-fields/period-type-drop-down';

export default new Map([
    ['categoryCombo', {
        fieldOptions: {
            queryParamFilter: ['dataDimensionType:eq:ATTRIBUTE', 'name:eq:default'],
        },
    }],
    ['expiryPeriodType', {
        component: PeriodTypeDropDown,
    }],
]);
