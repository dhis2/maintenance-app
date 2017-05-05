import { get, compose, first, __ } from 'lodash/fp';

const spy = (v) => {
    console.log(v);
    return v;
};

// export const getStageNotifications = (programStages) => Array.from(programStages)[0].notificationTemplates;
export const getStageNotifications = ({ programStages, programStageNotifications }) => compose(spy, get(__, spy(programStageNotifications)), spy, get('id'), first)(programStages)

export const isDeletingSelector = get('eventProgram.stageNotifications.isDeleting');
export const objectNameToBeDeletedSelector = get('eventProgram.stageNotifications.objectNameToBeDeleted');
export const modelToEditSelector = get('eventProgram.stageNotifications.modelToEdit');
