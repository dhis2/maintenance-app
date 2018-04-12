import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import { createEpicMiddleware, combineEpics } from 'redux-observable';

import eventProgramReducer from './EditModel/edit-event-program/reducers';
import eventProgramEpics from './EditModel/edit-event-program/epics';
import programIndicatorEpics from './EditModel/edit-program-indicator/epics';
import programIndicatorReducer from './EditModel/edit-program-indicator/reducers';
import snackBarReducer from './Snackbar/reducers';
import snackBarEpics from './Snackbar/epics';

const epics = combineEpics(eventProgramEpics, programIndicatorEpics, snackBarEpics);
const middlewares = [createEpicMiddleware(epics)];

const appReducers = combineReducers({
    eventProgram: eventProgramReducer,
    programIndicator: programIndicatorReducer,
    snackBar: snackBarReducer,
});

if (process.env.NODE_ENV === "development") {
    middlewares.push(
        createLogger()
    );
}

export default createStore(appReducers, applyMiddleware(...middlewares));
