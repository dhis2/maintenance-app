import { get } from 'lodash/fp';

export const activeStepSelector = get('step.activeStep');

export const modelSelector = get('model');
