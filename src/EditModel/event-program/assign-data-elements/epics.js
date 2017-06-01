import { PROGRAM_STAGE_DATA_ELEMENTS_ADD, PROGRAM_STAGE_DATA_ELEMENTS_REMOVE, PROGRAM_STAGE_DATA_ELEMENTS_ADDREMOVE_COMPLETE, PROGRAM_STAGE_DATA_ELEMENT_EDIT, PROGRAM_STAGE_DATA_ELEMENT_EDIT_COMPLETE } from './actions';
import { combineEpics } from 'redux-observable';
import { getOr, get, map, find, compose, isEqual, includes, negate, filter, __ } from 'lodash/fp';
import { generateUid } from 'd2/lib/uid';

// getProgramStageToModify :: String -> ProgramStage[] -> ProgramStage
export const getProgramStageToModify = (programStageIdToModify, programStages) => find(compose(isEqual(programStageIdToModify), get('id')), programStages);

const programStageDataElementExistsInDataElementUidList = uids => compose(includes(__, uids), get('dataElement.id'));
const keepProgramStageDataElementsNotInUidList = uids => filter(negate(programStageDataElementExistsInDataElementUidList(uids)));

const addDataElementsToStage = (store) => (action$) => {
    return action$
        .ofType(PROGRAM_STAGE_DATA_ELEMENTS_ADD)
        .map(action => {
            const state = store.getState();
            const programStageIdToModify = get('payload.programStage', action);
            const programStages = getOr([], 'programStages', state);
            const programStage = getProgramStageToModify(programStageIdToModify, programStages);

            const programStageDataElements = getOr([], 'programStageDataElements', programStage);
            const dataElementIdsToAdd = getOr([], 'payload.dataElements', action);
            const programStageDataElementsToAdd = map(id => ({
                id: generateUid(),
                dataElement: {
                    id,
                },
            }), dataElementIdsToAdd);

            programStage.programStageDataElements = programStageDataElements.concat(programStageDataElementsToAdd);

            store.setState({
                ...store.getState(),
                programStages,
            });
        })
        .mapTo({ type: PROGRAM_STAGE_DATA_ELEMENTS_ADDREMOVE_COMPLETE });
};

const removeDataElementFromStage = (store) => (action$) => {
    return action$
        .ofType(PROGRAM_STAGE_DATA_ELEMENTS_REMOVE)
        .map(action => {
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
        .mapTo({ type: PROGRAM_STAGE_DATA_ELEMENTS_ADDREMOVE_COMPLETE });
};

const getProgramStageByIdFromAction= (store, action) => {
    const programStageIdToModify = get('payload.programStage', action);
    const programStages = getOr([], 'programStages', store.getState());
    return getProgramStageToModify(programStageIdToModify, programStages);
};
const isObjectHasId = (id) => compose(isEqual(id), get('id'));

const editProgramStageDataElement = (store) => (action$) => {
    return action$
        .ofType(PROGRAM_STAGE_DATA_ELEMENT_EDIT)
        .map(action => {
            const programStageDataElementId = get('payload.programStageDataElement.id', action);
            const programStage = getProgramStageByIdFromAction(store, action);
            const programStageDataElements = getOr([], 'programStageDataElements', programStage);
            const programStageDataElement = programStageDataElements
                .find(isObjectHasId(programStageDataElementId));

            programStage.programStageDataElements = programStageDataElements
                .map(value => {
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
        .mapTo({ type: PROGRAM_STAGE_DATA_ELEMENT_EDIT_COMPLETE });
};

export default function createEpicsForStore(store) {
    return combineEpics(
        addDataElementsToStage(store),
        removeDataElementFromStage(store),
        editProgramStageDataElement(store)
    );
};
