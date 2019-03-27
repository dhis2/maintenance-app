import Action from 'd2-ui/lib/action/Action';
import store from '../store';
import { hideSnackBarMessage, requestShowSnackBarMessage } from './actions';

const snackActions = Action.createActionsFromNames(['show', 'hide']);

snackActions.show.subscribe((actionConfig) => {
    store.dispatch(requestShowSnackBarMessage(actionConfig));
});

snackActions.hide.subscribe(() => {
    store.dispatch(hideSnackBarMessage());
});

export default snackActions;
