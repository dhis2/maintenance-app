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
import CreateDataEntryForm from '../../create-data-entry-form/CreateDataEntryForm.component';
import { getCurrentProgramStage, getActiveProgramStageStep } from "./selectors";
import compose from 'recompose/compose';
import pure from 'recompose/pure';


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

const ProgramStageVerticalStepper = connect(
    state => ({
        activeStep: getActiveProgramStageStep(state)
    }),
    dispatch => bindActionCreators({ stepperClicked: changeStep }, dispatch)
)(createStepperFromConfig(stepperConfig(), 'vertical'));


export const ProgramStageStepper = pure(props => {
    console.log(props);
    return (
        <div>
            <ProgramStageVerticalStepper programStage$={props.programStage$} programStage={props.programStage} />

        </div>
    );
});

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
