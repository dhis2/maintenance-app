import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ExpressionManager from 'd2-ui/lib/expression-manager/ExpressionManager';
import expressionStatusStore from './expressionStatusStore'

export default function ExpressionDialog({ open, handleClose, handleSaveAndClose, ...props }) {
    const customContentStyle = {
        width: '100%',
        maxWidth: 'none',
    };

    const actions = [
        <FlatButton
            label="Cancel"
            primary
            onTouchTap={handleClose}
        />,
        <FlatButton
            label="Submit"
            primary
            onTouchTap={handleSaveAndClose}
        />,
    ];

    return (
        <Dialog
            open={open}
            actions={actions}
            contentStyle={customContentStyle}
            style={{ padding: '1rem' }}
            onRequestClose={handleClose}
        >
            <ExpressionManager
                validateExpression={props.validateExpression}
                descriptionLabel={'description'}
                descriptionValue={props.value ? props.value.description : ''}
                formulaValue={props.value ? props.value.expression : ''}
                expressionStatusStore={expressionStatusStore}
                expressionChanged={props.indicatorExpressionChanged}
                titleText={props.labelText}
            />
        </Dialog>
    );
}

ExpressionDialog.propTypes = {
    validateExpression: PropTypes.func,
}
