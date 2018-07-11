import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import { createEpicMiddleware, combineEpics } from 'redux-observable';

import eventProgramReducer from './EditModel/event-program/reducers';
import eventProgramEpics from './EditModel/event-program/epics';

const epics = combineEpics(eventProgramEpics);
const middlewares = [createEpicMiddleware(epics)];

const appReducers = combineReducers({
    eventProgram: eventProgramReducer,
});

if (process.env.NODE_ENV === 'development') {
    middlewares.push(
        createLogger(),
    );
}

export default createStore(appReducers, applyMiddleware(...middlewares));
