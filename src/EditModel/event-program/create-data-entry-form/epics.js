import { Observable } from 'rxjs';
import { combineEpics } from 'redux-observable';
import { get, getOr, compose, isEqual, find, findIndex, maxBy, filter } from 'lodash/fp';
import { generateUid } from 'd2/lib/uid';

import { getProgramStageToModify } from '../assign-data-elements/epics';
import {
    PROGRAM_STAGE_DATA_ELEMENTS_ORDER_CHANGE,
    PROGRAM_STAGE_SECTIONS_ORDER_CHANGE,
    PROGRAM_STAGE_SECTIONS_ADD,
    PROGRAM_STAGE_SECTIONS_REMOVE,
    PROGRAM_STAGE_SECTION_NAME_EDIT,
    PROGRAM_STAGE_DATA_ELEMENTS_ORDER_CHANGE_COMPLETE,
} from './actions';

const changeProgramStageDataElementOrder = (store) => (action$) => {
    return action$
        .ofType(PROGRAM_STAGE_DATA_ELEMENTS_ORDER_CHANGE)
        .map(action => {
            const state = store.getState();
            const programStages = getOr([], 'programStages', state);
            const programStage = getProgramStageToModify(get('payload.programStage', action), programStages);
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

const changeProgramStageSectionName = (store) => (action$) => {
    return action$
        .ofType(PROGRAM_STAGE_SECTION_NAME_EDIT)
        .map(action => {
            const state = store.getState();
            const programStageSectionId = get('payload.programStageSectionId', action);
            const newProgramStageSectionName = get('payload.newProgramStageSectionName', action);

            const programStageSections = getOr([], 'programStageSections', state)
                .map(section =>
                    isEqual(section.id, programStageSectionId) ? {
                        ...section,
                        displayName: newProgramStageSectionName,
                    } : section);

            store.setState({
                ...store.getState(),
                programStageSections,
            });
        })
        .flatMapTo(Observable.never());
};

const changeProgramStageSectionOrder = (store) => (action$) => {
    return action$
        .ofType(PROGRAM_STAGE_SECTIONS_ORDER_CHANGE)
        .map(action => {
            const state = store.getState();
            const newSections = get('payload.programStageSections', action);

            const programStageSections = getOr([], 'programStageSections', state)
                .map(oldSection => {
                    const newSectionIndex = findIndex(newSection => isEqual(newSection.id, oldSection.id), newSections);
                    const updatedValues =  newSections[newSectionIndex];

                    return updatedValues ? {
                        ...oldSection,
                        ...updatedValues,
                        sortOrder: newSectionIndex,
                    } : oldSection;
                });

            store.setState({
                ...store.getState(),
                programStageSections,
            });
        })
        .flatMapTo(Observable.never());
};

const addProgramStageSection = (store) => (action$) => {
    return action$
        .ofType(PROGRAM_STAGE_SECTIONS_ADD)
        .map(action => {
            const state = store.getState();
            const newSectionName = get('payload.newSectionName', action);
            const programStageSections = getOr([], 'programStageSections', state);
            const sortOrder = get('sortOrder', maxBy(section => get('sortOrder', section), programStageSections)) + 1;

            const updatedProgramStageSections = getOr([], 'programStageSections', state).concat({
                id: generateUid(),
                displayName: newSectionName,
                dataElements: [],
                sortOrder,
            });

            console.warn('updatedProgramStageSections:', updatedProgramStageSections);

            store.setState({
                ...store.getState(),
                programStageSections: updatedProgramStageSections,
            });
        })
        .flatMapTo(Observable.never());
};


const removeProgramStageSection = (store) => (action$) => {
    return action$
        .ofType(PROGRAM_STAGE_SECTIONS_REMOVE)
        .map(action => {
            // TODO: Update sortOrder? map(section => ({ ...section, sortOrder: section.sortOrder - 1 }), filter(section => section.sortOrder > sortOrderOfDeletedSection, sections));
            const state = store.getState();
            const sectionToDelete = get('payload.programStageSectionId', action);

            const programStageSections = getOr([], 'programStageSections', state);
            const updatedProgramStageSections = filter(section => !isEqual(sectionToDelete, section.id), programStageSections);

            store.setState({
                ...store.getState(),
                programStageSections: updatedProgramStageSections,
            });
        })
        .flatMapTo(Observable.never());
};

export default function createEpicsForStore(store) {
    return combineEpics(
        changeProgramStageDataElementOrder(store),
        changeProgramStageSectionName(store),
        changeProgramStageSectionOrder(store),
        addProgramStageSection(store),
        removeProgramStageSection(store),
    );
};
