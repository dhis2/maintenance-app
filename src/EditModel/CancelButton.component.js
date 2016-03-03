import React from 'react';
import RaisedButton from 'material-ui/lib/raised-button';
import Translate from 'd2-ui/lib/i18n/Translate.mixin';
import { config } from 'd2/lib/d2';

config.i18n.strings.add('cancel');

const CancelButton = React.createClass({
    propTypes: {
        onClick: React.PropTypes.func.isRequired,
    },

    mixins: [Translate],

    render() {
        return (
            <RaisedButton {...this.props} label={this.getTranslation('cancel')} />
        );
    },
});

export default CancelButton;
