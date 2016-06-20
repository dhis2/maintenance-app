import { SELECT } from '../../forms/fields';
import OrganisationUnitTreeMultiSelect from '../../forms/form-fields/orgunit-tree-multi-select';

export default new Map([
    ['categoryCombo', {
        referenceType: 'categoryCombo',
        fieldOptions: {
            queryParamFilter: ['dataDimensionType:eq:ATTRIBUTE'],
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
    ['expiryDays', {
        fieldOptions: {
            defaultValue: 0,
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
