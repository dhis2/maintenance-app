import { hashHistory } from 'react-router';
import Action from 'd2-ui/lib/action/Action';
import detailsStore from './details.store';
import { config, getInstance as getD2 } from 'd2/lib/d2';
import camelCaseToUnderscores from 'd2-utilizr/lib/camelCaseToUnderscores';
import snackActions from '../Snackbar/snack.actions';
import log from 'loglevel';
import listStore from './list.store';
import sharingStore from './sharing.store';
import translateStore from './translation-dialog/translationStore';
import appStore from '../App/appStateStore';
import { goToRoute } from '../router';
import { Subject } from 'rx';

config.i18n.strings.add('edit');
config.i18n.strings.add('clone');
config.i18n.strings.add('delete');
config.i18n.strings.add('details');
config.i18n.strings.add('translate');
config.i18n.strings.add('sharing');
config.i18n.strings.add('pdfDataSetForm');

export const afterDeleteHook$ = new Subject();

const contextActions = Action.createActionsFromNames([
    'edit',
    'clone',
    'share',
    'delete',
    'details',
    'translate',
    'pdfDataSetForm',
]);

const confirm = (message) => new Promise((resolve, reject) => {
    if (window.confirm(message)) {
        resolve();
    }
    reject();
});

// TODO: The action assumes that the appState actually has state
contextActions.edit
    .subscribe(action => {
        goToRoute(['/edit', appStore.state.sideBar.currentSection, action.data.modelDefinition.name, action.data.id].join('/'));
    });

// TODO: The action assumes that the appState actually has state
contextActions.clone
    .subscribe(action => {
        goToRoute(['/clone', appStore.state.sideBar.currentSection, action.data.modelDefinition.name, action.data.id].join('/'));
    });

contextActions.delete
    .subscribe(({ data: model }) => getD2()
            .then(d2 => confirm([d2.i18n.getTranslation(`confirm_delete_${camelCaseToUnderscores(model.modelDefinition.name)}`), `\n\n${model.name}`].join(''))
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

                                // Fire the afterDeleteHook
                                afterDeleteHook$.onNext({
                                    model,
                                    modelType: model.modelDefinition.name,
                                });
                            })
                            .catch(response => {
                                log.warn(response);
                                snackActions.show({
                                    message: response.message ? response.message : `${model.name} ${d2.i18n.getTranslation('was_not_deleted')}`,
                                });
                            });
                    })
            )
    );

contextActions.details
    .subscribe(({ data: model }) => {
        detailsStore.setState(model);
    });

contextActions.share
    .subscribe(async ({ data: model }) => {
        const d2 = await getD2();
        const modelToShare = await d2.models[model.modelDefinition.name].get(model.id);

        sharingStore.setState({
            model: modelToShare,
            open: true,
        });
    });

contextActions.translate
    .subscribe(async ({ data: model }) => {
        const d2 = await getD2();
        const modelToTranslate = await d2.models[model.modelDefinition.name].get(model.id);

        translateStore.setState({
            model: modelToTranslate,
            open: true,
        });
    });

contextActions.pdfDataSetForm
    .subscribe(({ data: model, complete, error }) => {
        getD2()
            .then((d2) => {
                window.open(`${d2.Api.getApi().baseUrl}/pdfForm/dataSet/${model.id}`);
            })
            .then(complete)
            .catch(error);
    });

export default contextActions;
