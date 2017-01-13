import React, { Component } from 'react';
import { withState, withProps, compose, onlyUpdateForKeys } from 'recompose';
import Translate from 'd2-ui/lib/i18n/Translate.component';
import MissingValueStrategy from './MissingValueStrategy';
import Dialog from 'material-ui/Dialog';
import ExpressionManager from 'd2-ui/lib/expression-manager/ExpressionManager';
import Store from 'd2-ui/lib/store/Store';
import RaisedButton from 'material-ui/RaisedButton';
import { isUndefined } from 'lodash/fp';

const customContentStyle = {
    width: '100%',
    maxWidth: 'none',
};

function ValidationRuleExpressionDialog({ open, close, actions, expressionDetails = {}, updateExpressionDetails, expressionStatusStore, onExpressionChanged, onMissingStrategyChanged }, { d2 }) {
    return (
        <Dialog 
            open={open}
            onRequestClose={close}
            modal
            actions={actions}
            contentStyle={customContentStyle}
            title={d2.i18n.getTranslation('left_side')}
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
                <RaisedButton onClick={() => save(expressionDetails)} primary={true} disabled={!isExpressionValid}><Translate>save</Translate></RaisedButton>,
                <RaisedButton onClick={close}><Translate>close</Translate></RaisedButton>
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