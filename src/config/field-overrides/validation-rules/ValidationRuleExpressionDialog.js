import { Observable } from 'rxjs';
import PropTypes from 'prop-types'
import { getInstance as getD2 } from 'd2';
import { result } from 'lodash/fp';
import Dialog from 'material-ui/Dialog';
import ExpressionManager from '../../../EditModel/expression/ExpressionManager'
import FlatButton from 'material-ui/FlatButton/FlatButton';
import { Store } from '@dhis2/d2-ui-core';
import Translate from '../../../d2-ui/i18n/Translate.component.js';

import { withState, withProps, compose } from 'recompose';

import {
  createActionToValidation$,
} from '../../../utils/createActionToValidation$';
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

const actionToValidation$ = createActionToValidation$(
    'validationRules/expression/description'
)

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
                validateExpression={actionToValidation$}
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
    d2: PropTypes.object,
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
