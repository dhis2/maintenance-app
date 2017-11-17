import { PROGRAM_STAGE_ATTRIBUTES_ADD, PROGRAM_STAGE_ATTRIBUTES_REMOVE, PROGRAM_STAGE_ATTRIBUTES_ADDREMOVE_COMPLETE, PROGRAM_STAGE_ATTRIBUTES_EDIT, PROGRAM_STAGE_ATTRIBUTES_EDIT_COMPLETE } from './actions';
import { combineEpics } from 'redux-observable';
import { getOr, get, map, find, compose, isEqual, includes, negate, filter, __ } from 'lodash/fp';
import { generateUid } from 'd2/lib/uid';

// getProgramStageToModify :: String -> ProgramStage[] -> ProgramStage
export const getProgramStageToModify = (programStageIdToModify, programStages) => find(compose(isEqual(programStageIdToModify), get('id')), programStages);

const programStageDataElementExistsInDataElementUidList = uids => compose(includes(__, uids), get('programTrackedEntity.id'));
const keepProgramStageDataElementsNotInUidList = uids => filter(negate(programStageDataElementExistsInDataElementUidList(uids)));

const addAttributeToStage = store => action$ => action$
        .ofType(PROGRAM_STAGE_ATTRIBUTES_ADD)
        .map((action) => {
            console.log("TO STAGE")
            const state = store.getState();
           // const programStageIdToModify = get('payload.programStage', action);
            //const programStages = getOr([], 'programStages', state);
            //const programStage = getProgramStageToModify(programStageIdToModify, programStages);
            const program = getOr([], 'program', state);
            console.log("ADD")
            const programAttributes = getOr([], 'programTrackedEntityAttributes', program);
            const attributesIdsToAdd = getOr([], 'payload.attributes', action);
            const attributesToAdd = map(id => ({
                id: generateUid(),
                trackedEntityAttribute: {
                    id,
                },
            }), attributesIdsToAdd);

            program.programTrackedEntityAttributes = programAttributes.concat(attributesToAdd);
            console.log("ADD NOW")
            store.setState({
                ...store.getState(),
                program,
            });
        })
        .mapTo({ type: PROGRAM_STAGE_ATTRIBUTES_ADDREMOVE_COMPLETE });

const removeAttributeFromStage = store => action$ => action$
        .ofType(PROGRAM_STAGE_ATTRIBUTES_REMOVE)
        .map((action) => {
            const state = store.getState();
            const programStageIdToModify = get('payload.programStage', action);
            const programStages = getOr([], 'programStages', state);
            const programStage = getProgramStageToModify(programStageIdToModify, programStages);

            const programStageDataElements = getOr([], 'programStageDataElements', programStage);
            const dataElementIdsToRemove = getOr([], 'payload.dataElements', action);

            const removeDataElements = keepProgramStageDataElementsNotInUidList(dataElementIdsToRemove);

            programStage.programStageDataElements = removeDataElements(programStageDataElements);

            store.setState({
                ...store.getState(),
                programStages,
            });
        })
        .mapTo({ type: PROGRAM_STAGE_ATTRIBUTES_ADDREMOVE_COMPLETE });

const getProgramStageByIdFromAction = (store, action) => {
    const programStageIdToModify = get('payload.programStage', action);
    const programStages = getOr([], 'programStages', store.getState());
    return getProgramStageToModify(programStageIdToModify, programStages);
};
const isObjectHasId = id => compose(isEqual(id), get('id'));

const editAttribute = store => action$ => action$
        .ofType(PROGRAM_STAGE_ATTRIBUTES_EDIT)
        .map((action) => {
            const programStageDataElementId = get('payload.programStageDataElement.id', action);
            const programStage = getProgramStageByIdFromAction(store, action);
            const programStageDataElements = getOr([], 'programStageDataElements', programStage);
            const programStageDataElement = programStageDataElements
                .find(isObjectHasId(programStageDataElementId));

            programStage.programStageDataElements = programStageDataElements
                .map((value) => {
                    if (programStageDataElement === value) {
                        return action.payload.programStageDataElement;
                    }
                    return value;
                });

            store.setState({
                ...store.getState(),
                programStages: [programStage],
            });
        })
        .mapTo({ type: PROGRAM_STAGE_ATTRIBUTES_EDIT_COMPLETE });

export default function createEpicsForStore(store) {
    return combineEpics(
        addAttributeToStage(store),
        removeAttributeFromStage(store),
        editAttribute(store)
    );
}
