import React, { Component } from 'react';
import { withState, withProps, compose, onlyUpdateForKeys } from 'recompose';
import Translate from 'd2-ui/lib/i18n/Translate.component';
import MissingValueStrategy from './MissingValueStrategy';
import Dialog from 'material-ui/Dialog';
import ExpressionManager from 'd2-ui/lib/expression-manager/ExpressionManager';
import Store from 'd2-ui/lib/store/Store';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import { isUndefined } from 'lodash/fp';

const styles = {
    saveButton: {
        marginLeft: '1rem',
    },
    customContentStyle: {
        width: '95%',
        maxWidth: 'none',
    },
};

function ValidationRuleExpressionDialog({ open, close, actions, expressionDetails = {}, updateExpressionDetails, expressionStatusStore, onExpressionChanged, onMissingStrategyChanged }, { d2 }) {
    return (
        <Dialog 
            open={open}
            onRequestClose={close}
            modal
            actions={actions}
            contentStyle={styles.customContentStyle}
            title={d2.i18n.getTranslation('left_side')}
            autoScrollBodyContent
        >
            <MissingValueStrategy
                value={expressionDetails.missingValueStrategy}
                onChange={onMissingStrategyChanged}
            />
            <ExpressionManager
                descriptionLabel={d2.i18n.getTranslation('description')}
                descriptionValue={expressionDetails.description || ''}
                expressionStatusStore={expressionStatusStore}
                expressionChanged={onExpressionChanged}
                formulaValue={expressionDetails.expression || ''}
            />
        </Dialog>
    );
}
ValidationRuleExpressionDialog.contextTypes = {
    d2: React.PropTypes.object,
};

const enhanceExpressionDialog = compose(
    withState('expressionDetails', 'updateExpressionDetails', ({ value }) => ({...value})),
    withState('expressionStatusStore', 'updateStore', () => Store.create()),
    withProps(({ close, save, value, store, expressionDetails, expressionStatusStore, updateExpressionDetails }) => {
        const isExpressionValid = isUndefined(expressionStatusStore.getState()) || expressionStatusStore.getState().status === 'OK';

        return ({
            actions: [
                <FlatButton
                    onClick={close}
                    label={<Translate>close</Translate>}
                />,
                <FlatButton
                    onClick={() => save(expressionDetails)}
                    disabled={!isExpressionValid}
                    style={styles.saveButton}
                    label={<Translate>done</Translate>}
                />
            ],
            onExpressionChanged: ({ description, formula }) => updateExpressionDetails({
                ...expressionDetails,
                description,
                expression: formula,
            }),
            onMissingStrategyChanged: (missingValueStrategy) => updateExpressionDetails({
                ...expressionDetails,
                missingValueStrategy,
            }),
        })
    })
);

export default enhanceExpressionDialog(ValidationRuleExpressionDialog);