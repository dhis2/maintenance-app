import Action from 'd2-flux/action/Action';
import modelToEditStore from './modelToEditStore';
import {isFunction} from 'd2-utils';
import log from 'loglevel';

const objectActions = Action.createActionsFromNames(['getObjectOfTypeById', 'getObjectOfTypeByIdAndClone', 'saveObject', 'afterSave', 'saveAndRedirectToList']);

// TODO: Extract this a convenience method onto the action object?
objectActions.mapActionsToStore = function mapActionsToStore(actionsConfig, store) {
    actionsConfig.forEach(mapping => {
        mapping[0].forEach(actionKey => {
            const actionTransformer = mapping[2];

            this[actionKey].subscribe(actionConfig => {
                let action = actionConfig;
                if (actionTransformer) {
                    action = actionTransformer(action);
                }
                store[mapping[1]](action);
            });
        });
    });
};

objectActions.mapActionsToStore([
    [['getObjectOfTypeById'], 'getObjectOfTypeById', (action) => { return action.data; }],
    [['getObjectOfTypeByIdAndClone'], 'getObjectOfTypeByIdAndClone', (action) => { return action.data; }],
], modelToEditStore);

objectActions.saveObject.subscribe(action => {
    const errorHandler = (message) => {
        action.error(message);
    };

    const successHandler = () => {
        if (isFunction(action.data.afterSave)) {
            log.info('Handling after save');
            action.data.afterSave(action)
                .subscribe(
                    () => action.complete('Success with aftersave'),
                    errorHandler
                );
        } else {
            action.complete('Success');
        }
    };

    return modelToEditStore
        .save(action.data.id)
        .subscribe(successHandler, errorHandler);
});

export default objectActions;
