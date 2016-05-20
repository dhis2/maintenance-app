import DropDown from '../../forms/form-fields/drop-down';

export default new Map([
    ['periodType', {
        component: DropDown,
        fieldOptions: {
            options: [
                'Daily', 'Weekly', 'Monthly', 'BiMonthly', 'Quarterly', 'SixMonthlyApril', 'Yearly', 'FinancialApril', 'FinancialJuly', 'FinancialOctober',
            ],
        },
    }],
]);
