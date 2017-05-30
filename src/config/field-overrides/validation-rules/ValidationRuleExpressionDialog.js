import React, { Component } from 'react';
import { withState, withProps, compose, onlyUpdateForKeys } from 'recompose';
import Translate from 'd2-ui/lib/i18n/Translate.component';
import MissingValueStrategy from './MissingValueStrategy';
import SlidingWindow from './SlidingWindow';
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

function ValidationRuleExpressionDialog({ open, close, actions, expressionDetails = {}, buttonLabel, updateExpressionDetails, expressionStatusStore, onExpressionChanged, onMissingStrategyChanged, onSlidingWindowChanged }, { d2 }) {
    console.log(buttonLabel);
    return (
        <Dialog
            open={open}
            onRequestClose={close}
            modal
            actions={actions}
            contentStyle={styles.customContentStyle}
            title={d2.i18n.getTranslation(buttonLabel)}
            autoScrollBodyContent
        >
            <MissingValueStrategy
                value={expressionDetails.missingValueStrategy}
                onChange={onMissingStrategyChanged}
            />
            <SlidingWindow
                value={expressionDetails.slidingWindow}
                onChange={onSlidingWindowChanged}
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
    withProps(({ close, save, value, store, expressionDetails, expressionStatusStore, updateExpressionDetails, buttonLabel }) => {
        const isExpressionValid = isUndefined(expressionStatusStore.getState()) || expressionStatusStore.getState().status === 'OK';

        return ({
            buttonLabel,
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
            onSlidingWindowChanged: (slidingWindow) => updateExpressionDetails({
                ...expressionDetails,
                slidingWindow,
            }),
        })
    })
);

export default enhanceExpressionDialog(ValidationRuleExpressionDialog);
