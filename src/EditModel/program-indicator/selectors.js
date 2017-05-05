import { get } from 'lodash/fp';

export const activeStepSelector = get('programIndicator.step.activeStep');
