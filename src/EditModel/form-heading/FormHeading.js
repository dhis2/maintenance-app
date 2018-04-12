import React from 'react';
import PropTypes from 'prop-types';

import addD2Context from 'd2-ui/lib/component-helpers/addD2Context';
import Heading from 'd2-ui/lib/headings/Heading.component';
import HelpLink from '../../List/HelpLink.component';
import BackButton from '../form-buttons/BackButton.component';
import { goToAndScrollUp } from '../../router-utils';

function FormHeading({ level, schema, children, groupName, isDirtyHandler, style, text }, context) {
    const onclickBack = () => goToAndScrollUp(`/list/${groupName}/${schema}`);

    return (
        <Heading text={text} style={style} level={level} >
            <BackButton
                onClick={onclickBack}
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
    isDirtyHandler: PropTypes.func,
    schema: PropTypes.string.isRequired,
    groupName: PropTypes.string.isRequired,
    style: PropTypes.object,
    text: PropTypes.string,
};

FormHeading.defaultProps = {
    isDirtyHandler: () => {},
    level: 2,
    children: '',
    style: {},
    text: '',
};

export default addD2Context(FormHeading);
