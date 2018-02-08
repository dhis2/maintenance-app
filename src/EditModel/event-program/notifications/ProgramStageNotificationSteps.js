import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { get } from 'lodash/fp';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

import withState from 'recompose/withState';
import compose from 'recompose/compose';
import withPropcs from 'recompose/withProps';
import branch from 'recompose/branch';
import renderNothing from 'recompose/renderNothing';

import FormBuilder from 'd2-ui/lib/forms/FormBuilder.component';

import { createStepperFromConfig } from '../../stepper/stepper';
import { modelToEditSelector } from './selectors';
import {
    setEditModel,
    setStageNotificationValue,
    saveStageNotification,
    setSelectedProgramStage
} from './actions';
import { createFieldConfigsFor } from '../../formHelpers';
import DropDown from '../../../forms/form-fields/drop-down';

const mapStateToProps= (state, { dataElements, ...ownprops }) => {
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

// TODO: Can not modify the fieldConfigs props as the FormBuilder will fail when it can not find old formConfigs. Therefore we'll need to return the same number of fieldConfigs
function skipLogicForNotificationTrigger(fieldConfigs = []) {
    const [notificationTriggerConfig, ...rest] = fieldConfigs;

    // The relativeScheduledDays field only makes sense if the notificationTrigger field is set to 'SCHEDULED_DAYS_DUE_DATE'
    if (notificationTriggerConfig.value !== 'SCHEDULED_DAYS_DUE_DATE') {
        const restRenderingNothing = rest.map(fieldConfig => ({
            ...fieldConfig,
            component: renderNothing(),
        }));
        return [notificationTriggerConfig, ...restRenderingNothing];
    }

    return [notificationTriggerConfig, ...rest];
}

// TODO: Can not modify the fieldConfigs props as the FormBuilder will fail when it can not find old formConfigs. Therefore we'll need to return the same number of fieldConfigs
function skipLogicForRecipients(fieldConfigs = []) {
    const [
        notificationRecipient,
        recipientUserGroup,
        deliveryChannels,
    ] = fieldConfigs;

    const recipientsWithDeliveryChannels = new Set([
        'TRACKED_ENTITY_INSTANCE',
        'ORGANISATION_UNIT_CONTACT',
    ]);
    if (recipientsWithDeliveryChannels.has(notificationRecipient.value)) {
        return [
            notificationRecipient,
            { ...recipientUserGroup, component: renderNothing() },
            deliveryChannels,
        ];
    }

    if (notificationRecipient.value === 'USER_GROUP') {
        return [
            notificationRecipient,
            recipientUserGroup,
            { ...deliveryChannels, component: renderNothing() },
        ];
    }

    return [
        notificationRecipient,
        { ...recipientUserGroup, component: renderNothing() },
        { ...deliveryChannels, component: renderNothing() },
    ];
}

const programStagesToOptions = (programStages) =>
    programStages.map((elem, i) => ({
        text: elem.displayName,
        value: elem.id
}));

class WhatToSendStep extends Component {
    constructor(props) {
        super(props);

        this.state = {
            programStageId: props.model.programStage.id
        }
    }

    handleProgramStage = (event) => {
        const sId = event.target.value;
        this.setState({
            ...this.state,
            programStageId: sId
        });
       // this.props.handleProgramStageSelect(sId);
        this.props.handleProgramStageSelect(sId);
    }

    createProgramStageDropdown = () => {
        return {
            name: 'programStage',
            component: DropDown,
            props: {
                options: programStagesToOptions(this.props.programStages),
                labelText: 'Program stage',
                fullWidth: true,
                value: this.state.programStageId,
                onChange: this.handleProgramStage
            }
        }
    }

    render() {
        const { fieldConfigs, onUpdateField, isTracker, dataElements } = this.props;
        let fieldsToUse = isTracker
            ? [this.createProgramStageDropdown(), ...fieldConfigs]
            : fieldConfigs;
        const addDataElementsToMessageTemplateField = fieldConfig => (
            fieldConfig.name === 'messageTemplate'
                ? Object.assign({}, fieldConfig, {
                    props: Object.assign({}, fieldConfig.props, { dataElements }),
                })
                : fieldConfig
        );

        return (
            <FormBuilder fields={fieldsToUse.map(addDataElementsToMessageTemplateField)} onUpdateField={onUpdateField} />
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
                ['notificationTrigger', 'relativeScheduledDays'],
                skipLogicForNotificationTrigger
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
                ],
                skipLogicForRecipients
            )
        )(({ fieldConfigs = [], onUpdateField }) =>
            <FormBuilder fields={fieldConfigs} onUpdateField={onUpdateField} />
        ),
    },
];

export default steps;
