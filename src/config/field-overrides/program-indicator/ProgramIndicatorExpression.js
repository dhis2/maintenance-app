import React from 'react';
import PropTypes from 'prop-types';
import { get, getOr } from 'lodash/fp';

import Paper from 'material-ui/Paper/Paper';

import ExpressionFormulaWithErrorMessage from './ExpressionFormulaWithErrorMessage';
import AttributeSelector from './AttributeSelector';
import VariableSelector from './VariableSelector';
import ConstantSelector from './ConstantSelector';
import DataElementSelectors from './DataElementSelectors';
import OperatorButtons from '../../../EditModel/OperatorButtons.component';
import HelpText from './HelpText';

import ExpressionStatusIcon, {
    ExpressionStatus,
    getColorForExpressionStatus,
    getBackgroundColorForExpressionStatus } from './ExpressionStatusIcon';

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
    statusMessage: {
        padding: '.25rem',
        paddingLeft: '1rem',
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
function ProgramIndicatorExpression({ d2, onChange, status, model, value: formula = '', referenceProperty }) {
    const programType = getOr('WITHOUT_REGISTRATION', 'program.programType', model);

    const onFormulaChange = value => onChange({ target: { value } });
    const onSelect = value => onChange({ target: { value: formula + value } });

    return (
        <div>
            <div style={styles.programIndicatorExpression.container}>

                <Paper style={styles.programIndicatorExpression.formula}>
                    <HelpText
                        schema={model.modelDefinition.name}
                        property={referenceProperty}
                    />
                    <ExpressionFormulaWithErrorMessage
                        formula={formula}
                        onFormulaChange={onFormulaChange}
                        errorStatus={status}
                    />
                    <OperatorButtons onClick={onSelect} />

                    {status.status === ExpressionStatus.VALID &&
                        <div style={styles.status.container(status.status)}>
                            <ExpressionStatusIcon status={status.status} />
                            <span style={styles.statusMessage}>
                                {status.message}
                            </span>
                        </div>}
                </Paper>

                <div style={styles.programIndicatorExpression.options}>
                    <DataElementSelectors
                        program={get('program.id', model)}
                        onSelect={onSelect}
                    />
                    <AttributeSelector
                        label={d2.i18n.getTranslation('attributes')}
                        program={model.program}
                        programType={programType}
                        onSelect={onSelect}
                    />
                    <VariableSelector
                        label={d2.i18n.getTranslation('variables')}
                        programType={programType}
                        onSelect={onSelect}
                    />
                    <ConstantSelector
                        label={d2.i18n.getTranslation('constants')}
                        onSelect={onSelect}
                    />
                </div>

            </div>
        </div>
    );
}

ProgramIndicatorExpression.propTypes = {
    d2: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    status: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    referenceProperty: PropTypes.string.isRequired,
    value: PropTypes.string,
};
ProgramIndicatorExpression.defaultProps = { value: '' };

export default ProgramIndicatorExpression;
