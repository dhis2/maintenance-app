import React from 'react';
import RaisedButton from 'material-ui/lib/raised-button';
import addD2Context from 'd2-ui/lib/component-helpers/addD2Context';
import { config } from 'd2/lib/d2';

config.i18n.strings.add('cancel');

function CancelButton(props, context) {
    return (
        <RaisedButton {...props} label={context.d2.i18n.getTranslation('cancel')} />
    );
}

CancelButton.propTypes = {
    onClick: React.PropTypes.func.isRequired,
};

export default addD2Context(CancelButton);
