import React from 'react';
import TextField from 'material-ui/lib/text-field';

export default React.createClass({
    propTypes: {
        labelText: React.PropTypes.string.isRequired,
        onChange: React.PropTypes.func.isRequired,
        multiLine: React.PropTypes.bool,
    },

    render() {
        const errorStyle = {
            lineHeight: this.props.multiLine ? '48px' : '12px',
            marginTop: this.props.multiLine ? -16 : -12,
        };

        return (
            <TextField errorStyle={errorStyle} {...this.props} floatingLabelText={this.props.labelText} onChange={this._convertToNumberAndEmitChange} />
        );
    },

    _convertToNumberAndEmitChange(event) {
        // When the value is not a number emit the original event
        if (Number.isNaN(Number(event.target.value))) {
            return this.props.onChange(event);
        }

        this.props.onChange({
            target: {
                value: Number.parseFloat(event.target.value),
            },
        });
    },
});
