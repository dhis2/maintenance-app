import { NOTIFICATION_STAGE_REMOVE, NOTIFICATION_STAGE_SAVE, NOTIFICATION_STAGE_SET_ADD_MODEL, removeStateNotificationSuccess, removeStateNotificationError, setEditModel, saveStageNotificationSuccess, saveStageNotificationError } from './actions';
import { Observable } from 'rxjs';
import { combineEpics } from 'redux-observable';
import { getInstance } from 'd2/lib/d2';
import { getStageNotifications } from './selectors';
import eventProgramStore from '../eventProgramStore';

const removeProgramStageNotification = action$ => action$
    .ofType(NOTIFICATION_STAGE_REMOVE)
    .flatMap(({ payload: model }) => Observable.of(model)
            .flatMap(model => Observable.fromPromise(
                model.delete()
                    .then(() => removeStateNotificationSuccess(model))
                    .catch(removeStateNotificationError)
            ))
            .retry(1)
            .timeoutWith(5000, Observable.of(removeStateNotificationError(new Error(`Deletion of ${model.displayName} timed out.`))))
    );

const saveProgramStageNotification = (action$, store) => action$
    .ofType(NOTIFICATION_STAGE_SAVE)
    // FIXME: Remove href hack when d2 is fixed
    .do(({ payload: model }) => {
        model.dataValues.href = `${model.modelDefinition.apiEndpoint}/${model.id}`;
    })
    .mergeMap(({ payload: model }) => (
        Observable.zip(
            eventProgramStore
                .take(1)
                .map(state => state.program),
            Observable.fromPromise(model.save()),
            (program, saveResult) => ({ program, saveResult })
        )
            // FIXME: Side effects are not cool :(
            .do(({ program }) => {
                const stageNotifications = getStageNotifications(program);

                // If model is not present in the stage notifications load it and add it
                if (!stageNotifications.has(model.id)) {
                    model.modelDefinition.get(model.id)
                        .then((addedModel) => {
                            stageNotifications.add(addedModel);
                            // FIXME: Hack to mark programModel as dirty
                            program.dirty = true;

                            eventProgramStore.setState({
                                ...eventProgramStore.getState(),
                                program,
                            });
                        });
                }
            })
            .mapTo(Observable.of(saveStageNotificationSuccess(), setEditModel(null)))
            .mergeAll()
            .catch(() => Observable.of(saveStageNotificationError()))
    ));

const setProgramStageNotificationAddModel = (action$, store) => action$
    .ofType(NOTIFICATION_STAGE_SET_ADD_MODEL)
    .combineLatest(Observable.fromPromise(getInstance()), ({ payload }, d2) => ({ model: payload, d2 }))
    .map(({ d2 }) => setEditModel(d2.models.programNotificationTemplate.create()));

export default combineEpics(removeProgramStageNotification, setProgramStageNotificationAddModel, saveProgramStageNotification);
