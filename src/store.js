import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import eventProgramReducer from './EditModel/event-program/reducers';
import eventProgramEpics from './EditModel/event-program/epics';
import programIndicatorEpics from './EditModel/program-indicator/epics';
import programIndicatorReducer from './EditModel/program-indicator/reducers';
import snackBarReducer from './Snackbar/reducers';
import snackBarEpics from './Snackbar/epics';

const epics = combineEpics(eventProgramEpics, programIndicatorEpics, snackBarEpics);
const epicMiddleware = createEpicMiddleware(epics);

const appReducers = combineReducers({
    eventProgram: eventProgramReducer,
    programIndicator: programIndicatorReducer,
    snackBar: snackBarReducer,
});

export default createStore(appReducers, applyMiddleware(epicMiddleware))

