import { Observable } from 'rxjs';
import { combineEpics } from 'redux-observable';
import { getInstance } from 'd2/lib/d2';
import { SNACK_BAR_MESSAGE_SHOW_REQUEST, showSnackBarMessage } from './actions';

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

export default combineEpics(snackBarEpic);
