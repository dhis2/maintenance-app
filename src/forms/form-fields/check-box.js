import React from 'react';
import Checkbox from 'material-ui/lib/checkbox';

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
        const { value, ...otherProps } = this.props;

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
