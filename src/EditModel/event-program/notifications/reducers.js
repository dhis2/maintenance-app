import { NOTIFICATION_STATE_SET_EDIT_MODEL, NOTIFICATION_STAGE_SET_VALUE, NOTIFICATION_STAGE_SAVE_ERROR } from './actions';

export function stageNotificationsReducer(state = { isDeleting: false }, action) {
    switch(action.type) {
        case NOTIFICATION_STAGE_SET_VALUE:
            const model = state.modelToEdit;
            model[action.payload.property] = action.payload.value;

            return {
                ...state,
                modelToEdit: model,
            };
        case NOTIFICATION_STATE_SET_EDIT_MODEL:
            return {
                ...state,
                modelToEdit: action.payload,
            };
        case NOTIFICATION_STAGE_SAVE_ERROR:
            // TODO: Notify user of the error
            console.error(action.payload);
            return;
    }

    return state;
}
