import Action from 'd2-flux/action/Action';
import modelToEditStore from './modelToEditStrore';

const objectActions = Action.createActionsFromNames(['getObjectOfTypeById', 'saveObject', 'saveAndRedirectToList']);

//TODO: Extract this a convenience method onto the action object?
objectActions.mapActionsToStore = function mapActionsToStore(actionsConfig, store) {
    actionsConfig.forEach(mapping => {
        mapping[0].forEach(actionKey => {
            let actionTransformer = mapping[2];

            this[actionKey].subscribe(function (actionConfig) {
                if (actionTransformer) {
                    actionConfig = actionTransformer(actionConfig);
                }
                store[mapping[1]](actionConfig);
            });
        });
    });
};

objectActions.mapActionsToStore([
    [['saveObject', 'saveAndRedirectToList'], 'save'],
    [['getObjectOfTypeById'], 'getObjectOfTypeById', (config) => { console.log('action transformer'); return config.data; }]
], modelToEditStore);

export default objectActions;
