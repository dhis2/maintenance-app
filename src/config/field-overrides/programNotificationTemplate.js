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

const PROGRAM_VARIABLES = [
    'program_name',
    'org_unit_name',
    'due_date',
    'days_since_due_date',
    'days_until_due_date',
    'current_date',
];

const toVariableType = name => ['V', name];
const toAttributeType = name => ['A', name]; // Used for program attributes
const toDataElementType = name => ['#', name];

const dataElementsTypeMap = dataElements =>
    map(toDataElementType, dataElements);
const attributesToTypeMap = attributes => map(toAttributeType, attributes);

const NotificationSubjectAndMessageTemplateFields = compose(
    connect(undefined, dispatch =>
        bindActionCreators(
            {
                onUpdate: ({ fieldName, value }) =>
                    setStageNotificationValue(fieldName, value),
            },
            dispatch
        )
    ),
    withProps(({ dataElements, attributes, isProgram }) => {
        let constantVariables = PROGRAM_STAGE_VARIABLES;
        let variables = dataElementsTypeMap(dataElements);

        if(isProgram) {
            constantVariables = PROGRAM_VARIABLES;
            variables = attributesToTypeMap(attributes);
        }

        return {
            variableTypes: map(toVariableType, constantVariables).concat(
                variables
            ),
        };
    })
)(SubjectAndMessageTemplateFields);

/**
 * programNotificationTemplate are shared for both program notification and
 * programStage notifications. We use a customFieldOrder name to differentiate
 * between these two, as they have different behavior and overrides.
 */
export default new Map([
    [
        'deliveryChannels',
        {
            component: DeliveryChannels,
        },
    ],
    [
        'relativeScheduledDays',
        {
            component: RelativeScheduledDays,
        },
    ],
    [
        'notificationTrigger',
        {
            required: true,
            fieldOptions: {
                options: [
                    'COMPLETION',
                    'ENROLLMENT',
                    'SCHEDULED_DAYS_INCIDENT_DATE',
                    'SCHEDULED_DAYS_ENROLLMENT_DATE',
                    'PROGRAM_RULE'
                ]
            },
        },
    ],
    [
        'notificationRecipient',
        {
            required: 'true',
        },
    ],
    [
        'recipientUserGroup',
        {
            component: props => {
                if (
                    !props.model ||
                    props.model.notificationRecipient !== 'USER_GROUP'
                ) {
                    return null;
                }

                return <DropDownAsync {...props} />;
            },
        },
    ],
    [
        'messageTemplate',
        {
            component: props =>
                <NotificationSubjectAndMessageTemplateFields {...props} />,
        },
    ],
]);

export const programStageNotificationTemplate = new Map([
    [
        'notificationTrigger',
        {
            required: true,
            fieldOptions: {
                // For program stages only the following values are allowed
                options: [
                    'COMPLETION',
                    'SCHEDULED_DAYS_DUE_DATE',
                    'PROGRAM_RULE'
                ]
            },
        },
    ]
])
