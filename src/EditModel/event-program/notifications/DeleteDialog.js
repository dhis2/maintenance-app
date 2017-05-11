import React, { PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';


// TODO: Move to d2-ui
export default function DeleteDialog({ onCancel, onConfirm, question, open, t }) {
    const actions = [
        <FlatButton
            label={t('cancel')}
            primary
            onTouchTap={onCancel}
        />,
        <FlatButton
            label={t('delete')}
            primary
            onTouchTap={onConfirm}
        />,
    ];

    return (
        <Dialog
            actions={actions}
            modal={false}
            open={open}
            onRequestClose={onCancel}
        >
            {question}
        </Dialog>
    )
}

DeleteDialog.propTypes = {
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,
    question: PropTypes.string,
    t: PropTypes.func,
};
