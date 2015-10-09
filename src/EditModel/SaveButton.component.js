import React from 'react';
import RaisedButton from 'material-ui/lib/raised-button';
import Translate from 'd2-ui/lib/i18n/Translate.mixin';
import {config} from 'd2';

config.i18n.strings.add('save');

const SaveButton = React.createClass({
    propTypes: {
        isFormValid: React.PropTypes.func.isRequired,
        onClick: React.PropTypes.func.isRequired,
    },

    mixins: [Translate],

    render() {
        return (
            <RaisedButton {...this.props} primary={true} onClick={this.props.onClick} label={this.getTranslation('save')} disabled={!this.props.isFormValid()} />
        );
    },
});

export default SaveButton;
