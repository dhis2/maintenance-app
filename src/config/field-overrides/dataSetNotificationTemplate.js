import React from 'react';

import { map } from 'lodash/fp';
import withProps from 'recompose/withProps';
import mapProps from 'recompose/mapProps';
import compose from 'recompose/compose';

import actions from '../../EditModel/objectActions';
import DeliveryChannels from './program-notification-template/DeliveryChannels';
import RelativeScheduledDays from './program-notification-template/RelativeScheduledDays';
import SubjectAndMessageTemplateFields from './validation-notification-template/SubjectAndMessageTemplateFields';
import DropDownAsync from '../../forms/form-fields/drop-down-async';

const DATA_SET_VARIABLES = [
    'data_set_name',
    'current_date',
];

const toVariableType = name => ['V', name];

const DataSetNotificationSubjectAndMessageTemplateFields = compose(
    withProps({
        variableTypes: map(toVariableType, DATA_SET_VARIABLES),
    }),
    mapProps(props => ({
        ...props,
        onUpdate: actions.update,
    })),
)(SubjectAndMessageTemplateFields);

export default new Map([
    ['deliveryChannels', {
        component: DeliveryChannels,
    }],
    ['relativeScheduledDays', {
        component: RelativeScheduledDays,
    }],
    ['dataSetNotificationTrigger', {
        required: true,
        fieldOptions: {
            options: [
                'DATA_SET_COMPLETION',
                'SCHEDULED_DAYS',
            ],
        },
    }],
    ['messageTemplate', {
        component: DataSetNotificationSubjectAndMessageTemplateFields,
    }],
    ['notificationRecipient', {
        required: 'true',
    }],
    ['recipientUserGroup', {
        component: (props) => {
            if (!props.model || props.model.notificationRecipient !== 'USER_GROUP') {
                return null;
            }

            return <DropDownAsync {...props} />;
        },
    }],
]);
