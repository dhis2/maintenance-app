import React from 'react';
import Translate from 'd2-ui/lib/i18n/Translate.component';
import { withProps } from 'recompose';
import ValidationRuleExpressionField from './ValidationRuleExpressionField';

export default withProps({
    buttonLabel: <Translate>right_side</Translate>,
})(ValidationRuleExpressionField);