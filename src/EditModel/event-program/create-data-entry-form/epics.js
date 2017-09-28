import { Observable } from 'rxjs';
import { combineEpics } from 'redux-observable';
import { get, getOr, compose, isEqual, find, findIndex, maxBy, filter, entries, sortBy, map } from 'lodash/fp';
import { generateUid } from 'd2/lib/uid';
import { getInstance } from 'd2/lib/d2';
import { getProgramStageToModify } from '../assign-data-elements/epics';
import {
    PROGRAM_STAGE_DATA_ELEMENTS_ORDER_CHANGE,
    PROGRAM_STAGE_SECTIONS_ORDER_CHANGE,
    PROGRAM_STAGE_SECTIONS_ADD,
    PROGRAM_STAGE_SECTIONS_REMOVE,
    PROGRAM_STAGE_SECTION_NAME_EDIT,
    PROGRAM_STAGE_DATA_ELEMENTS_ORDER_CHANGE_COMPLETE,
} from './actions';

const d2$ = Observable.fromPromise(getInstance());

const changeProgramStageDataElementOrder = store => action$ => action$
        .ofType(PROGRAM_STAGE_DATA_ELEMENTS_ORDER_CHANGE)
        .map((action) => {
            const state = store.getState();
            const programStages = getOr([], 'programStages', state);
            const programStage = getProgramStageToModify(get('payload.programStage', action), programStages);
            const programStageDataElements = getOr([], 'programStageDataElements', programStage);

            const newDataElementOrder = get('payload.newDataElementOrder', action);
            programStage.programStageDataElements = programStageDataElements
                .map((dataElement) => {
                    dataElement.sortOrder = findIndex(id => id === get('dataElement.id', dataElement), newDataElementOrder);

                    return dataElement;
                });

            store.setState({
                programStages,
            });
        })
        .mapTo({ type: PROGRAM_STAGE_DATA_ELEMENTS_ORDER_CHANGE_COMPLETE });

const changeProgramStageSectionName = store => action$ => action$
        .ofType(PROGRAM_STAGE_SECTION_NAME_EDIT)
        .map((action) => {
            const state = store.getState();
            const programStageSectionId = get('payload.programStageSectionId', action);
            const newProgramStageSectionName = get('payload.newProgramStageSectionName', action);

            const programStageSections = getOr([], 'programStageSections', state)
                .map((section) => {
                    // Modify the original Model instance
                    if (isEqual(section.id, programStageSectionId)) {
                        section.name = newProgramStageSectionName;
                        section.displayName = newProgramStageSectionName;
                    }

                    return section;
                });

            store.setState({
                programStageSections,
            });
        })
        .flatMapTo(Observable.never());

const setSortOrderToIndex = models => models.map((model, index) => {
    model.sortOrder = index;

    return model;
});

const changeProgramStageSectionOrder = store => action$ => action$
        .ofType(PROGRAM_STAGE_SECTIONS_ORDER_CHANGE)
        .map((action) => {
            const newSections = get('payload.programStageSections', action);
            const programStageSections = compose(sortBy('sortOrder'), setSortOrderToIndex)(newSections);

            store.setState({
                programStageSections,
            });
        })
        .flatMapTo(Observable.never());

const addProgramStageSection = store => action$ => action$
        .ofType(PROGRAM_STAGE_SECTIONS_ADD)
        .combineLatest(d2$, (action, d2) => ([d2, action]))
        .map(([d2, action]) => {
            const state = store.getState();
            const newSectionName = get('payload.newSectionName', action);
            const programStageSections = getOr([], 'programStageSections', state);
            const sortOrder = getOr(-1, 'sortOrder', maxBy(section => get('sortOrder', section), programStageSections)) + 1;

            const programStage = get('programStages[0]', state);

            // Create new section model and set the properties we can
            const newSection = d2.models.programStageSection.create({ id: generateUid(), dataElements: [] });
            newSection.name = newSectionName;
            newSection.displayName = newSectionName;
            newSection.sortOrder = sortOrder;

            // Add the section to the programStage, otherwise the section won't be associated with the programStage
            newSection.programStage = programStage;
            // Add the inverse relationship so the section gets associated correctly
            // Using the  programStageSection -> programStage relationship is not sufficient and the programStage -> programStageSection is the required relationship.Th
            programStage.programStageSections.add(newSection);

            const updatedProgramStageSections = getOr([], 'programStageSections', state).concat(newSection);

            store.setState({
                programStageSections: updatedProgramStageSections,
            });
        })
        .flatMapTo(Observable.never());


const removeProgramStageSection = store => action$ => action$
        .ofType(PROGRAM_STAGE_SECTIONS_REMOVE)
        .map((action) => {
            // TODO: Update sortOrder? map(section => ({ ...section, sortOrder: section.sortOrder - 1 }), filter(section => section.sortOrder > sortOrderOfDeletedSection, sections));
            const state = store.getState();
            const sectionToDelete = get('payload.programStageSectionId', action);

            const programStageSections = getOr([], 'programStageSections', state);
            const updatedProgramStageSections = filter(section => !isEqual(sectionToDelete, section.id), programStageSections);

            // Remove section from programStage
            const programStage = get('programStages[0]', state);
            programStage.programStageSections = updatedProgramStageSections;

            store.setState({
                programStageSections: updatedProgramStageSections,
            });
        })
        .flatMapTo(Observable.never());

export default function createEpicsForStore(store) {
    return combineEpics(
        changeProgramStageDataElementOrder(store),
        changeProgramStageSectionName(store),
        changeProgramStageSectionOrder(store),
        addProgramStageSection(store),
        removeProgramStageSection(store),
    );
}
