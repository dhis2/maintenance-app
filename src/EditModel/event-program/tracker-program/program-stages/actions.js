import eventProgramStore from '../../eventProgramStore';
import { generateUid } from 'd2/lib/uid';

export const PROGRAM_STAGE_STEP_CHANGE = 'PROGRAM_STAGE_STEP_CHANGE';
export const PROGRAM_STAGE_STEP_NEXT = 'PROGRAM_STAGE_STEP_NEXT';
export const PROGRAM_STAGE_STEP_PREVIOUS = 'PROGRAM_STAGE_STEP_PREVIOUS';

export const PROGRAM_STAGE_FIELD_EDIT = 'PROGRAM_STAGE_FIELD_EDIT';

export const PROGRAM_STAGE_ADD = 'PROGRAM_STAGE_ADD';
export const PROGRAM_STAGE_EDIT = 'PROGRAM_STAGE_EDIT';
export const PROGRAM_STAGE_EDIT_RESET = 'PROGRAM_STAGE_EDIT_RESET';
export const PROGRAM_STAGE_EDIT_CANCEL = 'PROGRAM_STAGE_EDIT_CANCEL';
export const PROGRAM_STAGE_EDIT_SAVE = 'PROGRAM_STAGE_EDIT_SAVE';

export const changeStep = stepKey => ({
    type: PROGRAM_STAGE_STEP_CHANGE,
    payload: {
        stepKey,
    },
});
export const nextStep = () => ({ type: PROGRAM_STAGE_STEP_NEXT });
export const previousStep = () => ({ type: PROGRAM_STAGE_STEP_PREVIOUS });

export const editProgramStage = stageId => ({
    type: PROGRAM_STAGE_EDIT,
    payload: { stageId },
});

export const addProgramStage = () => ({
    type: PROGRAM_STAGE_ADD,
});

export const editProgramStageReset = () => ({ type: PROGRAM_STAGE_EDIT_RESET });

export const editProgramStageField = (stageId, field, value) => ({
    type: PROGRAM_STAGE_FIELD_EDIT,
    payload: { stageId, field, value },
});

export const saveProgramStageEdit = () => ({ type: PROGRAM_STAGE_EDIT_SAVE });

export const cancelProgramStageEdit = () => {
    return {
        type: PROGRAM_STAGE_EDIT_CANCEL,
    };
};
