import Action from 'd2-ui/lib/action/Action';
import listStore from './list.store';
import detailsStore from './details.store';
import { getInstance } from 'd2/lib/d2';
import { Observable } from 'rx';

const listActions = Action.createActionsFromNames(['loadList', 'setListSource', 'searchByName', 'getNextPage', 'getPreviousPage', 'hideDetailsBox']);

listActions.setListSource.subscribe((action) => {
    listStore.listSourceSubject.onNext(Observable.just(action.data));
});

listActions.loadList.subscribe(action => {
    listStore.getListFor(action.data, action.complete, action.error);
});

listActions.searchByName.subscribe(action => {
    listStore.searchByName(action.data.modelType, action.data.searchString, action.complete, action.error);
});

// TODO: For simple action mapping like this we should be able to do something less boiler plate like
listActions.getNextPage.subscribe(() => {
    listStore.getNextPage();
});

listActions.getPreviousPage.subscribe(() => {
    listStore.getPreviousPage();
});

listActions.hideDetailsBox.subscribe(() => {
    detailsStore.setState(null);
});

export default listActions;
