import { combineEpics } from 'redux-observable';
import { get, getOr, compose, isEqual, find, findIndex } from 'lodash/fp';

import { getProgramStageToModify } from '../assign-data-elements/epics';
import {
    PROGRAM_STAGE_DATA_ELEMENTS_ORDER_CHANGE,
    //PROGRAM_STAGE_SECTIONS_ORDER_CHANGE,
    //PROGRAM_STAGE_SECTIONS_DATA_ELEMENTS_ORDER_CHANGE,
    //PROGRAM_STAGE_SECTIONS_ADD,
    //PROGRAM_STAGE_SECTIONS_REMOVE,
    //PROGRAM_STAGE_SECTIONS_NAME_EDIT,
    PROGRAM_STAGE_DATA_ELEMENTS_ORDER_CHANGE_COMPLETE,
} from './actions';

const changeProgramStageDataElementOrder = (store) => (action$) => {
    return action$
        .ofType(PROGRAM_STAGE_DATA_ELEMENTS_ORDER_CHANGE)
        .map(action => {
            const state = store.getState();
            const programStageIdToModify = get('payload.programStage', action);

            const programStages = getOr([], 'programStages', state);
            const programStage = getProgramStageToModify(programStageIdToModify, programStages);
            const programStageDataElements = getOr([], 'programStageDataElements', programStage);

            const newDataElementOrder = get('payload.newDataElementOrder', action);
            programStage.programStageDataElements = programStageDataElements
                .map((dataElement, index) => ({
                    ...dataElement,
                    sortOrder: findIndex(id => id === get('dataElement.id', dataElement), newDataElementOrder),
                }));

            store.setState({
                ...store.getState(),
                programStages,
            });
        })
        .mapTo({ type: PROGRAM_STAGE_DATA_ELEMENTS_ORDER_CHANGE_COMPLETE });
};

export default function createEpicsForStore(store) {
    return combineEpics(
        changeProgramStageDataElementOrder(store),
    );
};
