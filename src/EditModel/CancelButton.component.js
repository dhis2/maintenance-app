import PropTypes from 'prop-types'
import Button from 'material-ui/FlatButton';
import { addD2Context } from '@dhis2/d2-ui-core';
import modelToEditStore from '../EditModel/modelToEditStore';

function CancelButton(
    {
        onClick,
        isPristine,
        isDirtyHandler = modelToEditStore.getState.bind(modelToEditStore),
        ...props
    },
    context
) {
    const shouldConfirm =
        isDirtyHandler && isDirtyHandler() && isDirtyHandler().dirty;

    const onClickWithConfirm = (...params) => {
        if (!shouldConfirm) {
            onClick(...params);
        } else if (
            // eslint-disable-next-line no-restricted-globals
            confirm(context.d2.i18n.getTranslation('abandon_unsaved_changes'))
        ) {
            onClick(...params);
        }
    };

    return (
        <Button
            {...props}
            onClick={onClickWithConfirm}
            secondary={shouldConfirm}
            label={context.d2.i18n.getTranslation('cancel')}
        />
    );
}

CancelButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    /* A handler that should return an object with "dirty"-key,
    describing if the current edited model is dirty
     */
    isDirtyHandler: PropTypes.func,
};

export default addD2Context(CancelButton);
