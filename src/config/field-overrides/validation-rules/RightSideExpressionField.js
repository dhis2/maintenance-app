import React from 'react';
import { withProps } from 'recompose';
import ValidationRuleExpressionField from './ValidationRuleExpressionField';

export default withProps({
    buttonLabel: 'right_side',
})(ValidationRuleExpressionField);
