const actionCreator = type => payload => ({ type, payload });

export const DIALOG_OPEN = 'DIALOG_OPEN';
export const DIALOG_CLOSE = 'DIALOG_CLOSE';
/**
 * openDialog - Action creator helper method for creating dialogs
 *
 * @param  {string} dialogType  The type of dialog to open
 * @param  {object} dialogprops The props passed to the dialog
 * @return {object}             Dialog action
 */

export const openDialog = (dialogType, dialogprops) =>
    actionCreator(DIALOG_OPEN)({
        dialogprops: { ...dialogprops },
        dialogType,
    });

/**
 * closeDialog - Action creator helper method for handling dialogs
 *
 * @param  {string} dialogType  The type of dialog to close
 * @return {object}             Dialog action
 */
export const closeDialog = actionCreator(DIALOG_CLOSE);
