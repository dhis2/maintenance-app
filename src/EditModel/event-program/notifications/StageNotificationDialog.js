import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { get } from 'lodash/fp';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

import withState from 'recompose/withState';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import branch from 'recompose/branch';
import renderNothing from 'recompose/renderNothing';
import lifecycle from 'recompose/lifecycle';
import FormBuilder from 'd2-ui/lib/forms/FormBuilder.component';

import { createStepperFromConfig } from '../../stepper/stepper';
import { modelToEditSelector } from './selectors';
import {setEditModel, setStageNotificationValue, saveStageNotification, saveProgramNotification} from './actions';
import { createFieldConfigsFor } from '../../formHelpers';
import programStageSteps from './ProgramStageNotificationSteps';
import { getProgramStageDataElementsByStageId, getSelectedProgramStageId } from "./selectors";

const Stepper = compose(
    withState('activeStep', 'setActiveStep', 0),
    withProps(({ setActiveStep, dataElements }) => ({
        stepperClicked(stepKey) {
            setActiveStep(programStageSteps.findIndex(step => step.key === stepKey));
        },
        dataElements
    }))
)(createStepperFromConfig(programStageSteps, 'vertical'));

const notificationDialogStyle = {
    content: {
        width: '60%',
        minWidth: 700,
        maxWidth: 'none',
    },
};

function NotificationDialog({ model, onCancel, onConfirm, dataElements, isTracker, ...props }, { d2 }) {
    const t = d2.i18n.getTranslation.bind(d2.i18n);
    const stepperProps = {
        isProgram: props.isProgram,
        attributes: props.program.programTrackedEntityAttributes,
        programStages: props.programStages,
        dataElements,
        isTracker
    }
    const actions = [
        <FlatButton
            label={t('cancel')}
            primary
            onTouchTap={onCancel}
        />,
        <FlatButton
            label={t('save')}
            primary
            onTouchTap={() => onConfirm(model)}
        />,
    ];
    const title = `${isTracker ? t('program_stage_notification') : t('program_notification')} (${props.program.displayName || ''})`
    return (
        <Dialog
            actions={actions}
            open={!!model}
            onRequestClose={onCancel}
            title={title}
            autoDetectWindowHeight={true}
            repositionOnUpdate={false}
            autoScrollBodyContent
            contentStyle={notificationDialogStyle.content}
            style={{paddingTop: 0}}
        >
            <Stepper {...stepperProps} />
        </Dialog>
    );
}
NotificationDialog.contextTypes = {
    d2: PropTypes.object,
};
NotificationDialog.propTypes = {
    model: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    dataElements: PropTypes.array.isRequired,
    isTracker: PropTypes.bool,
    isProgram: PropTypes.bool
};

NotificationDialog.defaultProps = {
    isProgram: false,
    isTracker: false
}

const mapStateToProps = (state, { model, availableDataElements, programStages }) => {
    const selectedPSId = (model && model.programStage && model.programStage.id) || programStages[0].id;

    return {
        model,
        dataElements: getProgramStageDataElementsByStageId({
            availableDataElements,
            programStages
        })(selectedPSId)
    }
};
const mapDispatchToPropsForDialog = (dispatch) => bindActionCreators({
    onCancel: setEditModel.bind(null, null),
    onConfirm: saveStageNotification,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToPropsForDialog)(NotificationDialog);
