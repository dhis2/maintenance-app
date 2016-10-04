import { SELECT } from '../../forms/fields';
import OrganisationUnitTreeMultiSelect from '../../forms/form-fields/orgunit-tree-multi-select';
import React from 'react';

export default new Map([
    ['categoryCombo', {
        referenceType: 'categoryCombo',
        fieldOptions: {
            queryParamFilter: ['dataDimensionType:eq:ATTRIBUTE', 'name:eq:default'],
        },
    }],
    ['periodType', {
        type: SELECT,
        fieldOptions: {
            options: [
                'Daily', 'Weekly', 'Monthly', 'BiMonthly', 'Quarterly', 'SixMonthlyApril', 'Yearly', 'FinancialApril', 'FinancialJuly', 'FinancialOctober',
            ],
        },
    }],
    ['organisationUnits', {
        component: OrganisationUnitTreeMultiSelect,
        fieldOptions: {},
    }],
    ['dataElements', {
        fieldOptions: {
            queryParamFilter: ['domainType:eq:AGGREGATE'],
        }
    }]
]);
