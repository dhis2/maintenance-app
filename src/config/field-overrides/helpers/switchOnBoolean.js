import 'react';
import { addD2Context } from '@dhis2/d2-ui-core';
import wrapDisplayName from 'recompose/wrapDisplayName';
import { memoize } from 'lodash/fp';

const Empty = () => {
    return null;
};

export default memoize(function switchOnBoolean(predicate, WhenTrue, WhenFalse = Empty) {
    const switchedComponent = (props, context) => predicate(props, context) ? <WhenTrue d2={context.d2} {...props} /> : <WhenFalse d2={context.d2} {...props} />;

    switchedComponent.displayName = wrapDisplayName(WhenTrue, switchOnBoolean.name);

    return addD2Context(switchedComponent);
});
