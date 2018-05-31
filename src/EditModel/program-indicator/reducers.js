import fieldGroups from '../../config/field-config/field-groups';
import { nextStep, prevStep } from '../stepper/stepIterator';
import { getStepFields } from '../stepper/stepper';
import { STEPPER_RESET_ACTIVE_STEP } from '../actions';
import {
    PROGRAM_INDICATOR_TO_EDIT_FIELD_CHANGED_DONE,
    PROGRAM_INDICATOR_SAVE,
    PROGRAM_INDICATOR_LOAD_SUCCESS,
    PROGRAM_INDICATOR_SAVE_SUCCESS,
    PROGRAM_INDICATOR_SAVE_ERROR,
    PROGRAM_INDICATOR_STEP_CHANGE,
    PROGRAM_INDICATOR_STEP_NEXT,
    PROGRAM_INDICATOR_STEP_PREVIOUS,
} from './actions';

const getActiveStepFields = (activeStep, fieldConfigs) =>
    getStepFields(activeStep, fieldConfigs, 'programIndicator');

const stepLength = fieldGroups.getStepLength('programIndicator');

export const initialState = {
    activeStep: 0,
    fieldConfigs: [],
    isLoading: true,
    isSaving: false,
};

export function programIndicatorFormReducer(state = initialState, action) {
    switch (action.type) {
    case PROGRAM_INDICATOR_LOAD_SUCCESS:
        return {
            ...state,
            fieldConfigs: getActiveStepFields(state.activeStep, action.payload),
            isLoading: false,
        };
    case PROGRAM_INDICATOR_TO_EDIT_FIELD_CHANGED_DONE:
        return {
            ...state,
            fieldConfigs: getActiveStepFields(state.activeStep, action.payload),
        };
    case PROGRAM_INDICATOR_SAVE:
        return {
            ...state,
            isSaving: true,
        };
    case PROGRAM_INDICATOR_SAVE_SUCCESS:
    case PROGRAM_INDICATOR_SAVE_ERROR:
        return {
            ...state,
            isSaving: false,
        };
    case PROGRAM_INDICATOR_STEP_CHANGE:
        return {
            ...state,
            activeStep: action.payload,
            fieldConfigs: getActiveStepFields(action.payload, state.fieldConfigs),
        };
    case PROGRAM_INDICATOR_STEP_NEXT:
        return {
            ...state,
            activeStep: nextStep(state.activeStep, stepLength),
            fieldConfigs: getActiveStepFields(nextStep(state.activeStep, stepLength), state.fieldConfigs),
        };
    case PROGRAM_INDICATOR_STEP_PREVIOUS:
        return {
            ...state,
            activeStep: prevStep(state.activeStep),
            fieldConfigs: getActiveStepFields(prevStep(state.activeStep), state.fieldConfigs),
        };
    case STEPPER_RESET_ACTIVE_STEP:
        return {
            ...state,
            activeStep: 0,
            fieldConfigs: getActiveStepFields(0, state.fieldConfigs),
        };
    default:
        break;
    }
    return state;
}

export default programIndicatorFormReducer;
