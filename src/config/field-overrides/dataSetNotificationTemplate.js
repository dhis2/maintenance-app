import React from 'react';

import { map } from 'lodash/fp';
import withProps from 'recompose/withProps';
import mapProps from 'recompose/mapProps';
import compose from 'recompose/compose';

import actions from '../../EditModel/objectActions';
import SubjectAndMessageTemplateFields from './data-set-notification-template/SubjectAndMessageTemplateFields';

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
    ['notificationTrigger', {
        required: true,
        fieldOptions: {
            options: [
                'COMPLETION',
                'SCHEDULED_DAYS_DUE_DATE',
            ],
        },
    }],
    ['messageTemplate', {
        component: DataSetNotificationSubjectAndMessageTemplateFields,
    }],
]);
