import Router from 'react-router';
import Action from 'd2-flux/action/Action';
import detailsStore from './details.store';
import {config, getInstance as getD2} from 'd2/lib/d2';
import {camelCaseToUnderscores} from 'd2-utils';
import snackActions from '../Snackbar/snack.actions';
import log from 'loglevel';
import listStore from './list.store';
import sharingStore from './sharing.store';
import translateStore from './translation-dialog/translationStore';

config.i18n.strings.add('edit');
config.i18n.strings.add('clone');
config.i18n.strings.add('delete');
config.i18n.strings.add('details');
config.i18n.strings.add('translate');
config.i18n.strings.add('sharing');

const contextActions = Action.createActionsFromNames([
    'edit',
    'clone',
    'share',
    'delete',
    'details',
    'translate',
]);

const confirm = (message) => {
    return new Promise((resolve, reject) => {
        if (window.confirm(message)) {
            resolve();
        }
        reject();
    });
};

contextActions.edit
    .subscribe(action => {
        Router.HashLocation.push(['/edit', action.data.modelDefinition.name, action.data.id].join('/'));
    });

contextActions.clone
    .subscribe(action => {
        Router.HashLocation.push(['/clone', action.data.modelDefinition.name, action.data.id].join('/'));
    });

contextActions.delete
    .subscribe(({data: model}) => {
        return getD2()
            .then(d2 => {
                return confirm(d2.i18n.getTranslation(`confirm_delete_${camelCaseToUnderscores(model.modelDefinition.name)}`) + `\n\n${model.name}`)
                    .then(() => {
                        model.delete()
                            .then(() => {
                                // Remove deleted item from the listStore
                                if (listStore.getState() && listStore.getState().list) {
                                    listStore.setState({
                                        pager: listStore.getState().pager,
                                        list: listStore.getState().list
                                            .filter(modelToCheck => modelToCheck.id !== model.id),
                                    });
                                }

                                snackActions.show({
                                    message: `${model.name} ${d2.i18n.getTranslation('was_deleted')}`,
                                });
                            })
                            .catch(response => {
                                log.warn(response);
                                snackActions.show({
                                    message: response.message ? response.message : `${model.name} ${d2.i18n.getTranslation('was_not_deleted')}`,
                                });
                            });
                    });
            });
    });

contextActions.details
    .subscribe(({data: model}) => {
        detailsStore.setState(model);
    });

contextActions.share
    .subscribe(({data: model}) => {
        getD2()
            .then((d2) => {
                return d2.models[model.modelDefinition.name].get(model.id);
            })
            .then(modelToShare => {
                sharingStore.setState({
                    model: modelToShare,
                    open: true,
                });
            });
    });

contextActions.translate
    .subscribe(({data: model}) => {
        getD2()
            .then((d2) => {
                return d2.models[model.modelDefinition.name].get(model.id);
            })
            .then(modelToTranslate => {
                translateStore.setState({
                    model: modelToTranslate,
                    open: true,
                });
            });
    });

export default contextActions;
