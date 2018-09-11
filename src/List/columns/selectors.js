export const getColumnsForModelType = (state, modelType) => {
    const m = state.configurableColumns.modelTypes[modelType];
    if (m && m.columns) {
        return Array.isArray(m.columns) ? m.columns : [];
    }
    return [];
};

export const getAllModelTypes = state => state.configurableColumns.modelTypes;

export const getDialogOpen = state => state.configurableColumns.dialog.open;
