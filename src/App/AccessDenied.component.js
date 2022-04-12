import { Heading } from '@dhis2/d2-ui-core';

export default function AccessDenied() {
    return (
        <div>
            <Heading>Access denied!</Heading>
            <p>
                Unfortunately you do not have access to this functionality.
            </p>
        </div>
    );
}
