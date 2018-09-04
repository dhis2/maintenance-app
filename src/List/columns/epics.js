import { Observable } from 'rxjs';
import { configurableColumnsLoadTypes, setColumnsTypes  } from './actions';
import { getInstance } from 'd2/lib/d2';
import { combineEpics } from "redux-observable";

const d2$ = Observable.fromPromise(getInstance());
const DATASTORE_NAMESPACE = 'MAINTENANCE_CONFIGURABLE_COLUMNS';

const loadColumnsForModel = action$ =>
    action$
        .ofType(configurableColumnsLoadTypes.request)
        .combineLatest(d2$)
        .switchMap(async ([action, d2]) => {
            const { modelType } = action.payload;
            const hasNS = await d2.currentUser.dataStore.has(
                DATASTORE_NAMESPACE
            );
            let columns = [];
            if (hasNS) {
                const ns = await d2.currentUser.dataStore.get(
                    DATASTORE_NAMESPACE
                );
                if (ns.keys.includes(modelType)) {
                    columns = await ns.get(modelType);
                } 
            }
            return {type: "LOAD_SUCCESS", payload: {
                modelType,
                columns
            }}
        });

const setColumnsForModel = action$ =>
    action$
        .ofType(setColumnsTypes.request)
        .combineLatest(d2$)
        .switchMap(async ([action, d2]) => {
            const { modelType, columns } = action.payload;

            const namespace = await d2.currentUser.dataStore.get(
                DATASTORE_NAMESPACE
            );

            const ret = await namespace.set(modelType, columns);
            console.log(ret);

            return {type: setColumnsForModel.success, payload: action.payload}
        });


export default combineEpics(
    loadColumnsForModel,
    setColumnsForModel,
);