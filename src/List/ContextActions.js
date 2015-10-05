import Router from 'react-router';
import Action from 'd2-flux/action/Action';
import detailsStore from './details.store';
import {getInstance as getD2} from 'd2';
import {camelCaseToUnderscores} from 'd2-utils';

const contextActions = Action.createActionsFromNames(['edit', 'clone', 'delete', 'details', 'translate']);

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
                                console.info('Deleted!');
                            })
                            .catch(response => {
                                console.warn(response.responseJSON.message);
                            });
                    });
            });
    });

contextActions.details
    .subscribe(({data: model}) => {
        console.log(model);
        detailsStore.setState(model);
    });

export default contextActions;
