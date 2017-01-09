import React from 'react';
import { SELECT } from '../../forms/fields';
import OrganisationUnitTreeMultiSelect from '../../forms/form-fields/orgunit-tree-multi-select';
import DataSetElementField from './data-set/DataSetElementField.component';

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
                'Daily',
                'Weekly',
                'Monthly',
                'BiMonthly',
                'Quarterly',
                'SixMonthly',
                'SixMonthlyApril',
                'Yearly',
                'FinancialApril',
                'FinancialJuly',
                'FinancialOct',
            ],
        },
    }],
    ['organisationUnits', {
        component: OrganisationUnitTreeMultiSelect,
        fieldOptions: {},
    }],
    ['dataSetElements', {
        component: DataSetElementField,
    }],
]);
