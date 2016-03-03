import React from 'react';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import Translate from 'd2-ui/lib/i18n/Translate.mixin';

export default React.createClass({
    propTypes: {
        defaultValue: React.PropTypes.object.isRequired,
        labelText: React.PropTypes.string.isRequired,
        onChange: React.PropTypes.func.isRequired,
    },

    mixins: [Translate],

    render() {
        return (
            <DatePicker
                {...this.props}
                defaultDate={this.props.defaultValue && new Date(this.props.defaultValue)}
                mode="landscape"
                autoOk
                inline
                floatingLabelText={this.getTranslation(this.props.labelText)}
                onChange={this._onDateSelect}
            />
        );
    },

    _onDateSelect(event, date) {
        this.props.onChange({
            target: {
                value: date,
            },
        });
    },
});
