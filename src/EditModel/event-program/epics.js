import {
    MODEL_TO_EDIT_FIELD_CHANGED,
    EVENT_PROGRAM_LOAD,
    EVENT_PROGRAM_SAVE,
    EVENT_PROGRAM_SAVE_SUCCESS,
    EVENT_PROGRAM_SAVE_ERROR,
    loadEventProgramSuccess,
    notifyUser,
    saveEventProgramError,
    saveEventProgramSuccess,
} from './actions';

import {
    PROGRAM_STAGE_FIELD_EDIT,
    PROGRAM_STAGE_EDIT_RESET,
    PROGRAM_STAGE_EDIT_CANCEL,
    PROGRAM_STAGE_EDIT_SAVE,
    PROGRAM_STAGE_DELETE,
    editProgramStageReset,
    PROGRAM_STAGE_ADD,
    PROGRAM_STAGE_EDIT,
    editProgramStage,
} from './tracker-program/program-stages/actions';
import eventProgramStore, {
    isStoreStateDirty,
    getMetaDataToSend,
} from './eventProgramStore';
import { Observable } from 'rxjs';
import { combineEpics } from 'redux-observable';
import {
    get,
    getOr,
    set,
    first,
    map,
    compose,
    groupBy,
    isEqual,
    find,
    memoize,
    values,
    flatten,
} from 'lodash/fp';
import { getInstance } from 'd2/lib/d2';
import { generateUid } from 'd2/lib/uid';
import { getImportStatus } from './metadataimport-helpers';
import { goToAndScrollUp } from '../../router-utils';
import { hashHistory } from 'react-router';
import notificationEpics from './notifications/epics';
import createAssignDataElementEpics from './assign-data-elements/epics';
import createAssignAttributeEpics from './tracker-program/assign-tracked-entity-attributes/epics';
import createCreateDataEntryFormEpics from './create-data-entry-form/epics';
import dataEntryFormEpics from './data-entry-form/epics';
import {
    createModelToEditEpic,
    createModelToEditProgramStageEpic,
} from '../epicHelpers';
import trackerProgramEpics from './tracker-program/epics';

const d2$ = Observable.fromPromise(getInstance());
const api$ = d2$.map(d2 => d2.Api.getApi());

function loadEventProgramMetadataByProgramId(programPayload) {
    const programId = programPayload.id;
    if (programId === 'add') {
        const programUid = generateUid();
        const programStageUid = generateUid();

        // A api format payload that contains a program and a programStage
        const programStages =
            programPayload.query.type == 'WITH_REGISTRATION'
                ? []
                : [
                      {
                          id: programStageUid,
                          programStageDataElements: [],
                          notificationTemplates: [],
                          programStageSections: [],
                      },
                  ];
        const newProgramMetadata = {
            programs: [
                {
                    id: programUid,
                    /* programStages: [
                    {
                        id: programStageUid,
                        programStageDataElements: [],
                        notificationTemplates: [],
                        programStageSections: [],
                    },
                ],*/
                    programStages,
                    programTrackedEntityAttributes: [],
                    organisationUnits: [],
                },
            ],
        };

        const availableData$ = d2$.flatMap(d2 => {
            const dataElements$ = Observable.fromPromise(
                d2.models.dataElements
                    .filter()
                    .on('domainType')
                    .equals('TRACKER')
                    .list({ paging: false })
                    .then(dataElements => dataElements.toArray())
            );
            const trackedEntityAttributes$ = Observable.fromPromise(
                d2.models.trackedEntityAttributes
                    .list({ paging: false })
                    .then(attributes => attributes.toArray())
            );

            return Observable.combineLatest(
                dataElements$,
                trackedEntityAttributes$,
                (elements, attributes) => ({
                    elements,
                    attributes,
                })
            );
        });

        return Observable.combineLatest(
            Observable.of(newProgramMetadata),
            // Load the available dataElements and attributes from the api
            availableData$,
            (metadata, available) => ({
                ...metadata,
                dataElements: available.elements,
                trackedEntityAttributes: available.attributes,
            })
        )
            .flatMap(createEventProgramStoreStateFromMetadataResponse)
            .map(state => {
                // Set some eventProgram defaults
                //Set programType to router-query type
                const programType = programPayload.query.type;

                state.program.programType = programPayload.query.type;
                if (state.programStages.length > 0) {
                    const programStage = first(state.programStages);
                    programStage.name = state.program.id;
                }

                return state;
            });
    }
    const programFields = [
        ':owner,displayName',
        'attributeValues[:all,attribute[id,name,displayName]]',
        'organisationUnits[id,path]',
        'dataEntryForm[:owner]',
        'notificationTemplates[:owner]',
        'programTrackedEntityAttributes',
    ].join(',');

    return api$
        .flatMap(api =>
            Observable.fromPromise(
                api.get(
                    [
                        'metadata',
                        '?fields=:owner,displayName',
                        `&programs:filter=id:eq:${programId}`,
                        `&programs:fields=${programFields},programStages[:owner,displayName,programStageDataElements[:owner,dataElement[id,displayName]],notificationTemplates[:owner,displayName],dataEntryForm[:owner],programStageSections[:owner,displayName,dataElements[id,displayName]]]`,
                        '&dataElements:fields=id,displayName,valueType,optionSet',
                        '&dataElements:filter=domainType:eq:TRACKER',
                        '&trackedEntityAttributes:fields=id,displayName,valueType,optionSet,unique',
                    ].join('')
                )
            )
        )
        .flatMap(createEventProgramStoreStateFromMetadataResponse);
}

function createEventProgramStoreStateFromMetadataResponse(
    eventProgramMetadata
) {
    const {
        programs = [],
        dataElements = [],
        trackedEntityAttributes = [],
    } = eventProgramMetadata;
    const programStages = getOr([], 'programStages', first(programs));
    const storeState = getInstance().then(d2 => {
        // createModelFor :: ModelDefinition -> Function -> Model
        const createModelFor = schema => schema.create.bind(schema);

        // createProgramModel :: Array<Object> -> Model
        const createProgramModel = compose(
            createModelFor(d2.models.program),
            first
        );

        // createProgramStageSectionModels :: Array<Object> -> Array<Model>
        const createProgramStageSectionModels = map(
            createModelFor(d2.models.programStageSection)
        );

        // createProgramStageModels :: Array<Object> -> Array<Model>
        const createProgramStageModels = map(
            createModelFor(d2.models.programStage)
        );

        // createNotificationTemplateModels :: Array<Object> -> Array<Model>
        const createNotificationTemplateModels = map(
            createModelFor(d2.models.programNotificationTemplate)
        );

        // extractProgramNotifications :: Array<Object> -> Object<programStageId, [Model]>
        const extractProgramNotifications = programStages =>
            programStages.reduce(
                (acc, programStage) => ({
                    ...acc,
                    [programStage.id]: createNotificationTemplateModels(
                        getOr([], 'notificationTemplates', programStage)
                    ),
                }),
                {}
            );

        // createDataEntryFormModel :: Object<DataEntryForm> :: Model<DataEntryForm>
        const createDataEntryFormModel = createModelFor(
            d2.models.dataEntryForm
        );

        // extractDataEntryForms :: Array<Object> -> Object<programStageId, Model>
        const extractDataEntryForms = programStages =>
            programStages.reduce(
                (acc, programStage) => ({
                    ...acc,
                    [programStage.id]: createDataEntryFormModel(
                        getOr({}, 'dataEntryForm', programStage)
                    ),
                }),
                {}
            );

        return {
            program: createProgramModel(programs),
            programStages: createProgramStageModels(
                getOr([], 'programStages', first(programs))
            ),
            programStageSections: createProgramStageSectionModels(
                getOr(
                    [],
                    'programStages[0].programStageSections',
                    first(programs)
                )
            ),
            programStageNotifications: extractProgramNotifications(
                programStages
            ),
            availableDataElements: dataElements,
            availableAttributes: trackedEntityAttributes,
            dataEntryFormForProgramStage: extractDataEntryForms(programStages),
        };
    });
    return Observable.fromPromise(storeState);
}

export const programModel = action$ =>
    action$
        .ofType(EVENT_PROGRAM_LOAD)
        .map(get('payload'))
        .flatMap(loadEventProgramMetadataByProgramId)
        .do(storeState => eventProgramStore.setState(storeState))
        .mapTo(loadEventProgramSuccess());

export const programModelEdit = createModelToEditEpic(
    MODEL_TO_EDIT_FIELD_CHANGED,
    eventProgramStore,
    'program'
);

export const programStageModelEdit = createModelToEditProgramStageEpic(
    PROGRAM_STAGE_FIELD_EDIT,
    eventProgramStore,
    'programStages'
);

const saveEventProgram = eventProgramStore
    .take(1)
    .filter(isStoreStateDirty)
    .map(getMetaDataToSend)
    .flatMap(metaDataPayload =>
        api$
            .flatMap(api =>
                Observable.fromPromise(api.post('metadata', metaDataPayload))
            )
            .map(getImportStatus)
            .map(importStatus => {
                if (importStatus.isOk()) {
                    // TODO: Not the most elegant place to do this maybe
                    goToAndScrollUp('/list/programSection/program');
                    return saveEventProgramSuccess();
                }
                return saveEventProgramError(importStatus.errorsPerObject);
            })
            .catch(err => Observable.of(saveEventProgramError(err)))
    );

export const programModelSave = action$ =>
    action$
        .ofType(EVENT_PROGRAM_SAVE)
        .flatMapTo(eventProgramStore.take(1))
        .flatMap(eventProgramStore => {
            if (isStoreStateDirty(eventProgramStore)) {
                return saveEventProgram;
            }

            return Observable.of(notifyUser('no_changes_to_be_saved')).do(() =>
                goToAndScrollUp('/list/programSection/program')
            );
        });

export const programModelSaveResponses = action$ =>
    Observable.merge(
        action$.ofType(EVENT_PROGRAM_SAVE_SUCCESS).mapTo(notifyUser('success')),
        action$.ofType(EVENT_PROGRAM_SAVE_ERROR).map(action => {
            const getFirstErrorMessageFromAction = compose(
                get('message'),
                first,
                flatten,
                values,
                getOr([], 'errors'),
                first
            );
            const firstErrorMessage = getFirstErrorMessageFromAction(
                action.payload
            );

            return notifyUser({ message: firstErrorMessage, translate: false });
        })
    );

export default combineEpics(
    programModel,
    programModelEdit,
    programStageModelEdit,
    programModelSave,
    programModelSaveResponses,
    notificationEpics,
    createAssignDataElementEpics(eventProgramStore),
    createAssignAttributeEpics(eventProgramStore),
    createCreateDataEntryFormEpics(eventProgramStore),
    dataEntryFormEpics,
    trackerProgramEpics
);
