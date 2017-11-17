import PeriodTypeDropDown from '../../forms/form-fields/period-type-drop-down';
//import AttributeSelector from '../../'
export default new Map([
    ['categoryCombo', {
        fieldOptions: {
            queryParamFilter: ['dataDimensionType:eq:ATTRIBUTE', 'name:eq:default'],
        },
    }],
    ['expiryPeriodType', {
        component: PeriodTypeDropDown,
    }],
  /*  ['programAttributes', {
        component:
    }] */
]);
