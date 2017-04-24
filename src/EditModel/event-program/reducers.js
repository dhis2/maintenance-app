import { combineReducers } from 'redux';
import { STEP_CHANGE, STEP_NEXT, STEP_PREVIOUS, MODEL_TO_EDIT_LOADED, EVENT_PROGRAM_LOAD_SUCCESS, NOTIFY_USER, EVENT_PROGRAM_SAVE_ERROR } from './actions';
import { NOTIFICATION_STAGE_REMOVE_SUCCESS } from './notifications/actions';
import { getStageNotifications } from './notifications/selectors';
import steps from './event-program-steps';
import { stageNotificationsReducer } from './notifications/reducers';

function findNextStepKey(steps, activeStep) {
    const currentStepIndex = steps.findIndex(step => step.key === activeStep);

    if (steps[currentStepIndex + 1]) {
        return steps[currentStepIndex + 1].key;
    }

    return activeStep;
}

function findPreviousStepKey(steps, activeStep) {
    const currentStepIndex = steps.findIndex(step => step.key === activeStep);

    if (steps[currentStepIndex - 1]) {
        return steps[currentStepIndex - 1].key;
    }

    return activeStep;
}

function stepperReducer(state = { activeStep: 'details' }, action) {
    switch (action.type) {
        case STEP_CHANGE:
            return {
                activeStep: action.payload,
            };

        case STEP_NEXT:
            return {
                activeStep: findNextStepKey(steps, state.activeStep),
            };

        case STEP_PREVIOUS:
            return {
                activeStep: findPreviousStepKey(steps, state.activeStep),
            };
    }

    return state;
}

function modelToEditReducer(state = null, action) {
    if (NOTIFY_USER === action.type) {
        // TODO: Hook up to Snackbar
    }


    if (MODEL_TO_EDIT_LOADED === action.type) {
        return action.payload;
    }

    if (NOTIFICATION_STAGE_REMOVE_SUCCESS === action.type) {
        // TODO: Hook up to Snackbar
    }

    if (EVENT_PROGRAM_SAVE_ERROR === action.type) {
        // TODO: Hook up to Snackbar
    }

    return state;
}

export default combineReducers({
    step: stepperReducer,
    model: modelToEditReducer,
    stageNotifications: stageNotificationsReducer,
});
