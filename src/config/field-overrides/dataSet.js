import React from 'react';
import DropDown from '../../forms/form-fields/drop-down';
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
        component: DropDown,
        fieldOptions: {
            options: [
                'Daily',
                'Weekly',
                'Monthly',
                'BiMonthly',
                'Quarterly',
                'SixMonthlyApril',
                'Yearly',
                'FinancialApril',
                'FinancialJuly',
                'FinancialOctober',
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
