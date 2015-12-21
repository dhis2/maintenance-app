import React from 'react/addons';
import TextField from 'material-ui/lib/text-field';
import Translate from 'd2-ui/lib/i18n/Translate.mixin';
import isNumber from 'lodash.isnumber';

import MuiThemeMixin from '../mui-theme.mixin';

export default React.createClass({
    propTypes: {
        multiLine: React.PropTypes.bool,
    },

    mixins: [MuiThemeMixin, Translate],

    _convertToNumberAndEmitChange(event) {
        // When the value is not a number emit the original event
        if (Number.isNaN(Number(event.target.value))) {
            return this.props.onChange(event);
        }

        this.props.onChange({
            target: {
                value: Number.parseFloat(event.target.value),
            }
        });
    },

    render() {
        const errorStyle = {
            lineHeight: this.props.multiLine ? '48px' : '12px',
            marginTop: this.props.multiLine ? -16 : -12,
        };

        return (
            <TextField errorStyle={errorStyle} {...this.props} floatingLabelText={this.getTranslation(this.props.labelText)} onChange={this._convertToNumberAndEmitChange} />
        );
    },
});
