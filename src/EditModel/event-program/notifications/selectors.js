import { get } from 'lodash/fp';

export const getStageNotifications = (modelToEdit) => Array.from(modelToEdit.programStages)[0][1].notificationTemplates;

export const isDeletingSelector = get('stageNotifications.isDeleting');
export const objectNameToBeDeletedSelector = get('stageNotifications.objectNameToBeDeleted');
export const modelToEditSelector = get('stageNotifications.modelToEdit');
