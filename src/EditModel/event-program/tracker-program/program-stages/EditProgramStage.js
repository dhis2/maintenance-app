import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { removeQuery } from '../../../../router-utils';
import fieldOrder from '../../../../config/field-config/field-order';
import { createFormFor } from '../../../formHelpers';
import { flattenRouterProps, wrapInPaper } from '../../../componentHelpers';
import eventProgramStore$ from '../../eventProgramStore';
import { get, isEqual } from 'lodash/fp';
import { changeStep } from './actions';
import { editProgramStageField } from './actions';
import mapPropsStream from 'recompose/mapPropsStream';
import { compose, lifecycle, pure } from 'recompose';
import { Observable } from 'rxjs';
import steps from './programStageSteps';
import { createStepperFromConfig } from '../../../stepper/stepper';
import { activeStepSelector } from '../../selectors';
import { withProgramStageFromProgramStage$ } from './utils';
import ProgramStageStepper from './ProgramStageStepper';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import { changeStepperDisabledState } from '../../actions';
import { saveProgramStageEdit, cancelProgramStageEdit } from './actions';
import SaveButton from '../../../SaveButton.component';
import CancelButton from '../../../CancelButton.component';
import FormActionButtons from '../../../FormActionButtons';

const EditProgramStage = props => {
    const styles = {
        buttons: {
            padding: '2rem 1rem 1rem',
            marginLeft: '10px'
        },
    };
    return (
        <div>
            <ProgramStageStepper
                programStage$={props.programStage$}
                programStage={props.programStage}
            />
            <div style={styles.buttons}>
                <FormActionButtons onSaveAction={props.saveProgramStageEdit} onCancelAction={props.cancelProgramStageEdit}/>
            </div>


        </div>
    );
};

export default compose(
    connect(null, dispatch =>
        bindActionCreators(
            {
                changeStepperDisabledState,
                saveProgramStageEdit,
                cancelProgramStageEdit,
            },
            dispatch
        )
    ),
    lifecycle({
        componentWillMount() {
            this.props.changeStepperDisabledState(true);
        },
        componentWillUnmount() {
            this.props.changeStepperDisabledState(false);
            //     this.props.saveProgramStage()
        },
        shouldComponentUpdate(nextProps) {
            /* Do not update if programStage updates, this will make the form loose focus - as
            the component will re-render for every change when the observable changes(due getting a new object
            through withProgramStageFromProgramStage$ HoC. */
            if (
                nextProps.programStage !== this.props.programStage ||
                (!this.props.programStage && !nextProps.programStage)
            ) {
                return false;
            }

            return nextProps !== this.props;
        },
    }),
    withProgramStageFromProgramStage$
)(EditProgramStage);
