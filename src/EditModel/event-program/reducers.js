import { combineReducers } from 'redux';
import {
    EVENT_PROGRAM_STEP_CHANGE,
    EVENT_PROGRAM_STEP_NEXT,
    EVENT_PROGRAM_STEP_PREVIOUS,
} from './actions';
import { STEPPER_RESET_ACTIVE_STEP } from '../actions';
import { stageNotificationsReducer } from './notifications/reducers';
import steps from './event-program-steps';
import { next, previous, first } from '../stepper/stepIterator';

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
    default:
        break;
    }

    return state;
}

export default combineReducers({
    step: eventProgramStepperReducer,
    stageNotifications: stageNotificationsReducer,
});
