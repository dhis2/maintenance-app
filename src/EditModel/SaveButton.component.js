import React from 'react';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import addD2Context from 'd2-ui/lib/component-helpers/addD2Context';

function SaveButton(props, { d2 }) {
    const {
        isSaving,
        isValid,
        onClick,
        ...rest
    } = props;
    const buttonText = isSaving ? d2.i18n.getTranslation('saving') : d2.i18n.getTranslation('save');

    return (
        <RaisedButton {...rest} primary onClick={onClick} label={buttonText} disabled={isSaving || !isValid} />
    );
}

SaveButton.propTypes = {
    isSaving: PropTypes.bool,
    isValid: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
};
SaveButton.defaultProps = { isSaving: false, isValid: true };

export default addD2Context(SaveButton);
