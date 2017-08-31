import React from 'react';
import addD2Context from 'd2-ui/lib/component-helpers/addD2Context';
import Heading from 'd2-ui/lib/headings/Heading.component';
import HelpLink from '../List/HelpLink.component';
import BackButton from './BackButton.component';
import { goToAndScrollUp } from '../router-utils';

function FormHeading({ level, schema, children, groupName, ...props }, context) {
    return (
        <Heading {...props} level={level || 2}>
            <BackButton
                onClick={() => goToAndScrollUp(`/list/${groupName}/${schema}`)}
                iconStyle={{ top: 3 }}
            />
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
