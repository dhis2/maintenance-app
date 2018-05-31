import { Observable } from 'rxjs';
import { combineEpics } from 'redux-observable';
import { get, getOr, compose, first, filter, identity } from 'lodash/fp';
import { getInstance } from 'd2/lib/d2';

import { notifyUser } from '../actions';
import programIndicatorStore, { isStoreStateDirty } from './programIndicatorStore';
import { requestParams } from '../SingleModelStore';
import { addChangedFieldValueToModel } from '../epicHelpers';
import { getModelFromStore } from './selectors';
import { createFieldConfigForModelTypes } from '../form-helpers/modelFieldConfigCreator';
import getFirstInvalidFieldMessage from '../form-helpers/validateFields';
import { addValuesToFieldConfigs } from '../form-helpers/schemaFieldConfigCreator';
import fieldOrder from '../../config/field-config/field-order';
import { goToAndScrollUp } from '../../router-utils';
import {
    PROGRAM_INDICATOR_LOAD,
    PROGRAM_INDICATOR_SAVE_AND_VALIDATE,
    PROGRAM_INDICATOR_SAVE,
    PROGRAM_INDICATOR_SAVE_SUCCESS,
    PROGRAM_INDICATOR_SAVE_ERROR,
    PROGRAM_INDICATOR_TO_EDIT_FIELD_CHANGED,
    editFieldChangeDone,
    loadProgramIndicatorSuccess,
    saveProgramIndicator,
    saveProgramIndicatorSuccess,
    saveProgramIndicatorError,
} from './actions';

function loadProgramIndicator(programIndicatorId) {
    return Observable.fromPromise(
        getInstance()
            .then((d2) => {
                if (programIndicatorId === 'add') {
                    return d2.models.programIndicator.create();
                }
                return d2.models.programIndicator.get(
                    programIndicatorId, requestParams.get('programIndicator'));
            })
            .then(programIndicator => ({ programIndicator })),
    );
}

function loadProgramIndicatorFieldConfigs() {
    return Observable.fromPromise(
        createFieldConfigForModelTypes(
            'programIndicator',
            fieldOrder.for('programIndicator'),
            false,
            undefined,
        ).then(fieldConfigs => fieldConfigs),
    );
}

const addModelValuesToFieldConfigs = store =>
    fieldConfigs => addValuesToFieldConfigs(
        fieldConfigs,
        getModelFromStore(store),
    );

const handleMessageResults = store => (message) => {
    if (message) {
        return Observable.of(notifyUser({ message, action: 'ok' }));
    }

    if (!isStoreStateDirty(store)) {
        return Observable.of(notifyUser({ message: 'no_changes_to_be_saved', translate: true }))
            .do(() => goToAndScrollUp('/list/indicatorSection/programIndicator'));
    }

    return Observable.of(saveProgramIndicator());
};

export const programIndicatorLoad = pIStore => action$ => action$
    .ofType(PROGRAM_INDICATOR_LOAD)
    .map(get('payload.id'))
    .mergeMap(loadProgramIndicator)
    .map(storeState => pIStore.setState(storeState))
    .mergeMap(loadProgramIndicatorFieldConfigs)
    .map(addModelValuesToFieldConfigs(pIStore))
    .map(fieldConfigs => loadProgramIndicatorSuccess(fieldConfigs));

export const programIndicatorEdit = pIStore => action$ => action$
    .ofType(PROGRAM_INDICATOR_TO_EDIT_FIELD_CHANGED)
    .map(action => action.payload)
    .mergeMap(payload => addChangedFieldValueToModel(payload, pIStore, 'programIndicator'))
    .mergeMap(loadProgramIndicatorFieldConfigs)
    .map(addModelValuesToFieldConfigs(pIStore))
    .map(fieldConfigs => editFieldChangeDone(fieldConfigs));

export const programIndicatorSaveAndValidate = pIStore => action$ => action$
    .ofType(PROGRAM_INDICATOR_SAVE_AND_VALIDATE)
    .map(action => action.payload)
    .map(({ fieldConfigs, formRef }) => getFirstInvalidFieldMessage(fieldConfigs, formRef))
    .mergeMap(handleMessageResults(pIStore));

export const programIndicatorSave = pIStore => action$ => action$
    .ofType(PROGRAM_INDICATOR_SAVE)
    .mapTo(pIStore)
    .map(getModelFromStore)
    .mergeMap(programIndicator => Observable
        .fromPromise(programIndicator.save())
        .mapTo(saveProgramIndicatorSuccess())
        .do(() => goToAndScrollUp('/list/indicatorSection/programIndicator'))
        .catch(error => Observable.of(saveProgramIndicatorError(error))),
    );

const extractFirstMessageFromErrorReports = compose(get('message'), first, getOr([], 'errorReports'), get('response'));
const extractFirstMessageFromMessages = compose(get('message'), first, get('messages'));
const firstNotUndefinedIn = compose(first, filter(identity));

function extractFirstErrorMessage(response) {
    const messages = [
        extractFirstMessageFromErrorReports(response),
        extractFirstMessageFromMessages(response),
    ];

    return firstNotUndefinedIn(messages);
}

export const programIndicatorModelSaveResponses = action$ => Observable
    .merge(
        action$
            .ofType(PROGRAM_INDICATOR_SAVE_SUCCESS)
            .mapTo(notifyUser({ message: 'success', action: 'ok', translate: true })),
        action$
            .ofType(PROGRAM_INDICATOR_SAVE_ERROR)
            .map((action) => {
                const firstErrorMessage = extractFirstErrorMessage(action.payload);

                return notifyUser({ message: firstErrorMessage, translate: false });
            }),
    );

export default (function createEpicsForStore(store) {
    return combineEpics(
        programIndicatorLoad(store),
        programIndicatorEdit(store),
        programIndicatorSaveAndValidate(store),
        programIndicatorSave(store),
        programIndicatorModelSaveResponses,
    );
}(programIndicatorStore));
