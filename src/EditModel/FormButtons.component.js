import React from 'react';
import PropTypes from 'prop-types'
import isArray from 'd2-utilizr/lib/isArray';

export default function FormButtons(props) {
    const defaultStyle = {
        marginTop: '1rem',
    };

    const buttonStyle = {
        marginRight: '1rem',
        width: '10rem',
    };

    const buttonsToRender = isArray(props.children) ? props.children : [props.children];

    return (
        <div style={Object.assign(defaultStyle, props.style)}>
            {buttonsToRender.map((child, index) => React.cloneElement(child, {
                style: buttonStyle,
                key: index,
            }))}
        </div>
    );
}
FormButtons.propTypes = {
    style: PropTypes.object,
    children: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]).isRequired,
    isFormValid: PropTypes.func,
};
//
// export default React.createClass({
//
//
//    render() {
//        return (
//            <div style={this.props.style}>
//                {this.props.children.map((child, index) => {
//                    return React.cloneElement(child, {
//                        isFormValid: this.props.isFormValid,
//                        key: index,
//                    });
//                })}
//            </div>
//        );
//    },
// });
