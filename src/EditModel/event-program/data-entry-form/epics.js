import { Observable } from 'rxjs';
import { getOr, get, find, isEqual, compose } from 'lodash/fp';
import log from 'loglevel';
import { combineEpics } from 'redux-observable';
import { PROGRAM_STAGE_DATA_ENTRY_FORM_FIELD_CHANGED, PROGRAM_STAGE_DATA_ENTRY_FORM_REMOVE } from './actions';
import eventProgramStore from '../eventProgramStore';
import { generateUid } from 'd2/lib/uid';
import { getInstance } from 'd2/lib/d2';

const d2$ = Observable.fromPromise(getInstance());

const findById = id => find(compose(isEqual(id), get('id')));
const findProgramStageById = programStageId => compose(
    findById(programStageId),
    get('programStages'),
);

const dataEntryFormChangedEpic = action$ => action$
    .ofType(PROGRAM_STAGE_DATA_ENTRY_FORM_FIELD_CHANGED)
    .map(action => {
        const fieldName = get('payload.field', action);
        const value = get('payload.value', action);
        const programStageId = get('payload.programStage', action);

        const storeState = eventProgramStore.getState();
        const programStage = findProgramStageById(programStageId)(storeState);
        let dataEntryForm = storeState.dataEntryFormForProgramStage[programStageId];

        // Set the uid in case we're dealing with a new form
        dataEntryForm.id = getOr(generateUid(), 'id', dataEntryForm);
        dataEntryForm.name = getOr(programStage.name, 'name', dataEntryForm);
        log.debug('Setting', fieldName, 'to', value);
        dataEntryForm[fieldName] = value;

        if (!programStage.dataEntryForm) {
            programStage.dataEntryForm = dataEntryForm;
        }

        // Force a state update on the store
        eventProgramStore.setState({});
    })
    .flatMapTo(Observable.never());

const dataEntryFormRemoveEpic = action$ => action$
    .ofType(PROGRAM_STAGE_DATA_ENTRY_FORM_REMOVE)
    .combineLatest(d2$, (action, d2) => ({ action, d2 }))
    .mergeMap(({ action, d2 }) => {
        const storeState = eventProgramStore.getState();
        const programStageId = action.payload;
        const programStage = findProgramStageById(programStageId)(storeState);
        const dataEntryFormsForProgramStages = storeState.dataEntryFormForProgramStage;

        return Observable.fromPromise(
            dataEntryFormsForProgramStages[programStageId]
                .delete()
                .then(() => {
                    programStage.dataEntryForm = undefined;
                    dataEntryFormsForProgramStages[programStageId] = d2.models.dataEntryForm.create();
                    eventProgramStore.setState({});
                })
                .catch(v => console.log(v))
        );
    })
    .mergeMapTo(Observable.never());

export default combineEpics(dataEntryFormChangedEpic, dataEntryFormRemoveEpic);
