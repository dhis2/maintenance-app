import React from 'react';
import addD2Context from 'd2-ui/lib/component-helpers/addD2Context';
import Heading from 'd2-ui/lib/headings/Heading.component';

function FormHeading(props, context) {
    return (
        <Heading level={props.level || 2} text={context.d2.i18n.getTranslation(props.text)} />
    );
}
FormHeading.propTypes = {
    text: React.PropTypes.string.isRequired,
    level: React.PropTypes.number,
};

export default addD2Context(FormHeading);
