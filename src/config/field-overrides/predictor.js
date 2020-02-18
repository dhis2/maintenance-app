import PeriodTypeDropDown from '../../forms/form-fields/period-type-drop-down';
import ExpressionField from './predictor/ExpressionField';
import DataElementCategoryOptionCombo from './predictor/DataElementCategoryOptionCombo';

export default new Map([
    ['periodType', {
        component: PeriodTypeDropDown,
    }],
    ['generator', {
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
        // Override unique, it was set to true on the backend for an unkown reason
        // see https://jira.dhis2.org/browse/DHIS2-8311
        unique: false
    }],
    ['sampleSkipTest', {
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
        // See https://jira.dhis2.org/browse/DHIS2-8311
        unique: false
    }],
    [
        'outputCombo',
        {
            component: DataElementCategoryOptionCombo,
        },
    ],
]);
