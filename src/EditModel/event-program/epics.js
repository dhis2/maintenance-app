import { MODEL_TO_EDIT_LOADED } from './actions';
import modelToEditStore from '../modelToEditStore';
import eventProgramStore from './eventProgramStore';
import { Observable } from 'rxjs';

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
