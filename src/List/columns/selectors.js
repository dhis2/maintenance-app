export const getColumnsForModelType = (state, modelType) => {
    const m = state.configurableColumns.modelTypes[modelType];
    console.log(m);
    if (m) {
        return m.columns;
    }
    return [];
};

export const getAllModelTypes = state => state.configurableColumns.modelTypes;

export const getDialogOpen = state => state.configurableColumns.dialog.open;
