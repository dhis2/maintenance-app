import { combineReducers } from 'redux';
import { PROGRAM_INDICATOR_STEP_CHANGE, PROGRAM_INDICATOR_STEP_NEXT, PROGRAM_INDICATOR_STEP_PREVIOUS } from './actions';
import { STEPPER_RESET_ACTIVE_STEP } from '../actions';
import steps from './program-indicator-steps';

export function programIndicatorStepperReducer(state = { activeStep: steps.first() }, action) {
    switch (action.type) {
    case PROGRAM_INDICATOR_STEP_CHANGE:
        return {
            activeStep: action.payload,
        };

    case PROGRAM_INDICATOR_STEP_NEXT:
        return {
            activeStep: steps.next(state.activeStep),
        };

    case PROGRAM_INDICATOR_STEP_PREVIOUS:
        return {
            activeStep: steps.previous(state.activeStep),
        };

    case STEPPER_RESET_ACTIVE_STEP:
        return {
            activeStep: steps.first(),
        };
    default:
        break;
    }

    return state;
}

export default combineReducers({
    step: programIndicatorStepperReducer,
});
