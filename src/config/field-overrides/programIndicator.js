import React, { PropTypes } from 'react';
import { decimals } from './sharedFields';
import ExpressionFormula from 'd2-ui/lib/expression-manager/ExpressionFormula';
import Paper from 'material-ui/Paper/Paper';
import { Observable, ReplaySubject } from 'rxjs';
import { isFunction, compose, isEmpty, memoize, get, getOr, values, identity, noop } from 'lodash/fp';
import withState from 'recompose/withState';
import getContext from 'recompose/getContext';
import { getInstance } from 'd2/lib/d2';
import lifecycle from 'recompose/lifecycle';
import InfoIcon from 'material-ui/svg-icons/action/info';
import { green500, red500, red50, green50, blue50, blue200 } from 'material-ui/styles/colors';
import AttributeSelector from './program-indicator/AttributeSelector';
import VariableSelector from './program-indicator/VariableSelector';
import ConstantSelector from './program-indicator/ConstantSelector';
import DataElementSelectors from './program-indicator/DataElementSelectors';
import ExpressionStatusIcon from './program-indicator/ExpressionStatusIcon';

const styles = {
    programIndicatorExpression: {
        container: {
            display: 'flex',
        },
        formula: {
            width: 'auto',
            flex: '1',
            padding: '3rem',
        },
        options: {
            width: '40%',
            minWidth: '300px',
            padding: '0 1rem',
        },
    },
    status: {
        container: (isValid) => ({
            display: 'flex',
            flexDirection: 'row',
            padding: '2rem',
            border: `1px solid ${isValid ? green500 : red500}`,
            borderRadius: '1rem',
            lineHeight: '1.5rem',
            margin: '1rem 0 2rem',
            backgroundColor: isValid ? green50 : red50,
        }),

        message: {
            fontFamily: 'monospace',
            paddingLeft: '1rem',
        },
    }
};

function HelpText({ schema, property }, { d2 }) {
    const styles = {
        wrap: {
            padding: '1rem',
            backgroundColor: blue50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexDirection: 'row',
        },
        text: {
            paddingLeft: '1rem',
        },
        iconWrap: {
            margin: '3px 3px 0',
        },
    };

    return (
        <div style={styles.wrap}>
            <span style={styles.iconWrap}><InfoIcon color={blue200} /></span>
            <span style={styles.text}>{d2.i18n.getTranslation(`${schema}__${property}__help_text`)}</span>
        </div>
    )
}
HelpText.contextTypes = {
    d2: PropTypes.object,
};

function ProgramIndicatorExpression({d2, onChange, status, model, value: formula = '', referenceProperty}) {
    const programType = getOr('WITHOUT_REGISTRATION', 'program.programType', model);

    return (
        <div>
            <div style={styles.programIndicatorExpression.container}>
                <Paper style={styles.programIndicatorExpression.formula}>
                    <HelpText schema={model.modelDefinition.name} property={referenceProperty} />
                    <ExpressionFormula
                        formula={formula}
                        onFormulaChange={(value) => onChange({ target:{ value }})}
                    />
                    <div style={styles.status.container(status.isValid)}>
                        <ExpressionStatusIcon status={status.isValid} />
                        <span style={styles.status.message}>{status.message}</span>
                    </div>
                </Paper>
                <div style={styles.programIndicatorExpression.options}>
                    <DataElementSelectors
                        program={get('program.id', model)}
                        onSelect={(value) => onChange({ target:{ value: formula + value }})}
                    />
                    <AttributeSelector
                        label={d2.i18n.getTranslation('attributes')}
                        program={model.program}
                        programType={programType}
                        onSelect={(value) => onChange({ target:{ value: formula + value }})}
                    />
                    <VariableSelector
                        label={d2.i18n.getTranslation('variables')}
                        programType={programType}
                        onSelect={(value) => onChange({ target:{ value: formula + value }})}
                    />
                    <ConstantSelector
                        label={d2.i18n.getTranslation('constants')}
                        onSelect={(value) => onChange({ target:{ value: formula + value }})}
                    />
                </div>
            </div>
        </div>
    );
}

function createValidator(property, setStatus) {
    const validation$ = new ReplaySubject(1);

    const status$ = validation$
        .distinctUntilChanged()
        .debounceTime(300)
        .map(memoize((expression = '') => {
            if (isEmpty(expression)) {
                return Observable.of({
                    httpStatus: 'OK',
                    httpStatusCode: 200,
                    status: 'ERROR',
                    message:'Expression is empty',
                });
            }

            return Observable.fromPromise(
                getInstance()
                    .then(d2 => {
                        const api = d2.Api.getApi();

                        const requestOptions = {
                            headers: {
                                'Content-Type': 'text/plain',
                            },
                        };

                        return api.post(`programIndicators/${property}/description`, `${expression}` , requestOptions)
                            .then(({ status, description, message }) => ({
                                isValid: status === 'OK',
                                message: status === 'OK' ? description : message
                            }))
                            .catch(error => {
                                // If error contains a message and an error status we consider it to be a valid response
                                if (error.message && error.status === 'ERROR') {
                                    return {
                                        isValid: false,
                                        message: error.message,
                                    };
                                }
                                // Rethrow if not a valid error
                                throw error;
                            });
                    })
            )
        }))
        .concatAll();

    return {
        status$,
        validate(value) {
            validation$.next(value);
        }
    }
}

const enhance = compose(
    getContext({ d2: PropTypes.object }),
    withState('status', 'setStatus', { isValid: false, message: 'Checking expression status..' }),
    lifecycle({
        componentDidMount() {
            const { setStatus, validator, value, referenceProperty } = this.props;
            const { status$, validate } = createValidator(referenceProperty, setStatus);

            this.validate = validate;

            this.validatorStatusSubscription = status$
                .subscribe(setStatus);

            this.validate(value);
        },

        componentWillReceiveProps(newProps) {
            if (newProps.value !== this.props.value) {
                this.validate(newProps.value);
            }
        },

        componentWillUnmount() {
            this.validatorStatusSubscription.unsubscribe();
        }
    })
);

export default new Map([
    decimals,
    ['expression', {
        component: enhance(ProgramIndicatorExpression),
    }],

    ['filter', {
        component: enhance(ProgramIndicatorExpression),
    }],
]);
