export const getColumnsForModelType = (state, modelType) =>
    state.configurableColumns.modelTypes[modelType];


export const getDialogOpen = (state) => state.configurableColumns.dialog.open;