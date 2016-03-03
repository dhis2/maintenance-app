import Action from 'd2-ui/lib/action/Action';
import snackStore from './snack.store';
import { config, getInstance as getD2 } from 'd2/lib/d2';

const snackActions = Action.createActionsFromNames(['show', 'hide']);

config.i18n.strings.add('success');
config.i18n.strings.add('dismiss');

snackActions.show.subscribe(actionConfig => {
    const { message, action, autoHideDuration, onActionTouchTap, translate } = actionConfig.data;

    getD2()
        .then((d2) => {
            snackStore.setState({
                message: translate ? d2.i18n.getTranslation(message) : message,
                action: d2.i18n.getTranslation(action || 'dismiss'),
                autoHideDuration,
                onActionTouchTap: onActionTouchTap || (() => {
                    snackActions.hide();
                }),
            });
        });
});

snackActions.hide.subscribe(() => {
    snackStore.setState(null);
});

export default snackActions;
