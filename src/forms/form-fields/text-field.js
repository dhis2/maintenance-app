import React from 'react';
import TextField from 'material-ui/lib/text-field';

export default function TextFormField(props) {
    const errorStyle = {
        lineHeight: props.multiLine ? '48px' : '12px',
        marginTop: props.multiLine ? -16 : -12,
    };

    return (
        <TextField
            errorStyle={errorStyle}
            {...props}
            value={props.value}
            floatingLabelText={props.labelText}
        />
    );
}
TextFormField.propTypes = {
    labelText: React.PropTypes.string.isRequired,
    multiLine: React.PropTypes.bool,
};
