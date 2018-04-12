import { combineReducers } from 'redux';
import {
    PROGRAM_INDICATOR_STEP_CHANGE,
    PROGRAM_INDICATOR_STEP_NEXT,
    PROGRAM_INDICATOR_STEP_PREVIOUS,
} from './actions';
import { STEPPER_RESET_ACTIVE_STEP } from '../actions';
import steps from './program-indicator-steps';
import { next, previous, first } from '../stepper/stepIterator';

export function programIndicatorStepperReducer(state = { activeStep: first(steps) }, action) {
    switch (action.type) {
    case PROGRAM_INDICATOR_STEP_CHANGE:
        return {
            activeStep: action.payload,
        };

    case PROGRAM_INDICATOR_STEP_NEXT:
        return {
            activeStep: next(steps, state.activeStep),
        };

    case PROGRAM_INDICATOR_STEP_PREVIOUS:
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
    step: programIndicatorStepperReducer,
});
