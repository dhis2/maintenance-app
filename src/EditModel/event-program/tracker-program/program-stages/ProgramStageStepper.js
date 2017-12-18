import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import steps from './programStageSteps';
import { changeStep } from './actions';
import { bindActionCreators } from 'redux';
import fieldOrder from '../../../../config/field-config/field-order';
import { flattenRouterProps, wrapInPaper } from '../../../componentHelpers';
import ProgramStage from './ProgramStage';
import AssignOrganisationUnits from '../../assign-organisation-units/AssignOrganisationUnits';
import mapPropsStream from 'recompose/mapPropsStream';
import { createStepperContentFromConfig } from '../../../stepper/stepper';
import eventProgramStore from '../../eventProgramStore';
import { editFieldChanged } from '../../actions';
import { createFormFor } from '../../../formHelpers';
import { createStepperFromConfig } from '../../../stepper/stepper';
import EditProgramStageDetails from './EditProgramStageDetails';
import AssignProgramStageDataElements from './AssignProgramStageDataElements';
import CreateDataEntryForm from './CreateDataEntryForm';

import compose from 'recompose/compose';

const ProgramStageStepperNavigation = connect(
    state => ({
        activeStep: state.eventProgram.programStageStepper.activeStep
    }),
    dispatch => bindActionCreators({ stepperClicked: changeStep }, dispatch)
)(createStepperFromConfig(steps, 'vertical'));

//const ProgramStageForm = connectEditForm(wrapInPaper(createFormFor(props.programStage$, 'programStage', programStageFields)));

const stepperConfig = () => {
    //   const program$ = eventProgramStore.map(get('program'));

    const stepComponents = {
        EditProgramStageDetails,
        AssignProgramStageDataElements,
        CreateDataEntryForm
    };

    return steps.map(step => {
        step.component = stepComponents[step.componentName]; // eslint-disable-line no-param-reassign
        step.content = stepComponents[step.componentName];
        return step;
    });
};

const ProgramStageStepperContent = compose(
    connect(state => ({
        activeStep: state.eventProgram.programStageStepper.activeStep
    })),
    mapPropsStream(props$ =>
        props$.combineLatest(eventProgramStore, (props, { program }) => ({
            ...props,
            modelToEdit: program
        }))
    ))(createStepperContentFromConfig(stepperConfig()));

export const ProgramStageStepper = props => {
    console.log(props);
    return (
        <div>
            <ProgramStageStepperNavigation programStage$={props.programStage$} programStage={props.programStage} />

        </div>
    );
};

ProgramStageStepper.propTypes = {
    /**
     * Programstage observable, needed to create custom forms
     */
    programStage$: PropTypes.object.isRequired,
    /**
     * Programstage-model object
     */
    programStage: PropTypes.object
};

export default ProgramStageStepper;
