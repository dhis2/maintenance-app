import { curry, curryRight } from 'lodash/fp';

export const getCurrentProgramStageId = state =>
    state.eventProgram.programStageStepper.stageId;

export const getActiveProgramStageStep = state =>
    state.eventProgram.programStageStepper.activeStep;

export const isProgramStageStepperActive = state =>
    !!state.eventProgram.programStageStepper.stageId;

export const getProgramStageById = curryRight((stageId, store) => {
    console.log(store);
    console.log(stageId)
        return store.programStages.find(stage => stage.id == stageId)
    }
);

export const getProgramStageIndexById = curry((stageId, store) =>
    store.programStages.findIndex(stage => stage.id == stageId)
);
