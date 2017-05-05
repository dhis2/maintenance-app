import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import eventProgramReducer from './EditModel/event-program/reducers';
import eventProgramEpics from './EditModel/event-program/epics';
import programIndicatorEpics from './EditModel/program-indicator/epics';
import programIndicatorReducer from './EditModel/program-indicator/reducers';

const epics = combineEpics(eventProgramEpics, programIndicatorEpics);
const epicMiddleware = createEpicMiddleware(epics);

const appReducers = combineReducers({
    eventProgram: eventProgramReducer,
    programIndicator: programIndicatorReducer,
});

export default createStore(appReducers, applyMiddleware(epicMiddleware))
