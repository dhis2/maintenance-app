import PropTypes from 'prop-types';

import { addD2Context } from '@dhis2/d2-ui-core';
import { Heading } from '@dhis2/d2-ui-core';
import HelpLink from '../List/HelpLink.component';
import BackButton from './BackButton.component';
import { goToAndScrollUp } from '../router-utils';

function FormHeading({ level, schema, children, groupName, isDirtyHandler, skipTranslation, ...props }, context) {
    return (
        <Heading {...props} level={level}>
            <BackButton
                onClick={() => goToAndScrollUp(`/list/${groupName}/${schema}`)}
                iconStyle={{ top: 3 }}
                isDirtyHandler={isDirtyHandler}
            />
            {skipTranslation ? children : context.d2.i18n.getTranslation(children)}
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
    isDirtyHandler: PropTypes.func,
    schema: PropTypes.string.isRequired,
    groupName: PropTypes.string.isRequired,
    skipTranslation: PropTypes.bool,
};

FormHeading.defaultProps = {
    isDirtyHandler: () => {},
    level: 2,
    children: '',
    skipTranslation: false,
};

export default addD2Context(FormHeading);
