import { combineReducers } from 'redux';
import { STEP_CHANGE, STEP_NEXT, STEP_PREVIOUS, MODEL_TO_EDIT_LOADED, EVENT_PROGRAM_LOAD_SUCCESS, NOTIFY_USER, EVENT_PROGRAM_SAVE_ERROR, EVENT_PROGRAM_SAVE_SUCCESS } from './actions';
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

function eventProgramReducer(state = {}, action) {
    switch(action.type) {
        case EVENT_PROGRAM_SAVE_SUCCESS:
            console.log('Success', action.payload);
            break;
        case EVENT_PROGRAM_SAVE_ERROR: {
            console.log('Error', action.payload);
            break;
        }
    }

    return state;
}

export default combineReducers({
    eventProgram: eventProgramReducer,
    step: stepperReducer,
    stageNotifications: stageNotificationsReducer,
});
