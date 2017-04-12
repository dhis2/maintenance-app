import { NOTIFICATION_STAGE_REMOVE, NOTIFICATION_STAGE_REMOVE_SUCCESS, NOTIFICATION_STAGE_REMOVE_ERROR, NOTIFICATION_STATE_SET_EDIT_MODEL, NOTIFICATION_STAGE_SET_VALUE, NOTIFICATION_STAGE_SET_ADD_MODEL } from './actions';

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
        console.log('setmodel to ', action.payload);
        return {
            ...state,
            modelToEdit: action.payload,
        }
    }

    if (NOTIFICATION_STAGE_SET_VALUE === action.type) {
        const model = state.modelToEdit;
        model[action.payload.property] = action.payload.value;

        return {
            ...state,
            modelToEdit: model,
        };
    }

    return state;
}
