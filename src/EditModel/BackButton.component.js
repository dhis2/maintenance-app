import React from 'react';

import IconButton from 'material-ui/lib/icon-button';

import Translate from 'd2-ui/lib/i18n/Translate.mixin';

export default React.createClass({
    mixins: [Translate],

    render() {
        return (
            <IconButton tooltip={this.getTranslation('back')} tooltipPosition="bottom-right" {...this.props} iconClassName="material-icons">&#xE5C4;</IconButton>
        );
    },
});
