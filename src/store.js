import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import { createEpicMiddleware, combineEpics } from 'redux-observable';

import eventProgramReducer from './EditModel/event-program/reducers';
import eventProgramEpics from './EditModel/event-program/epics';
import programIndicatorEpics from './EditModel/program-indicator/epics';
import programIndicatorReducer from './EditModel/program-indicator/reducers';

const epics = combineEpics(eventProgramEpics, programIndicatorEpics);
const middlewares = [createEpicMiddleware(epics)];

const appReducers = combineReducers({
    eventProgram: eventProgramReducer,
    programIndicator: programIndicatorReducer,
});

if (process.env.NODE_ENV === 'development') {
    middlewares.push(
        createLogger(),
    );
}

export default createStore(appReducers, applyMiddleware(...middlewares));
