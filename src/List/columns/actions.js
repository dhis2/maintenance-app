

export const CONFIGURABLE_COLUMNS_LOAD = 'CONFIGURABLE_COLUMNS_LOAD';
export const CONFIGURABLE_COLUMNS_LOAD_SUCCESS = 'CONFIGURABLE_COLUMNS_LOAD_SUCCESS';
export const CONFIGURABLE_COLUMNS_LOAD_ERROR = 'CONFIGURABLE_COLUMNS_LOAD_ERROR';

export const CONFIGURABLE_COLUMNS_DIALOG_OPEN = 'CONFIGURABLE_COLUMNS_DIALOG_OPEN';
export const CONFIGURABLE_COLUMNS_DIALOG_CLOSE = 'CONFIGURABLE_COLUMNS_DIALOG_CLOSE';
const createTypes = (type) => ({
    request: `${type}_REQUEST`,
    success: `${type}_SUCCESS`,
    error: `${type}_ERROR`
})

export const configurableColumnsLoadTypes = createTypes('CONFIGURABLE_COLUMNS_LOAD');

export const loadColumnsForModel = (modelType) => ({
    type: configurableColumnsLoadTypes.request,
    payload: {
        modelType,
    }
});

export const setColumnsTypes = createTypes('SET_COLUMNS_FOR_MODEL');

/**
 * 
 * @param {string} modelType Modeltype for the columns 
 * @param {array} columns Array of the columns, in correct order
 */
export const setColumnsForModel = (modelType, columns) => ({
    type: setColumnsTypes.request,
    payload: {
        modelType,
        columns: Array.isArray(columns) ? columns: [],
    }
})

export const openColumnsDialog = (modelType) => ({
    type: CONFIGURABLE_COLUMNS_DIALOG_OPEN,
    payload: {
        modelType
    }
});

export const closeColumnsDialog = () => ({
    type: CONFIGURABLE_COLUMNS_DIALOG_CLOSE,
});