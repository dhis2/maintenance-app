import React from 'react';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import addD2Context from 'd2-ui/lib/component-helpers/addD2Context';

function CancelButton(props, context) {
    return (
        <RaisedButton {...props} label={context.d2.i18n.getTranslation('cancel')} />
    );
}

CancelButton.propTypes = {
    onClick: React.PropTypes.func.isRequired,
};

export default addD2Context(CancelButton);
