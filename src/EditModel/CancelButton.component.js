import React from 'react';
import Button from 'material-ui/FlatButton';
import addD2Context from 'd2-ui/lib/component-helpers/addD2Context';
import modelToEditStore from '../EditModel/modelToEditStore';

function CancelButton({ onClick, isPristine, ...props }, context) {
    const onClickWithConfirm = (...params) => {
        const isDirty = modelToEditStore.getState() && modelToEditStore.getState().dirty;

        if (!isDirty) {
            onClick(...params);
        } else {
            if (confirm(context.d2.i18n.getTranslation('abandon_unsaved_changes'))) {
                onClick(...params);
            }
        }
    };

    return (
        <Button
            {...props}
            onClick={onClickWithConfirm}
            secondary={modelToEditStore.getState() && modelToEditStore.getState().dirty}
            label={context.d2.i18n.getTranslation('cancel')}
        />
    );
}

CancelButton.propTypes = {
    onClick: React.PropTypes.func.isRequired,
};

export default addD2Context(CancelButton);
