import { combineReducers } from 'redux';
import {
    EVENT_PROGRAM_STEP_CHANGE,
    EVENT_PROGRAM_STEP_NEXT,
    EVENT_PROGRAM_STEP_PREVIOUS,
    EVENT_PROGRAM_LOAD_SUCCESS,
    EVENT_PROGRAM_LOAD_ERROR,
    PROGRAM_STEPPER_SET_DISABLE,
    EVENT_PROGRAM_SAVE,
    EVENT_PROGRAM_SAVE_SUCCESS,
    EVENT_PROGRAM_SAVE_ERROR,
    MODEL_TO_EDIT_FIELD_CHANGED,
} from './actions';
import { STEPPER_RESET_ACTIVE_STEP } from '../actions';
import { stageNotificationsReducer } from './notifications/reducers';
import { programStageStepperReducer } from './tracker-program/program-stages/reducer';
import steps from './event-program-steps';
import { next, previous, first } from '../stepper/stepIterator';
import { generateUid } from 'd2/lib/uid';
import { has } from 'lodash/fp';

export const initialState = {
    activeStep: first(steps),
    disabled: false,
    isLoading: true,
    isSaving: false,
};

function eventProgramStepperReducer(state = initialState, action) {
    switch (action.type) {
        case EVENT_PROGRAM_STEP_CHANGE:
            return {
                ...state,
                activeStep: action.payload,
            };

        case EVENT_PROGRAM_STEP_NEXT:
            return {
                ...state,
                activeStep: next(steps, state.activeStep),
            };

        case EVENT_PROGRAM_STEP_PREVIOUS:
            return {
                ...state,
                activeStep: previous(steps, state.activeStep),
            };

        case STEPPER_RESET_ACTIVE_STEP:
            return {
                ...state,
                activeStep: first(steps),
                isLoading: true,
            };
        case EVENT_PROGRAM_LOAD_SUCCESS: {
            return {
                ...state,
                isLoading: false,
            };
        }
        case PROGRAM_STEPPER_SET_DISABLE:
            return {
                ...state,
                disabled: action.payload.disabled,
            };
        case EVENT_PROGRAM_SAVE:
            return {
                ...state,
                isSaving: true,
            };

        case EVENT_PROGRAM_SAVE_ERROR:
        case EVENT_PROGRAM_SAVE_SUCCESS:
            return {
                ...state,
                isSaving: false,
            };
        default:
            break;
    }

    return state;
}

export default combineReducers({
    step: eventProgramStepperReducer,
    stageNotifications: stageNotificationsReducer,
    programStageStepper: programStageStepperReducer,
});
