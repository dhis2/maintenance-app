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
import { get, set } from 'lodash/fp';
import programStore from '../eventProgramStore';
import { combineEpics } from 'redux-observable';
import { generateUid } from 'd2/lib/uid';
import { Observable } from 'rxjs';
import { getInstance } from 'd2/lib/d2';
import { deleteProgramStageWithSnackbar } from './program-stages/contextActions';

const d2$ = Observable.fromPromise(getInstance());

const getProgramStageById = stageId => store =>
    store.programStages.find(stage => stage.id == stageId);
const getProgramStageIndexById = stageId => store =>
    store.programStages.findIndex(stage => stage.id == stageId);

export const newTrackerProgramStage = action$ =>
    action$.ofType(PROGRAM_STAGE_ADD).flatMap(action => {
        return d2$.flatMap(d2 =>
            programStore.take(1).map(store => {
                const programStages = store.programStages;
                const program = store.program;
                const programStageUid = generateUid();
                const newProgramStage = programStages.push(
                    d2.models.programStages.create({
                        id: programStageUid,
                        programStageDataElements: [],
                        notificationTemplates: [],
                        programStageSections: [],
                        program: {
                            id: program.id,
                        },
                        lastUpdated: new Date().toISOString(),
                    })
                );
                const newState = { ...programStore.getState() };
                programStore.setState(
                    set('programStages')(programStages, newState),
                    set('program.programStages')(programStages, newState)
                );
                return editProgramStage(programStageUid);
            })
        );
    });

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
                .map(programStages => {
                    const index = programStages.findIndex(
                        stage => stage.id == stageId
                    );
                    const model = programStages[index].clone();
                    const setter = { programStageToEditCopy: model };

                    programStore.setState(setter);
                })
        )
        .flatMapTo(Observable.of({ type: 'EMPTY' }));

export const saveTrackerProgramStage = action$ =>
    action$
        .ofType(PROGRAM_STAGE_EDIT_SAVE)
        .flatMap(action =>
            programStore.take(1).map(store => {
                const stageId = store.programStageToEditCopy.id;
                const index = store.programStages.findIndex(
                    stage => stage.id == stageId
                );
                if (index < 0) {
                    console.warn(
                        `ProgramStage with id ${stageId} does not exist`
                    );
                }
                try {
                    programStore.setState({
                        programStageToEditCopy: null,
                    });
                } catch (e) {
                    console.log(e);
                }
            })
        )
        .flatMapTo(Observable.of({ type: PROGRAM_STAGE_EDIT_RESET }));

export const cancelProgramStageEdit = action$ =>
    action$
        .ofType(PROGRAM_STAGE_EDIT_CANCEL)
        .flatMap(() =>
            programStore.take(1).map(store => {
                const stageId = store.programStageToEditCopy.id;
                const index = getProgramStageIndexById(stageId);
                if (index < 0) {
                    console.warn(
                        `ProgramStage with id ${stageId} does not exist`
                    );
                }
                const model = store.programStageToEditCopy;
                try {
                    programStore.setState(
                        set(`programStages[${index}]`)(model, {
                            ...programStore.getState(),
                        }),
                        set(
                            'programStageToEditCopy',
                            null,
                            programStore.getState()
                        )
                    );
                } catch (e) {
                    console.log(e);
                }
            })
        )
        .flatMapTo(Observable.of({ type: PROGRAM_STAGE_EDIT_RESET }));

const deleteProgramStage = action$ =>
    action$
        .ofType(PROGRAM_STAGE_DELETE)
        .map(action => action.payload)
        .flatMap(action =>
            programStore.take(1).map(store => {
                try {
                    const ind = store.programStages.findIndex(
                        stage => stage.id == action.stageId
                    );

                    const index = getProgramStageIndexById(action.stageId)(
                        store
                    );
                    const model = store.programStages[index];

                    deleteProgramStageWithSnackbar(model, index);
                    return deleteProgramStageSuccess();
                } catch (e) {
                    return deleteProgramStageError();
                }
            })
        );

export default combineEpics(
    newTrackerProgramStage,
    editTrackerProgramStage,
    saveTrackerProgramStage,
    cancelProgramStageEdit,
    deleteProgramStage
);
