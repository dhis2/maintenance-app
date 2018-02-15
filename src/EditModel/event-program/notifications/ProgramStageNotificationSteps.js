import React, { PropTypes, Component } from 'react';
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
import DropDown from '../../../forms/form-fields/drop-down';

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
        const { fieldConfigs, onUpdateField, isTracker, isProgram, dataElements, attributes } = this.props;
        let fieldsToUse = isTracker && !isProgram
            ? [this.createProgramStageDropdown(), ...fieldConfigs]
            : fieldConfigs;
        const addPropsToTemplateField = fieldConfig => (
            fieldConfig.name === 'messageTemplate'
                ? Object.assign({}, fieldConfig, {
                    props: Object.assign({}, fieldConfig.props, { dataElements, attributes, isProgram }),
                })
                : fieldConfig
        );

        return (
            <FormBuilder fields={fieldsToUse.map(addPropsToTemplateField)} onUpdateField={onUpdateField} />
        );
    }
}

WhatToSendStep = compose(
    connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false }),
    createFieldConfigsFor(
        'programNotificationTemplate', ['name', 'messageTemplate']
    )
)(WhatToSendStep);

const stepToFormBuilder = ({ fieldConfigs = [], onUpdateField }) =>
    <FormBuilder fields={fieldConfigs} onUpdateField={onUpdateField} />

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
                undefined,
                null,
                true,
                'programStageNotificationTemplate'
            )
        )(stepToFormBuilder),
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
                undefined,
                null,
                true,
                'programStageNotificationTemplate'
            )
        )(stepToFormBuilder),
    },
];

export default steps;
