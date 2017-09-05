import { combineReducers } from 'redux';
import log from 'loglevel';
import { EVENT_PROGRAM_STEP_CHANGE, EVENT_PROGRAM_STEP_NEXT, EVENT_PROGRAM_STEP_PREVIOUS, EVENT_PROGRAM_SAVE_ERROR, EVENT_PROGRAM_SAVE_SUCCESS } from './actions';
import { STEPPER_RESET_ACTIVE_STEP } from '../actions';
import steps, { STEP_DETAILS } from './event-program-steps';
import { stageNotificationsReducer } from './notifications/reducers';
import { findNextStepKey, findPreviousStepKey } from './stepper';

function eventProgramStepperReducer(state = { activeStep: STEP_DETAILS }, action) {
    switch (action.type) {
    case EVENT_PROGRAM_STEP_CHANGE:
        return {
            activeStep: action.payload,
        };

    case EVENT_PROGRAM_STEP_NEXT:
        return {
            activeStep: findNextStepKey(steps, state.activeStep),
        };

    case EVENT_PROGRAM_STEP_PREVIOUS:
        return {
            activeStep: findPreviousStepKey(steps, state.activeStep),
        };

    case STEPPER_RESET_ACTIVE_STEP:
        return {
            activeStep: STEP_DETAILS,
        };
    }

    return state;
}

function eventProgramReducer(state = {}, action) {
    switch (action.type) {
    case EVENT_PROGRAM_SAVE_SUCCESS:
        log.info('Success', action.payload);
        break;
    case EVENT_PROGRAM_SAVE_ERROR: {
        log.error('Error', action.payload);
        break;
    }
    }

    return state;
}

export default combineReducers({
    eventProgram: eventProgramReducer,
    step: eventProgramStepperReducer,
    stageNotifications: stageNotificationsReducer,
});
