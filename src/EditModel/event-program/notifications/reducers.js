import {
    NOTIFICATION_SET_EDIT_MODEL,
    NOTIFICATION_SET_VALUE,
    NOTIFICATION_STAGE_SAVE_ERROR,
    NOTIFICATION_STAGE_SET_PROGRAM_STAGE,
} from './actions';

export const initialState = {
    isDeleting: false,
    modelToEdit: null,
    notificationType: null
}

export function stageNotificationsReducer(
    state = initialState,
    action
) {
    switch (action.type) {
        case NOTIFICATION_SET_VALUE: {
            const model = state.modelToEdit;
            model[action.payload.property] = action.payload.value;

            return {
                ...state,
                modelToEdit: model,
            };
        }
        case NOTIFICATION_SET_EDIT_MODEL: {

            return {
                notificationType: action.payload.notificationType,
                modelToEdit: action.payload.model,
            };
        }
        case NOTIFICATION_STAGE_SAVE_ERROR:
            // TODO: Notify user of the error
            console.error(action.payload);
            return;

        case NOTIFICATION_STAGE_SET_PROGRAM_STAGE: {
            const model = state.modelToEdit;
            model.programStage.id = action.payload.stageId;
            return {
                ...state,
                modelToEdit: model,
            }
        }
    }

    return state;
}
