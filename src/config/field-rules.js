import { defaultAnalyticsPeriodBoundaries, createDefaultRuleForField } from './field-config/field-defaults';

/**
 * Rule functions in EditModel/form-rules
 *
 * Rules for the form fields.
 * If multiple `when` objects are specified these are evaluated as an OR.
 * The following would result check if either of the statements return true
 * ```
 when: [{
        field: 'valueType',
        operator: 'ONEOF',
        value: [
            'TEXT',
            'LONG_TEXT',
            'LETTER',
            'PHONE_NUMBER',
            'EMAIL',
            'TRACKER_ASSOCIATE',
            'USERNAME',
            'FILE_RESOURCE',
            'COORDINATE',
        ]
        }, {
            field: 'domainType',
            operator: 'EQUALS',
            value: 'TRACKER',
        }],
 * ```
 */

/*
    Sets the valueType to the valueType of the optionSet
    TODO: This function does a mutable modification. It is more efficient this way however it might
    collide and is not very transparent. Especially the fact that the new value needs to be set
    on both the model and the fieldConfig is not very clear.
    It would probably make sense to run the model modification rules before sending the values to
    the FormBuilder. */
function setValueTypeToOptionSet(model, fieldConfig) {
    // Do not not change the valueType when there is no optionSet or when there is no valueType
    // for the optionSet (which can occur during the initial run of the rules)
    if (model.optionSet && model.optionSet.valueType) {
        // Update the fieldConfig to contain the correct value
        fieldConfig.value = model.optionSet.valueType;

        // Update the model only when the value is not the same as the current
        if (model[fieldConfig.name] !== model.optionSet.valueType) {
            model[fieldConfig.name] = model.optionSet.valueType;
        }
    }
}

export default new Map([
    ['dataElement', [
        {
            field: 'domainType',
            when: {
                operator: 'EQUALS',
                value: 'TRACKER',
            },
            operations: [{
                field: 'categoryCombo',
                type: 'SET_PROP',
                propName: 'disabled',
                thenValue: true,
                elseValue: false,
            }],
        },
        {
            field: 'optionSet',
            when: {
                operator: 'PREDICATE',
                value: () => {
                    // value can be ID or model here, so need to check for valueType in operation...
                    return true
                }
            },
            operations: [{
                type: 'CHANGE_VALUE',
                field: 'valueType',
                setValue: (model, fieldConfig) => {
                    const isMultiText = model && (model.valueType === 'MULTI_TEXT'
                            || (model.optionSet && model.optionSet.valueType === 'MULTI_TEXT'));

                    if(isMultiText) {
                        // this is needed for the UI to reflect that valueType is MULTI_TEXT
                        // However it is always disabled in this case, because it's dictated by the optionSet
                        // see setValueTypeToOptionSet()
                        if(fieldConfig.originalOptions) {
                            fieldConfig.props.options = fieldConfig.originalOptions;
                        }
                    } else {
                            // MULTI_TEXT should not be selectable for valueType for dataElements, since it needs to be an optionSet
                            // thus the option is removed from the valueType options
                            const options = fieldConfig.props.options;
                            if(!fieldConfig.originalOptions) {
                                fieldConfig.originalOptions = fieldConfig.props.options;
                            }
                            fieldConfig.props.options = options.filter(option => option.value !== 'MULTI_TEXT');
                        }
                    },
            }],
        },
        {
            field: 'valueType',
            when: {
                field: 'optionSet',
                operator: 'HAS_VALUE',
            },
            operations: [{
                type: 'SET_PROP',
                propName: 'disabled',
                thenValue: true,
                elseValue: false,
            }, {
                type: 'CHANGE_VALUE',
                setValue: setValueTypeToOptionSet,
            }],
        },
        {
            field: 'aggregationType',
            when: {
                field: 'valueType',
                operator: 'ONEOF',
                value: [
                    'TEXT',
                    'LONG_TEXT',
                    'MULTI_TEXT',
                    'LETTER',
                    'PHONE_NUMBER',
                    'EMAIL',
                    'TRACKER_ASSOCIATE',
                    'USERNAME',
                    'FILE_RESOURCE',
                    'COORDINATE',
                ],
            },
            operations: [{
                field: 'aggregationType',
                type: 'SET_PROP',
                propName: 'disabled',
                thenValue: true,
                elseValue: false,
            }, {
                field: 'aggregationType',
                type: 'CHANGE_VALUE',
                setValue: (model, fieldConfig) => {
                    fieldConfig.value = 'NONE';
                    model[fieldConfig.name] = 'NONE';
                },
            }],
        },
    ]],
    ['dataSetNotificationTemplate', [
        {
            when: [
                {
                    field: 'dataSetNotificationTrigger',
                    operator: 'NOT_EQUALS',
                    value: 'SCHEDULED_DAYS',
                },
            ],
            operations: [
                {
                    field: 'relativeScheduledDays',
                    type: 'HIDE_FIELD',
                },
                {
                    field: 'sendStrategy',
                    type: 'HIDE_FIELD',
                },
            ],
        },
        {
            field: 'deliveryChannels',
            when: [
                {
                    field: 'notificationRecipient',
                    operator: 'NOT_EQUALS',
                    value: 'ORGANISATION_UNIT_CONTACT',
                },
            ],
            operations: [
                {
                    field: 'deliveryChannels',
                    type: 'HIDE_FIELD',
                },
            ],
        },
    ]],
    ['attribute', [
        {
            field: 'valueType',
            when: {
                field: 'optionSet',
                operator: 'HAS_VALUE',
            },
            operations: [{
                type: 'SET_PROP',
                propName: 'disabled',
                thenValue: true,
                elseValue: false,
            }, {
                type: 'CHANGE_VALUE',
                setValue: setValueTypeToOptionSet,
            }],
        },
    ]],
    ['trackedEntityAttribute', [
        {
            field: 'unique',
            when: [{
                field: 'valueType',
                operator: 'ONEOF',
                value: [
                    'BOOLEAN',
                    'TRUE_ONLY',
                    'DATE',
                    'TRACKER_ASSOCIATE',
                    'USERNAME',
                    'OPTION_SET',
                ],
            }],
            operations: [
                {
                    field: 'unique',
                    type: 'SET_PROP',
                    propName: 'disabled',
                    thenValue: true,
                    elseValue: false,
                },
                {
                    field: 'unique',
                    type: 'CHANGE_VALUE',
                    setValue: (model, fieldConfig) => {
                        fieldConfig.value = false;
                        model.unique = false;
                    },
                },
            ],
        },
        {
            field: 'valueType',
            when: {
                field: 'optionSet',
                operator: 'HAS_VALUE',
            },
            operations: [
                {
                    type: 'SET_PROP',
                    propName: 'disabled',
                    thenValue: true,
                    elseValue: false,
                }, {
                    type: 'CHANGE_VALUE',
                    setValue: setValueTypeToOptionSet,
                },
            ],
        },
        {
            field: 'orgunitScope',
            when: [
                {
                    field: 'unique',
                    operator: 'NOT_EQUALS',
                    value: true,
                },
                {
                    field: 'valueType',
                    operator: 'ONEOF',
                    value: [
                        'BOOLEAN',
                        'TRUE_ONLY',
                        'DATE',
                        'TRACKER_ASSOCIATE',
                        'USERNAME',
                        'OPTION_SET',
                    ],
                },
            ],
            operations: [{ type: 'HIDE_FIELD' }],
        },
        {
            field: 'generated',
            when: [
                {
                    field: 'orgunitScope',
                    operator: 'IS_HIDDEN_FIELD',
                },
                {
                    field: 'orgunitScope',
                    operator: 'ONEOF',
                    value: ['organisation_unit'],
                },
                {
                    field: 'orgunitScope',
                    operator: 'EQUALS',
                    value: true,
                },
            ],
            operations: [
                {
                    type: 'HIDE_FIELD',
                },
                {
                    type: 'CHANGE_VALUE',
                    setValue: (model, fieldConfig) => {
                        fieldConfig.value = false;
                        model.generated = false;
                    },
                },
            ],
        },
        {
            field: 'pattern',
            when: [
                {
                    field: 'generated',
                    operator: 'IS_HIDDEN_FIELD',
                },
                {
                    field: 'generated',
                    operator: 'NOT_EQUALS',
                    value: true,
                },
            ],
            operations: [
                {
                    type: 'HIDE_FIELD',
                },
                {
                    type: 'CHANGE_VALUE',
                    setValue: (model, fieldConfig) => {
                        fieldConfig.value = null;
                        model.pattern = null;
                    },
                },
            ],
        },
    ]],
    ['externalMapLayer', [
        {
            // When legendSet has value, clear and disable the legendSetUrl field
            field: 'legendSetUrl',
            when: [{
                field: 'legendSet',
                operator: 'HAS_VALUE',
            }],
            operations: [{
                field: 'legendSetUrl',
                type: 'SET_PROP',
                propName: 'disabled',
                thenValue: true,
                elseValue: false,
            }],
        },
        {
            // When legendSetUrl has value, clear and disable the legendSet field
            field: 'legendSet',
            when: [{
                field: 'legendSetUrl',
                operator: 'HAS_STRING_VALUE',
            }],
            operations: [{
                field: 'legendSet',
                type: 'SET_PROP',
                propName: 'disabled',
                thenValue: true,
                elseValue: false,
            }],
        },
        {
            // When mapService is geojson or arcgis, then mapLayerPosition must be OVERLAY
            field: 'mapLayerPosition',
            when: [
                {
                    field: 'mapService',
                    operator: 'ONEOF',
                    value: ['GEOJSON_URL', 'ARCGIS_FEATURE'],
                },
            ],
            operations: [
                {
                    field: 'mapLayerPosition',
                    type: 'CHANGE_VALUE',

                    setValue: (model, fieldConfig) => {
                        fieldConfig.value = 'OVERLAY';
                        model[fieldConfig.name] = 'OVERLAY';
                    },
                },
            ],
        },
        {
            // When mapService is Vector style, then mapLayerPosition must be BASEMAP
            field: 'mapLayerPosition',
            when: [
                {
                    field: 'mapService',
                    operator: 'EQUALS',
                    value: 'VECTOR_STYLE',
                },
            ],
            operations: [
                {
                    field: 'mapLayerPosition',
                    type: 'CHANGE_VALUE',

                    setValue: (model, fieldConfig) => {
                        fieldConfig.value = 'BASEMAP';
                        model[fieldConfig.name] = 'BASEMAP';
                    },
                },
            ],
        },
    ]],
    ['organisationUnit', [
        {
            field: 'dataSets',
            when: [{
                operator: 'SYSTEM_SETTING_IS_FALSE',
                value: 'keyAllowObjectAssignment',
            }],
            operations: [{
                field: 'dataSets',
                type: 'HIDE_FIELD',
            }],
        },
        {
            field: 'programs',
            when: [{
                operator: 'SYSTEM_SETTING_IS_FALSE',
                value: 'keyAllowObjectAssignment',
            }],
            operations: [{
                field: 'programs',
                type: 'HIDE_FIELD',
            }],
        },
    ]],
    ['programRule', [
        {
            field: 'name',
            when: [{
                field: 'program',
                operator: 'HAS_VALUE',
            }],
            operations: [{
                type: 'SET_PROP',
                propName: 'disabled',
                thenValue: false,
                elseValue: true,
            }],
        },
        {
            field: 'description',
            when: [{
                field: 'program',
                operator: 'HAS_VALUE',
            }],
            operations: [{
                type: 'SET_PROP',
                propName: 'disabled',
                thenValue: false,
                elseValue: true,
            }],
        },
        {
            field: 'priority',
            when: [{
                field: 'program',
                operator: 'HAS_VALUE',
            }],
            operations: [{
                type: 'SET_PROP',
                propName: 'disabled',
                thenValue: false,
                elseValue: true,
            }],
        },
        {
            field: 'condition',
            when: [{
                field: 'program',
                operator: 'HAS_VALUE',
            }],
            operations: [{
                type: 'SET_PROP',
                propName: 'disabled',
                thenValue: false,
                elseValue: true,
            }],
        },
        {
            field: 'programRuleActions',
            when: [{
                field: 'program',
                operator: 'HAS_VALUE',
            }],
            operations: [{
                type: 'SET_PROP',
                propName: 'disabled',
                thenValue: false,
                elseValue: true,
            }],
        },
    ]],
    ['programRuleVariable', [
        {
            field: 'program',
            when: [{
                field: 'dataElement',
                operator: 'HAS_STRING_VALUE',
            }, {
                field: 'trackedEntityAttribute',
                operator: 'HAS_STRING_VALUE',
            }, {
                field: 'programStage',
                operator: 'HAS_STRING_VALUE',
            }],
            operations: [{
                type: 'SET_PROP',
                propName: 'disabled',
                thenValue: true,
                elseValue: false,
            }],
        },
        {
            field: 'dataElement',
            when: [{
                field: 'programRuleVariableSourceType',
                operator: 'ONEOF',
                value: [
                    'CALCULATED_VALUE',
                    'TEI_ATTRIBUTE',
                ],
            }],
            operations: [{
                field: 'dataElement',
                type: 'HIDE_FIELD',
            }],
        },
        {
            field: 'trackedEntityAttribute',
            when: [{
                field: 'programRuleVariableSourceType',
                operator: 'NOT_EQUALS',
                value: 'TEI_ATTRIBUTE',
            }],
            operations: [{
                field: 'trackedEntityAttribute',
                type: 'HIDE_FIELD',
            }],
        },
        {
            field: 'programStage',
            when: [{
                field: 'programRuleVariableSourceType',
                operator: 'NOT_EQUALS',
                value: 'DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE',
            }],
            operations: [{
                field: 'programStage',
                type: 'HIDE_FIELD',
            }],
        },
        {
            field: 'programStage',
            when: [{
                field: 'dataElement',
                operator: 'HAS_STRING_VALUE',
            }],
            operations: [{
                type: 'SET_PROP',
                propName: 'disabled',
                thenValue: true,
                elseValue: false,
            }],
        },
        {
            field: 'valueType',
            when: [{
                field: 'programRuleVariableSourceType',
                operator: 'NOT_EQUALS',
                value: 'CALCULATED_VALUE',
            }],
            operations: [{
                field: 'valueType',
                type: 'HIDE_FIELD',
            }],
        },
        createDefaultRuleForField('valueType', 'TEXT')
    ]],
    ['programStage', [
        {
            field: 'autoGenerateEvent',
            when: [{
                field: 'autoGenerateEvent',
                operator: 'NOT_EQUALS',
                value: true,
            }],
            operations: [{
                field: 'openAfterEnrollment',
                type: 'HIDE_FIELD',
            }, {
                field: 'reportDateToUse',
                type: 'HIDE_FIELD',
            }],
        },
        {
            field: 'reportDateToUse',
            when: [{
                field: 'openAfterEnrollment',
                operator: 'NOT_EQUALS',
                value: true,
            }],
            operations: [{
                type: 'SET_PROP',
                propName: 'disabled',
                thenValue: true,
                elseValue: false,
            }],
        },
    ]],
    ['eventProgramStage', [
        createDefaultRuleForField('validationStrategy', 'ON_UPDATE_AND_INSERT'),
    ]],
    ['programIndicator', [{
        field: 'orgUnitField',
        when: [{
            field: 'program',
            operator: 'EQUALS',
            value: undefined,
        }],
        operations: [{
            field: 'orgUnitField',
            type: 'HIDE_FIELD',
        }],
    }, {
        field: 'analyticsPeriodBoundaries',
        when: [{
            field: 'analyticsType',
            operator: 'HAS_VALUE',
        }],
        operations: [{
            type: 'CHANGE_VALUE',
            setValue: (model, fieldConfig) => {
                if (fieldConfig) {
                    const prevAnalyticsType = fieldConfig.previousAnalyticsType;
                    const analyticsType = model.analyticsType
                    const currentBoundaries = fieldConfig.value;
                    const didChange = prevAnalyticsType && prevAnalyticsType !== analyticsType;

                    if(!currentBoundaries || didChange) {
                        const defaultValue = defaultAnalyticsPeriodBoundaries(analyticsType, fieldConfig.value);
                        fieldConfig.value = defaultValue;
                        model[fieldConfig.name] = defaultValue;
                    }
                    // save previous analytics type to be able to check if it has changed
                    // no other good way to check, since all rules are run on every change
                    fieldConfig.previousAnalyticsType = analyticsType;
                }
            }
        }]
    },
    ]],
    ['programStageNotificationTemplate', [
        {
            field: 'notificationTrigger',
            when: [{
                field: 'notificationTrigger',
                operator: 'NOT_EQUALS',
                value: 'SCHEDULED_DAYS_DUE_DATE',
            }],
            operations: [{
                field: 'relativeScheduledDays',
                type: 'HIDE_FIELD',
            }],
        },
        {
            field: 'notificationRecipient',
            when: [{
                field: 'notificationRecipient',
                operator: 'NONEOF',
                value: [
                    'TRACKED_ENTITY_INSTANCE',
                    'ORGANISATION_UNIT_CONTACT',
                ],
            }],
            operations: [{
                field: 'deliveryChannels',
                type: 'HIDE_FIELD',
            }],
        },
        {
            field: 'notificationRecipient',
            when: [{
                field: 'notificationRecipient',
                operator: 'NOT_EQUALS',
                value: 'DATA_ELEMENT',
            }],
            operations: [{
                field: 'recipientDataElement',
                type: 'HIDE_FIELD',
            }],
        },
        {
            field: 'notificationRecipient',
            when: [{
                field: 'notificationRecipient',
                operator: 'NOT_EQUALS',
                value: 'PROGRAM_ATTRIBUTE',
            }],
            operations: [{
                field: 'recipientProgramAttribute',
                type: 'HIDE_FIELD',
            }],
        },
        {
            field: 'notificationRecipient',
            when: [{
                field: 'notificationRecipient',
                operator: 'NOT_EQUALS',
                value: 'USER_GROUP',
            }],
            operations: [{
                field: 'notifyUsersInHierarchyOnly',
                type: 'HIDE_FIELD',
            }],
        },
        {
            field: 'notificationRecipient',
            when: [{
                field: 'notificationRecipient',
                operator: 'NOT_EQUALS',
                value: 'USER_GROUP',
            }],
            operations: [{
                field: 'notifyParentOrganisationUnitOnly',
                type: 'HIDE_FIELD',
            }],
        },
        {
            field: 'notificationRecipient',
            when: [{
                field: 'notificationRecipient',
                operator: 'EQUALS',
                value: 'WEB_HOOK',
            }],
            operations: [{
                field: 'deliveryChannels',
                type: 'CHANGE_VALUE',
                setValue: (model, fieldConfig) => {
                    if(fieldConfig) {
                        fieldConfig.value = model[fieldConfig.name] = ['HTTP']
                    }
                }
            }],
        },
        {
            field: 'notifyUsersInHierarchyOnly',
            when: [{
                field: 'notifyParentOrganisationUnitOnly',
                operator: 'EQUALS',
                value: true,
            }],
            operations: [{
                field: 'notifyUsersInHierarchyOnly',
                type: 'SET_PROP',
                propName: 'disabled',
                thenValue: true,
                elseValue: false,
            }],
        },
        {
            field: 'notifyParentOrganisationUnitOnly',
            when: [{
                field: 'notifyUsersInHierarchyOnly',
                operator: 'EQUALS',
                value: true,
            }],
            operations: [{
                field: 'notifyParentOrganisationUnitOnly',
                type: 'SET_PROP',
                propName: 'disabled',
                thenValue: true,
                elseValue: false,
            }],
        },
    ]],
    ['programNotificationTemplate', [
        {
            field: 'notificationTrigger',
            when: [{
                field: 'notificationTrigger',
                operator: 'NONEOF',
                value: [
                    'SCHEDULED_DAYS_INCIDENT_DATE',
                    'SCHEDULED_DAYS_ENROLLMENT_DATE',
                ],
            }],
            operations: [{
                field: 'relativeScheduledDays',
                type: 'HIDE_FIELD',
            }],
        },
        {
            field: 'notificationRecipient',
            when: [{
                field: 'notificationRecipient',
                operator: 'NONEOF',
                value: [
                    'TRACKED_ENTITY_INSTANCE',
                    'ORGANISATION_UNIT_CONTACT',
                ],
            }],
            operations: [{
                field: 'deliveryChannels',
                type: 'HIDE_FIELD',
            }],
        },
        {
            field: 'notificationRecipient',
            when: [{
                field: 'notificationRecipient',
                operator: 'NOT_EQUALS',
                value: 'PROGRAM_ATTRIBUTE',
            }],
            operations: [{
                field: 'recipientProgramAttribute',
                type: 'HIDE_FIELD',
            }],
        },
        {
            field: 'notificationRecipient',
            when: [{
                field: 'notificationRecipient',
                operator: 'NOT_EQUALS',
                value: 'USER_GROUP',
            }],
            operations: [{
                field: 'notifyUsersInHierarchyOnly',
                type: 'HIDE_FIELD',
            }],
        },
        {
            field: 'notificationRecipient',
            when: [{
                field: 'notificationRecipient',
                operator: 'NOT_EQUALS',
                value: 'USER_GROUP',
            }],
            operations: [{
                field: 'notifyParentOrganisationUnitOnly',
                type: 'HIDE_FIELD',
            }],
        },
        {
            field: 'notificationRecipient',
            when: [{
                field: 'notificationRecipient',
                operator: 'EQUALS',
                value: 'WEB_HOOK',
            }],
            operations: [{
                field: 'deliveryChannels',
                type: 'CHANGE_VALUE',
                setValue: (model, fieldConfig) => {
                    if(fieldConfig) {
                        fieldConfig.value = model[fieldConfig.name] = ['HTTP']
                    }
                }
            }],
        },
    ]],
    ['categoryCombo', [
        {
            field: 'dataDimensionType',
            when: [{
                field: 'dataDimensionType',
                operator: 'HAS_NO_VALUE'
            }],
            operations: [{
                type: 'CHANGE_VALUE',
                setValue: (model, fieldConfig) => {
                    fieldConfig.value = model[fieldConfig.name] = 'DISAGGREGATION'
                }
            }]
        }
    ]],
    ['sqlView', [
        {
            field: 'name',
            when: {
                field: 'id',
                operator: 'HAS_VALUE',
            },
            operations: [{
                type: 'SET_PROP',
                propName: 'disabled',
                thenValue: true,
                elseValue: false,
            }],
        },
        {
            field: 'type',
            when: {
                field: 'id',
                operator: 'HAS_VALUE',
            },
            operations: [{
                type: 'SET_PROP',
                propName: 'disabled',
                thenValue: true,
                elseValue: false,
            }],
        },
    ]],
    ['analyticsTableHook', [
        {
            field: 'resourceTableType',
            when: {
                field: 'phase',
                operator: 'PREDICATE',
                value: (phase) => phase === 'ANALYTICS_TABLE_POPULATED'
            },
            operations: [{
                type: 'HIDE_FIELD',
            }],
        },
        {
            field: 'analyticsTableType',
            when: {
                field: 'phase',
                operator: 'PREDICATE',
                value: (phase) => phase === 'RESOURCE_TABLE_POPULATED'
            },
            operations: [{
                type: 'HIDE_FIELD',
            }],
        },
    ]],
    ['relationshipType', [
        {
            field: 'toFromName',
            when: {
                field: 'bidirectional',
                operator: 'NOT_EQUALS',
                value: true
            },
            operations: [{
                type: 'HIDE_FIELD',
            }],
        },
    ]],
    ['dataSet', [
        {
            field: 'openPeriodsAfterCoEndDate',
            when: {
                field: 'categoryCombo',
                operator: 'PREDICATE',
                value: (categoryComboField) => categoryComboField && categoryComboField.name === 'default'
            },
            operations: [{
                type: 'HIDE_FIELD',
            }]
        },
        {
            field: 'workflow',
            when: [{
                field: 'categoryCombo',
                operator: 'HAS_VALUE',
            }],
            operations: [{
                type: 'CHANGE_VALUE',
                setValue: (model, fieldConfig) => {
                    try {
                        const filters = ['categoryCombo.id:eq:' + model.dataValues.categoryCombo.id, 'categoryCombo.id:null'];
                        if (!Array.isArray(fieldConfig.props.queryParamFilter)) {
                            fieldConfig.props.queryParamFilter = filters;
                        } else if (!fieldConfig.props.queryParamFilter.includes(filters[0])) {
                            fieldConfig.props.queryParamFilter = filters;
                            fieldConfig.value = model[fieldConfig.name] = undefined;
                        }
                    } catch (e) {
                        return;
                    }
                }
            }]
        },
    ]],
    ['predictor', [
        createDefaultRuleForField('organisationUnitDescendants', 'SELECTED'),
    ]],
    ['eventProgram', [
        {
            field: 'openDaysAfterCoEndDate',
            when: {
                field: 'categoryCombo',
                operator: 'PREDICATE',
                value: (categoryComboField) => categoryComboField && categoryComboField.name === 'default'
            },
            operations: [{
                type: 'HIDE_FIELD',
            }]
        }
    ]],
    ['trackerProgram', [
        {
            field: 'openDaysAfterCoEndDate',
            when: {
                field: 'categoryCombo',
                operator: 'PREDICATE',
                value: (categoryComboField) => categoryComboField && categoryComboField.name === 'default'
            },
            operations: [{
                type: 'HIDE_FIELD',
            }]
        }
    ]],
]);
