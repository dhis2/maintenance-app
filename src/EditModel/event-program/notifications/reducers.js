import {
    NOTIFICATION_STATE_SET_EDIT_MODEL,
    NOTIFICATION_STAGE_SET_VALUE,
    NOTIFICATION_STAGE_SAVE_ERROR,
    NOTIFICATION_STAGE_SET_PROGRAM_STAGE,
} from './actions';

export function stageNotificationsReducer(
    state = { isDeleting: false, selectedProgramStage: null },
    action
) {
    switch (action.type) {
        case NOTIFICATION_STAGE_SET_VALUE: {
            const model = state.modelToEdit;
            model[action.payload.property] = action.payload.value;

            return {
                ...state,
                modelToEdit: model,
            };
        }
        case NOTIFICATION_STATE_SET_EDIT_MODEL: {

            const selectedProgramStage = action.payload && action.payload.programStage && action.payload.programStage.id;
            return {
                ...state,
                ...(action.payload &&
                    action.payload.id && {type: action.payload.id}),
                modelToEdit: action.payload,
                selectedProgramStage: selectedProgramStage || null,
            };
        }
        case NOTIFICATION_STAGE_SAVE_ERROR:
            // TODO: Notify user of the error
            console.error(action.payload);
            return;

        case NOTIFICATION_STAGE_SET_PROGRAM_STAGE: {
            const model = state.modelToEdit;
            model.programStage.id = action.payload.stageId;
            console.log(model);
            return {
                ...state,
                modelToEdit: model,
                selectedProgramStage: action.payload.stageId
            }
        }
    }

    return state;
}
