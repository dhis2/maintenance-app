import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import eventProgramReducer from './reducers';
import { programModel } from './epics';

const epicMiddleware = createEpicMiddleware(combineEpics(programModel));

export default createStore(eventProgramReducer, applyMiddleware(epicMiddleware));
