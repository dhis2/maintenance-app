import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import { createEpicMiddleware, combineEpics } from 'redux-observable';

import eventProgramReducer from './EditModel/event-program/reducers';
import eventProgramEpics from './EditModel/event-program/epics';
import configurableColumnsEpics from './List/columns/epics';
import configurableColumnsReducer from './List/columns/reducers';
import sessionReducer from './Session/reducer';
import appLoadReducer from './AppLoad/reducer';

const epics = combineEpics(eventProgramEpics, configurableColumnsEpics);
const middlewares = [createEpicMiddleware(epics)];

const appReducers = combineReducers({
    eventProgram: eventProgramReducer,
    configurableColumns: configurableColumnsReducer,
    session: sessionReducer,
    appLoad: appLoadReducer,
});

if (process.env.NODE_ENV === 'development') {
    middlewares.push(
        createLogger(),
    );
}

export default createStore(appReducers, applyMiddleware(...middlewares));
