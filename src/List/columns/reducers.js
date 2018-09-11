import {
    setColumnsTypes,
    loadColumnsForModel,
    configurableColumnsLoadTypes,
    CONFIGURABLE_COLUMNS_DIALOG_CLOSE,
    CONFIGURABLE_COLUMNS_DIALOG_OPEN
} from './actions';
import { combineReducers } from 'redux';

function createReducer(initialState, handlers) {
    return function reducer(state = initialState, action) {
        if (handlers.hasOwnProperty(action.type)) {
            return handlers[action.type](state, action);
        } else {
            return state;
        }
    };
}

export const setColumnsForModel = (state, action) => {
    const { modelType, columns } = action.payload;
    const model = state[modelType];
    return {
        ...state,
        [modelType]: {
            ...model,
            columns: Array.isArray(columns) ? columns : [],
        },
    };
};

const setColumns = (state, action) => {
    return {
        ...action.payload.modelTypes,
    };
};

const byModelTypeReducer = createReducer(
    {},
    {
        [setColumnsTypes.success]: setColumnsForModel,
        [configurableColumnsLoadTypes.success]: setColumns,
    }
);

const loadingReducer = createReducer(true, {
    [configurableColumnsLoadTypes.success]: () => false,
});

const dialogReducer = (state = { open: false }, action) => {
    switch (action.type) {
        case CONFIGURABLE_COLUMNS_DIALOG_OPEN: {
            return {
                ...state,
                open: true,
            };
        }

        case setColumnsTypes.success:
        case CONFIGURABLE_COLUMNS_DIALOG_CLOSE: {
            return {
                ...state,
                open: false,
            };
        }
        default: {
            return state;
        }
    }
};

export const configurableColumnsReducer = combineReducers({
    modelTypes: byModelTypeReducer,
    dialog: dialogReducer,
    loading: loadingReducer,
});

export default configurableColumnsReducer;
