import { combineReducers } from 'redux';
import {
    PROGRAM_STAGE_STEP_CHANGE,
    PROGRAM_STAGE_STEP_NEXT,
    PROGRAM_STAGE_STEP_PREVIOUS
} from './actions';
import { STEPPER_RESET_ACTIVE_STEP } from '../../../actions';
import steps from './programStageSteps';
import { next, previous, first } from '../../../stepper/stepIterator';

export function programStageStepperReducer(
    state = { activeStep: first(steps) },
    action
) {
    switch (action.type) {
        case PROGRAM_STAGE_STEP_CHANGE:
            return {
                ...state,
                activeStep: action.payload
            };

        case PROGRAM_STAGE_STEP_NEXT:
            return {
                ...state,
                activeStep: next(steps, state.activeStep)
            };

        case PROGRAM_STAGE_STEP_PREVIOUS:
            return {
                ...state,
                activeStep: previous(steps, state.activeStep)
            };

        case STEPPER_RESET_ACTIVE_STEP:
            return {
                ...state,
                activeStep: first(steps)
            };

        default:
            break;
    }

    return state;
}

export default programStageStepperReducer;
