import { combineReducers } from 'redux';
import log from 'loglevel';
import {
    EVENT_PROGRAM_STEP_CHANGE,
    EVENT_PROGRAM_STEP_NEXT,
    EVENT_PROGRAM_STEP_PREVIOUS,
    EVENT_PROGRAM_SAVE_ERROR,
    EVENT_PROGRAM_SAVE_SUCCESS,
} from './actions';
import { STEPPER_RESET_ACTIVE_STEP } from '../actions';
import { stageNotificationsReducer } from './notifications/reducers';
import steps from './event-program-steps';
import { next, previous, first } from '../steps/stepIterator';

function eventProgramStepperReducer(state = { activeStep: first(steps) }, action) {
    switch (action.type) {
    case EVENT_PROGRAM_STEP_CHANGE:
        return {
            activeStep: action.payload,
        };

    case EVENT_PROGRAM_STEP_NEXT:
        return {
            activeStep: next(steps, state.activeStep),
        };

    case EVENT_PROGRAM_STEP_PREVIOUS:
        return {
            activeStep: previous(steps, state.activeStep),
        };

    case STEPPER_RESET_ACTIVE_STEP:
        return {
            activeStep: first(steps),
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
