import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import eventProgramReducer from './reducers';
import programModelEpics from './epics';
import notificationEpics from './notifications/epics';
import createAssignDataElementEpics from './assign-data-elements/epics';
import eventProgramStore from './eventProgramStore';

const epics = combineEpics(programModelEpics, notificationEpics, createAssignDataElementEpics(eventProgramStore));
const epicMiddleware = createEpicMiddleware(epics);

export default createStore(eventProgramReducer, applyMiddleware(epicMiddleware))
