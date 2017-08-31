export const NOTIFICATION_STAGE_REMOVE = 'NOTIFICATION_STAGE_REMOVE';
export const NOTIFICATION_STAGE_REMOVE_SUCCESS = 'NOTIFICATION_STAGE_REMOVE_SUCCESS';
export const NOTIFICATION_STAGE_REMOVE_ERROR = 'NOTIFICATION_STAGE_REMOVE_ERROR';
export const NOTIFICATION_STATE_SET_EDIT_MODEL = 'NOTIFICATION_STAGE_SET_EDIT_MODEL';
export const NOTIFICATION_STAGE_SET_VALUE = 'NOTIFICATION_STAGE_SET_VALUE';
export const NOTIFICATION_STAGE_SAVE = 'NOTIFICATION_STAGE_SAVE';
export const NOTIFICATION_STAGE_SAVE_SUCCESS = 'NOTIFICATION_STAGE_SAVE_SUCCESS';
export const NOTIFICATION_STAGE_SAVE_ERROR = 'NOTIFICATION_STAGE_SAVE_ERROR';
export const NOTIFICATION_STAGE_SET_ADD_MODEL = 'NOTIFICATION_STAGE_SET_ADD_MODEL';

const createActionCreator = type => payload => ({ type, payload });

export const removeStageNotification = model => ({ type: NOTIFICATION_STAGE_REMOVE, payload: model });

export const removeStateNotificationSuccess = createActionCreator(NOTIFICATION_STAGE_REMOVE_SUCCESS);
export const removeStateNotificationError = createActionCreator(NOTIFICATION_STAGE_REMOVE_ERROR);
export const setEditModel = createActionCreator(NOTIFICATION_STATE_SET_EDIT_MODEL);
export const setAddModel = createActionCreator(NOTIFICATION_STAGE_SET_ADD_MODEL);

export const setStageNotificationValue = (property, value) => ({ type: NOTIFICATION_STAGE_SET_VALUE, payload: { property, value } });
export const saveStageNotification = model => ({ type: NOTIFICATION_STAGE_SAVE, payload: model });
export const saveStageNotificationSuccess = createActionCreator(NOTIFICATION_STAGE_SAVE_SUCCESS);
export const saveStageNotificationError = createActionCreator(NOTIFICATION_STAGE_SAVE_ERROR);
