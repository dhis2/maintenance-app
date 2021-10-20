import React from 'react';
import PropTypes from 'prop-types'
import Heading from 'd2-ui/lib/headings/Heading.component';

const defaultStyle = {
    fontSize: '1.25rem',
    paddingTop: '.5rem',
    fontWeight: 100,
};

function FormSubHeading({ level, children, ...props }) {
    const style = Object.assign({}, defaultStyle, props.style);

    return (
        <Heading {...props} style={style} level={level || 3}>
            {children}
        </Heading>
    );
}
FormSubHeading.propTypes = {
    children: PropTypes.string,
    level: PropTypes.number,
};

export default FormSubHeading;
