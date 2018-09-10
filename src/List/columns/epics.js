import logger from 'loglevel';
import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs';
import { getInstance } from 'd2/lib/d2';
import { notifyUser } from '../../EditModel/actions';
import listActions from '../list.actions';
import listStore from '../list.store';
import { configurableColumnsLoadTypes, setColumnsTypes } from './actions';
import { setColumnsForModel } from './reducers';
import { getAllModelTypes } from './selectors';

const d2$ = Observable.fromPromise(getInstance());
const DATASTORE_NAMESPACE = 'maintenance';
const COLUMN_KEY = 'configurableColumns';

export const loadColumnsForAllModeltypes = action$ =>
    action$
        .ofType(configurableColumnsLoadTypes.request)
        .combineLatest(d2$)
        .switchMap(async ([action, d2]) => {
            let modelTypes = {};
            try {
                const ns = await d2.currentUser.dataStore.get(
                    DATASTORE_NAMESPACE
                );
                if (ns.keys.includes(COLUMN_KEY)) {
                    modelTypes = await ns.get(COLUMN_KEY);
                }
            } catch (e) {
                //We do not actually do anything here, as we just let it be empty
                //if it does not exist. namespace is set when editing columns (for the first time)
                logger.debug(e);
            }
            return {
                type: configurableColumnsLoadTypes.success,
                payload: {
                    modelTypes,
                },
            };
        });

const editColumnsForModel = (action$, store) =>
    action$
        .ofType(setColumnsTypes.request)
        .combineLatest(d2$)
        .switchMap(async ([action, d2]) => {
            const { modelType, columns } = action.payload;
            let namespace;
            try {
                namespace = await d2.currentUser.dataStore.get(
                    DATASTORE_NAMESPACE
                );
            } catch (e) {
                if (e.httpStatusCode === 404) {
                    //this is fine, we just need to create it
                    try {
                        namespace = await d2.currentUser.dataStore.create(
                            DATASTORE_NAMESPACE
                        );
                    } catch (e) {
                        //actual error
                        logger.error('Failed to create new namespace!', e);
                        return notifyUser({ message: 'Failed to save' });
                    }
                }
                //Some other actual error
                logger.error(e);
                return notifyUser({ message: 'Failed to save' });
            }
            try {
                const cols = getAllModelTypes(store.getState());
                const updatedColumns = setColumnsForModel(cols, action);
                const ret = await namespace.set(COLUMN_KEY, updatedColumns);

                return {
                    type: setColumnsTypes.success,
                    payload: action.payload,
                };
            } catch (e) {
                logger.error(e);
                return notifyUser({ message: 'Failed to save' });
            }
        });

const updateListState = action$ =>
    action$
        .ofType(setColumnsTypes.success)
        .combineLatest(d2$)
        .switchMap(([action, d2]) => {
            const { modelType, columns } = action.payload;
            listStore.setState({
                ...listStore.state,
                list: null,
                tableColumns: columns,
            });
            listActions.loadList(modelType);
            return [{ type: 'LIST_LOAD', payload: action.payload }];
        });

export default combineEpics(
    loadColumnsForAllModeltypes,
    editColumnsForModel,
    updateListState
);
