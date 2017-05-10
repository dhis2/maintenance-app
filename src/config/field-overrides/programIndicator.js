import React, { PropTypes } from 'react';
import { decimals } from './sharedFields';
import ExpressionFormula from 'd2-ui/lib/expression-manager/ExpressionFormula';
import CircularProgress from 'material-ui/CircularProgress/CircularProgress';
import Paper from 'material-ui/Paper/Paper';
import TreeView from 'd2-ui/lib/tree-view/TreeView.component';
import { getAllObjectsWithFields } from 'd2-ui/lib/data-helpers';
import { Observable, ReplaySubject } from 'rxjs';
import { isFunction, compose, isEmpty, memoize, get, getOr, values, identity, noop } from 'lodash/fp';
import withState from 'recompose/withState';
import componentFromStream from 'recompose/componentFromStream';
import mapPropsStream from 'recompose/mapPropsStream';
import getContext from 'recompose/getContext';
import mapProps from 'recompose/mapProps';
import { getInstance } from 'd2/lib/d2';
import lifecycle from 'recompose/lifecycle';
import branch from 'recompose/branch';
import RemoveIcon from 'material-ui/svg-icons/content/remove-circle';
import CheckIcon from 'material-ui/svg-icons/action/check-circle';
import InfoIcon from 'material-ui/svg-icons/action/info';
import renderComponent from 'recompose/renderComponent';
import { green500, red500, red50, green50, blue50, blue200 } from 'material-ui/styles/colors';
import nest from 'recompose/nest';

const ExpressionInvalidIcon = nest('span', mapProps(props => ({ color: red500 }))(RemoveIcon));
const ExpressionValidIcon = nest('span', mapProps(props => ({ color: green500 }))(CheckIcon));

const ExpressionStatusIcon = branch(
    props => props.status,
    renderComponent(ExpressionValidIcon),
)(ExpressionInvalidIcon);

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

const getProgramVariablesForProgramType = (programType) => {
    if (programType === 'WITH_REGISTRATION') {
        return programIndicatorVariables.concat(additionalTrackerProgramsVariables);
    }

    return programIndicatorVariables;
};

const withVariablePropsForProgramType = mapPropsStream(props$ => props$
    .map(({ programType, onSelect = noop, ...props }) => {
        const variables = getProgramVariablesForProgramType(programType);

        return ({
            ...props,
            items: variables.map(variable => ({
                value: `V{${variable}}`,
                label: variable
            })),
            onItemClick: onSelect,
        });
    })
);

const CollapsibleList = withState('expanded', 'setExpanded', false)
    (({ items, label, onItemClick, expanded, setExpanded }) => {
        const styles = {
            collapsibleListWrap: {
                padding: '.5rem',
            },
            collapsibleListLabel: {
                fontWeight: 'bold',
            },
            firstCollapsibleListItem: {
                fontSize: '.75rem',
                padding: '.75rem 0',
                cursor: 'pointer',
            },
            collapsibleListItem: {
                fontSize: '.75rem',
                padding: '.5rem 0',
                cursor: 'pointer',
                borderTop: '1px dotted #CCC',
            },
        };

        const children = items.map((item, index) => (
            <div
                key={item.value} onClick={() => onItemClick(item.value)}
                style={index === 0 ? styles.firstCollapsibleListItem : styles.collapsibleListItem}
            >
                {item.label}
            </div>
        ));

        const labelComponent = (<span style={styles.collapsibleListLabel}>{label}</span>);

        return (
            <div style={styles.collapsibleListWrap}>
                <TreeView
                    label={labelComponent}
                    children={children}
                    initiallyExpanded={expanded}
                    onClick={() => setExpanded(true)}
                />
            </div>
        );
    });



const AttributeSelector = mapProps(({ program, onSelect = noop, ...props }) => {
    const programAttributeItems = getOr([], 'programTrackedEntityAttributes', program)
        .map(get('trackedEntityAttribute'))
        .filter(identity) // TODO: Also filter on valueType
        .map(trackedEntityAttribute => ({
            label: trackedEntityAttribute.displayName,
            value: `A{${trackedEntityAttribute.id}}`,
        }));

    return {
        ...props,
        items: programAttributeItems,
        onItemClick: onSelect,
    };
})(CollapsibleList);

const VariableSelector = withVariablePropsForProgramType(CollapsibleList);

const withConstantProps = mapPropsStream(props$ => props$
    .combineLatest(
        Observable.fromPromise(getAllObjectsWithFields('constant'))
            .startWith([]),
        ({ onSelect = noop, ...props }, constants) => ({
            ...props,
            items: constants
                .map(constant => ({
                    value: `C{${constant.id}}`,
                    label: constant.displayName
                })),
            onItemClick: onSelect,
        })
    )
);

const ConstantSelector = withConstantProps(CollapsibleList);

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

function CollapsibleLists({ listSources, onSelect }) {
    const renderedItemLists = listSources
        .map(({ label, items }) => (
            <CollapsibleList
                key={label}
                label={label}
                items={items}
                onItemClick={onSelect}
            />
        ));

    return (
        <div>{ renderedItemLists }</div>
    );
}

const getAvailableDataElementsForProgram = memoize(program => {
    return Observable.fromPromise(getInstance())
        .mergeMap(memoize(d2 => d2.models.programStages
            .filter().on('program.id').equals(program)
            .list({ fields: 'id,displayName,programStageDataElements[id,dataElement[id,displayName]' })
        ));
});

const DataElementSelectors = componentFromStream(props$ => props$
    .flatMap(({ program, ...props }) => {
        return getAvailableDataElementsForProgram(program)
            .map((programStageCollection) => {
                const programStages = programStageCollection.toArray();

                const availableDataElements = programStages
                    .map(programStage => {
                       const programStageDataElements = compose(values, getOr([], 'programStageDataElements'))(programStage);

                        return {
                            label: programStage.displayName,
                            items: programStageDataElements
                                .map(({ dataElement }) => ({
                                    label: dataElement.displayName,
                                    value: `#{${programStage.id}.${dataElement.id}}`,
                                }))
                        };
                    });

                return ({
                    ...props,
                    listSources: availableDataElements,
                });
            });

    })
    .map(props => (<CollapsibleLists {...props} />))
    .startWith(<CircularProgress />)
);

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
