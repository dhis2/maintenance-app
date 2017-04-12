import { MODEL_TO_EDIT_FIELD_CHANGED } from './actions';
import modelToEditStore from '../modelToEditStore';
import eventProgramStore from './eventProgramStore';
import { Observable } from 'rxjs';
import { combineEpics } from 'redux-observable';
import { get } from 'lodash/fp';

export const programModel = action$ => modelToEditStore
    // We currently only want the redux store to update then we're dealing with a program.
    .filter(model => model.modelDefinition.name === 'program')
    .do(model => {
        eventProgramStore.setState({
            ...eventProgramStore.getState(),
            program: model,
        });
    })
    .flatMapTo(Observable.never());

export const programModelEdit = action$ => action$
    .ofType(MODEL_TO_EDIT_FIELD_CHANGED)
    .map(action => action.payload)
    .flatMap(({ field, value }) => {
        return eventProgramStore
            .take(1)
            .map(get('program'))
            .map(program => {
                program[field] = value;
                eventProgramStore.setState({
                    ...eventProgramStore.getState(),
                    program,
                });
            });
    })
    .flatMapTo(Observable.never());

export default combineEpics(programModel, programModelEdit);
