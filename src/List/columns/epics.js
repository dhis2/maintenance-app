import { Observable } from 'rxjs';
import { configurableColumnsLoadTypes, setColumnsTypes  } from './actions';
import { getInstance } from '../../../../d2/lib/d2';
import { combineEpics } from "redux-observable";
import listStore from '../list.store';
import listActions from '../list.actions';
import { setColumnsForModel } from './reducers';
import { getAllModelTypes } from './selectors';
const d2$ = Observable.fromPromise(getInstance());
const DATASTORE_NAMESPACE = 'maintenance';
const COLUMN_KEY = "configurableColumns";



const loadColumnsForAllModeltypes = action$ =>
    action$
        .ofType(configurableColumnsLoadTypes.request)
        .combineLatest(d2$)
        .switchMap(async ([action, d2]) => {
            const { modelType } = action.payload;
            const hasNS = await d2.currentUser.dataStore.has(
                DATASTORE_NAMESPACE
            );
            let modelTypes = {};
            if (hasNS) {
                const ns = await d2.currentUser.dataStore.get(
                    DATASTORE_NAMESPACE
                );
                console.log(ns.keys);
                if (ns.keys.includes(COLUMN_KEY)) {
                    modelTypes = await ns.get(COLUMN_KEY);
                } 
            }
            return {type: configurableColumnsLoadTypes.success, payload: {
                modelTypes
            }}
        });

const editColumnsForModel = (action$, store) =>
    action$
        .ofType(setColumnsTypes.request)
        .combineLatest(d2$)
        .switchMap(async ([action, d2]) => {
            const { modelType, columns } = action.payload;
            
            /*const namespace = await d2.currentUser.dataStore.get(
                DATASTORE_NAMESPACE
            );
            //TODO fix issue when namespace does not exist!
            const ret = await namespace.set(modelType, columns); */
           // console.log(ret);
           const namespace = await d2.currentUser.dataStore.get(
            DATASTORE_NAMESPACE,
            );
            const cols = getAllModelTypes(store.getState());
            const updatedColumns = setColumnsForModel(cols,action);
            const ret = await namespace.set(COLUMN_KEY, updatedColumns);
            console.log(ret);
            return {type: setColumnsTypes.success, payload: action.payload}
        });

const updateListState = action$ =>
    action$
        .ofType(setColumnsTypes.success)
        .combineLatest(d2$)
        .switchMap(async ([action, d2]) => {
            const { modelType, columns } = action.payload;
            listStore.setState({...listStore.state, list: null, tableColumns: columns})
            listActions.loadList(modelType);
            return {type: 'LIST_LOAD', payload: action.payload};
        });


export default combineEpics(
    loadColumnsForAllModeltypes,
    editColumnsForModel,
    updateListState,
);