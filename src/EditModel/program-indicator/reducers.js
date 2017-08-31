import { combineReducers } from 'redux';
import { PROGRAM_INDICATOR_STEP_CHANGE, PROGRAM_INDICATOR_STEP_NEXT, PROGRAM_INDICATOR_STEP_PREVIOUS } from './actions';
import { STEPPER_RESET_ACTIVE_STEP } from '../actions';
import { findNextStepKey, findPreviousStepKey } from '../event-program/stepper';
import steps, { STEP_DETAILS } from './program-indicator-steps';

export function programIndicatorStepperReducer(state = { activeStep: STEP_DETAILS }, action) {
    switch (action.type) {
    case PROGRAM_INDICATOR_STEP_CHANGE:
        return {
            activeStep: action.payload,
        };

    case PROGRAM_INDICATOR_STEP_NEXT:
        return {
            activeStep: findNextStepKey(steps, state.activeStep),
        };

    case PROGRAM_INDICATOR_STEP_PREVIOUS:
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

export default combineReducers({
    step: programIndicatorStepperReducer,
});
