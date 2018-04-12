import React from 'react';
import PropTypes from 'prop-types';

import IconButton from 'material-ui/IconButton/IconButton';
import addD2Context from 'd2-ui/lib/component-helpers/addD2Context';

import modelToEditStore from '../../EditModel/modelToEditStore';

function BackButton(props, context) {
    const {
        tooltip,
        onClick,
        isDirtyHandler,
        iconStyle,
    } = props;

    const onClickWithConfirm = (...params) => {
        const isDirty = isDirtyHandler() && isDirtyHandler().dirty;
        if (!isDirty) {
            onClick(...params);
        } else if (confirm(context.d2.i18n.getTranslation('abandon_unsaved_changes'))) {
            onClick(...params);
        }
    };

    return (
        <IconButton
            tooltip={context.d2.i18n.getTranslation(tooltip)}
            tooltipPosition="bottom-right"
            onClick={onClickWithConfirm}
            iconStyle={iconStyle}
            iconClassName="material-icons"
        >
            &#xE5C4; {/* <--for IE9 compability. icon:arrow_back */}
        </IconButton>
    );
}
BackButton.propTypes = {
    tooltip: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    isDirtyHandler: PropTypes.func,
    iconStyle: PropTypes.object,
};

BackButton.defaultProps = {
    tooltip: 'back',
    iconStyle: {},
    isDirtyHandler: modelToEditStore.getState.bind(modelToEditStore),
};

export default addD2Context(BackButton);
