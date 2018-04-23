import Store from 'd2-ui/lib/store/Store';
import { equals, first, negate, some, get, compose, find, identity, map, __, concat, includes, reduce, findIndex, isObject, keys, values, flatten } from 'lodash/fp';
import { getOwnedPropertyJSON } from 'd2/lib/model/helpers/json';

// ___ programSelector :: StoreState -> Model<Program>
const programSelector = get('program');

const progamDataEntrySelector = get('program.dataEntryForm');

// ___ programStagesSelector :: StoreState -> Array<Model<ProgramStage>>
const programStagesSelector = get('programStages');

// ___ programStageSectionsSelector :: StoreState -> Array<Model<ProgramStageSection>>
const programStageSectionsSelector = get('programStageSections');

// ___ programStageNotificationsSelector :: StoreState -> Object<programStageId, programStageNotifications>
const programStageNotificationsSelector = get('programStageNotifications');

// ___ dataEntryFormsSelector :: StoreState -> Object<programStageId, DataEntryForm>
const dataEntryFormsSelector = get('dataEntryFormForProgramStage');

const programNotificationsSelector = get('program.notificationTemplates');

// ___ checkIfDirty :: Model -> Boolean
const checkIfDirty = model => model && model.isDirty();

// ___ modelToJson :: Model -> Object
const modelToJson = getOwnedPropertyJSON;

// ___ isProgramStageDirty :: Object<StoreState> -> Object<{programStages}> -> Boolean
const isProgramStageDirty = compose(some(checkIfDirty), programStagesSelector);

// ___ getIdForFirstProgramStage : Object<StoreState> -> Object<{programStages}> -> String
const getIdForFirstProgramStage = compose(get('id'), first, programStagesSelector);

// ___ hasDirtyProgramStageSections :: Object<StoreState> -> Boolean
//const hasDirtyProgramStageSections = compose(some(checkIfDirty), programStageSectionsSelector);
const hasDirtyProgramStageSections = compose(some(checkIfDirty), flatten, values, programStageSectionsSelector)

const hasDirtyProgramNotifications = state => programNotificationsSelector(state).isDirty();

// ___ hasDirtyNotificationTemplate :: Object<{programStageNotifications, programStages}> -> Boolean

const hasDirtyNotificationTemplate = compose(some(checkIfDirty), flatten, values, programStageNotificationsSelector)

// ___ hasDirtyDataEntryForms :: Object<StoreState> -> Object<{programStageId: Model.DataEntryForm}> -> Boolean
const hasDirtyDataEntryForms = compose(some(checkIfDirty), values, dataEntryFormsSelector);

// __ isProgramDirty :: Object<{program}> -> Boolean
const isProgramDirty = compose(checkIfDirty, programSelector);

// __ isStoreStateDirty :: StoreState -> Boolean
export const isStoreStateDirty = compose(
    some(identity),
    map(
        __,
        [
            isProgramDirty,
            isProgramStageDirty,
            hasDirtyProgramStageSections,
            hasDirtyNotificationTemplate,
            hasDirtyDataEntryForms,
            hasDirtyProgramNotifications
        ]
    ),
    value => func => func(value)
);

// getMetaDataToSend :: StoreState -> SaveState
export const getMetaDataToSend = (state) => {
    const payload = {};

    if (isProgramDirty(state)) {
        payload.programs = [programSelector(state)]
            .map(modelToJson);

        //For custom-form
        const programDataEntryForm = state.program.dataEntryForm;
        if(programDataEntryForm && programDataEntryForm.id && programDataEntryForm.isDirty()) {
            payload.dataEntryForms  = [programDataEntryForm].map(modelToJson);
        }
    }

    if (isProgramStageDirty(state)) {
        payload.programStages = programStagesSelector(state)
            .map(modelToJson);
    }

    if (hasDirtyProgramStageSections(state)) {
        const programStageSections = programStageSectionsSelector(state);
        payload.programStageSections = Object
            .keys(programStageSections)
            .map(get(__, programStageSections))
            .reduce(concat)
            .filter(checkIfDirty)
            .map(modelToJson)
    }

    if (hasDirtyNotificationTemplate(state)) {
        const programStageNotifications = programStageNotificationsSelector(state);

        payload.programNotificationTemplates = Object
            .keys(programStageNotifications)
            .map(get(__, programStageNotifications))
            .reduce(concat)
            .filter(checkIfDirty)
            .map(modelToJson);
    }

    if(hasDirtyProgramNotifications(state)) {
        payload.programNotificationTemplates = payload.programNotificationTemplates || [];

        payload.programNotificationTemplates = payload.programNotificationTemplates.concat(
            programNotificationsSelector(state).toArray().map(modelToJson)
        )
    }

    //Program stage dataEntryForms
    if (hasDirtyDataEntryForms(state)) {
        const dataEntryForms = dataEntryFormsSelector(state);
        const programStageDataEntryForms = Object
            .keys(dataEntryForms)
            .map(get(__, dataEntryForms))
            .filter(checkIfDirty)
            .map(modelToJson);

        payload.dataEntryForms = payload.dataEntryForms ?
            payload.dataEntryForms.concat(programStageDataEntryForms) : programStageDataEntryForms;
    }

    return payload;
};

// isValidState :: StoreState -> Boolean
function isValidState(state) {
    const acceptedKeys = [
        'program',
        'programStages',
        'programStageToEditCopy',
        'programStageSections',
        'programStageNotifications',
        'availableDataElements',
        'availableAttributes',
        'dataEntryFormForProgramStage',
        //'programStageSectionsExtracted' //FIX ME REMOVE
    ];

    return Object
        .keys(state)
        .every(key => some(equals(key), acceptedKeys));
}

/**
 * Contains all the event related d2 models.
 * We can't store these in the redux store since they are mutable objects. This store works similar to the Redux store
 * except it won't be able to do the shallow optimizations that the Redux store allows.
 *
 * The store will contain all the d2 related models, in a normalized fashion.
 *
 * The store contains the following keys
 * program: The event program itself.
 *      - Loaded using the filter id:eq:VBqh0ynB2wv
 * programStages: The stages for the program
 *      - Loaded using the filter = program.id:eq:VBqh0ynB2wv
 * programStageSections The sections for the program it's stages
 *      - Loaded using the filter = programStage.program.id:eq:VBqh0ynB2wv
 * programStageNotifications:
 *      - Notifications pulled from the programStages
 */
/*
 Example query for a program with programStages and programSections

 /api/27/metadata
     ?fields=:owner
     &programs:filter=id:eq:VBqh0ynB2wv&programStages=true
     &programStages:filter=program.id:eq:VBqh0ynB2wv
     &programStages:fields=:owner,notificationTemplates[:owner]
     &programStageSections:filter=programStage.program.id:eq:VBqh0ynB2wv
 */
const eventProgramStore = Store.create();

if (process.env.NODE_ENV === "development") {
    eventProgramStore.subscribe(state => {
        console.log('=====================');
        console.info('new store state');
        console.log(state);
        console.log('=====================');
    });
}

const storeSetState = eventProgramStore.setState.bind(eventProgramStore);

eventProgramStore.setState = (newState) => {
    if (!isObject(newState)) {
        throw new Error('You are attempting to set a state that is a non object');
    }

    if (!isValidState(newState)) {
        throw new Error('You are attempting to set an invalid state onto the eventProgramStore');
    }
    storeSetState({
        ...eventProgramStore.getState(),
        ...newState,
    });
};

export default eventProgramStore;
