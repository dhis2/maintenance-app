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
        return (
            <div style={{ marginTop: 12, marginBottom: 12 }}>
                <Checkbox onClick={this._onClick} {...this.props}
                          label={this.props.labelText}
                          defaultChecked={isTrueOrTheStringTrue(this.props.value)} />
            </div>
        );
    },

    _onClick() {
        // TODO: Emit a proper event..?
        this.props.onChange({
            target: {
                value: !isTrueOrTheStringTrue(this.props.value),
            },
        });
    },
});
