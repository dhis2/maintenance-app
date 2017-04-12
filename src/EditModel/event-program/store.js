import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import eventProgramReducer from './reducers';
import programModelEpics from './epics';
import notificationEpics from './notifications/epics';

const epicMiddleware = createEpicMiddleware(combineEpics(programModelEpics, notificationEpics));

export default createStore(eventProgramReducer, applyMiddleware(epicMiddleware));
