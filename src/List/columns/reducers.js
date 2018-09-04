import { setColumnsTypes, loadColumnsForModel } from './actions';
import { combineReducers } from 'redux';
const typeDetails = {
    category: {
        filters: ['dataDimensionType'],
        columns: ['displayName', 'dataDimensionType', 'publicAccess', 'lastUpdated'],
    },
    categoryCombo: {
        filters: ['dataDimensionType'],
        columns: ['displayName', 'dataDimensionType', 'publicAccess', 'lastUpdated'],
    },
    categoryOptionGroup: {
        filters: ['dataDimensionType'],
        columns: ['displayName', 'dataDimensionType', 'publicAccess', 'lastUpdated'],
    },
    categoryOptionGroupSet: {
        filters: ['dataDimensionType'],
        columns: ['displayName', 'dataDimensionType', 'publicAccess', 'lastUpdated'],
    },
    dataElement: {
        filters: ['domainType', 'valueType', 'categoryCombo'],
        columns: ['displayName', 'domainType', 'valueType', 'categoryCombo[displayName]', 'lastUpdated'],
    },
    dataElementGroupSet: {
        columns: ['displayName', 'compulsory', 'publicAccess', 'lastUpdated'],
    },
    dataSet: {
        filters: ['formType'],
        columns: ['displayName', 'formType', 'periodType', 'publicAccess', 'lastUpdated'],
    },
    dataSetNotificationTemplate: {
        columns: ['displayName', 'lastUpdated'],
    },
    indicator: {
        filters: ['indicatorType'],
        columns: ['displayName', 'indicatorType[displayName]', 'publicAccess', 'lastUpdated'],
    },
    indicatorType: {
        columns: ['displayName', 'factor', 'publicAccess', 'lastUpdated'],
    },
    indicatorGroupSet: {
        columns: ['displayName', 'compulsory', 'publicAccess', 'lastUpdated'],
    },
    organisationUnit: {
        columns: ['displayName', 'level', 'lastUpdated'],
    },
    organisationUnitGroupSet: {
        columns: ['displayName', 'compulsory', 'dataDimension', 'publicAccess', 'lastUpdated'],
    },
    trackedEntityAttribute: {
        filters: ['valueType', 'aggregationType'],
        columns: ['displayName', 'valueType', 'aggregationType', 'unique', 'confidential', 'lastUpdated'],
    },
    program: {
        columns: ['displayName', 'programType', 'publicAccess', 'lastUpdated'],
        filters: ['programType'],
    },
    programIndicator: {
        filters: ['program'],
        columns: ['displayName', 'program[displayName]', 'lastUpdated'],
    },
    programRule: {
        filters: ['program'],
        columns: ['displayName', 'program[displayName]', 'lastUpdated'],
    },
    programRuleVariable: {
        filters: ['program', 'programRuleVariableSourceType'],
        columns: ['displayName', 'program[displayName]', 'programRuleVariableSourceType', 'lastUpdated'],
    },
    programStage: {
        columns: ['displayName', 'lastUpdated'],
    },
    validationRule: {
        columns: ['displayName', 'importance', 'periodType', 'publicAccess', 'lastUpdated'],
    },
    constant: {
        columns: ['displayName', 'value', 'lastUpdated'],
    },
    attribute: {
        columns: ['displayName', 'valueType', 'mandatory', 'unique', 'publicAccess', 'lastUpdated'],
    },
    optionSet: {
        columns: ['displayName', 'valueType', 'publicAccess', 'lastUpdated'],
    },
    predictor: {
        columns: ['displayName', 'output[displayName]', 'periodType', 'lastUpdated'],
    },
    pushAnalysis: {
        columns: ['displayName', 'dashboard[displayName]', 'lastUpdated'],
    },
    externalMapLayer: {
        columns: ['displayName', 'mapLayerPosition', 'mapService', 'lastUpdated'],
    },
    dataApprovalLevel: {
        columns: [
            'displayName',
            'level',
            'orgUnitLevel',
            'categoryOptionGroupSet[displayName]',
            'publicAccess',
            'lastUpdated',
        ],
    },
    dataApprovalWorkflow: {
        columns: [
            'displayName',
            'periodType',
            'publicAccess',
            'lastUpdated',
        ],
    },
    locale: {
        columns: [
            'name',
            'locale',
        ],
    },
    sqlView: {
        columns: [
            'displayName',
        ],
        additionalFields: [
            'name',
            'type',
        ]
    },
};

function createReducer(initialState, handlers) {
    return function reducer(state = initialState, action) {
      if (handlers.hasOwnProperty(action.type)) {
        return handlers[action.type](state, action)
      } else {
        return state
      }
    }
  }

const setColumnsForModel = (state, action) => {
    const { modelType, columns} = action.payload;

    const model = state[modelType];
    if(!model) return state;
    return {
        ...state,
        [modelType]: {
            ...model,
            columns
        }
    }
}

const byModelTypeReducer = createReducer(typeDetails, {
    'SET_COLUMNS_FOR_MODEL': setColumnsForModel
});

const dialogReducer = (state = {open: false}, action) => {
    switch(action.type) {
        case "CONFIGURABLE_COLUMNS_DIALOG_OPEN": {
            return {
                ...state,
                open: true
            }
        }

        case "CONFIGURABLE_COLUMNS_DIALOG_CLOSE": {
            return {
                ...state,
                open: false,
            }
        }
        default: {
            return state;
        }
    }
}

export const configurableColumnsReducer = combineReducers({
    modelTypes: byModelTypeReducer,
    dialog: dialogReducer
})

export default configurableColumnsReducer;