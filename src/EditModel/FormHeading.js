import React from 'react';
import PropTypes from 'prop-types';

import addD2Context from 'd2-ui/lib/component-helpers/addD2Context';
import Heading from 'd2-ui/lib/headings/Heading.component';
import HelpLink from '../List/HelpLink.component';
import BackButton from './BackButton.component';
import { goToAndScrollUp } from '../router-utils';

function FormHeading({ level, schema, children, groupName, isDirtyHandler, ...props }, context) {
    return (
        <Heading {...props} level={level}>
            <BackButton
                onClick={() => goToAndScrollUp(`/list/${groupName}/${schema}`)}
                iconStyle={{ top: 3 }}
                isDirtyHandler={isDirtyHandler}
            />
            {context.d2.i18n.getTranslation(children)}
            {schema && (<HelpLink schema={schema} />)}
        </Heading>
    );
}

FormHeading.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
    ]),
    level: PropTypes.number,
    isDirtyHandler: PropTypes.bool,
    schema: PropTypes.string.isRequired,
    groupName: PropTypes.string.isRequired,
};

FormHeading.defaultProps = {
    isDirtyHandler: false,
    level: 2,
    children: '',
};

export default addD2Context(FormHeading);
