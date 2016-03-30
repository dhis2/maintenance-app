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
                mode="landscape"
                autoOk
                inline
                floatingLabelText={this.props.labelText}
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
