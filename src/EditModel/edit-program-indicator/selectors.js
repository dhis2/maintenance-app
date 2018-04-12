import { get, compose } from 'lodash/fp';

export const activeStepSelector = get('programIndicator.step.activeStep');

export const programIndicatorFromStoreSelector = compose(get('programIndicator'), store => store.getState());
