import DropDown from '../../forms/form-fields/drop-down';
import LeftSideExpressionField from './validation-rules/LeftSideExpressionField';
import RightSideExpressionField from './validation-rules/RightSideExpressionField';

export default new Map([
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
    ['importance', {
        required: true,
    }],
    ["leftSide", {
        component: LeftSideExpressionField,
    }],
    ["rightSide", {
        component: RightSideExpressionField,
    }],
]);