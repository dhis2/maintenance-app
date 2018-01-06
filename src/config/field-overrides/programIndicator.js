import React, { PropTypes } from 'react';

import ExpressionFormula from 'd2-ui/lib/expression-manager/ExpressionFormula';
import Paper from 'material-ui/Paper/Paper';
import { Observable, ReplaySubject } from 'rxjs';
import { isFunction, compose, isEmpty, memoize, get, getOr, values, identity, noop, negate } from 'lodash/fp';
import withState from 'recompose/withState';
import getContext from 'recompose/getContext';
import { getInstance } from 'd2/lib/d2';
import lifecycle from 'recompose/lifecycle';
import InfoIcon from 'material-ui/svg-icons/action/info';
import { blue50, blue200 } from 'material-ui/styles/colors';
import { decimals } from './sharedFields';

import AttributeSelector from './program-indicator/AttributeSelector';
import VariableSelector from './program-indicator/VariableSelector';
import ConstantSelector from './program-indicator/ConstantSelector';
import DataElementSelectors from './program-indicator/DataElementSelectors';
import ExpressionStatusIcon, {
    ExpressionStatus,
    getColorForExpressionStatus,
    getBackgroundColorForExpressionStatus } from './program-indicator/ExpressionStatusIcon';
import OperatorButtons from '../../EditModel/OperatorButtons.component';

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
        container: status => ({
            display: 'flex',
            flexDirection: 'row',
            padding: '2rem',
            border: `1px solid ${getColorForExpressionStatus(status)}`,
            lineHeight: '1.5rem',
            margin: '1rem 0 2rem',
            backgroundColor: getBackgroundColorForExpressionStatus(status),
        }),
    },
    operatorButton: {
        marginRight: 8,
        marginTop: 8,
        minWidth: 50,
    },
    operatorButtonSeparator: {
        display: 'inline-block',
        marginTop: 8,
        marginLeft: 8,
        whiteSpace: 'nowrap',
    },
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
    );
}
HelpText.contextTypes = {
    d2: PropTypes.object,
};

const isExpressionValid = expressionStatus => expressionStatus.status === ExpressionStatus.VALID;
const isExpressionInvalid = negate(isExpressionValid);

function ExpressionFormulaWithErrorMessage({ formula, onFormulaChange, errorStatus }) {
    const color = getColorForExpressionStatus(errorStatus.status);
    const formulaWrapStyle = {
        border: `2px solid ${isExpressionInvalid(errorStatus) ? color : 'transparent'}`,
    };
    const formulaDescriptionField = isExpressionInvalid(errorStatus)
        ? <span style={{ color, marginTop: '.25rem' }}>{errorStatus.message}</span>
        : null;

    return (
        <div>
            <div style={formulaWrapStyle}>
                <ExpressionFormula
                    formula={formula}
                    onFormulaChange={onFormulaChange}
                />
            </div>
            {formulaDescriptionField}
        </div>
    );
}

function ProgramIndicatorExpression({ d2, onChange, status, model, value: formula = '', referenceProperty }) {
    const programType = getOr('WITHOUT_REGISTRATION', 'program.programType', model);

    return (
        <div>
            <div style={styles.programIndicatorExpression.container}>

                <Paper style={styles.programIndicatorExpression.formula}>
                    <HelpText schema={model.modelDefinition.name} property={referenceProperty} />
                    <ExpressionFormulaWithErrorMessage
                        formula={formula}
                        onFormulaChange={value => onChange({ target: { value } })}
                        errorStatus={status}
                    />
                    <OperatorButtons
                        onClick={value => {
                            console.log(value)
                            onChange({ target: { value: formula + value } })
                        }
                        }
                    />
                    {status.status === ExpressionStatus.VALID
                        ? <div style={styles.status.container(status.status)}>
                            <ExpressionStatusIcon status={status.status} />
                            <span style={{ padding: '.25rem', paddingLeft: '1rem' }}>{status.message}</span>
                        </div>
                        : null}
                </Paper>

                <div style={styles.programIndicatorExpression.options}>
                    <DataElementSelectors
                        program={get('program.id', model)}
                        onSelect={value => onChange({ target: { value: formula + value } })}
                    />
                    <AttributeSelector
                        label={d2.i18n.getTranslation('attributes')}
                        program={model.program}
                        programType={programType}
                        onSelect={value => onChange({ target: { value: formula + value } })}
                    />
                    <VariableSelector
                        label={d2.i18n.getTranslation('variables')}
                        programType={programType}
                        onSelect={value => onChange({ target: { value: formula + value } })}
                    />
                    <ConstantSelector
                        label={d2.i18n.getTranslation('constants')}
                        onSelect={value => onChange({ target: { value: formula + value } })}
                    />
                </div>

            </div>
        </div>
    );
}

function createValidator(property) {
    const validation$ = new ReplaySubject(1);

    const status$ = validation$
        .distinctUntilChanged()
        .debounceTime(300)
        .mergeMap(memoize((expression = '') => Observable.fromPromise(
            getInstance()
                .then((d2) => {
                    if (isEmpty(expression)) {
                        return Observable.of({
                            status: ExpressionStatus.PENDING,
                            message: d2.i18n.getTranslation('expression_is_empty'),
                        });
                    }

                    const api = d2.Api.getApi();
                    const requestOptions = {
                        headers: {
                            'Content-Type': 'text/plain',
                        },
                    };

                    const validation$ = api.post(`programIndicators/${property}/description`, `${expression}`, requestOptions)
                        .then(({ status, description, message }) => ({
                            status: status === 'OK' ? ExpressionStatus.VALID : ExpressionStatus.INVALID,
                            message: status === 'OK' ? description : message,
                        }))
                        .catch((error) => {
                            // If error contains a message and an error status we consider it to be a valid response
                            if (error.message && error.status === 'ERROR') {
                                return {
                                    status: ExpressionStatus.INVALID,
                                    message: error.message,
                                };
                            }
                            // Rethrow if not a valid error
                            throw error;
                        });

                    return Observable.merge(
                        Observable.of({
                            status: ExpressionStatus.PENDING,
                            message: d2.i18n.getTranslation('checking_expression_status'),
                        }),
                        Observable.fromPromise(validation$),
                    );
                }),
        )))
        .concatAll();

    return {
        status$,
        validate(value) {
            validation$.next(value);
        },
    };
}

const enhance = compose(
    getContext({ d2: PropTypes.object }),
    withState('status', 'setStatus', ({ d2 }) => ({
        status: ExpressionStatus.PENDING,
        message: d2.i18n.getTranslation('checking_expression_status'),
    })),
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
        },
    }),
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
