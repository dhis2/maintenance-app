import {
    some,
    get,
    compose,
    __,
    concat,
    values,
    flatten,
} from 'lodash/fp';
import { getOwnedPropertyJSON } from 'd2/lib/model/helpers/json';

const checkIfDirty = model => model && model.isDirty();
const programStagesSelector = get('programStages');
const programStageSectionsSelector = get('programStageSections');
const programStageNotificationsSelector = get('programStageNotifications');
const programNotificationsSelector = get('program.notificationTemplates');
const dataEntryFormsSelector = get('dataEntryFormForProgramStage');
const modelToJson = getOwnedPropertyJSON;

const programSelector = get('program');
const isProgramDirty = compose(checkIfDirty, programSelector);
const isProgramStageDirty = compose(some(checkIfDirty), programStagesSelector);
const hasDirtyProgramStageSections = compose(some(checkIfDirty), flatten, values, programStageSectionsSelector)
const hasDirtyNotificationTemplate = compose(some(checkIfDirty), flatten, values, programStageNotificationsSelector)
const hasDirtyProgramNotifications = state => programNotificationsSelector(state).isDirty();
const hasDirtyDataEntryForms = compose(some(checkIfDirty), values, dataEntryFormsSelector);

const handleDataEntryForm = state => payload => {
    if (isProgramDirty(state)) {
        const withPrograms = {
            ...payload,
            programs: [programSelector(state)].map(modelToJson)
        }

        //For custom-form
        const programDataEntryForm = state.program.dataEntryForm;
        if(programDataEntryForm && programDataEntryForm.id && programDataEntryForm.isDirty()) {
            payload.dataEntryForms  = [programDataEntryForm].map(modelToJson);

            return {
                ...withPrograms,
                dataEntryForms: [programDataEntryForm].map(modelToJson),
            }
        }

        return withPrograms
    }

    return payload
}

const handleProgramStages = state => payload => {
    if (isProgramStageDirty(state)) {
        return {
            ...payload,
            programStages: programStagesSelector(state).map(modelToJson)
        }
    }

    return payload
}

const handleProgramStageSections = state => payload => {
    if (hasDirtyProgramStageSections(state)) {
        const programStageSections = programStageSectionsSelector(state);

        return {
            ...payload,
            programStageSections: Object
                .keys(programStageSections)
                .map(get(__, programStageSections))
                .reduce(concat)
                .filter(checkIfDirty)
                .map(modelToJson)
        }
    }

    return payload
}

const handleProgramNotificationTemplates = state => payload => {
    if (hasDirtyNotificationTemplate(state)) {
        const programStageNotifications = programStageNotificationsSelector(state);

        return {
            ...payload,
            programNotificationTemplates: Object
                .keys(programStageNotifications)
                .map(get(__, programStageNotifications))
                .reduce(concat)
                .filter(checkIfDirty)
                .map(modelToJson)
        }
    }

    return payload
}

const handleDirtyProgramNotifications = state => payload => {
    if(hasDirtyProgramNotifications(state)) {
        return {
            ...payload,
            programNotificationTemplates: concat(
                payload.programNotificationTemplates || [],
                programNotificationsSelector(state)
                    .toArray()
                    .map(modelToJson)
            )
        }
    }

    return payload
}

const handleDirtyDataEntryForms = state => payload => {
    //Program stage dataEntryForms
    if (hasDirtyDataEntryForms(state)) {
        const dataEntryForms = dataEntryFormsSelector(state);
        const programStageDataEntryForms = Object
            .keys(dataEntryForms)
            .map(get(__, dataEntryForms))
            .filter(checkIfDirty)
            .map(modelToJson);

        return {
            ...payload,
            dataEntryForms: payload.dataEntryForms
                ? concat(payload.dataEntryForms, programStageDataEntryForms)
                : programStageDataEntryForms
        }
    }

    return payload
}

// getMetaDataToSend :: StoreState -> SaveState
export const getMetaDataToSend = (state) => compose(
    handleDirtyDataEntryForms(state),
    handleDirtyProgramNotifications(state),
    handleProgramNotificationTemplates(state),
    handleProgramStageSections(state),
    handleProgramStages(state),
    handleDataEntryForm(state),
)({});
