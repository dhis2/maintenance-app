import Action from 'd2-flux/action/Action';
import listStore from './list.store';

const listActions = Action.createActionsFromNames(['loadList', 'searchByName', 'getNextPage', 'getPreviousPage']);

listActions.loadList.subscribe(action => {
    listStore.getListFor(action.data, action.complete, action.error);
});

listActions.searchByName.subscribe(action => {
    listStore.searchByName(action.data.modelType, action.data.searchString, action.complete, action.error);
});

//TODO: For simple action mapping like this we should be able to do something less boiler plate like
listActions.getNextPage.subscribe(() => {
    listStore.getNextPage();
});

listActions.getPreviousPage.subscribe(() => {
    listStore.getPreviousPage();
});

export default listActions;
