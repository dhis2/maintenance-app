export const NOTIFICATION_STAGE_REMOVE = 'NOTIFICATION_STAGE_REMOVE';
export const NOTIFICATION_STAGE_REMOVE_SUCCESS = 'NOTIFICATION_STAGE_REMOVE_SUCCESS';
export const NOTIFICATION_STAGE_REMOVE_ERROR = 'NOTIFICATION_STAGE_REMOVE_ERROR';
export const NOTIFICATION_STATE_SET_EDIT_MODEL = 'NOTIFICATION_STAGE_SET_EDIT_MODEL';

const createActionCreator = (type) => (payload) => ({ type, payload });

export const removeStageNotification = (model) => ({ type: NOTIFICATION_STAGE_REMOVE, payload: model });

export const removeStateNotificationSuccess = createActionCreator(NOTIFICATION_STAGE_REMOVE_SUCCESS);
export const removeStateNotificationError = createActionCreator(NOTIFICATION_STAGE_REMOVE_ERROR);
export const setEditModel = createActionCreator(NOTIFICATION_STATE_SET_EDIT_MODEL);
