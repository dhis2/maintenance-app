import { NOTIFICATION_STAGE_REMOVE, NOTIFICATION_STAGE_SAVE, NOTIFICATION_SET_ADD_MODEL, removeStateNotificationSuccess, removeStateNotificationError, setEditModel, saveStageNotificationSuccess, saveStageNotificationError, NOTIFICATION_PROGRAM_SAVE } from './actions';
import { Observable } from 'rxjs';
import { combineEpics } from 'redux-observable';
import { getInstance } from 'd2/lib/d2';
import { getStageNotifications, getStageNotificationsForProgramStageId } from './selectors';
import { getProgramStageById } from "../tracker-program/program-stages/selectors";
import eventProgramStore from '../eventProgramStore';
import { equals, first, negate, some, get, compose, find, identity, map, __, pick } from 'lodash/fp';
import { generateUid } from 'd2/lib/uid';

// notEqualTo :: any -> any -> Boolean
const notEqualTo = left => right => left !== right;

/** Selector to get the programStage-id from the model.
 * @param state the programState.
 * @param model programNotification model with programStage property.
 * @returns {*} The programStage model that the notification is part of, or the first programStage if
 * programStage is not defined on the notification.
 */
const getProgramStageFromModel = (state, model) => model.programStage && model.programStage.id ? getProgramStageById(state, model.programStage.id) :
    first(programStages);

const removeProgramStageNotification = action$ => action$
    .ofType(NOTIFICATION_STAGE_REMOVE)
    .flatMap(({ payload: model }) => Observable.of(model)
        .flatMap(model => eventProgramStore
            .take(1)
            .map((eventProgramState) => {
                const { programStageNotifications } = eventProgramState;
                const programStage = getProgramStageFromModel(eventProgramState, model);
                const stageNotifications = getStageNotificationsForProgramStageId(eventProgramState, programStage.id);

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
                const programStage = getProgramStageFromModel(eventProgramState, model);

                let stageNotifications = getStageNotificationsForProgramStageId(eventProgramState, programStage.id)
                // If we're dealing with a new model we have to add it to the notification lists
                // Both on the notification list on the programStage and on the eventStore
                if (negate(find(equals(model)))(stageNotifications)) {
                    programStage.notificationTemplates.add(model);
                    //Add empty stageNotifications if its a new programStage
                    if(!stageNotifications) {
                        stageNotifications = eventProgramState.programStageNotifications[programStage.id] = [];
                    }
                    stageNotifications.push(model);
                }

                return Observable.of(eventProgramState);
            })
            .map(eventProgramState => eventProgramStore.setState(eventProgramState))
            .mapTo(Observable.of(saveStageNotificationSuccess(), setEditModel(null)))
            .mergeAll()
            .catch(error => Observable.of(saveStageNotificationError(error)))
    ));

const setProgramStageNotificationAddModel = (action$, store) => action$
    .ofType(NOTIFICATION_SET_ADD_MODEL)
    .combineLatest(Observable.fromPromise(getInstance()), ({ payload }, d2) => ({ model: payload.model, notificationType: payload.notificationType, d2 }))
    .map(({ d2, notificationType }) => {
        const model = d2.models.programNotificationTemplate.create();
        const psStore = eventProgramStore.getState();


        // Set default values
        model.id = generateUid();
        model.lastUpdated = new Date().toISOString();
        if(notificationType == 'PROGRAM_NOTIFICATION') {
            return setEditModel(model, 'PROGRAM_NOTIFICATION');
        }

        //set default to first programStage
        model.programStage = pick('id', first(psStore.programStages))

        return setEditModel(model);
    });

const saveProgramNotification = (action$, store) => action$
    .ofType(NOTIFICATION_PROGRAM_SAVE)
    // FIXME: Remove href hack when d2 is fixed
    .do(({ payload: {model} }) => {
        model.dataValues.href = `${model.modelDefinition.apiEndpoint}/${model.id}`;
    })
    .mergeMap(({ payload: {model} }) => (
        eventProgramStore
            .take(1)
            .flatMap((eventProgramState) => {
                const { program, programNotifications } = eventProgramState;

                // If we're dealing with a new model we have to add it to the notification lists
                if (negate(find(equals(model)))(program)) {
                    program.notificationTemplates.add(model);
                }

                return Observable.of(eventProgramState);
            })
            .map(eventProgramState => eventProgramStore.setState(eventProgramState))
            .mapTo(Observable.of(saveStageNotificationSuccess(), setEditModel(null)))
            .mergeAll()
            .catch(error => Observable.of(saveStageNotificationError(error)))
    ));



export default combineEpics(removeProgramStageNotification, setProgramStageNotificationAddModel, saveProgramStageNotification, saveProgramNotification);
