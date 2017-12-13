

export const PROGRAM_STAGE_STEP_CHANGE = 'PROGRAM_STAGE_STEP_CHANGE';
export const PROGRAM_STAGE_STEP_NEXT = 'PROGRAM_STAGE_STEP_NEXT';
export const PROGRAM_STAGE_STEP_PREVIOUS = 'PROGRAM_STAGE_STEP_PREVIOUS';

export const PROGRAM_STAGE_EDIT = "PROGRAM_STAGE_EDIT";


export const changeStep = stepKey => ({ type: PROGRAM_STAGE_STEP_CHANGE, payload: stepKey });
export const nextStep = () => ({ type: PROGRAM_STAGE_STEP_NEXT });
export const previousStep = () => ({ type: PROGRAM_STAGE_STEP_PREVIOUS });

export const editProgramStageField = (stageId, field, value) => ({type: PROGRAM_STAGE_EDIT, payload: { stageId, field, value }});