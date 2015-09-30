import Action from 'd2-flux/action/Action';
import snackStore from './snack.store';

const snackActions = Action.createActionsFromNames(['show', 'hide']);

snackActions.show.subscribe(actionConfig => {
    const {message, action, autoHideDuration, onActionTouchTap} = actionConfig.data;

    snackStore.setState({
        message,
        action: action || 'dismiss',
        autoHideDuration,
        onActionTouchTap: onActionTouchTap || (() => {
            snackActions.hide();
        }),
    });
});

snackActions.hide.subscribe(() => {
    snackStore.setState(null);
});

export default snackActions;
