import { get, compose } from 'lodash/fp';

export const activeStepSelector = get('programIndicator.activeStep');
export const fieldConfigsSelector = get('programIndicator.fieldConfigs');
export const isLoadingSelector = get('programIndicator.isLoading');
export const isSavingSelector = get('programIndicator.isSaving');

export const getModelFromStore = compose(get('programIndicator'), store => store.getState());
