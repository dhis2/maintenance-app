import { Observable } from 'rxjs';
import { combineEpics } from 'redux-observable';
import { get, getOr, compose, isEqual, findIndex, maxBy, filter, sortBy } from 'lodash/fp';
import { generateUid } from 'd2/lib/uid';
import { getInstance } from 'd2/lib/d2';
import {
    PROGRAM_SECTIONS_ORDER_CHANGE,
    PROGRAM_SECTIONS_ADD,
    PROGRAM_SECTIONS_REMOVE,
    PROGRAM_SECTION_UPDATE,
} from './actions';
import snackActions from '../../../../../Snackbar/snack.actions'
const d2$ = Observable.fromPromise(getInstance());

const updateProgramSection = store => action$ => action$
        .ofType(PROGRAM_SECTION_UPDATE)
        .map((action) => {
            const state = store.getState();
            const programSectionId = get('payload.programSectionId', action);
            const newProgramStageSectionData = get('payload.newProgramSectionData', action);

            state.programSections.map((section) => {
                    // Modify the original Model instance
                    if (isEqual(section.id, programSectionId)) {
                        section.name = newProgramStageSectionData.name;
                        section.displayName = newProgramStageSectionData.name;
                        section.description = newProgramStageSectionData.description;
                        section.renderType = newProgramStageSectionData.renderType;
                    }

                    return section;
                });

            store.setState(
                state
            );
        })
        .flatMapTo(Observable.never());

const setSortOrderToIndex = models => models.map((model, index) => {
    model.sortOrder = index;

    return model;
});

const changeProgramSectionOrder = store => action$ => action$
        .ofType(PROGRAM_SECTIONS_ORDER_CHANGE)
        .map((action) => {
            const state = store.getState();
            const newSections = get('payload.programSections', action);

            const sortedSections = compose(sortBy('sortOrder'), setSortOrderToIndex)(newSections);
            sortedSections.map(s => {
                s.dirty = true;
                return s
            })
            state.programSections = sortedSections;

            store.setState(
                state
            );
        })
        .flatMapTo(Observable.never());

const addProgramSection = store => action$ => action$
        .ofType(PROGRAM_SECTIONS_ADD)
        .combineLatest(d2$)
        .map(([action, d2]) => {
            const state = store.getState();
            const program = state.program;
            const newSectionData = get('payload.newSectionData', action);
            
            const programSections = state.programSections;
            const sortOrder = getOr(-1, 'sortOrder', maxBy(section => get('sortOrder', section), programSections)) + 1;

            // Create new section model and set the properties we can
            const newSection = d2.models.programSection.create({ id: generateUid() });
            newSection.name = newSectionData.name;
            newSection.displayName = newSectionData.name;
            newSection.description = newSectionData.description;
            newSection.renderType = newSectionData.renderType;
            newSection.sortOrder = sortOrder;

            console.log(newSection);

            // Add the section to the programStage, otherwise the section won't be associated with the programStage
            newSection.program = program;
            // Add the inverse relationship so the section gets associated correctly
            // Using the  programStageSection -> programStage relationship is not sufficient and the programStage -> programStageSection is the required relationship.Th
            program.programSections.add(newSection);
            programSections.push(newSection);

            store.setState(state);
        })
        .flatMapTo(Observable.never());


const removeProgramSection = store => action$ => action$
        .ofType(PROGRAM_SECTIONS_REMOVE)
        .map(async (action) => {
            // TODO: Update sortOrder? map(section => ({ ...section, sortOrder: section.sortOrder - 1 }), filter(section => section.sortOrder > sortOrderOfDeletedSection, sections));
            const state = store.getState();
            const program = state.program;
            const sectionToDelete = get('payload.programSection', action);
            const programSections = state.programSections;
            const updatedProgramStageSections = filter(section => !isEqual(sectionToDelete.id, section.id), programSections);

            if(sectionToDelete.lastUpdated) { //undefined if not saved to server yet
                try {
                    await sectionToDelete.delete()
                    snackActions.show({message: 'section_deleted', translate: true })
                } catch(e) {
                    console.error(e)
                    snackActions.show({message: 'failed_to_delete_section', translate: true })
                    return;
                }
            }
           
            // Remove section from programStage and normalized-store
            program.programSections.remove(sectionToDelete);
            state.programSections = updatedProgramStageSections;
            store.setState(
                state
            );
        })
        .flatMapTo(Observable.never());

export default function createEpicsForStore(store) {
    return combineEpics(
        updateProgramSection(store),
        changeProgramSectionOrder(store),
        addProgramSection(store),
        removeProgramSection(store),
    );
}
