import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ExpressionManager from 'd2-ui/lib/expression-manager/ExpressionManager';
import expressionStatusStore from './expressionStatusStore'
import MissingValueStrategy from '../validation-rules/MissingValueStrategy';

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

    // Only display the MissingValueStrategy for GENERATOR, not SAMPLE SKIP TEST
    // see https://jira.dhis2.org/browse/DHIS2-7147?focusedCommentId=29805&page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-29805
    const showMissingValueStrategy = props.referenceProperty === 'generator';

    return (
        <Dialog
            open={open}
            actions={actions}
            contentStyle={customContentStyle}
            style={{ padding: '1rem' }}
            onRequestClose={handleClose}
        >
            {showMissingValueStrategy && (
                <MissingValueStrategy
                    value={props.value ? props.value.missingValueStrategy : ''}
                    onChange={props.missingValueStrategyChanged}
                />
            )}
            <ExpressionManager
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
