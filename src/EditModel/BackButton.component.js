import React from 'react';
import IconButton from 'material-ui/lib/icon-button';
import addD2Context from 'd2-ui/lib/component-helpers/addD2Context';
import { config } from 'd2/lib/d2';

config.i18n.strings.add('back');

function BackButton(props, context) {
    const { tooltip, ...otherProps } = props;

    return (
        <IconButton
            tooltip={tooltip || context.d2.i18n.getTranslation('back')}
            tooltipPosition="bottom-right"
            {...otherProps}
            iconClassName="material-icons"
        >
            &#xE5C4;
        </IconButton>
    );
}
BackButton.propTypes = {
    tooltip: React.PropTypes.string,
};

export default addD2Context(BackButton);
