import React from 'react';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import addD2Context from 'd2-ui/lib/component-helpers/addD2Context';
import { config } from 'd2/lib/d2';

function SaveButton(props, { d2 }) {
    const buttonText = props.isSaving ? d2.i18n.getTranslation('saving') : d2.i18n.getTranslation('save');

    return (
        <RaisedButton {...props} primary onClick={props.onClick} label={buttonText} disabled={props.isSaving || !props.isValid} />
    );
}

SaveButton.propTypes = {
    isSaving: React.PropTypes.bool,
    isValid: React.PropTypes.bool,
    onClick: React.PropTypes.func.isRequired,
};

export default addD2Context(SaveButton);
