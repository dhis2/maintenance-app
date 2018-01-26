import { get } from 'lodash/fp';

export const activeStepSelector = get('eventProgram.step.activeStep');

export const disabledSelector = get('eventProgram.step.disabled');