import React from 'react';

import {
  createActionToValidation$,
} from '../../utils/createActionToValidation$';
import DataElementCategoryOptionCombo from './predictor/DataElementCategoryOptionCombo';
import ExpressionField from './predictor/ExpressionField';
import PeriodTypeDropDown from '../../forms/form-fields/period-type-drop-down';

const actionToGeneratorValidation$ = createActionToValidation$(
    'predictors/expression/description'
)

const GeneratorExpressionField = props => (
    <ExpressionField
        {...props}
        validateExpression={actionToGeneratorValidation$}
    />
)

const actionToSampleSkipTestValidation$ = createActionToValidation$(
    'predictors/skipTest/description'
)

const SampleSkipTestExpressionField = props => (
    <ExpressionField
        {...props}
        validateExpression={actionToSampleSkipTestValidation$}
    />
)



export default new Map([
    ['periodType', {
        component: PeriodTypeDropDown,
    }],
    ['generator', {
        component: GeneratorExpressionField,
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
        component: SampleSkipTestExpressionField,
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
