import React from 'react';

export default React.createClass({
    propTypes: {
        style: React.PropTypes.object,
        children: React.PropTypes.array.isRequired,
        isFormValid: React.PropTypes.func,
    },

    render() {
        return (
            <div style={this.props.style}>
                {this.props.children.map((child, index) => {
                    return React.addons.cloneWithProps(child, {
                        isFormValid: this.props.isFormValid,
                        key: index,
                    });
                })}
            </div>
        );
    },
});
