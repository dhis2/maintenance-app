import PropTypes from 'prop-types'
import { Heading } from '@dhis2/d2-ui-core';

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
