export const getCurrentProgramStageId = state =>
    state.eventProgram.programStageStepper.stageId;

export const getActiveProgramStageStep = state =>
    state.eventProgram.programStageStepper.activeStep;

export const isProgramStageStepperActive = state =>
    !!state.eventProgram.programStageStepper.stageId;
