import { combineReducers } from 'redux';
import { EVENT_PROGRAM_STEP_CHANGE, EVENT_PROGRAM_STEP_NEXT, EVENT_PROGRAM_STEP_PREVIOUS, MODEL_TO_EDIT_LOADED, EVENT_PROGRAM_LOAD_SUCCESS, NOTIFY_USER, EVENT_PROGRAM_SAVE_ERROR, EVENT_PROGRAM_SAVE_SUCCESS } from './actions';
import steps from './event-program-steps';
import { stageNotificationsReducer } from './notifications/reducers';
import { findNextStepKey, findPreviousStepKey } from './stepper';

import { programIndicatorStepperReducer } from '../program-indicator/reducers';

function eventProgramStepperReducer(state = { activeStep: 'details' }, action) {
    console.log(action.type);
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
    step: eventProgramStepperReducer,
    stageNotifications: stageNotificationsReducer,
});
