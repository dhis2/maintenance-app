import React from 'react';
import PropTypes from 'prop-types';
import Heading from 'd2-ui/lib/headings/Heading.component';

const defaultStyle = {
    fontSize: '1.25rem',
    paddingTop: '.5rem',
    fontWeight: 100,
};

function FormSubHeading({ level, children, style, text }) {
    return (
        <Heading
            text={text}
            style={{ ...defaultStyle, ...style }}
            level={level}
        >
            {children}
        </Heading>
    );
}
FormSubHeading.propTypes = {
    children: PropTypes.string,
    level: PropTypes.number,
    text: PropTypes.string,
    style: PropTypes.object,
};

FormSubHeading.defaultProps = {
    level: 3,
    text: '',
    style: {},
    children: '',
};

export default FormSubHeading;
