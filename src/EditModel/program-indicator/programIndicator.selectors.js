import { get, compose } from 'lodash/fp';

export const getActiveStep = get('programIndicator.activeStep');
export const getFieldConfigs = get('programIndicator.fieldConfigs');
export const getIsLoading = get('programIndicator.isLoading');
export const getIsSaving = get('programIndicator.isSaving');

export const getModelFromStore = compose(get('programIndicator'), store => store.getState());
