import React from 'react';
import { withState, withProps, compose } from 'recompose';
import Store from 'd2-ui/lib/store/Store';
import { result } from 'lodash/fp';

import ExpressionManager from 'd2-ui/lib/expression-manager/ExpressionManager';
import Translate from 'd2-ui/lib/i18n/Translate.component';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton/FlatButton';

import MissingValueStrategy from './MissingValueStrategy';
import SlidingWindow from './SlidingWindow';

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
    withState('expressionDetails', 'updateExpressionDetails', ({ value }) => ({ ...value })),
    withState('expressionStatusStore', 'updateStore', () => Store.create()),
    withProps(({ close, save, value, expressionDetails, expressionStatusStore, updateExpressionDetails, buttonLabel }) => {
        const isExpressionValid = result('getState.status', expressionStatusStore) === 'OK';

        const onClickSave = () => save(expressionDetails);
        const discardChanges = () => updateExpressionDetails({ ...value });

        const onClickClose = () => {
            discardChanges();
            close();
        };

        return ({
            buttonLabel,
            actions: [
                <FlatButton
                    onClick={onClickClose}
                    label={<Translate>cancel</Translate>}
                />,
                <FlatButton
                    onClick={onClickSave}
                    disabled={!isExpressionValid}
                    style={styles.saveButton}
                    label={<Translate>save</Translate>}
                />,
            ],
            onExpressionChanged: ({ description, formula }) => updateExpressionDetails({
                ...expressionDetails,
                description,
                expression: formula,
            }),
            onMissingStrategyChanged: missingValueStrategy => updateExpressionDetails({
                ...expressionDetails,
                missingValueStrategy,
            }),
            onSlidingWindowChanged: slidingWindow => updateExpressionDetails({
                ...expressionDetails,
                slidingWindow,
            }),
        });
    }),
);

export default enhanceExpressionDialog(ValidationRuleExpressionDialog);
