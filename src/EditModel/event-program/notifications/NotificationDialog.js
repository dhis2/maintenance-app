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
import {
    setEditModel,
    setStageNotificationValue,
    saveStageNotification,
    saveProgramNotification,
} from './actions';
import { createFieldConfigsFor } from '../../formHelpers';
import programStageSteps from './ProgramStageNotificationSteps';
import {
    getProgramStageDataElementsByStageId,
    getSelectedProgramStageId,
    getNotificationType,
    isProgramNotification,
} from './selectors';
import ProgramStageNotificationDialog from './StageNotificationDialog';

const notificationDialogStyle = {
    content: {
        width: '60%',
        minWidth: 700,
        maxWidth: 'none',
    },
};

export const NotificationDialog = ({ isProgram, ...props }) =>
    isProgram
        ? <ProgramNotificationDialog {...props} dialogStyle={notificationDialogStyle} />
        : <ProgramStageNotificationDialog {...props} dialogStyle={notificationDialogStyle} />;

export const EnhancedDialog = compose(
    connect(state => ({
        notificationType: getNotificationType(state),
        isProgram: isProgramNotification(state),
        model: modelToEditSelector(state)
    })),
    branch(({ model }) => !model, renderNothing)
)(NotificationDialog);

const Stepper = compose(
    withState('activeStep', 'setActiveStep', 0),
    withProps(({ setActiveStep, dataElements, isTracker }) => ({
        stepperClicked(stepKey) {
            setActiveStep(
                programStageSteps.findIndex(step => step.key === stepKey)
            );
        },
        dataElements
    }))
)(createStepperFromConfig(programStageSteps, 'vertical'));

function ProgramNotificationDialog(
    { model, onCancel, onConfirm, dataElements, ...props },
    { d2 }
) {
    const t = d2.i18n.getTranslation.bind(d2.i18n);
    const stepperProps = {
        isTracker: props.isTracker,
        isProgram: props.isProgram,
        attributes: props.program.programTrackedEntityAttributes,
        programStages: props.programStages,
        dataElements,
    };
    const actions = [
        <FlatButton label={t('cancel')} primary onTouchTap={onCancel} />,
        <FlatButton
            label={t('save')}
            primary
            onTouchTap={() => onConfirm(model)}
        />,
    ];

    return (
        <Dialog
            actions={actions}
            open={!!model}
            onRequestClose={onCancel}
            title={`${t('program_notification')} (${props.program.displayName ||
                ''})`}
            autoDetectWindowHeight={true}
            repositionOnUpdate={false}
            autoScrollBodyContent
            contentStyle={props.contentStyle && props.contentStyle.content}
            style={{ paddingTop: 0 }}
        >
            <Stepper {...stepperProps} />
        </Dialog>
    );
}

const mapStateToProps = (state, { program }) => ({
    attributes: program.programTrackedEntityAttributes,
});
const mapDispatchToPropsForDialog = dispatch =>
    bindActionCreators(
        {
            onCancel: setEditModel.bind(null, null),
            onConfirm: saveProgramNotification,
        },
        dispatch
    );

ProgramNotificationDialog.contextTypes = {
    d2: PropTypes.object,
};

ProgramNotificationDialog.propTypes = {
    model: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    attributes: PropTypes.array.isRequired,
    isTracker: PropTypes.bool,
    isProgram: PropTypes.bool,
};

ProgramNotificationDialog.defaultProps = {
    isProgram: true,
    isTracker: true,
};

ProgramNotificationDialog = connect(
    mapStateToProps,
    mapDispatchToPropsForDialog
)(ProgramNotificationDialog);




export default EnhancedDialog;
