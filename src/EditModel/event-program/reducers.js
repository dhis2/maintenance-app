import { combineReducers } from 'redux';
import { STEP_CHANGE, STEP_NEXT, STEP_PREVIOUS, MODEL_TO_EDIT_LOADED } from './actions';
import steps from './event-program-steps';

function findNextStepKey(steps, activeStep) {
    const currentStepIndex = steps.findIndex(step => step.key === activeStep);

    if (steps[currentStepIndex + 1]) {
        return steps[currentStepIndex + 1].key;
    }

    return activeStep;
}

function findPreviousStepKey(steps, activeStep) {
    const currentStepIndex = steps.findIndex(step => step.key === activeStep);

    if (steps[currentStepIndex - 1]) {
        return steps[currentStepIndex - 1].key;
    }

    return activeStep;
}

function stepperReducer(state = { activeStep: 'details' }, action) {
    switch (action.type) {
        case STEP_CHANGE:
            return {
                activeStep: action.payload,
            };

        case STEP_NEXT:
            return {
                activeStep: findNextStepKey(steps, state.activeStep),
            };

        case STEP_PREVIOUS:
            return {
                activeStep: findPreviousStepKey(steps, state.activeStep),
            };
    }

    return state;
}

function modelToEditReducer(state = null, action) {
    if (MODEL_TO_EDIT_LOADED === action.type) {
        return action.payload;
    }

    return state;
}

export default combineReducers({
    step: stepperReducer,
    model: modelToEditReducer
});
