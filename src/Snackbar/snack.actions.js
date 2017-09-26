import Action from 'd2-ui/lib/action/Action';
import store from '../store';
import { hideSnackBarMessage, requestShowSnackBarMessage } from './actions';

const snackActions = Action.createActionsFromNames(['show', 'hide']);

snackActions.show.subscribe((actionConfig) => {
    const { message, action, autoHideDuration, onActionTouchTap, translate } = actionConfig.data;

    store.dispatch(requestShowSnackBarMessage({ message, action, autoHideDuration, onActionTouchTap, translate }));
});

snackActions.hide.subscribe(() => {
    store.dispatch(hideSnackBarMessage());
});

export default snackActions;
