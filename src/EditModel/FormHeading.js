import React from 'react';
import addD2Context from 'd2-ui/lib/component-helpers/addD2Context';
import Heading from 'd2-ui/lib/headings/Heading.component';
import HelpLink from '../List/HelpLink.component';

function FormHeading({ level, schema, children, ...props }, context) {
    return (
        <Heading {...props} level={level || 2}>
            {context.d2.i18n.getTranslation(children)}
            {schema && (<HelpLink schema={schema} />)}
        </Heading>
    );
}
FormHeading.propTypes = {
    children: React.PropTypes.string,
    level: React.PropTypes.number,
};

export default addD2Context(FormHeading);
