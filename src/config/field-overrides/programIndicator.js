import PropTypes from 'prop-types';
import { compose } from 'lodash/fp';

import withState from 'recompose/withState';
import getContext from 'recompose/getContext';
import lifecycle from 'recompose/lifecycle';
import { decimals } from './sharedFields';

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
            const { setStatus, value, referenceProperty } = this.props;
            const { status$, validate } = createExpressionValidator(referenceProperty, setStatus);

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

export default new Map([
    ['analyticsPeriodBoundaries', {
        component: AnalyticsPeriodBoundaries,
    }],
    ['expression', {
        component: enhance(ProgramIndicatorExpression),
    }],
    ['filter', {
        component: enhance(ProgramIndicatorExpression),
    }],
    decimals,
]);
