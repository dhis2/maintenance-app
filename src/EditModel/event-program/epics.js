import { MODEL_TO_EDIT_FIELD_CHANGED, EVENT_PROGRAM_LOAD, EVENT_PROGRAM_SAVE, loadEventProgramSuccess, notifyUser, saveEventProgramError, saveEventProgramSuccess } from './actions';
import eventProgramStore, { isStoreStateDirty, getMetaDataToSend } from './eventProgramStore';
import { Observable } from 'rxjs';
import { combineEpics } from 'redux-observable';
import { get, first, map, compose } from 'lodash/fp';
import { getInstance } from 'd2/lib/d2';

const d2$ = Observable.fromPromise(getInstance());
const api$ = d2$.map(d2 => d2.Api.getApi());

function loadEventProgramMetadataByProgramId(programId) {
    const programFields = [
        ':owner,displayName',
        'attributeValues[:all,attribute[id,name,displayName]]',
        'organisationUnits[id,path]',
        'dataEntryForm[:owner]',
        'notificationTemplates[:owner]',
    ].join(',');

    return api$
        .flatMap(api => Observable.fromPromise(api.get([
            'metadata',
            '?fields=:owner,displayName',
            `&programs:filter=id:eq:${programId}&programStages=true`,
            `&programs:fields=${programFields}`,
            `&programStages:filter=program.id:eq:${programId}`,
            '&programStages:fields=:owner,notificationTemplates[:owner,displayName]',
            `&programStageSections:filter=programStage.program.id:eq:${programId}`,
        ].join(''))));
}

function createEventProgramStoreStateFromMetadataResponse(eventProgramMetadata) {
    const { programs = [], programStages = [], programStageSections = [] } = eventProgramMetadata;

    const storeState = getInstance()
        .then((d2) => {
            // createModelFor :: ModelDefinition -> Function -> Model
            const createModelFor = schema => schema.create.bind(schema);
            // createProgramModel :: Array<Object> -> Model
            const createProgramModel = compose(createModelFor(d2.models.program), first);
            // createNotificationTemplateModels :: Array<Object> -> Array<Model>
            const createNotificationTemplateModels = map(createModelFor(d2.models.programNotificationTemplate));
            // createProgramStageSectionModels :: Array<Object> -> Array<Model>
            const createProgramStageSectionModels = map(createModelFor(d2.models.programStageSection));
            // createProgramStageModels :: Array<Object> -> Array<Model>
            const createProgramStageModels = map(createModelFor(d2.models.programStage));
            // extractProgramNotifications :: Array<Object> -> Object<programStageId, Model>
            const extractProgramNotifications = programStages => programStages.reduce((acc, programStage) => ({
                ...acc,
                [programStage.id]: createNotificationTemplateModels(programStage.notificationTemplates),
            }), {});

            return {
                program: createProgramModel(programs),
                programStages: createProgramStageModels(programStages),
                programStageSections: createProgramStageSectionModels(programStageSections),
                programStageNotifications: extractProgramNotifications(programStages),
            };
        });

    return Observable.fromPromise(storeState);
}

export const programModel = action$ => action$
    .ofType(EVENT_PROGRAM_LOAD)
    .map(get('payload.id'))
    .flatMap(loadEventProgramMetadataByProgramId)
    .flatMap(createEventProgramStoreStateFromMetadataResponse)
    .do(storeState => eventProgramStore.setState(storeState))
    .do(() => console.log(eventProgramStore.getState()))
    .mapTo(loadEventProgramSuccess());

export const programModelEdit = action$ => action$
    .ofType(MODEL_TO_EDIT_FIELD_CHANGED)
    .map(action => action.payload)
    .flatMap(({ field, value }) => {
        return eventProgramStore
            .take(1)
            .map(get('program'))
            .map(program => {
                // Change field the program model
                program[field] = value;

                // Write back the state to the eventProgramModel
                eventProgramStore.setState({
                    ...eventProgramStore.getState(),
                    program,
                });
            });
    })
    .flatMapTo(Observable.never());

const saveEventProgram = eventProgramStore
    .take(1)
    .filter(isStoreStateDirty)
    .map(getMetaDataToSend)
    .flatMap(metaDataPayload => api$
            .flatMap(api => Observable.fromPromise(api.post('metadata', metaDataPayload)))
            .mapTo(saveEventProgramSuccess())
            .catch(saveEventProgramError)
    );

export const programModelSave = action$ => action$
    .ofType(EVENT_PROGRAM_SAVE)
    .flatMapTo(eventProgramStore.take(1))
    .flatMap((eventProgramStore) => {
        if (isStoreStateDirty(eventProgramStore)) {
            return saveEventProgram;
        }

        return Observable.of(notifyUser('no_changes_to_be_saved'));
    });

export default combineEpics(programModel, programModelEdit, programModelSave);
