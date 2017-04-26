import Store from 'd2-ui/lib/store/Store';
import { equals, first, negate, some, get, compose, find, identity, map, __, concat, includes, findIndex, isObject } from 'lodash/fp';
import { getOwnedPropertyJSON } from 'd2/lib/model/helpers/json';

// programSelector :: StoreState -> Model<Program>
const programSelector = get('program');

// programStagesSelector :: StoreState -> Array<Model<ProgramStage>>
const programStagesSelector = get('programStages');

// programStageNotificationsSelector :: StoreState -> Object<programStageId, programStageNotifications>
const programStageNotificationsSelector = get('programStageNotifications');

// checkIfDirty :: Model -> Boolean
const checkIfDirty = model => model && model.isDirty();

// modelToJson :: Model -> Object
const modelToJson = getOwnedPropertyJSON;

// isProgramStageDirty :: Object<{programStages}> -> Boolean
const isProgramStageDirty = compose(checkIfDirty, first, programStagesSelector);

// getIdForFirstProgramStage :: Object<{programStages}> -> String
const getIdForFirstProgramStage = compose(get('id'), first, programStagesSelector);

// hasDirtyNotificationTemplate :: Object<{programStageNotifications, programStages}> -> Boolean
const hasDirtyNotificationTemplate = state => some(checkIfDirty, get(getIdForFirstProgramStage(state), programStageNotificationsSelector(state)));

// isProgramDirty :: Object<{program}> -> Boolean
const isProgramDirty = compose(checkIfDirty, programSelector);

// isStoreStateDirty :: StoreState -> Boolean
export const isStoreStateDirty = compose(some(identity), map(__, [isProgramDirty, hasDirtyNotificationTemplate, isProgramStageDirty]), value => func => func(value));

// getMetaDataToSend :: StoreState -> SaveState
export const getMetaDataToSend = state => {
    const payload = {};

    if (isProgramDirty(state)) {
        payload.programs = [programSelector(state)]
            .map(modelToJson);
    }

    if (isProgramStageDirty(state)) {
        payload.programStages = programStagesSelector(state)
            .map(modelToJson);
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

    return payload;
};

// isValidState :: StoreState -> Boolean
function isValidState(state) {
    const acceptedKeys = ['program', 'programStages', 'programStageSections', 'programStageNotifications'];

    return Object
        .keys(state)
        .every((key) => {
            return some(equals(key), acceptedKeys);
        });
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

const storeSetState = eventProgramStore.setState.bind(eventProgramStore);

eventProgramStore.setState = newState => {
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
