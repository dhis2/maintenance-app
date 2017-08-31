import { Observable } from 'rxjs';
import { combineEpics } from 'redux-observable';
import { getInstance } from 'd2/lib/d2';
import { isString } from 'lodash/fp';
import { SNACK_BAR_MESSAGE_SHOW_REQUEST, SNACK_BAR_MESSAGE_SHOW, showSnackBarMessage, requestShowSnackBarMessage } from './actions';
import { NOTIFY_USER } from '../EditModel/actions';
import snackActions from './snack.actions';

const d2$ = Observable.fromPromise(getInstance());

const snackBarEpic = (action$) => {
    const snackBarShowRequests$ = action$
        .ofType(SNACK_BAR_MESSAGE_SHOW_REQUEST)
        .map(({ payload }) => payload);

    return Observable
        .merge(
            snackBarShowRequests$.filter(({ translate }) => !translate),
            snackBarShowRequests$.filter(({ translate }) => translate)
                .combineLatest(d2$, (payload, d2) => ({
                    ...payload,
                    translate: false,
                    message: d2.i18n.getTranslation(payload.message),
                }))
        )
        .map(payload => showSnackBarMessage(payload));
};

const showSnackBarMessageEpic = action$ => action$
    .ofType(SNACK_BAR_MESSAGE_SHOW)
    .do(({ payload: message }) => snackActions.show(message))
    .mergeMapTo(Observable.empty());

const notifyEpic = action$ => action$
    .ofType(NOTIFY_USER)
    .map(({ payload }) => {
        if (isString(payload)) {
            return { message: payload, translate: true };
        }

        return payload;
    })
    .map(requestShowSnackBarMessage);

export default combineEpics(snackBarEpic, showSnackBarMessageEpic, notifyEpic);
