import { get } from 'lodash/fp';

export const activeStepSelector = get('step.activeStep');
