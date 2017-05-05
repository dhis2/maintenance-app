import React, { PropTypes } from 'react';
import { decimals } from './sharedFields';
import ConstantSelector from 'd2-ui/lib/expression-manager/ConstantSelector';
import ExpressionFormula from 'd2-ui/lib/expression-manager/ExpressionFormula';
import {Tabs, Tab} from 'material-ui/Tabs';

import ListSelectWithLocalSearch from 'd2-ui/lib/list-select/ListSelectWithLocalSearch.component';
import withPropsFromObservable from 'd2-ui/lib/component-helpers/withPropsFromObservable';
import { Observable, ReplaySubject } from 'rxjs';
import { isFunction, compose, isEmpty, memoize } from 'lodash/fp';
import withState from 'recompose/withState';
import mapPropsStream from 'recompose/mapPropsStream';
import getContext from 'recompose/getContext';
import { getInstance } from 'd2/lib/d2';
import lifecycle from 'recompose/lifecycle';

import CheckCircle from 'material-ui/svg-icons/action/check-circle';
import RemoveCircle from 'material-ui/svg-icons/content/remove-circle';

const programIndicatorVariables = [
    'event_date',
    'due_date',
    'incident_date',
    'current_date',
    'completed_date',
    'value_count',
    'zero_pos_value_count',
    'event_count',
    'program_stage_name',
    'program_stage_id',
];
const additionalTrackerProgramsVariables = [
    'enrollment_count',
    'tei_count',
    'enrollment_date',
    'enrollment_status',
];

const programVariables$ = Observable.of(programIndicatorVariables)
    .map(variables => ({
        source: variables.map(variable => ({ value: variable, label: variable })),
        onItemDoubleClick(value) {
            const constFormula = ['V{', value, '}'].join('');

            // `this` is the react component props object
            if (isFunction(this.onSelect)) {
                this.onSelect(constFormula);
            }
        },
    }));

const VariableSelector = withPropsFromObservable(programVariables$, ListSelectWithLocalSearch);

const styles = {
    programIndicatorExpression: {
        container: {
            display: 'flex',
        },
        formula: {
            width: '40%',
        },
        options: {
            width: '60%',
        },
    },
    status: {
        container: (isValid) => ({
            display: 'flex',
            flexDirection: 'row',
            padding: '2rem',
            border: `1px solid ${isValid ? 'green' : 'red'}`,
            borderRadius: '1rem',
            lineHeight: '1.5rem',
            margin: '1rem 0 2rem',
            backgroundColor: '#F0F0F0',
        }),

        message: {
            fontFamily: 'monospace',
        },
    }
};

function ProgramIndicatorExpression({ onChange, status, value: formula = ''}) {
    return (
        <div>
            <div style={styles.programIndicatorExpression.container}>
                <div style={styles.programIndicatorExpression.formula}>
                    <ExpressionFormula
                        formula={formula}
                        onFormulaChange={(value) => onChange({ target:{ value }})}
                    />
                </div>
                <Tabs style={styles.programIndicatorExpression.options}>
                    <Tab label="DataElements">
                        <div>Stuff!</div>
                    </Tab>
                    <Tab label="Variables">
                        <VariableSelector
                            onSelect={(value) => onChange({ target:{ value: formula + value }})}
                        />
                    </Tab>
                    <Tab label="Constants">
                        <ConstantSelector
                            onSelect={(value) => onChange({ target:{ value: formula + value }})}
                        />
                    </Tab>
                </Tabs>
            </div>
            <div style={styles.status.container(status.isValid)}>
                <div style={styles.status.message}>{status.message}</div>
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
            console.log(this.props);
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
