import { PROGRAM_INDICATOR_LOAD, loadProgramIndicatorSuccess } from './actions';
import programIndicatorStore from './programIndicatorStore';
import { get } from 'lodash/fp';
import { Observable } from 'rxjs';
import { getInstance } from 'd2/lib/d2';
import { requestParams } from '../SingleModelStore';

function loadProgramIndicator(programIndicatorId) {
    console.log(programIndicatorId);

    return Observable.fromPromise(
        getInstance()
            .then(d2 => d2.models.programIndicator.get(programIndicatorId, requestParams.get('programIndicator')))
            .then(programIndicator => ({ programIndicator }))
    );
}

export const programIndicatorLoad = action$ => action$
    .ofType(PROGRAM_INDICATOR_LOAD)
    .map(get('payload.id'))
    .flatMap(loadProgramIndicator)
    .do(storeState => programIndicatorStore.setState(storeState))
    .mapTo(loadProgramIndicatorSuccess());

export default programIndicatorLoad;
