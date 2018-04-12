import React from 'react';
import PropTypes from 'prop-types';
import isArray from 'd2-utilizr/lib/isArray';

const styles = {
    defaultStyle: {
        marginTop: '1rem',
    },
    buttonStyle: {
        marginRight: '1rem',
        width: '10rem',
    },
};

export default function FormButtons({ children, style }) {
    const buttonsToRender = isArray(children) ? children : [children];
    return (
        <div style={Object.assign(styles.defaultStyle, style)}>
            {buttonsToRender.map((child, index) =>
                React.cloneElement(
                    child,
                    {
                        style: styles.buttonStyle,
                        key: index,
                    },
                ))}
        </div>
    );
}
FormButtons.propTypes = {
    style: PropTypes.object,
    children: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]).isRequired,
};

FormButtons.defaultProps = {
    style: {},
};
