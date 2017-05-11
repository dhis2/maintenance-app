import { Observable } from 'rxjs';
import { getOr, get, find, isEqual, compose } from 'lodash/fp';
import log from 'loglevel';
import { combineEpics } from 'redux-observable';
import { PROGRAM_STAGE_DATA_ENTRY_FORM_FIELD_CHANGED, PROGRAM_STAGE_DATA_ENTRY_FORM_REMOVE } from './actions';
import eventProgramStore from '../eventProgramStore';
import { generateUid } from 'd2/lib/uid';

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
    .map((action) => {
        const storeState = eventProgramStore.getState();
        const programStageId = action.payload;
        const programStage = findProgramStageById(programStageId)(storeState);
        const dataEntryFormsForProgramStages = storeState.dataEntryFormForProgramStage;

        programStage.dataEntryForm = undefined;
        // dataEntryFormsForProgramStages[programStageId] =

    })
    .mergeMapTo(Observable.never());

export default combineEpics(dataEntryFormChangedEpic, dataEntryFormRemoveEpic);
