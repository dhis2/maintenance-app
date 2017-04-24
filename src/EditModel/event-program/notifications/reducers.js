import { NOTIFICATION_STATE_SET_EDIT_MODEL, NOTIFICATION_STAGE_SET_VALUE } from './actions';

export function stageNotificationsReducer(state = { isDeleting: false }, action) {
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
