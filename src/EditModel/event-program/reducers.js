import { combineReducers } from 'redux';
import {
    EVENT_PROGRAM_STEP_CHANGE,
    EVENT_PROGRAM_STEP_NEXT,
    EVENT_PROGRAM_STEP_PREVIOUS,
    EVENT_PROGRAM_LOAD_SUCCESS,
    EVENT_PROGRAM_LOAD_ERROR,
    PROGRAM_STEPPER_SET_DISABLE,
} from './actions';
import { STEPPER_RESET_ACTIVE_STEP } from '../actions';
import { stageNotificationsReducer } from './notifications/reducers';
import { programStageStepperReducer} from "./tracker-program/program-stages/reducer";
import steps from './event-program-steps';
import { next, previous, first } from '../stepper/stepIterator';

function eventProgramStepperReducer(
    state = { activeStep: first(steps), disabled: false, isLoading: true },
    action
) {
    switch (action.type) {
        case EVENT_PROGRAM_STEP_CHANGE:
            return {
                ...state,
                activeStep: action.payload
            };

        case EVENT_PROGRAM_STEP_NEXT:
            return {
                ...state,
                activeStep: next(steps, state.activeStep)
            };

        case EVENT_PROGRAM_STEP_PREVIOUS:
            return {
                ...state,
                activeStep: previous(steps, state.activeStep)
            };

        case STEPPER_RESET_ACTIVE_STEP:
            return {
                ...state,
                activeStep: first(steps),
                isLoading: true
            };
        case EVENT_PROGRAM_LOAD_SUCCESS:
            return {
                ...state,
                isLoading: false
            };
        case PROGRAM_STEPPER_SET_DISABLE:
            return {
                ...state,
                disabled: action.payload.disabled
            };

        default:
            break;
    }

    return state;
}

export default combineReducers({
    step: eventProgramStepperReducer,
    stageNotifications: stageNotificationsReducer,
    programStageStepper: programStageStepperReducer
});
