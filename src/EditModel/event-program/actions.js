////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Stepper
export const STEP_CHANGE = 'STEP_CHANGE';
export const STEP_NEXT = 'STEP_NEXT';
export const STEP_PREVIOUS = 'STEP_PREVIOUS';

export const changeStep = (stepKey) => ({ type: STEP_CHANGE, payload: stepKey });
export const nextStep = () => ({ type: STEP_NEXT });
export const previousStep = () => ({ type: STEP_PREVIOUS });

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Model
export const MODEL_TO_EDIT_LOADED = 'MODEL_TO_EDIT_LOADED';
export const MODEL_TO_EDIT_FIELD_CHANGED = 'MODEL_TO_EDIT_FIELD_CHANGED';

export const editFieldChanged = (field, value) => ({ type: MODEL_TO_EDIT_FIELD_CHANGED, payload: { field, value } });
