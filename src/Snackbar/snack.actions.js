import { getInstance as getD2 } from 'd2';
import { Action } from '@dhis2/d2-ui-core';
import snackStore from './snack.store';

const snackActions = Action.createActionsFromNames(['show', 'hide']);

snackActions.show.subscribe((actionConfig) => {
    const {
        message,
        action,
        autoHideDuration,
        onClick,
        translate,
        variables
    } = actionConfig.data;

    getD2()
        .then((d2) => {
            snackStore.setState({
                message: translate ? d2.i18n.getTranslation(message, variables) : message,
                action,
                autoHideDuration,
                onClick: onClick || (() => {
                    snackActions.hide();
                }),
            });
        });
});

snackActions.hide.subscribe(() => {
    snackStore.setState(null);
});

export default snackActions;
