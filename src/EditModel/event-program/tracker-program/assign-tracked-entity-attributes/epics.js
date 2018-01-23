import { PROGRAM_ATTRIBUTES_ADD, PROGRAM_ATTRIBUTES_REMOVE, PROGRAM_ATTRIBUTES_ADDREMOVE_COMPLETE, PROGRAM_ATTRIBUTES_EDIT, PROGRAM_ATTRIBUTES_EDIT_COMPLETE } from './actions';
import { combineEpics } from 'redux-observable';
import { getOr, get, map, find, compose, isEqual, includes, negate, filter, __ } from 'lodash/fp';
import { generateUid } from 'd2/lib/uid';

const programAttributeExistsInAttributeUidList = uids => compose(includes(__, uids), get('trackedEntityAttribute.id'));
const keepProgramAttributesNotInUidList = uids => filter(negate(programAttributeExistsInAttributeUidList(uids)));

const addAttributeToProgram = store => action$ => action$
        .ofType(PROGRAM_ATTRIBUTES_ADD)
        .map((action) => {
            const state = store.getState();

            const program = getOr([], 'program', state);
            const programAttributes = getOr([], 'programTrackedEntityAttributes', program);
            const attributesIdsToAdd = getOr([], 'payload.attributes', action);
            const attributesToAdd = map(id => ({
                id: generateUid(),
                trackedEntityAttribute: {
                    id,
                },
            }), attributesIdsToAdd);

            program.programTrackedEntityAttributes = programAttributes.concat(attributesToAdd);
            store.setState({
                ...store.getState(),
                program,
            });
        })
        .mapTo({ type: PROGRAM_ATTRIBUTES_ADDREMOVE_COMPLETE });

const removeAttributeFromProgram = store => action$ => action$
        .ofType(PROGRAM_ATTRIBUTES_REMOVE)
        .map((action) => {
            const state = store.getState();
            const program = getOr([], 'program', state);
            const programAttributes = getOr([], 'programTrackedEntityAttributes', program);
            const attributeIdsToRemove = getOr([], 'payload.attributes', action);
            const removeAttributes = keepProgramAttributesNotInUidList(attributeIdsToRemove);
            program.programTrackedEntityAttributes = removeAttributes(programAttributes);
            store.setState({
                ...store.getState(),
                program,
            });
        })
        .mapTo({ type: PROGRAM_ATTRIBUTES_ADDREMOVE_COMPLETE });

const isObjectWithId = id => compose(isEqual(id), get('id'));

const editAttribute = store => action$ => action$
        .ofType(PROGRAM_ATTRIBUTES_EDIT)
        .map((action) => {
            const program = getOr([], 'program', store.getState());
            const programAttributes = getOr([], 'programTrackedEntityAttributes', program);

            const programAttributeId = get('payload.attribute.id', action);

            const programAttribute = programAttributes
                .find(isObjectWithId(programAttributeId));

            program.programTrackedEntityAttributes = programAttributes
                .map((attr) => {
                    if (programAttribute === attr) {
                        return action.payload.attribute;
                    }
                    return attr;
                });

            store.setState({
                ...store.getState(),
                program
            });
        })
        .mapTo({ type: PROGRAM_ATTRIBUTES_EDIT_COMPLETE });

export default function createEpicsForStore(store) {
    return combineEpics(
        addAttributeToProgram(store),
        removeAttributeFromProgram(store),
        editAttribute(store)
    );
}
