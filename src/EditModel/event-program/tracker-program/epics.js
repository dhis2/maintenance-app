import { get, set, curry } from 'lodash/fp';
import log from 'loglevel';
import { Observable } from 'rxjs';
import { combineEpics } from 'redux-observable';

import { generateUid } from 'd2/lib/uid';
import { getInstance } from 'd2/lib/d2';

import programStore from '../eventProgramStore';
import { deleteProgramStageWithSnackbar } from './program-stages/contextActions';
import {
    editProgramStage,
    PROGRAM_STAGE_ADD,
    PROGRAM_STAGE_DELETE,
    PROGRAM_STAGE_EDIT,
    PROGRAM_STAGE_EDIT_CANCEL,
    PROGRAM_STAGE_EDIT_RESET,
    PROGRAM_STAGE_EDIT_SAVE,
    deleteProgramStageSuccess,
    deleteProgramStageError,
} from './program-stages/actions';

const d2$ = Observable.fromPromise(getInstance());

const getProgramStageById = curry((stageId, store) =>
    store.programStages.find(stage => stage.id == stageId),
);

const getProgramStageIndexById = curry((stageId, store) =>
    store.programStages.findIndex(stage => stage.id == stageId),
);

/**
 * Deletes a programStage from state by id.
 * @param stageId to delete
 * @param shouldSetState flag to indicate if the function should set the state.
 * If not, the function can be used to get the "setter"-object to use with setState.
 * And is useful if you are setting the state manually later. Default true
 * @returns {*} the state that should be modified, to use as a setter for store.setState().
 */
export const deleteProgramStageFromState = (stageId, shouldSetState = true) => {
    const state = programStore.getState();
    const programStage = getProgramStageById(stageId, state);
    const index = getProgramStageIndexById(stageId, state);
    const program = state.program;
    const removedFromProgramStages = state.programStages.filter(
        (p, i) => i !== index,
    );

    program.programStages.remove(programStage);
    const setters = set('program', program)(
        set('programStages', removedFromProgramStages, state),
    );
    shouldSetState && programStore.setState(setters);
    return setters;
};

export const newTrackerProgramStage = action$ =>
    action$.ofType(PROGRAM_STAGE_ADD).flatMap(action => d2$.flatMap(d2 =>
        programStore.take(1).map((store) => {
            const programStages = store.programStages;
            const program = store.program;
            const programStageUid = generateUid();
            const programStageModel = d2.models.programStages.create({
                id: programStageUid,
                programStageDataElements: [],
                notificationTemplates: [],
                programStageSections: [],
                program: {
                    id: program.id,
                },
                lastUpdated: new Date().toISOString(),
                displayGenerateEventBox: true,
                autoGenerateEvent: true,
            });
            try {
                const newProgramStage = programStages.push(
                    programStageModel,
                );

                const newProgramStageCollection = store.program.programStages.add(
                    programStageModel,
                );
                program.programStages = newProgramStageCollection;
                programStore.setState(
                    set('program', program)(
                        set(
                            'programStages',
                            programStages,
                            programStore.getState(),
                        ),
                    ),
                );
            } catch (e) {
                log.error(e);
                throw new Error(e);
            }
            return editProgramStage(programStageUid);
        }),
    ));

/* Gets called when user starts to edit a TrackerProgramStage.
*  Copies the original model, that is used if the user cancels editing of the model */
export const editTrackerProgramStage = action$ =>
    action$
        .ofType(PROGRAM_STAGE_EDIT)
        .map(action => action.payload)
        .flatMap(({ stageId }) =>
            programStore
                .take(1)
                .map(get('programStages'))
                .map((programStages) => {
                    const index = programStages.findIndex(
                        stage => stage.id == stageId,
                    );
                    const programStage = programStages[index];

                    const model = programStages[index].clone();
                    const setter = set(
                        'programStageToEditCopy',
                        model,
                        programStore.getState(),
                    );

                    programStore.setState(setter);
                }),
        )
        .flatMapTo(Observable.of({ type: 'EMPTY' }));

export const saveTrackerProgramStage = action$ =>
    action$
        .ofType(PROGRAM_STAGE_EDIT_SAVE)
        .flatMap(action =>
            programStore.take(1).map((store) => {
                const stageId = store.programStageToEditCopy.id;
                const index = store.programStages.findIndex(
                    stage => stage.id == stageId,
                );

                if (index < 0) {
                    log.warn(`ProgramStage with id ${stageId} does not exist`);
                }
                try {
                    programStore.setState({
                        programStageToEditCopy: null,
                    });
                } catch (e) {
                    log.error(e);
                }
            }),
        )
        .flatMapTo(Observable.of({ type: PROGRAM_STAGE_EDIT_RESET }));

export const cancelProgramStageEdit = action$ =>
    action$
        .ofType(PROGRAM_STAGE_EDIT_CANCEL)
        .flatMap(() =>
            programStore.take(1).map((store) => {
                try {
                    const stageId = store.programStageToEditCopy.id;
                    const index = getProgramStageIndexById(stageId)(store);

                    if (index < 0) {
                        log.warn(
                            `ProgramStage with id ${stageId} does not exist`,
                        );
                    }
                    const model = store.programStageToEditCopy;
                    let programStageSetter = set(
                        `programStages[${index}]`,
                        model,
                        store,
                    );
                    // If the programstage is new, remove it when cancelling
                    if (model.name === undefined) {
                        const removedFromProgramStages = store.programStages.filter(
                            (p, i) => i !== index,
                        );
                        programStageSetter = deleteProgramStageFromState(
                            stageId,
                            false,
                        );
                    }
                    programStore.setState(
                        set('programStageToEditCopy', null, programStageSetter),
                    );
                } catch (e) {
                    log.error(e);
                }
            }),
        )
        .flatMapTo(Observable.of({ type: PROGRAM_STAGE_EDIT_RESET }));

const deleteProgramStage = action$ =>
    action$
        .ofType(PROGRAM_STAGE_DELETE)
        .map(action => action.payload)
        .flatMap(action =>
            programStore.take(1).map((store) => {
                try {
                    const ind = store.programStages.findIndex(
                        stage => stage.id == action.stageId,
                    );

                    const index = getProgramStageIndexById(action.stageId)(
                        store,
                    );
                    const model = store.programStages[index];

                    deleteProgramStageWithSnackbar(model);
                    return deleteProgramStageSuccess();
                } catch (e) {
                    return deleteProgramStageError();
                }
            }),
        );

export default combineEpics(
    newTrackerProgramStage,
    editTrackerProgramStage,
    saveTrackerProgramStage,
    cancelProgramStageEdit,
    deleteProgramStage,
);
