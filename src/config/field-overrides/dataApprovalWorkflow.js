import PeriodTypeDropDown from '../../forms/form-fields/period-type-drop-down';

export default new Map([
    ['periodType', {
        component: PeriodTypeDropDown,
    }],
    ['categoryCombo', {
        referenceType: 'categoryCombo',
        fieldOptions: {
            queryParamFilter: ['dataDimensionType:eq:ATTRIBUTE', 'name:eq:default'],
            defaultToDefaultValue: true,
        },
    }],
]);
