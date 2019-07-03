import React from 'react';

import {
  createActionToValidation$,
} from '../../utils/createActionToValidation$';
import DataElementCategoryOptionCombo from './predictor/DataElementCategoryOptionCombo';
import ExpressionField from './predictor/ExpressionField';
import PeriodTypeDropDown from '../../forms/form-fields/period-type-drop-down';

const actionToValidation$ = createActionToValidation$(
    'predictors/expression/description'
)

const PredictorExpressionField = props => (
    <ExpressionField
        {...props}
        validateExpression={actionToValidation$}
    />
)

export default new Map([
    ['periodType', {
        component: PeriodTypeDropDown,
    }],
    ['generator', {
        component: PredictorExpressionField,
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
    }],
    ['sampleSkipTest', {
        component: PredictorExpressionField,
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
    }],
    ['outputCombo', {
        component: DataElementCategoryOptionCombo,
    }]
]);
