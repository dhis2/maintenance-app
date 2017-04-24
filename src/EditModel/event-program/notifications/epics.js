import { NOTIFICATION_STAGE_REMOVE, NOTIFICATION_STAGE_SAVE, NOTIFICATION_STAGE_SET_ADD_MODEL, removeStateNotificationSuccess, removeStateNotificationError, setEditModel, saveStageNotificationSuccess, saveStageNotificationError } from './actions';
import { Observable } from 'rxjs';
import { combineEpics } from 'redux-observable';
import { getInstance } from 'd2/lib/d2';
import { getStageNotifications } from './selectors';
import eventProgramStore from '../eventProgramStore';
import { equals, first, negate, some, get, compose, find, identity, map, __ } from 'lodash/fp';
import { generateUid } from 'd2/lib/uid';

// notEqualTo :: any -> any -> Boolean
const notEqualTo = left => right => left !== right;

const removeProgramStageNotification = action$ => action$
    .ofType(NOTIFICATION_STAGE_REMOVE)
    .flatMap(({ payload: model }) => Observable.of(model)
        .flatMap(model => eventProgramStore
            .take(1)
            .map(eventProgramState => {
                const { programStages, programStageNotifications } = eventProgramState;
                const programStage = first(programStages);
                const stageNotifications = getStageNotifications({ programStages, programStageNotifications });

                // Remove the model from both the lists (store and programStage property collection)
                programStage.notificationTemplates.remove(model);
                programStageNotifications[programStage.id] = stageNotifications.filter(notEqualTo(model));

                eventProgramStore.setState(eventProgramState);
            })
        )
    )
    .flatMapTo(Observable.never());

const saveProgramStageNotification = (action$, store) => action$
    .ofType(NOTIFICATION_STAGE_SAVE)
    // FIXME: Remove href hack when d2 is fixed
    .do(({ payload: model }) => {
        model.dataValues.href = `${model.modelDefinition.apiEndpoint}/${model.id}`;
    })
    .mergeMap(({ payload: model }) => (
        eventProgramStore
            .take(1)
            .flatMap((eventProgramState) => {
                const { programStages, programStageNotifications } = eventProgramState;
                const programStage = first(programStages);
                const stageNotifications = getStageNotifications({ programStages, programStageNotifications });

                // If we're dealing with a new model we have to add it to the notification lists
                // Both on the notification list on the programStage and on the eventStore
                if (negate(find(equals(model)))(stageNotifications)) {
                    programStage.notificationTemplates.add(model);
                    stageNotifications.push(model);
                }

                return Observable.of(eventProgramState);
            })
            .map(eventProgramState => eventProgramStore.setState(eventProgramState))
            .mapTo(Observable.of(saveStageNotificationSuccess(), setEditModel(null)))
            .mergeAll()
            .catch(() => Observable.of(saveStageNotificationError()))
    ));

const setProgramStageNotificationAddModel = (action$, store) => action$
    .ofType(NOTIFICATION_STAGE_SET_ADD_MODEL)
    .combineLatest(Observable.fromPromise(getInstance()), ({ payload }, d2) => ({ model: payload, d2 }))
    .map(({ d2 }) => {
        const model = d2.models.programNotificationTemplate.create();

        // Set default values
        model.id = generateUid();
        model.lastUpdated = new Date().toISOString();

        return setEditModel(model);
    });

export default combineEpics(removeProgramStageNotification, setProgramStageNotificationAddModel, saveProgramStageNotification);
