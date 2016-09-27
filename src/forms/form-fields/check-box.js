import React from 'react';
import Checkbox from 'material-ui/Checkbox/Checkbox';

function isTrueOrTheStringTrue(value) {
    return value === true || value === 'true';
}

export default React.createClass({
    propTypes: {
        onChange: React.PropTypes.func.isRequired,
        labelText: React.PropTypes.string.isRequired,
        value: React.PropTypes.bool,
    },

    render() {
        // Do not pass the value on to the CheckBox component
        const {
            value,
            errorStyle,
            errorText,
            labelText,
            modelDefinition,
            models,
            referenceType,
            referenceProperty,
            isInteger,
            multiLine,
            fullWidth,
            translateOptions,
            isRequired,
            options,
            model,
            ...otherProps,
        } = this.props;

        return (
            <div style={{ marginTop: 12, marginBottom: 12 }}>
                <Checkbox onClick={this._onClick}
                          {...otherProps}
                          label={this.props.labelText}
                          defaultChecked={isTrueOrTheStringTrue(this.props.value)} />
            </div>
        );
    },

    _onClick() {
        this.props.onChange({
            target: {
                value: !isTrueOrTheStringTrue(this.props.value),
            },
        });
    },
});
