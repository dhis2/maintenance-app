import React from 'react';
import mapPropsStream from 'recompose/mapPropsStream';
import eventProgramStore$ from './eventProgramStore';
import { createConnectedForwardButton, createConnectedBackwardButton, createStepperNavigation } from '../stepper/stepper';
import { previousStep, nextStep } from './actions';
import EditEventProgram from './EditEventProgram.component';
import EditTrackerProgram from './tracker-program/EditTrackerProgram'

const withPreLoadedModel = mapPropsStream(props$ => props$
    .combineLatest(
        eventProgramStore$,
        (props, eventProgramState) => ({ ...props, model: eventProgramState.program })
    )
);

function EditProgram(props) {
    const schema = props.params.modelType || 'program';
    const { groupName } = props.params;
    console.log(props.model)
    return (
        props.model.programType === "WITH_REGISTRATION" ? <EditTrackerProgram {...props} /> : <EditEventProgram {...props} />
    );
}

export default withPreLoadedModel(EditProgram);
