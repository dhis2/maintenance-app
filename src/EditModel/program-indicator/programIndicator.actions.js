import { createActionCreator } from '../actions';

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
