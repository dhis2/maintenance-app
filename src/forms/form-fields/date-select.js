import React from 'react';
import DatePicker from 'material-ui/lib/date-picker/date-picker';

export default React.createClass({
    propTypes: {
        defaultValue: React.PropTypes.object.isRequired,
        labelText: React.PropTypes.string.isRequired,
        onChange: React.PropTypes.func.isRequired,
    },

    render() {
        return (
            <DatePicker
                {...this.props}
                defaultDate={this.props.defaultValue && new Date(this.props.defaultValue)}
                mode="landscape"
                autoOk={true}
                inline={true}
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
