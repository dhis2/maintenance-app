import React from 'react';
import PropTypes from 'prop-types';

import Button from 'material-ui/FlatButton';
import addD2Context from 'd2-ui/lib/component-helpers/addD2Context';
import modelToEditStore from '../../EditModel/modelToEditStore';

function CancelButton({ onClick, isPristine, isDirtyHandler, style }, context) {
    const shouldConfirm = isDirtyHandler() && isDirtyHandler().dirty;

    const onClickWithConfirm = (...params) => {
        if (!shouldConfirm) {
            onClick(...params);
        } else if (confirm(context.d2.i18n.getTranslation('abandon_unsaved_changes'))) {
            onClick(...params);
        }
    };

    return (
        <Button
            style={style}
            onClick={onClickWithConfirm}
            secondary={shouldConfirm}
            label={context.d2.i18n.getTranslation('cancel')}
        />
    );
}

CancelButton.propTypes = {
    onClick: PropTypes.func.isRequired,

    /* A handler that should return an object with "dirty"-key,
     * describing if the current edited model is dirty.
     */
    isDirtyHandler: PropTypes.func,
    isPristine: PropTypes.bool,
    style: PropTypes.object,
};

CancelButton.defaultProps = {
    isDirtyHandler: modelToEditStore.getState.bind(modelToEditStore),
    isPristine: false,
    style: {},
};

export default addD2Context(CancelButton);
