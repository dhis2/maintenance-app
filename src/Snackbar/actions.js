const createActionCreator = type => payload => ({ type, payload });

export const SNACK_BAR_MESSAGE_SHOW_REQUEST = 'SNACK_BAR_MESSAGE_SHOW_REQUEST';
export const SNACK_BAR_MESSAGE_SHOW = 'SNACK_BAR_MESSAGE_SHOW';
export const SNACK_BAR_MESSAGE_HIDE = 'SNACK_BAR_MESSAGE_HIDE';

export const requestShowSnackBarMessage = createActionCreator(SNACK_BAR_MESSAGE_SHOW_REQUEST);
export const showSnackBarMessage = createActionCreator(SNACK_BAR_MESSAGE_SHOW);
export const hideSnackBarMessage = createActionCreator(SNACK_BAR_MESSAGE_HIDE);
