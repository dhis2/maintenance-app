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
import getMissingValuesForModelName from '../../forms/getMissingValuesForModelName';

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
                : [{
                    id: programStageUid,
                    programStageDataElements: [],
                    notificationTemplates: [],
                    programStageSections: [],
                }];
        const newProgramMetadata = {
            programs: [
                {
                    id: programUid,
                    programStages,
                    programTrackedEntityAttributes: [],
                    organisationUnits: [],
                },
            ],
        };

        const availableData$ = d2$.flatMap((d2) => {
            const dataElements$ = Observable.fromPromise(
                d2.models.dataElements
                    .filter()
                    .on('domainType')
                    .equals('TRACKER')
                    .list({ paging: false })
                    .then(dataElements => dataElements.toArray()),
            );
            const trackedEntityAttributes$ = Observable.fromPromise(
                d2.models.trackedEntityAttributes
                    .list({ paging: false })
                    .then(attributes => attributes.toArray()),
            );

            return Observable.combineLatest(
                dataElements$,
                trackedEntityAttributes$,
                (elements, attributes) => ({
                    elements,
                    attributes,
                }),
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
            }),
        )
            .flatMap(createEventProgramStoreStateFromMetadataResponse)
            .map((state) => {
                // Set some eventProgram defaults
                // Set programType to router-query type
                // fallback to event program
                const programType = programPayload.query.type || "WITHOUT_REGISTRATION";

                state.program.programType = programType;
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

    // Tomcat 8.5 does not allow unencoded brackets in querystrings. By passing the query params
    // as an object to d2 it will url encode all params and escape the brackets
    const queryParams = {
        fields: ':owner,displayName',
        'programs:filter': `id:eq:${programId}`,
        'programs:fields': `${programFields},programStages[:owner,displayName,programStageDataElements[:owner,dataElement[id,displayName,valueType,optionSet,domainType]],notificationTemplates[:owner,displayName],dataEntryForm[:owner],programStageSections[:owner,displayName,dataElements[id,displayName]]]`,
        'dataElements:fields': 'id,displayName,valueType,optionSet',
        'dataElements:filter': 'domainType:eq:TRACKER',
        'trackedEntityAttributes:fields': 'id,displayName,valueType,optionSet,unique'
    }

    return api$
        .flatMap(api =>
            Observable.fromPromise(
                api.get('metadata', queryParams),
            ),
        )
        .flatMap(createEventProgramStoreStateFromMetadataResponse);
}

function createEventProgramStoreStateFromMetadataResponse(
    eventProgramMetadata,
) {
    const {
        programs = [],
        dataElements = [],
        trackedEntityAttributes = [],
    } = eventProgramMetadata;
    const programStages = getOr([], 'programStages', first(programs));

    const storeState = getInstance().then((d2) => {
        // createModelFor :: ModelDefinition -> Function -> Model
        const createModelFor = schema => schema.create.bind(schema);

        // createProgramModel :: Array<Object> -> Model
        const createProgramModel = compose(
            createModelFor(d2.models.program),
            first,
        );

        // createProgramStageSectionModels :: Array<Object> -> Array<Model>
        const createProgramStageSectionModels = map(
            createModelFor(d2.models.programStageSection),
        );

        // createProgramStageModels :: Array<Object> -> Array<Model>
        const createProgramStageModels = map(
            createModelFor(d2.models.programStage),
        );

        // createNotificationTemplateModels :: Array<Object> -> Array<Model>
        const createNotificationTemplateModels = map(
            createModelFor(d2.models.programNotificationTemplate),
        );

        const extractProgramStageSections =
            programStages =>
                programStages.reduce(
                    (acc, programStage) => ({
                        ...acc,
                        [programStage.id]: createProgramStageSectionModels(
                            getOr([], 'programStageSections', programStage),
                        ),
                    }),
                    {},
                );

        // extractProgramNotifications :: Array<Object> -> Object<programStageId, [Model]>
        const extractProgramNotifications = programStages =>
            programStages.reduce(
                (acc, programStage) => ({
                    ...acc,
                    [programStage.id]: createNotificationTemplateModels(
                        getOr([], 'notificationTemplates', programStage),
                    ),
                }),
                {},
            );

        // createDataEntryFormModel :: Object<DataEntryForm> :: Model<DataEntryForm>
        const createDataEntryFormModel = createModelFor(
            d2.models.dataEntryForm,
        );

        // extractDataEntryForms :: Array<Object> -> Object<programStageId, Model>
        const extractDataEntryForms = programStages =>
            programStages.reduce(
                (acc, programStage) => ({
                    ...acc,
                    [programStage.id]: createDataEntryFormModel(
                        getOr({}, 'dataEntryForm', programStage),
                    ),
                }),
                {},
            );

        const program = createProgramModel(programs);
        program.dataEntryForm = program.dataEntryForm ? createDataEntryFormModel(getOr({}, 'dataEntryForm', program)) : undefined

        return {
            program,
            programStages: createProgramStageModels(programStages),
            programStageNotifications: extractProgramNotifications(
                programStages,
            ),
            programStageSections: extractProgramStageSections(programStages),
            availableDataElements: dataElements,
            availableAttributes: trackedEntityAttributes,
            dataEntryFormForProgramStage: extractDataEntryForms(programStages),
        };
    });
    return Observable.fromPromise(storeState);
}

async function loadAdditionalTrackerMetadata(loadedMetadata) {
    const program = loadedMetadata.program;

    if(!program.programType || program.programType !== 'WITH_REGISTRATION' || !program.trackedEntityType) {
        return loadedMetadata;
    }
    //Load trackedEntityTypeAttributes
    const tetId = program.trackedEntityType.id;
    const d2 = await getInstance();
    try {
        const tet = await d2.models.trackedEntityType.get(tetId, {
            fields: 'id,displayName,name,trackedEntityTypeAttributes[trackedEntityAttribute]'
        });
        program.trackedEntityType = tet;
        program.resetDirtyState();
    } catch(e) {
        return loadedMetadata;
    }

    return loadedMetadata;
}

export const programModel = action$ =>
    action$
        .ofType(EVENT_PROGRAM_LOAD)
        .map(get('payload'))
        .flatMap(loadEventProgramMetadataByProgramId)
        .flatMap(loadAdditionalTrackerMetadata)
        .do(storeState => eventProgramStore.setState(storeState))
        .mapTo(loadEventProgramSuccess());

export const programModelEdit = createModelToEditEpic(
    MODEL_TO_EDIT_FIELD_CHANGED,
    eventProgramStore,
    'program',
);

export const programStageModelEdit = createModelToEditProgramStageEpic(
    PROGRAM_STAGE_FIELD_EDIT,
    eventProgramStore,
    'programStages',
);

const setEventPSStage = (state) => {
    if (state.program.programType === "WITH_REGISTRATION") {
        return state;
    }
    const ps = first(state.programStages);
    ps.name = state.program.name || state.program.id;
    return {
        ...state,
        programStages: [ps],
    };
};

const saveEventProgram = eventProgramStore
    .take(1)
    .filter(isStoreStateDirty)
    .map(setEventPSStage)
    .map(getMetaDataToSend)
    .flatMap(metaDataPayload =>
        api$
            .flatMap(api =>
                Observable.fromPromise(api.post('metadata', metaDataPayload)),
            )
            .map(getImportStatus)
            .map((importStatus) => {
                if (importStatus.isOk()) {
                    // TODO: Not the most elegant place to do this maybe
                    goToAndScrollUp('/list/programSection/program');
                    return saveEventProgramSuccess();
                }
                return saveEventProgramError(importStatus.errorsPerObject);
            })
            .catch(err => Observable.of(saveEventProgramError(err))),
    );

/**
 * @param {Object} eventProgramStore d2-ui store
 * @param {Object} d2 Instance of d2
 * @return {Promise<eventProgramStore>} A promise that resolves eventProgramStore
*/
const checkProgramForRequiredValues = (eventProgramStore, d2) => {
    const { program } = eventProgramStore;
    const modelType = 'program';
    const formFieldOrder = program.programType === 'WITH_REGISTRATION'
        ? 'trackerProgram'
        : 'eventProgram'
    const missingFields = getMissingValuesForModelName(d2, modelType, formFieldOrder, program);

    return { eventProgramStore, missingFields };
}

const createSaveEventProgramError$ = missingFields => Observable.of(
    saveEventProgramError({
        data: {
            message: missingFields.length === 1
                ? 'required_value_missing'
                : 'required_values_missing',
            translate: true,
            variables: {
                [missingFields.length > 1 ? 'FIELDS' : 'FIELD']:
                    missingFields.join(', '),
            }
        }
    }),
);

const createSaveEventProgramSuccess$ = () => Observable
    .of(saveEventProgramSuccess())
    .concat(
        Observable
            .of(notifyUser({message: 'no_changes_to_be_saved', translate: true}))
            .do(() => goToAndScrollUp('/list/programSection/program'))
    )
;

export const programModelSave = action$ =>
    action$
        .ofType(EVENT_PROGRAM_SAVE)
        .flatMapTo(eventProgramStore.take(1))

        // get missing fields
        .combineLatest(d2$)
        .map(([ eventProgramStore, d2 ]) => checkProgramForRequiredValues(eventProgramStore, d2))

        // determine next action
        .switchMap(({ eventProgramStore, missingFields }) => (
            missingFields.length
                ? createSaveEventProgramError$(missingFields)

            : isStoreStateDirty(eventProgramStore)
                ? saveEventProgram

            : createSaveEventProgramSuccess$()
        ))

        // handle errors
        .catch(e => console.log(e));

export const programModelSaveResponses = action$ =>
    Observable.merge(
        action$.ofType(EVENT_PROGRAM_SAVE_SUCCESS).mapTo(notifyUser({message: 'success', translate: true})),
        action$.ofType(EVENT_PROGRAM_SAVE_ERROR).map((action) => {
			const getFirstErrorFromAction = compose(
                first,
                flatten,
                values,
                getOr([], 'errors'),
                first,
            );

			const firstErrorMessage = getFirstErrorFromAction(action.payload) || action.payload;

            return notifyUser(firstErrorMessage);
        }),
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
    trackerProgramEpics,
);
