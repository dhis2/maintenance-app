import React, { PropTypes } from 'react';
import switchOnBoolean from './helpers/switchOnBoolean';
import DropDown from '../../forms/form-fields/drop-down';
import UserGroupRecipientFields from './validation-notification-template/UserGroupRecipients';
import DeliveryChannels from './validation-notification-template/DeliveryChannels';
import SubjectAndMessageTemplateFields from './validation-notification-template/SubjectAndMessageTemplateFields';

const SkipLogicFields = switchOnBoolean((props) => props.value === 'USER_GROUPS', UserGroupRecipientFields, DeliveryChannels);

export default new Map([
    ['notificationRecipient', {
        component: (props) => {
            return (<div>
                <DropDown {...props} />
                <SkipLogicFields {...props} />
            </div>);
        },
    }],
    ['messageTemplate', {
        component: SubjectAndMessageTemplateFields,
    }]
]);