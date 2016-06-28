import React from 'react';
import DatePicker from 'material-ui/lib/date-picker/date-picker';

export default React.createClass({
    propTypes: {
        value: React.PropTypes.string,
        labelText: React.PropTypes.string.isRequired,
        onChange: React.PropTypes.func.isRequired,
    },

    render() {
        return (
            <DatePicker
                {...this.props}
                value={this.props.value && new Date(this.props.value)}
                mode="portrait"
                autoOk
                floatingLabelText={this.props.labelText}
                onChange={this._onDateSelect}
                inputStyle={{zIndex: 2}} // TODO: Remove temp label click fix when updating to material-ui 15
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
