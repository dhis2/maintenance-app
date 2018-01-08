import React, { PropTypes } from 'react';
import withProps from 'recompose/withProps';
import compose from 'recompose/compose';
import RelativeScheduledDays from './program-notification-template/RelativeScheduledDays';
import DeliveryChannels from './program-notification-template/DeliveryChannels';
import DropDownAsync from '../../forms/form-fields/drop-down-async';
import SubjectAndMessageTemplateFields from './validation-notification-template/SubjectAndMessageTemplateFields';
import { map } from 'lodash/fp';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setStageNotificationValue } from '../../EditModel/event-program/notifications/actions';

const PROGRAM_STAGE_VARIABLES = [
    'program_name',
    'program_stage_name',
    'org_unit_name',
    'due_date',
    'days_since_due_date',
    'days_until_due_date',
    'current_date',
];

const toVariableType = name => ['V', name];
const toAttributeType = name => ['A', name]; // Used for program attributes
const toDataElementType = name => ['#', name];

const ProgramStageNotificationSubjectAndMessageTemplateFields = compose(
    connect(undefined, dispatch => bindActionCreators({
        onUpdate: ({ fieldName, value }) => setStageNotificationValue(fieldName, value),
    },
    dispatch,
    )),
    withProps(({ dataElements }) => ({
        variableTypes: map(toVariableType, PROGRAM_STAGE_VARIABLES).concat(map(toDataElementType, dataElements)),
    })))(SubjectAndMessageTemplateFields);

export default new Map([
    ['deliveryChannels', {
        component: DeliveryChannels,
    }],
    ['relativeScheduledDays', {
        component: RelativeScheduledDays,
    }],
    ['notificationTrigger', {
        required: true,
        fieldOptions: {
            // For program stages only the following values are allowed
            options: [
                'COMPLETION',
                'SCHEDULED_DAYS_DUE_DATE',
            ],
        },
    }],
    ['notificationRecipient', {
        required: 'true',
    }],
    ['recipientUserGroup', {
        component: (props) => {
            console.log(props);
            if (!props.model || props.model.notificationRecipient !== 'USER_GROUP') {
                return null;
            }

            return <DropDownAsync {...props} />;
        },
    }],
    ['messageTemplate', {
        component: ProgramStageNotificationSubjectAndMessageTemplateFields,
    }],
]);
