export const getColumnsForModelType = (state, modelType) =>
    state.configurableColumns[modelType];


export const getDialogOpen = (state) => state.configurableColumns.dialog.open;