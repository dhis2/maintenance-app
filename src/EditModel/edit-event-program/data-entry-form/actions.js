export const PROGRAM_STAGE_DATA_ENTRY_FORM_FIELD_CHANGED = 'PROGRAM_STAGE_DATA_ENTRY_FORM_FIELD_CHANGED';
export const PROGRAM_STAGE_DATA_ENTRY_FORM_REMOVE = 'PROGRAM_STAGE_DATA_ENTRY_FORM_REMOVE';

export const dataEntryFormChanged = (programStageId, field, value) => ({ type: PROGRAM_STAGE_DATA_ENTRY_FORM_FIELD_CHANGED, payload: { programStage: programStageId, field, value } });

export const dataEntryFormRemove = programStageId => ({ type: PROGRAM_STAGE_DATA_ENTRY_FORM_REMOVE, payload: programStageId });
