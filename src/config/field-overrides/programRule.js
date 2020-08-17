import React from 'react';
import PropTypes from 'prop-types';
import ProgramRuleActionList from './program-rules/programRuleActionList.component';
import ProgramRuleConditionField from './program-rules/programRuleConditionField.component';
import ProgramStageField from './program-rules/programRuleProgramStage';

import withState from 'recompose/withState';
import getContext from 'recompose/getContext';
import lifecycle from 'recompose/lifecycle';
import { decimals } from './sharedFields';
import { compose } from 'lodash/fp';

import ProgramIndicatorExpression from './program-indicator/ProgramIndicatorExpression';
import { ExpressionStatus } from './program-indicator/ExpressionStatusIcon';
import { AnalyticsPeriodBoundaries } from './program-indicator/AnalyticsPeriodBoundaries';
import createExpressionValidator from './program-indicator/createExpressionValidator';

const enhance = compose(
    getContext({ d2: PropTypes.object }),
    withState('status', 'setStatus', ({ d2 }) => ({
        status: ExpressionStatus.PENDING,
        message: d2.i18n.getTranslation('checking_expression_status'),
    })),
    lifecycle({
        componentDidMount() {
            const { setStatus, value } = this.props;
            const path = `programRules/condition/description?programRule=${this.props.model.id}`
            const { status$, validate } = createExpressionValidator(path, setStatus);

            this.validate = validate;

            this.validatorStatusSubscription = status$.subscribe(setStatus);

            this.validate(value);
        },

        componentWillReceiveProps(newProps) {
            if (newProps.value !== this.props.value) {
                this.validate(newProps.value);
            }
        },

        componentWillUnmount() {
            this.validatorStatusSubscription.unsubscribe();
        },
    }),
);

const EnhancedProgramRuleConditionField = enhance(ProgramRuleConditionField)

export default new Map([
    ['condition', {
        component: EnhancedProgramRuleConditionField,
    }],
    ['programRuleActions', {
        component: ProgramRuleActionList,
    }],
    ['programStage', {
        component: ProgramStageField,
    }],
]);
