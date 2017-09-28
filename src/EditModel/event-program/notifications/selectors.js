import { get, compose, first, __ } from 'lodash/fp';

export const getStageNotifications = ({ programStages, programStageNotifications }) => compose(get(__, programStageNotifications), get('id'), first)(programStages);

export const isDeletingSelector = get('eventProgram.stageNotifications.isDeleting');
export const objectNameToBeDeletedSelector = get('eventProgram.stageNotifications.objectNameToBeDeleted');
export const modelToEditSelector = get('eventProgram.stageNotifications.modelToEdit');
