import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { get } from 'lodash/fp';

import compose from 'recompose/compose';
import FormBuilder from 'd2-ui/lib/forms/FormBuilder.component';
import { modelToEditSelector } from './selectors';
import {
    setStageNotificationValue,
    setSelectedProgramStage
} from './actions';
import { createFieldConfigsFor } from '../../formHelpers';

const mapStateToProps= (state) => {
    return {
        model: modelToEditSelector(state),
    };
};

const mapDispatchToProps = dispatch => ({
    onUpdateField(fieldName, value) {
        dispatch(setStageNotificationValue(fieldName, value));
    },
    handleProgramStageSelect(stageId) {
        dispatch(setSelectedProgramStage(stageId));
    },
});

class WhatToSendStep extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        const { fieldConfigs, onUpdateField, isProgram, attributes } = this.props;

        const addPropsToTemplateField = fieldConfig => (
            fieldConfig.name === 'messageTemplate'
                ? Object.assign({}, fieldConfig, {
                    props: Object.assign({}, fieldConfig.props, { attributes, isProgram }),
                })
                : fieldConfig
        );

        return (
            <FormBuilder fields={fieldConfigs.map(addPropsToTemplateField)} onUpdateField={onUpdateField} />
        );
    }
}

WhatToSendStep = compose(
    connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false }),
    createFieldConfigsFor(
        'programNotificationTemplate', ['name', 'messageTemplate']
    )
)(WhatToSendStep);

const steps = [
    {
        key: 'what',
        name: 'what_to_send',
        content: WhatToSendStep,
    },
    {
        key: 'when',
        name: 'when_to_send_it',
        content: compose(
            connect(mapStateToProps, mapDispatchToProps, undefined, {
                pure: false,
            }),
            createFieldConfigsFor(
                'programNotificationTemplate',
                ['notificationTrigger', 'relativeScheduledDays']
            )
        )(({ fieldConfigs = [], onUpdateField }) =>
            <FormBuilder fields={fieldConfigs} onUpdateField={onUpdateField} />
        ),
    },
    {
        key: 'who',
        name: 'who_to_send_it_to',
        content: compose(
            connect(mapStateToProps, mapDispatchToProps, undefined, {
                pure: false,
            }),
            createFieldConfigsFor(
                'programNotificationTemplate',
                [
                    'notificationRecipient',
                    'recipientUserGroup',
                    'deliveryChannels',
                ]
            )
        )(({ fieldConfigs = [], onUpdateField }) =>
            <FormBuilder fields={fieldConfigs} onUpdateField={onUpdateField} />
        ),
    },
];

export default steps;
