export const createActionCreator = (type) => (payload) => ({ type, payload });

export const NOTIFY_USER = 'NOTIFY_USER';
export const notifyUser = createActionCreator(NOTIFY_USER);

export const STEPPER_RESET_ACTIVE_STEP = 'STEPPER_RESET_ACTIVE_STEP';
export const resetActiveStep = createActionCreator(STEPPER_RESET_ACTIVE_STEP);
