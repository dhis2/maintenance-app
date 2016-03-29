import React from 'react';
import IconButton from 'material-ui/lib/icon-button';
import addD2Context from 'd2-ui/lib/component-helpers/addD2Context';
import { config } from 'd2/lib/d2';

config.i18n.strings.add('back');

function BackButton(props, context) {
    return (
        <IconButton
            tooltip={context.d2.i18n.getTranslation('back')}
            tooltipPosition="bottom-right" {...props}
            iconClassName="material-icons">&#xE5C4;</IconButton>
    );
}

export default addD2Context(BackButton);
