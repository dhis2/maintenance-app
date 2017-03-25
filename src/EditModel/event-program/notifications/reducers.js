import { NOTIFICATION_STAGE_REMOVE, NOTIFICATION_STAGE_REMOVE_SUCCESS, NOTIFICATION_STAGE_REMOVE_ERROR, NOTIFICATION_STATE_SET_EDIT_MODEL } from './actions';

export function stageNotificationsReducer(state = { isDeleting: false }, action) {
    if (NOTIFICATION_STAGE_REMOVE === action.type) {
        return {
            ...state,
            isDeleting: true,
            objectNameToBeDeleted: action.payload.displayName,
        };
    }

    // Reset the isDeleting flag to false when either success or error happened
    if (NOTIFICATION_STAGE_REMOVE_SUCCESS === action.type || NOTIFICATION_STAGE_REMOVE_ERROR === action.type) {
        return {
            ...state,
            isDeleting: false,
            objectNameToBeDeleted: undefined,
        };
    }

    if (NOTIFICATION_STATE_SET_EDIT_MODEL === action.type) {
        return {
            ...state,
            modelToEdit: action.payload,
        }
    }

    return state;
}
