import Action from 'd2-flux/action/Action';
import modelToEditStore from './modelToEditStore';
import {isFunction} from 'd2-utils';
import log from 'loglevel';

const objectActions = Action.createActionsFromNames([
    'getObjectOfTypeById',
    'getObjectOfTypeByIdAndClone',
    'saveObject',
    'afterSave',
    'saveAndRedirectToList',
    'update',
    'updateAttribute',
]);

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

objectActions.update.subscribe(action => {
    const {fieldName, value} = action.data;
    const modelToEdit = modelToEditStore.getState();

    if (modelToEdit) {
        if (!(modelToEdit[fieldName] && modelToEdit[fieldName].constructor && modelToEdit[fieldName].constructor.name === 'ModelCollectionProperty')) {
            log.debug(`Change ${fieldName} to ${value}`);
            modelToEdit[fieldName] = value;
            log.debug(`Value is now: ${modelToEdit.dataValues[fieldName]}`);
        } else {
            log.debug('Not updating anything');
        }

        modelToEditStore.setState(modelToEdit);

        action.complete();
    } else {
        log.error(`modelToEdit does not exist`);
        action.error();
    }
});

objectActions.updateAttribute.subscribe(action => {
    const {attributeName, value} = action.data;
    const modelToEdit = modelToEditStore.getState();

    modelToEdit.attributes[attributeName] = value;

    modelToEditStore.setState(modelToEdit);

    action.complete();
});

export default objectActions;
