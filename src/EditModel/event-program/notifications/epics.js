import { NOTIFICATION_STAGE_REMOVE, removeStateNotificationSuccess, removeStateNotificationError } from './actions';
import { Observable } from 'rxjs';

export const removeProgramStageNotification = action$ => action$
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
