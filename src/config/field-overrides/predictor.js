import PeriodTypeDropDown from '../../forms/form-fields/period-type-drop-down';
import ExpressionField from './predictor/ExpressionField';
import DataElementCategoryOptionCombo from './predictor/DataElementCategoryOptionCombo';

export default new Map([
    [
        'periodType',
        {
            component: PeriodTypeDropDown,
        },
    ],
    [
        'generator',
        {
            component: ExpressionField,
            validators: [
                {
                    validator: value => Boolean(value && value.description),
                    message: 'description_is_required',
                },
                {
                    validator: value => Boolean(value && value.expression),
                    message: 'expression_is_required',
                },
            ],
        },
    ],
    [
        'sampleSkipTest',
        {
            component: ExpressionField,
            validators: [
                {
                    validator: value => Boolean(value && value.description),
                    message: 'description_is_required',
                },
                {
                    validator: value => Boolean(value && value.expression),
                    message: 'expression_is_required',
                },
            ],
        },
    ],
    [
        'outputCombo',
        {
            component: DataElementCategoryOptionCombo,
        },
    ],
]);
