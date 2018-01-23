import { get, compose, first, __ } from 'lodash/fp';

export const getStageNotifications = ({ programStages, programStageNotifications }) =>
    compose(get(__, programStageNotifications), get('id'), first)(programStages);

export const getProgramNotifications = ({ program }) => program.notificationTemplates;

export const getProgramStageDataElements = ({ programStages, availableDataElements }) => {
    const programStageDataElements = programStages[0].programStageDataElements
        .map(psde => psde.dataElement.id);

    return availableDataElements
        .filter(de => programStageDataElements.includes(de.id));
};

export const isDeletingSelector = get('eventProgram.stageNotifications.isDeleting');
export const objectNameToBeDeletedSelector = get('eventProgram.stageNotifications.objectNameToBeDeleted');
export const modelToEditSelector = get('eventProgram.stageNotifications.modelToEdit');
