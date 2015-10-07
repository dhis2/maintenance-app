import Action from 'd2-flux/action/Action';
import modelToEditStore from './modelToEditStore';
import {isFunction} from 'd2-utils';
import log from 'loglevel';

const objectActions = Action.createActionsFromNames(['getObjectOfTypeById', 'getObjectOfTypeByIdAndClone', 'saveObject', 'afterSave', 'saveAndRedirectToList']);

objectActions.getObjectOfTypeById
    .subscribe(({data, complete, error}) => {
        modelToEditStore
            .getObjectOfTypeById(data)
            .subscribe(complete, error);
    });

objectActions.getObjectOfTypeByIdAndClone
    .subscribe(({data, complete, error}) => {
        modelToEditStore
            .getObjectOfTypeByIdAndClone(data)
            .subscribe(complete, error);
    });

objectActions.saveObject.subscribe(action => {
    const errorHandler = (message) => {
        action.error(message);
    };

    const successHandler = () => {
        if (isFunction(action.data.afterSave)) {
            log.info('Handling after save');
            action.data.afterSave(action)
                .subscribe(
                    () => action.complete('success'),
                    errorHandler
                );
        } else {
            action.complete('success');
        }
    };

    return modelToEditStore
        .save(action.data.id)
        .subscribe(successHandler, errorHandler);
});

export default objectActions;
