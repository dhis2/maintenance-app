import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import eventProgramReducer from './reducers';
import { programModel } from './epics';
import notificationEpics from './notifications/epics';

const epicMiddleware = createEpicMiddleware(combineEpics(programModel, notificationEpics));

export default createStore(eventProgramReducer, applyMiddleware(epicMiddleware));
