import { createActionCreator } from '../actions';

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Stepper
export const PROGRAM_INDICATOR_STEP_CHANGE = 'PROGRAM_INDICATOR_STEP_CHANGE';
export const PROGRAM_INDICATOR_STEP_NEXT = 'PROGRAM_INDICATOR_STEP_NEXT';
export const PROGRAM_INDICATOR_STEP_PREVIOUS = 'PROGRAM_INDICATOR_STEP_PREVIOUS';

export const changeStep = createActionCreator(PROGRAM_INDICATOR_STEP_CHANGE);
export const nextStep = createActionCreator(PROGRAM_INDICATOR_STEP_NEXT);
export const previousStep = createActionCreator(PROGRAM_INDICATOR_STEP_PREVIOUS);

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Program Indicator
export const PROGRAM_INDICATOR_LOAD = 'PROGRAM_INDICATOR_LOAD';
export const PROGRAM_INDICATOR_LOAD_SUCCESS = 'PROGRAM_INDICATOR_LOAD_SUCCESS';
export const PROGRAM_INDICATOR_LOAD_ERROR = 'PROGRAM_INDICATOR_LOAD_ERROR';

export const loadProgramIndicator = createActionCreator(PROGRAM_INDICATOR_LOAD);
export const loadProgramIndicatorSuccess = createActionCreator(PROGRAM_INDICATOR_LOAD_SUCCESS);
export const loadProgramIndicatorFailure = createActionCreator(PROGRAM_INDICATOR_LOAD_ERROR);

export const PROGRAM_INDICATOR_SAVE_AND_VALIDATE = 'PROGRAM_INDICATOR_SAVE_AND_VALIDATE';
export const saveAndValidateProgramIndicator = (fieldConfigs, formRef) => ({
    type: PROGRAM_INDICATOR_SAVE_AND_VALIDATE,
    payload: { fieldConfigs, formRef },
});

export const PROGRAM_INDICATOR_SAVE = 'PROGRAM_INDICATOR_SAVE';
export const PROGRAM_INDICATOR_SAVE_SUCCESS = 'PROGRAM_INDICATOR_SAVE_SUCCESS';
export const PROGRAM_INDICATOR_SAVE_ERROR = 'PROGRAM_INDICATOR_SAVE_ERROR';

export const saveProgramIndicator = createActionCreator(PROGRAM_INDICATOR_SAVE);
export const saveProgramIndicatorSuccess = createActionCreator(PROGRAM_INDICATOR_SAVE_SUCCESS);
export const saveProgramIndicatorError = createActionCreator(PROGRAM_INDICATOR_SAVE_ERROR);

export const PROGRAM_INDICATOR_TO_EDIT_FIELD_CHANGED = 'PROGRAM_INDICATOR_TO_EDIT_FIELD_CHANGED';
export const editFieldChanged = (field, value) => ({
    type: PROGRAM_INDICATOR_TO_EDIT_FIELD_CHANGED,
    payload: { field, value },
});

export const PROGRAM_INDICATOR_TO_EDIT_FIELD_CHANGED_DONE = 'PROGRAM_INDICATOR_TO_EDIT_FIELD_CHANGED_DONE';
export const editFieldChangeDone = createActionCreator(PROGRAM_INDICATOR_TO_EDIT_FIELD_CHANGED_DONE);
