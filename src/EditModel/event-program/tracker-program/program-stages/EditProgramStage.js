import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, lifecycle } from 'recompose';

import ProgramStageStepper from './ProgramStageStepper';
import { withProgramStageFromProgramStage$ } from './utils';
import { changeStepperDisabledState } from '../../actions';
import { saveProgramStageEdit, cancelProgramStageEdit, editProgramStageReset } from './actions';
import FormActionButtons from '../../../FormActionButtons';

const EditProgramStage = (props) => {
    const styles = {
        buttons: {
            padding: '2rem 1rem 1rem',
            marginLeft: '10px',
        },
    };
    return (
        <div>
            <ProgramStageStepper
                programStage$={props.programStage$}
                programStage={props.programStage}
            />
            <div style={styles.buttons}>
                <FormActionButtons
                    onSaveAction={props.saveProgramStageEdit}
                    onCancelAction={props.cancelProgramStageEdit}
                />
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
                editProgramStageReset,
            },
            dispatch,
        ),
    ),
    lifecycle({
        componentWillMount() {
            this.props.changeStepperDisabledState(true);
        },
        componentWillUnmount() {
            this.props.changeStepperDisabledState(false);
            this.props.editProgramStageReset();
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
    withProgramStageFromProgramStage$,
)(EditProgramStage);
