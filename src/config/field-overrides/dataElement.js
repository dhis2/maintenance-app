import DropDownAsync from '../../forms/form-fields/drop-down-async';

export default new Map([
    ['aggregationLevels', {
        referenceType: 'organisationUnitLevel',
        fieldOptions: {},
    }],
    ['aggregationType', {
        fieldOptions: {
            options: [
                'SUM',
                'AVERAGE',
                'COUNT',
                'STDDEV',
                'VARIANCE',
                'MIN',
                'MAX',
                'NONE',
                'AVERAGE_SUM_ORG_UNIT',
            ]
        }
    }],
    ['categoryCombo', {
        component: DropDownAsync,
    }],
]);
