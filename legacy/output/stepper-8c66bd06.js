import { r as react, a0 as addD2Context, c7 as modelToEditStore, q as _objectWithoutProperties, a8 as _default$2, s as _extends, ax as fieldOrder, al as fp, cd as AFTER_START_OF_REPORTING_PERIOD, ce as ENROLLMENT_DATE, cf as BEFORE_END_OF_REPORTING_PERIOD, cg as EVENT_DATE, ch as systemSettingsStore, c5 as _default$3, ci as _default$4, cj as _default$5, O as Observable, a4 as _objectSpread2, f as _asyncToGenerator, ck as FormFieldsManager, cl as FormFieldsForModel, cm as _createForOfIteratorHelper, cn as fieldOverrides, j as _slicedToArray, i as getInstance, c4 as FormBuilder, co as createFieldConfig, cp as typeToFieldMap, S as pure, U as SvgIcon, cq as _toConsumableArray, cr as _default$6, cs as _default$7, ct as _default$8, aq as Translate, p as log, aw as connect, cu as bindActionCreators, cv as _default$9, _ as _default$a } from './index-44839b1a.js';

var _excluded$2 = ["onClick", "isPristine", "isDirtyHandler"];

function CancelButton(_ref, context) {
  var onClick = _ref.onClick;
      _ref.isPristine;
      var _ref$isDirtyHandler = _ref.isDirtyHandler,
      isDirtyHandler = _ref$isDirtyHandler === void 0 ? modelToEditStore.getState.bind(modelToEditStore) : _ref$isDirtyHandler,
      props = _objectWithoutProperties(_ref, _excluded$2);

  var shouldConfirm = isDirtyHandler && isDirtyHandler() && isDirtyHandler().dirty;

  var onClickWithConfirm = function onClickWithConfirm() {
    if (!shouldConfirm) {
      onClick.apply(void 0, arguments);
    } else if ( // eslint-disable-next-line no-restricted-globals
    confirm(context.d2.i18n.getTranslation('abandon_unsaved_changes'))) {
      onClick.apply(void 0, arguments);
    }
  };

  return /*#__PURE__*/react.createElement(_default$2, _extends({}, props, {
    onClick: onClickWithConfirm,
    secondary: shouldConfirm,
    label: context.d2.i18n.getTranslation('cancel')
  }));
}

CancelButton.propTypes = {
  onClick: react.PropTypes.func.isRequired,

  /* A handler that should return an object with "dirty"-key,
  describing if the current edited model is dirty
   */
  isDirtyHandler: react.PropTypes.func
};
var CancelButton$1 = addD2Context(CancelButton);

/*
    The stepper sets the style of the fields of the not active step to "display: none"
    to hide them from view. For this to work the component of the field needs to recieve
    the style from props. If the fields are not hidden when changing the active step
    then check if the component of the corresponding fields are receiving and using the
    style from props in its outer div.
*/

var fieldGroupsForModelType = new Map([['programRule', [{
  label: 'enter_program_rule_details',
  fields: ['program', 'programStage', 'name', 'description', 'priority']
}, {
  label: 'enter_program_rule_expression',
  fields: ['condition']
}, {
  label: 'define_program_rule_actions',
  fields: ['programRuleActions']
}]], ['dataSetNotificationTemplate', [{
  label: 'what_to_send',
  fields: ['name', 'code', 'dataSets', 'messageTemplate']
}, {
  label: 'when_to_send_it',
  fields: ['dataSetNotificationTrigger', 'relativeScheduledDays', 'sendStrategy']
}, {
  label: 'who_to_send_it_to',
  fields: ['notificationRecipient', 'recipientUserGroup', 'deliveryChannels']
}]], ['programNotificationTemplate', [{
  label: 'what_to_send',
  fields: ['name', 'messageTemplate']
}, {
  label: 'when_to_send_it',
  fields: ['notificationTrigger', 'relativeScheduledDays']
}, {
  label: 'who_to_send_it_to',
  fields: ['notificationRecipient', 'recipientUserGroup', 'deliveryChannels', 'recipientProgramAttribute', 'notifyUsersInHierarchyOnly', 'notifyParentOrganisationUnitOnly']
}]], ['programStageNotificationTemplate', [{
  label: 'what_to_send',
  fields: ['name', 'messageTemplate']
}, {
  label: 'when_to_send_it',
  fields: ['notificationTrigger', 'relativeScheduledDays', 'sendRepeatable']
}, {
  label: 'who_to_send_it_to',
  fields: ['notificationRecipient', 'recipientUserGroup', 'deliveryChannels', 'recipientDataElement', 'recipientProgramAttribute', 'notifyUsersInHierarchyOnly', 'notifyParentOrganisationUnitOnly']
}]], ['programIndicator', [{
  label: 'program_indicator__details',
  fields: ['program', 'name', 'shortName', 'code', 'style', 'description', 'decimals', 'aggregationType', 'analyticsType', 'analyticsPeriodBoundaries', 'displayInForm', 'legendSets', 'aggregateExportCategoryOptionCombo', 'aggregateExportAttributeOptionCombo']
}, {
  label: 'program_indicator__edit_expression',
  fields: ['expression']
}, {
  label: 'program_indicator__edit_filter',
  fields: ['filter']
}]]]);
var fieldGroups = {
  "for": function _for(modelType) {
    if (this.isGroupedFields(modelType)) {
      return fieldGroupsForModelType.get(modelType);
    }

    return [{
      label: 'details',
      fields: fieldOrder["for"](modelType)
    }];
  },
  isGroupedFields: function isGroupedFields(modelType) {
    return modelType && fieldGroupsForModelType.has(modelType);
  },
  getStepLength: function getStepLength(modelType) {
    if (this.isGroupedFields(modelType)) {
      var modelGroup = fieldGroupsForModelType.get(modelType);
      return modelGroup.length;
    }

    return 0;
  },
  groupNoByName: function groupNoByName(fieldName, modelType) {
    if (this.isGroupedFields(modelType)) {
      var modelGroup = fieldGroupsForModelType.get(modelType);
      return fp.findIndex(function (group) {
        return group.fields.includes(fieldName);
      }, modelGroup);
    }

    return 0;
  },
  groupNameByStep: function groupNameByStep(stepNo, modelType) {
    if (this.isGroupedFields(modelType)) {
      var modelGroup = fieldGroupsForModelType.get(modelType);
      return modelGroup[stepNo].label;
    }

    return '';
  },
  groupsByField: function groupsByField(modelType) {
    if (this.isGroupedFields(modelType)) {
      return fieldGroupsForModelType.get(modelType).map(function (group) {
        return group.fields;
      }).reduce(function (fieldsWithStep, groupFields, stepNo) {
        groupFields.map(function (field) {
          return fieldsWithStep[field] = stepNo;
        });
        return fieldsWithStep;
      }, {});
    }
  }
};

function defaultAnalyticsPeriodBoundaries(type, current) {
  var defaultProps = {
    enrollment: [{
      analyticsPeriodBoundaryType: AFTER_START_OF_REPORTING_PERIOD,
      boundaryTarget: ENROLLMENT_DATE
    }, {
      analyticsPeriodBoundaryType: BEFORE_END_OF_REPORTING_PERIOD,
      boundaryTarget: ENROLLMENT_DATE
    }],
    event: [{
      analyticsPeriodBoundaryType: AFTER_START_OF_REPORTING_PERIOD,
      boundaryTarget: EVENT_DATE
    }, {
      analyticsPeriodBoundaryType: BEFORE_END_OF_REPORTING_PERIOD,
      boundaryTarget: EVENT_DATE
    }]
  };

  function isNotDefault(val) {
    return !fp.isEqual(val, defaultProps.event) && !fp.isEqual(val, defaultProps.enrollment);
  }

  if (current && isNotDefault(current)) {
    return current;
  }

  return defaultProps[type];
}
/**
 * Helper function to create a "default"-rule for a field, that can
 * be used in field-rules.
 * This will set the value of the field whenever the value is undefined.
 * When a value is set to no-value, it is null. Undefined only
 * occurs when it is not set at all.
 *
 * @param field Fieldname for the field to set a default value for.
 * @param defaultValue The default value for the field.
 */

function createDefaultRuleForField(field, defaultValue) {
  return {
    field: field,
    when: [{
      operator: 'EQUALS',
      value: undefined
    }],
    operations: [{
      type: 'CHANGE_VALUE',
      setValue: function setValue(model, fieldConfig) {
        if (fieldConfig) {
          fieldConfig.value = defaultValue;
          model[fieldConfig.name] = defaultValue;
        }
      }
    }]
  };
}

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
    fieldConfig.value = model.optionSet.valueType; // Update the model only when the value is not the same as the current

    if (model[fieldConfig.name] !== model.optionSet.valueType) {
      model[fieldConfig.name] = model.optionSet.valueType;
    }
  }
}

var fieldRules = new Map([['dataElement', [{
  field: 'domainType',
  when: {
    operator: 'EQUALS',
    value: 'TRACKER'
  },
  operations: [{
    field: 'categoryCombo',
    type: 'SET_PROP',
    propName: 'disabled',
    thenValue: true,
    elseValue: false
  }]
}, {
  field: 'valueType',
  when: {
    field: 'optionSet',
    operator: 'HAS_VALUE'
  },
  operations: [{
    type: 'SET_PROP',
    propName: 'disabled',
    thenValue: true,
    elseValue: false
  }, {
    type: 'CHANGE_VALUE',
    setValue: setValueTypeToOptionSet
  }]
}, {
  field: 'aggregationType',
  when: {
    field: 'valueType',
    operator: 'ONEOF',
    value: ['TEXT', 'LONG_TEXT', 'LETTER', 'PHONE_NUMBER', 'EMAIL', 'TRACKER_ASSOCIATE', 'USERNAME', 'FILE_RESOURCE', 'COORDINATE']
  },
  operations: [{
    field: 'aggregationType',
    type: 'SET_PROP',
    propName: 'disabled',
    thenValue: true,
    elseValue: false
  }, {
    field: 'aggregationType',
    type: 'CHANGE_VALUE',
    setValue: function setValue(model, fieldConfig) {
      fieldConfig.value = 'NONE';
      model[fieldConfig.name] = 'NONE';
    }
  }]
}]], ['dataSetNotificationTemplate', [{
  when: [{
    field: 'dataSetNotificationTrigger',
    operator: 'NOT_EQUALS',
    value: 'SCHEDULED_DAYS'
  }],
  operations: [{
    field: 'relativeScheduledDays',
    type: 'HIDE_FIELD'
  }, {
    field: 'sendStrategy',
    type: 'HIDE_FIELD'
  }]
}, {
  field: 'deliveryChannels',
  when: [{
    field: 'notificationRecipient',
    operator: 'NOT_EQUALS',
    value: 'ORGANISATION_UNIT_CONTACT'
  }],
  operations: [{
    field: 'deliveryChannels',
    type: 'HIDE_FIELD'
  }]
}]], ['attribute', [{
  field: 'valueType',
  when: {
    field: 'optionSet',
    operator: 'HAS_VALUE'
  },
  operations: [{
    type: 'SET_PROP',
    propName: 'disabled',
    thenValue: true,
    elseValue: false
  }, {
    type: 'CHANGE_VALUE',
    setValue: setValueTypeToOptionSet
  }]
}]], ['trackedEntityAttribute', [{
  field: 'unique',
  when: [{
    field: 'valueType',
    operator: 'ONEOF',
    value: ['BOOLEAN', 'TRUE_ONLY', 'DATE', 'TRACKER_ASSOCIATE', 'USERNAME', 'OPTION_SET']
  }],
  operations: [{
    field: 'unique',
    type: 'SET_PROP',
    propName: 'disabled',
    thenValue: true,
    elseValue: false
  }, {
    field: 'unique',
    type: 'CHANGE_VALUE',
    setValue: function setValue(model, fieldConfig) {
      fieldConfig.value = false;
      model.unique = false;
    }
  }]
}, {
  field: 'valueType',
  when: {
    field: 'optionSet',
    operator: 'HAS_VALUE'
  },
  operations: [{
    type: 'SET_PROP',
    propName: 'disabled',
    thenValue: true,
    elseValue: false
  }, {
    type: 'CHANGE_VALUE',
    setValue: setValueTypeToOptionSet
  }]
}, {
  field: 'orgunitScope',
  when: [{
    field: 'unique',
    operator: 'NOT_EQUALS',
    value: true
  }, {
    field: 'valueType',
    operator: 'ONEOF',
    value: ['BOOLEAN', 'TRUE_ONLY', 'DATE', 'TRACKER_ASSOCIATE', 'USERNAME', 'OPTION_SET']
  }],
  operations: [{
    type: 'HIDE_FIELD'
  }]
}, {
  field: 'generated',
  when: [{
    field: 'orgunitScope',
    operator: 'IS_HIDDEN_FIELD'
  }, {
    field: 'orgunitScope',
    operator: 'ONEOF',
    value: ['organisation_unit']
  }, {
    field: 'orgunitScope',
    operator: 'EQUALS',
    value: true
  }],
  operations: [{
    type: 'HIDE_FIELD'
  }, {
    type: 'CHANGE_VALUE',
    setValue: function setValue(model, fieldConfig) {
      fieldConfig.value = false;
      model.generated = false;
    }
  }]
}, {
  field: 'pattern',
  when: [{
    field: 'generated',
    operator: 'IS_HIDDEN_FIELD'
  }, {
    field: 'generated',
    operator: 'NOT_EQUALS',
    value: true
  }],
  operations: [{
    type: 'HIDE_FIELD'
  }, {
    type: 'CHANGE_VALUE',
    setValue: function setValue(model, fieldConfig) {
      fieldConfig.value = null;
      model.pattern = null;
    }
  }]
}]], ['externalMapLayer', [{
  // When legendSet has value, clear and disable the legendSetUrl field
  field: 'legendSetUrl',
  when: [{
    field: 'legendSet',
    operator: 'HAS_VALUE'
  }],
  operations: [{
    field: 'legendSetUrl',
    type: 'SET_PROP',
    propName: 'disabled',
    thenValue: true,
    elseValue: false
  }]
}, {
  // When legendSetUrl has value, clear and disable the legendSet field
  field: 'legendSet',
  when: [{
    field: 'legendSetUrl',
    operator: 'HAS_STRING_VALUE'
  }],
  operations: [{
    field: 'legendSet',
    type: 'SET_PROP',
    propName: 'disabled',
    thenValue: true,
    elseValue: false
  }]
}]], ['organisationUnit', [{
  field: 'dataSets',
  when: [{
    operator: 'SYSTEM_SETTING_IS_FALSE',
    value: 'keyAllowObjectAssignment'
  }],
  operations: [{
    field: 'dataSets',
    type: 'HIDE_FIELD'
  }]
}, {
  field: 'programs',
  when: [{
    operator: 'SYSTEM_SETTING_IS_FALSE',
    value: 'keyAllowObjectAssignment'
  }],
  operations: [{
    field: 'programs',
    type: 'HIDE_FIELD'
  }]
}]], ['programRule', [{
  field: 'name',
  when: [{
    field: 'program',
    operator: 'HAS_VALUE'
  }],
  operations: [{
    type: 'SET_PROP',
    propName: 'disabled',
    thenValue: false,
    elseValue: true
  }]
}, {
  field: 'description',
  when: [{
    field: 'program',
    operator: 'HAS_VALUE'
  }],
  operations: [{
    type: 'SET_PROP',
    propName: 'disabled',
    thenValue: false,
    elseValue: true
  }]
}, {
  field: 'priority',
  when: [{
    field: 'program',
    operator: 'HAS_VALUE'
  }],
  operations: [{
    type: 'SET_PROP',
    propName: 'disabled',
    thenValue: false,
    elseValue: true
  }]
}, {
  field: 'condition',
  when: [{
    field: 'program',
    operator: 'HAS_VALUE'
  }],
  operations: [{
    type: 'SET_PROP',
    propName: 'disabled',
    thenValue: false,
    elseValue: true
  }]
}, {
  field: 'programRuleActions',
  when: [{
    field: 'program',
    operator: 'HAS_VALUE'
  }],
  operations: [{
    type: 'SET_PROP',
    propName: 'disabled',
    thenValue: false,
    elseValue: true
  }]
}]], ['programRuleVariable', [{
  field: 'program',
  when: [{
    field: 'dataElement',
    operator: 'HAS_STRING_VALUE'
  }, {
    field: 'trackedEntityAttribute',
    operator: 'HAS_STRING_VALUE'
  }, {
    field: 'programStage',
    operator: 'HAS_STRING_VALUE'
  }],
  operations: [{
    type: 'SET_PROP',
    propName: 'disabled',
    thenValue: true,
    elseValue: false
  }]
}, {
  field: 'dataElement',
  when: [{
    field: 'programRuleVariableSourceType',
    operator: 'ONEOF',
    value: ['CALCULATED_VALUE', 'TEI_ATTRIBUTE']
  }],
  operations: [{
    field: 'dataElement',
    type: 'HIDE_FIELD'
  }]
}, {
  field: 'trackedEntityAttribute',
  when: [{
    field: 'programRuleVariableSourceType',
    operator: 'NOT_EQUALS',
    value: 'TEI_ATTRIBUTE'
  }],
  operations: [{
    field: 'trackedEntityAttribute',
    type: 'HIDE_FIELD'
  }]
}, {
  field: 'programStage',
  when: [{
    field: 'programRuleVariableSourceType',
    operator: 'NOT_EQUALS',
    value: 'DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE'
  }],
  operations: [{
    field: 'programStage',
    type: 'HIDE_FIELD'
  }]
}, {
  field: 'programStage',
  when: [{
    field: 'dataElement',
    operator: 'HAS_STRING_VALUE'
  }],
  operations: [{
    type: 'SET_PROP',
    propName: 'disabled',
    thenValue: true,
    elseValue: false
  }]
}]], ['programStage', [{
  field: 'autoGenerateEvent',
  when: [{
    field: 'autoGenerateEvent',
    operator: 'NOT_EQUALS',
    value: true
  }],
  operations: [{
    field: 'openAfterEnrollment',
    type: 'HIDE_FIELD'
  }, {
    field: 'reportDateToUse',
    type: 'HIDE_FIELD'
  }]
}, {
  field: 'reportDateToUse',
  when: [{
    field: 'openAfterEnrollment',
    operator: 'NOT_EQUALS',
    value: true
  }],
  operations: [{
    type: 'SET_PROP',
    propName: 'disabled',
    thenValue: true,
    elseValue: false
  }]
}]], ['eventProgramStage', [createDefaultRuleForField('validationStrategy', "ON_COMPLETE")]], ['programIndicator', [{
  field: 'analyticsPeriodBoundaries',
  when: [{
    field: 'analyticsType',
    operator: 'EQUALS',
    value: 'EVENT'
  }],
  operations: [{
    type: 'CHANGE_VALUE',
    setValue: function setValue(model, fieldConfig) {
      if (fieldConfig) {
        fieldConfig.value = defaultAnalyticsPeriodBoundaries('event', fieldConfig.value);
        model[fieldConfig.name] = defaultAnalyticsPeriodBoundaries('event', fieldConfig.value);
      }
    }
  }]
}, {
  field: 'analyticsPeriodBoundaries',
  when: [{
    field: 'analyticsType',
    operator: 'EQUALS',
    value: 'ENROLLMENT'
  }],
  operations: [{
    type: 'CHANGE_VALUE',
    setValue: function setValue(model, fieldConfig) {
      if (fieldConfig) {
        fieldConfig.value = defaultAnalyticsPeriodBoundaries('enrollment', fieldConfig.value);
        model[fieldConfig.name] = defaultAnalyticsPeriodBoundaries('enrollment', fieldConfig.value);
      }
    }
  }]
}]], ['programStageNotificationTemplate', [{
  field: 'notificationTrigger',
  when: [{
    field: 'notificationTrigger',
    operator: 'NOT_EQUALS',
    value: 'SCHEDULED_DAYS_DUE_DATE'
  }],
  operations: [{
    field: 'relativeScheduledDays',
    type: 'HIDE_FIELD'
  }]
}, {
  field: 'notificationRecipient',
  when: [{
    field: 'notificationRecipient',
    operator: 'NONEOF',
    value: ['TRACKED_ENTITY_INSTANCE', 'ORGANISATION_UNIT_CONTACT']
  }],
  operations: [{
    field: 'deliveryChannels',
    type: 'HIDE_FIELD'
  }]
}, {
  field: 'notificationRecipient',
  when: [{
    field: 'notificationRecipient',
    operator: 'NOT_EQUALS',
    value: 'DATA_ELEMENT'
  }],
  operations: [{
    field: 'recipientDataElement',
    type: 'HIDE_FIELD'
  }]
}, {
  field: 'notificationRecipient',
  when: [{
    field: 'notificationRecipient',
    operator: 'NOT_EQUALS',
    value: 'PROGRAM_ATTRIBUTE'
  }],
  operations: [{
    field: 'recipientProgramAttribute',
    type: 'HIDE_FIELD'
  }]
}, {
  field: 'notificationRecipient',
  when: [{
    field: 'notificationRecipient',
    operator: 'NOT_EQUALS',
    value: 'USER_GROUP'
  }],
  operations: [{
    field: 'notifyUsersInHierarchyOnly',
    type: 'HIDE_FIELD'
  }]
}, {
  field: 'notificationRecipient',
  when: [{
    field: 'notificationRecipient',
    operator: 'NOT_EQUALS',
    value: 'USER_GROUP'
  }],
  operations: [{
    field: 'notifyParentOrganisationUnitOnly',
    type: 'HIDE_FIELD'
  }]
}, {
  field: 'notifyUsersInHierarchyOnly',
  when: [{
    field: 'notifyParentOrganisationUnitOnly',
    operator: 'EQUALS',
    value: true
  }],
  operations: [{
    field: 'notifyUsersInHierarchyOnly',
    type: 'SET_PROP',
    propName: 'disabled',
    thenValue: true,
    elseValue: false
  }]
}, {
  field: 'notifyParentOrganisationUnitOnly',
  when: [{
    field: 'notifyUsersInHierarchyOnly',
    operator: 'EQUALS',
    value: true
  }],
  operations: [{
    field: 'notifyParentOrganisationUnitOnly',
    type: 'SET_PROP',
    propName: 'disabled',
    thenValue: true,
    elseValue: false
  }]
}]], ['programNotificationTemplate', [{
  field: 'notificationTrigger',
  when: [{
    field: 'notificationTrigger',
    operator: 'NONEOF',
    value: ['SCHEDULED_DAYS_INCIDENT_DATE', 'SCHEDULED_DAYS_ENROLLMENT_DATE']
  }],
  operations: [{
    field: 'relativeScheduledDays',
    type: 'HIDE_FIELD'
  }]
}, {
  field: 'notificationRecipient',
  when: [{
    field: 'notificationRecipient',
    operator: 'NONEOF',
    value: ['TRACKED_ENTITY_INSTANCE', 'ORGANISATION_UNIT_CONTACT']
  }],
  operations: [{
    field: 'deliveryChannels',
    type: 'HIDE_FIELD'
  }]
}, {
  field: 'notificationRecipient',
  when: [{
    field: 'notificationRecipient',
    operator: 'NOT_EQUALS',
    value: 'PROGRAM_ATTRIBUTE'
  }],
  operations: [{
    field: 'recipientProgramAttribute',
    type: 'HIDE_FIELD'
  }]
}, {
  field: 'notificationRecipient',
  when: [{
    field: 'notificationRecipient',
    operator: 'NOT_EQUALS',
    value: 'USER_GROUP'
  }],
  operations: [{
    field: 'notifyUsersInHierarchyOnly',
    type: 'HIDE_FIELD'
  }]
}, {
  field: 'notificationRecipient',
  when: [{
    field: 'notificationRecipient',
    operator: 'NOT_EQUALS',
    value: 'USER_GROUP'
  }],
  operations: [{
    field: 'notifyParentOrganisationUnitOnly',
    type: 'HIDE_FIELD'
  }]
}]], ['categoryCombo', [{
  field: 'dataDimensionType',
  when: [{
    field: 'dataDimensionType',
    operator: 'HAS_NO_VALUE'
  }],
  operations: [{
    type: 'CHANGE_VALUE',
    setValue: function setValue(model, fieldConfig) {
      fieldConfig.value = model[fieldConfig.name] = 'DISAGGREGATION';
    }
  }]
}]], ['sqlView', [{
  field: 'name',
  when: {
    field: 'id',
    operator: 'HAS_VALUE'
  },
  operations: [{
    type: 'SET_PROP',
    propName: 'disabled',
    thenValue: true,
    elseValue: false
  }]
}, {
  field: 'type',
  when: {
    field: 'id',
    operator: 'HAS_VALUE'
  },
  operations: [{
    type: 'SET_PROP',
    propName: 'disabled',
    thenValue: true,
    elseValue: false
  }]
}]], ['relationshipType', [{
  field: 'toFromName',
  when: {
    field: 'bidirectional',
    operator: 'NOT_EQUALS',
    value: true
  },
  operations: [{
    type: 'HIDE_FIELD'
  }]
}]], ['dataSet', [{
  field: 'openPeriodsAfterCoEndDate',
  when: {
    field: 'categoryCombo',
    operator: 'PREDICATE',
    value: function value(categoryComboField) {
      return categoryComboField && categoryComboField.name === 'default';
    }
  },
  operations: [{
    type: 'HIDE_FIELD'
  }]
}]]]);

var _excluded$1 = ["field", "type"];
/* eslint-disable no-use-before-define */

var whenOperatorMap = new Map([['EQUALS', equalsOperator], ['NOT_EQUALS', notEqualsOperator], ['HAS_VALUE', hasValueOperator], ['HAS_NO_VALUE', fp.negate(hasValueOperator)], ['HAS_STRING_VALUE', hasStringValueOperator], ['ONEOF', oneOfOperator], ['NONEOF', noneOfOperator], ['SYSTEM_SETTING_IS_TRUE', systemSettingIsTrueOperator], ['SYSTEM_SETTING_IS_FALSE', systemSettingIsFalseOperator], ['IS_VALID_POINT', isPointOperator], ['IS_HIDDEN_FIELD', isHiddenFieldOperator], ['PREDICATE', predicateOperator]]);
var operationsMap = new Map([['SET_PROP', setProp], ['CHANGE_VALUE', changeValue], ['HIDE_FIELD', hideField], ['SHOW_FIELD', showField]]);
/* eslint-enable no-use-before-define */

function getRulesForModelType(fieldName) {
  if (fieldRules.has(fieldName)) {
    return fieldRules.get(fieldName);
  }

  return [];
}

function changeValue(fieldConfig, operationParams, ruleResult, model) {
  if (ruleResult) {
    operationParams.setValue(model, fieldConfig);
  }
}

function setProp(fieldConfig, operationParams, ruleResult) {
  if (!fieldConfig) {
    return;
  }

  if (ruleResult) {
    return fieldConfig.props[operationParams.propName] = operationParams.thenValue;
  }

  return fieldConfig.props[operationParams.propName] = operationParams.elseValue;
}
/*
    Uses the swapping variable "hiddenComponent" when temporary hiding a field.
    When the field should be shown again, the content of "hiddenComponent" is
    put back to the "component" variable.
*/


function hideField(fieldConfig, operationParams, ruleResult) {
  if (ruleResult && fieldConfig) {
    fieldConfig.hiddenComponent = fieldConfig.hiddenComponent || fieldConfig.component;

    fieldConfig.component = function () {
      return null;
    };
  } else if (fieldConfig && fieldConfig.hiddenComponent) {
    fieldConfig.component = fieldConfig.hiddenComponent;
    delete fieldConfig.hiddenComponent;
  }
}

function showField(fieldConfig, operationParams, ruleResult) {
  if (ruleResult && fieldConfig.hiddenComponent) {
    fieldConfig.component = fieldConfig.hiddenComponent;
    delete fieldConfig.hiddenComponent;
  } else {
    fieldConfig.hiddenComponent = fieldConfig.hiddenComponent || fieldConfig.component;

    fieldConfig.component = function () {
      return null;
    };
  }
}

function getOperation(operationType) {
  return operationsMap.has(operationType) ? operationsMap.get(operationType) : _default$4;
}

function getWhenOperator(operatorType) {
  return whenOperatorMap.has(operatorType) ? whenOperatorMap.get(operatorType) : _default$4;
}

function hasValueOperator(value) {
  return value !== undefined && value !== null;
}

function hasStringValueOperator(value) {
  return hasValueOperator(value) && value.toString().trim().length > 0;
}

function equalsOperator(left, right) {
  return left === right;
}

function notEqualsOperator(left, right) {
  return left !== right;
}

function oneOfOperator(value, list) {
  return list.indexOf(value) >= 0;
}

function noneOfOperator(value, list) {
  return list.indexOf(value) < 0;
}

function predicateOperator(value, predicate) {
  return predicate(value);
}

function isPointOperator(value) {
  // TODO: Use the same validator as the one in the coordinate-field (perhaps move it to d2/d2-ui)
  try {
    var poly = JSON.parse(value);
    return Array.isArray(poly) && (poly.length === 0 || poly.length === 2 && !isNaN(poly[0]) && !isNaN(poly[1]));
  } catch (e) {
    return false;
  }
}

function isHiddenFieldOperator(a, b, fieldConfig) {
  return fieldConfig.hasOwnProperty('hiddenComponent');
}

function systemSettingIsTrueOperator(value, settingKey) {
  var settingsValue = systemSettingsStore.getState() ? systemSettingsStore.getState()[settingKey] : undefined;
  return settingsValue === true;
}

function systemSettingIsFalseOperator(value, settingKey) {
  var settingsValue = systemSettingsStore.getState() ? systemSettingsStore.getState()[settingKey] : undefined;
  return settingsValue === false;
}

function ruleRunner(_ref, fieldConfig, model) {
  var whenFieldName = _ref.whenFieldName,
      operatorFn = _ref.operatorFn,
      whenValue = _ref.whenValue;
  return operatorFn(model[whenFieldName], whenValue, fieldConfig, model, whenFieldName);
}

function rulesRunner(rules, rule, modelToEdit, fieldConfigs) {
  return rules.map(function (whenRule, index) {
    // log.debug(`For field ${rule.field} run the when-rule where field ` +
    //     ` ${whenRule.field || rule.field} ${getWhenOperator(whenRule.operator).name}` +
    //     ` ${whenRule.value || ''} ${rule.field} ${rules.length > (index + 1) && 'then run'}`);
    var fieldConfigForRule = fieldConfigs.find(function (fieldConfig) {
      return fieldConfig.name === (whenRule.field || rule.field);
    });
    var whenFieldName = whenRule.field ? whenRule.field : rule.field;
    var operatorFn = getWhenOperator(whenRule.operator);
    var whenValue = whenRule.value;
    return ruleRunner({
      whenFieldName: whenFieldName,
      operatorFn: operatorFn,
      whenValue: whenValue
    }, fieldConfigForRule, modelToEdit);
  });
}

function applyRulesToFieldConfigs(rules, fieldConfigs, modelToEdit) {
  rules.forEach(function (rule) {
    var rules = _default$3(rule.when) ? rule.when : [rule.when];
    var rulePassed = rulesRunner(rules, rule, modelToEdit, fieldConfigs).some(function (result) {
      return result === true;
    }); // log.debug('And the result is', rulePassed);

    (rule.operations || [rule.operation]).forEach(function (operation) {
      var fieldConfigForOperation = fieldConfigs.find(function (fieldConfig) {
        return fieldConfig.name === (operation.field || rule.field);
      });

      operation.field;
          var type = operation.type,
          operationParams = _objectWithoutProperties(operation, _excluded$1); // log.debug(`---- For field ${field || rule.field} 
      //         execute ${getOperation(type).name} 
      //         with`, operationParams);


      getOperation(type)(fieldConfigForOperation, operationParams, rulePassed, modelToEdit);
    });
  });
  return fieldConfigs;
}

function getLabelText(labelText) {
  var fieldConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  // Add required indicator when the field is required
  if (fieldConfig.props && fieldConfig.props.isRequired) {
    return "".concat(labelText, " (*)");
  }

  return labelText;
}

function createAttributeFieldConfigs(d2, schemaName) {
  var modelDefinition = d2.models[schemaName];
  return Object.keys(modelDefinition.attributeProperties).map(function (attributeName) {
    var attribute = modelDefinition.attributeProperties[attributeName];
    return createFieldConfig({
      name: attribute.name,
      valueType: attribute.valueType,
      type: typeToFieldMap.get(attribute.optionSet ? 'CONSTANT' : attribute.valueType),
      required: Boolean(attribute.mandatory),
      fieldOptions: {
        labelText: attribute.name,
        options: attribute.optionSet ? attribute.optionSet.options.map(function (option) {
          return {
            name: option.displayName || option.name,
            value: option.code
          };
        }) : []
      }
    }, modelDefinition, d2.models);
  });
} // Translate the sync validator messages if there are any validators


function translateValidators(fieldConfig, d2) {
  if (fieldConfig.validators) {
    fieldConfig.validators = fieldConfig.validators.map(function (validator) {
      return _objectSpread2(_objectSpread2({}, validator), {}, {
        message: d2.i18n.getTranslation(validator.message)
      });
    });
  }
} // Get the field's label with required indicator if the field is required
// Save one translated label for validation messages


function setRequiredFieldsLabelText(fieldConfig, d2) {
  fieldConfig.translatedName = d2.i18n.getTranslation(fieldConfig.props.labelText);
  fieldConfig.props.labelText = getLabelText(fieldConfig.translatedName, fieldConfig);
}
/* 
 * If the modelType are grouped in field-groups.js, the step number and group/step name 
 * will be added to the fieldConfig. This string can later be used for the validating
 * step in EditModelForm.isRequiredFieldsValid to tell the user which step to find the 
 * non-valid required field.
 */


function setRequiredFieldsStepName(fieldConfig, modelType, d2) {
  // TODO: Find way to fix programNotificationTemplate sending the correct modelType
  if (fieldGroups.isGroupedFields(modelType) && modelType !== 'programNotificationTemplate') {
    var stepNo = fieldGroups.groupNoByName(fieldConfig.name, modelType);
    var stepName = fieldGroups.groupNameByStep(stepNo, modelType);
    fieldConfig.step = "".concat(stepNo + 1, ": ").concat(d2.i18n.getTranslation(stepName));
  }
}

function createFieldConfigForModelTypes(_x, _x2) {
  return _createFieldConfigForModelTypes.apply(this, arguments);
}

function _createFieldConfigForModelTypes() {
  _createFieldConfigForModelTypes = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(modelType, forcedFieldOrderNames) {
    var includeAttributes,
        customFieldOrderName,
        d2,
        formFieldsManager,
        _iterator,
        _step,
        _step$value,
        fieldName,
        overrideConfig,
        _args = arguments;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            includeAttributes = _args.length > 2 && _args[2] !== undefined ? _args[2] : true;
            customFieldOrderName = _args.length > 3 ? _args[3] : undefined;
            _context.next = 4;
            return getInstance();

          case 4:
            d2 = _context.sent;
            formFieldsManager = new FormFieldsManager(new FormFieldsForModel(d2.models));
            formFieldsManager.setFieldOrder(forcedFieldOrderNames || fieldOrder["for"](modelType));
            _iterator = _createForOfIteratorHelper(fieldOverrides["for"](customFieldOrderName || modelType));

            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                _step$value = _slicedToArray(_step.value, 2), fieldName = _step$value[0], overrideConfig = _step$value[1];
                formFieldsManager.addFieldOverrideFor(fieldName, overrideConfig);
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }

            return _context.abrupt("return", formFieldsManager.getFormFieldsForModel({
              modelDefinition: d2.models[modelType]
            }, customFieldOrderName).map(function (fieldConfig) {
              translateValidators(fieldConfig, d2);
              setRequiredFieldsStepName(fieldConfig, modelType, d2);
              setRequiredFieldsLabelText(fieldConfig, d2);
              return fieldConfig;
            }).concat(includeAttributes ? createAttributeFieldConfigs(d2, modelType) : []));

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _createFieldConfigForModelTypes.apply(this, arguments);
}

function createUniqueValidator(fieldConfig, modelDefinition, uid) {
  return function checkAgainstServer(value) {
    // Don't validate against the server when we have no value
    if (!value || !value.trim()) {
      return Promise.resolve(true);
    }

    var modelDefinitionWithFilter = modelDefinition.filter().on(fieldConfig.fieldOptions.referenceProperty).equals(value);

    if (uid) {
      modelDefinitionWithFilter = modelDefinitionWithFilter.filter().on('id').notEqual(uid);
    }

    return modelDefinitionWithFilter.list().then(function (collection) {
      if (collection.size !== 0) {
        return getInstance().then(function (d2) {
          return d2.i18n.getTranslation('value_not_unique');
        }).then(function (message) {
          return Promise.reject(message);
        });
      }

      return Promise.resolve(true);
    });
  };
}

function addUniqueValidatorWhenUnique(fieldConfig, modelToEdit) {
  if (fieldConfig.unique) {
    fieldConfig.asyncValidators = [createUniqueValidator(fieldConfig, modelToEdit.modelDefinition, modelToEdit.id)];
  }

  return fieldConfig;
}
function isAttribute(model, fieldConfig) {
  return model.attributes && new Set(Object.keys(model.attributes)).has(fieldConfig.name);
}

var transformValuesUsingConverters = function transformValuesUsingConverters(fieldConfig) {
  if (fieldConfig.beforePassToFieldConverter) {
    return _objectSpread2(_objectSpread2({}, fieldConfig), {}, {
      value: fieldConfig.beforePassToFieldConverter(fieldConfig.value)
    });
  }

  return fieldConfig;
};

var addModelToFieldConfigProps = function addModelToFieldConfigProps(model) {
  return function (fieldConfig) {
    return _objectSpread2(_objectSpread2({}, fieldConfig), {}, {
      props: _objectSpread2(_objectSpread2({}, fieldConfig.props), {}, {
        model: model
      })
    });
  };
};

function addValuesToFieldConfigs(fieldConfigs, model) {
  return fieldConfigs.map(function (fieldConfig) {
    if (isAttribute(model, fieldConfig)) {
      return _objectSpread2(_objectSpread2({}, fieldConfig), {}, {
        value: model.attributes[fieldConfig.name]
      });
    }

    return _objectSpread2(_objectSpread2({}, fieldConfig), {}, {
      value: model[fieldConfig.name]
    });
  }).map(transformValuesUsingConverters).map(addModelToFieldConfigProps(model));
}
/**
 * Create fieldConfigs for a schema
 * @param schema - Schema to create configs for
 * @param fieldNames - Fields to use
 * @param filterFieldConfigs - A filter function that should return an array of fieldConfigs (must be same amount of fieldConfigs)
 * @param includeAttributes - Whether to include attributes
 * @param runRules - Whether to apply field-rules specified in field-rules file.
 * @param customFieldOrderName - Custom name for the "schema", useful if the same schema has multiple purposes.
 * Ie. programNotificationTemplate, which are used in program Notification and programStage notifications.
 */


function createFieldConfigsFor(schema, fieldNames) {
  var filterFieldConfigs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : fp.identity;
  var includeAttributes = arguments.length > 3 ? arguments[3] : undefined;
  var runRules = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
  var customFieldOrderName = arguments.length > 5 ? arguments[5] : undefined;
  // eslint-disable-next-line no-param-reassign
  filterFieldConfigs = filterFieldConfigs || fp.identity;
  return _default$5(function (props$) {
    return props$.filter(function (_ref) {
      var model = _ref.model;
      return model;
    }).combineLatest(Observable.fromPromise(createFieldConfigForModelTypes(schema, fieldNames, includeAttributes, customFieldOrderName)), function (props, fieldConfigs) {
      var fieldConfigsWithValues = addValuesToFieldConfigs(fieldConfigs, props.model);
      var fieldConfigsToUse = runRules ? applyRulesToFieldConfigs(getRulesForModelType(customFieldOrderName || schema), filterFieldConfigs(fieldConfigsWithValues), props.model) : fieldConfigsWithValues;
      return _objectSpread2(_objectSpread2({}, props), {}, {
        fieldConfigs: fieldConfigsToUse
      });
    });
  });
}

var convertValueUsingFieldConverter = function convertValueUsingFieldConverter(fieldConfigs, onChangeCallback) {
  return function (fieldName, value) {
    var fieldConfig = fieldConfigs.find(function (fieldConfig) {
      return fieldConfig.name === fieldName;
    });
    var converter = fieldConfig.beforeUpdateConverter || fp.identity;
    return onChangeCallback(fieldName, converter(value));
  };
}; // TODO: Refactor includeAttributes magic flag to separate method `createFormWithAttributesFor`


function createFormFor(source$, schema, properties, includeAttributes, customFieldOrderName) {
  var enhance = fp.compose(_default$5(function (props$) {
    return props$.combineLatest(source$, function (props, model) {
      return _objectSpread2(_objectSpread2({}, props), {}, {
        model: model
      });
    });
  }), createFieldConfigsFor(schema, properties, undefined, includeAttributes, false, customFieldOrderName));

  function CreatedFormBuilderForm(_ref2) {
    var fieldConfigs = _ref2.fieldConfigs,
        model = _ref2.model,
        editFieldChanged = _ref2.editFieldChanged,
        _ref2$detailsFormStat = _ref2.detailsFormStatusChange,
        detailsFormStatusChange = _ref2$detailsFormStat === void 0 ? fp.noop : _ref2$detailsFormStat;
    var onUpdateField = convertValueUsingFieldConverter(fieldConfigs, editFieldChanged);
    var fieldConfigsAfterRules = applyRulesToFieldConfigs(getRulesForModelType(customFieldOrderName || schema), fieldConfigs, model);
    return /*#__PURE__*/react.createElement(FormBuilder, {
      fields: fieldConfigsAfterRules,
      onUpdateField: onUpdateField,
      onUpdateFormStatus: detailsFormStatusChange
    });
  }

  return enhance(CreatedFormBuilderForm);
}
/**
 * Add given props to the fieldConfig.
 * If fieldNames has values, only fields with those name will be given the props.
 * Useful to be given to map() of fieldConfigs.
 *
 * Ie: Only fields with name='shortname' will be given the props.
 * @example
 *  fieldConfigs.map(addPropsToFieldConfig[props, ['shortName']
 * @param fieldNames to add the props to.
 * @param props to add to fields
 * @returns {function(*): {props: {}}} fieldConfig with the props added.
 */

var addPropsToFieldConfig = function addPropsToFieldConfig(props) {
  var fieldNames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return function (fieldConfig) {
    return fieldNames.length < 1 || fieldNames.includes(fieldConfig.name) ? _objectSpread2(_objectSpread2({}, fieldConfig), {}, {
      props: _objectSpread2(_objectSpread2({}, fieldConfig.props), props)
    }) : fieldConfig;
  };
};

var arrowForward = {};

Object.defineProperty(arrowForward, "__esModule", {
  value: true
});

var _react$1 = react;

var _react2$1 = _interopRequireDefault$1(_react$1);

var _pure$1 = pure;

var _pure2$1 = _interopRequireDefault$1(_pure$1);

var _SvgIcon$1 = SvgIcon;

var _SvgIcon2$1 = _interopRequireDefault$1(_SvgIcon$1);

function _interopRequireDefault$1(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NavigationArrowForward = function NavigationArrowForward(props) {
  return _react2$1.default.createElement(
    _SvgIcon2$1.default,
    props,
    _react2$1.default.createElement('path', { d: 'M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z' })
  );
};
NavigationArrowForward = (0, _pure2$1.default)(NavigationArrowForward);
NavigationArrowForward.displayName = 'NavigationArrowForward';
NavigationArrowForward.muiName = 'SvgIcon';

var _default$1 = arrowForward.default = NavigationArrowForward;

var arrowBack = {};

Object.defineProperty(arrowBack, "__esModule", {
  value: true
});

var _react = react;

var _react2 = _interopRequireDefault(_react);

var _pure = pure;

var _pure2 = _interopRequireDefault(_pure);

var _SvgIcon = SvgIcon;

var _SvgIcon2 = _interopRequireDefault(_SvgIcon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NavigationArrowBack = function NavigationArrowBack(props) {
  return _react2.default.createElement(
    _SvgIcon2.default,
    props,
    _react2.default.createElement('path', { d: 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z' })
  );
};
NavigationArrowBack = (0, _pure2.default)(NavigationArrowBack);
NavigationArrowBack.displayName = 'NavigationArrowBack';
NavigationArrowBack.muiName = 'SvgIcon';

var _default = arrowBack.default = NavigationArrowBack;

var _excluded = ["activeStep", "stepperClicked", "disabled"],
    _excluded2 = ["activeStep"];

function isActiveStep(activeStep, step, index) {
  if (fp.isString(activeStep)) {
    return activeStep === step.key;
  }

  return activeStep === index;
}

var getStepFields = function getStepFields(step, fieldConfigs, modelType) {
  var stepsByField = fieldGroups.groupsByField(modelType);

  if (stepsByField) {
    fieldConfigs.map(function (field) {
      if (stepsByField[field.name] === step || field.isAttribute && step === 0 // add custom attributes-fields to first step
      ) {
        field.props.style = {
          display: 'block'
        };
      } else {
        field.props.style = {
          display: 'none'
        };
      }

      return field;
    });
  }

  return _toConsumableArray(fieldConfigs);
};
var createStepper = function createStepper(_ref) {
  var steps = _ref.steps,
      activeStep = _ref.activeStep,
      stepperClicked = _ref.stepperClicked,
      _ref$orientation = _ref.orientation,
      orientation = _ref$orientation === void 0 ? 'horizontal' : _ref$orientation;
  return /*#__PURE__*/react.createElement(_default$6, {
    activeStep: activeStep,
    linear: false,
    orientation: orientation,
    style: {
      margin: '0 -16px'
    }
  }, steps.map(function (step, index) {
    return /*#__PURE__*/react.createElement(_default$7, {
      key: step.label
    }, /*#__PURE__*/react.createElement(_default$8, {
      onClick: function onClick() {
        return stepperClicked(index);
      }
    }, /*#__PURE__*/react.createElement(Translate, null, step.label)));
  }));
};
/**
 * Create a Stepper component from a configuration object.
 *
 * @param {Array} stepperConfig Config array that defines the steps that should be shown.
 * @param {String} [orientation='horizontal'] The orientation in which to render the Stepper.
 *
 * @returns {ReactComponent} A React component that will render the steps as defined by the `stepperConfig`
 *
 * @example
 * ```
 * const steps = [
 *      { key: 'first', name: 'First step!' },
 *      { key: 'last', name: 'My last step!' },
 * ];
 * const MyStepperComponent = createStepperFromConfig(steps)
 *
 * // <MyStepperComponent activeStep={activeStep.key} />
 * ```
 */

var createStepperFromConfig = function createStepperFromConfig(stepperConfig) {
  var orientation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'horizontal';
  return function (_ref2) {
    var activeStep = _ref2.activeStep,
        stepperClicked = _ref2.stepperClicked,
        disabled = _ref2.disabled,
        props = _objectWithoutProperties(_ref2, _excluded);

    var getStepChildren = function getStepChildren(step) {
      var stepChildren = [];
      stepChildren.push( /*#__PURE__*/react.createElement(_default$8, {
        key: "button",
        onClick: function onClick() {
          return stepperClicked(step.key);
        }
      }, /*#__PURE__*/react.createElement(Translate, null, step.name)));

      if (step.content) {
        stepChildren.push( /*#__PURE__*/react.createElement(_default$9, {
          key: "content"
        }, /*#__PURE__*/react.createElement(step.content, props)));
      }

      return stepChildren;
    };

    return /*#__PURE__*/react.createElement(_default$6, {
      linear: false,
      orientation: orientation,
      activeStep: fp.isNumber(activeStep) ? activeStep : undefined
    }, stepperConfig.map(function (step, index) {
      return /*#__PURE__*/react.createElement(_default$7, {
        key: step.key,
        active: isActiveStep(activeStep, step, index),
        disabled: !!disabled
      }, getStepChildren(step));
    }));
  };
};
/**
 * Create a StepperContent component from a configuration object. The StepperContent component renders the content that
 * belongs to the current `activeStep`. When the config does not specify a `component` property for the current active
 * step a warning is logged and `null` is rendered.
 * The `component` is passed all the props passed to the StepperContent.
 *
 * @param {Array} stepperConfig Config array that defines the steps and the components that should be rendered for the
 * currently active step.
 *
 * @returns {ReactComponent} A React component that will render the `component` property of the currently active step.
 */

var createStepperContentFromConfig = function createStepperContentFromConfig(stepperConfig) {
  return function (_ref3) {
    var activeStep = _ref3.activeStep,
        props = _objectWithoutProperties(_ref3, _excluded2);

    var step = stepperConfig.find(function (stepConfig) {
      return stepConfig.key === activeStep;
    });

    if (step && step.component) {
      return /*#__PURE__*/react.createElement(step.component, props);
    }

    if (activeStep) {
      log.warn("Could not find a content component for a step with key (".concat(activeStep, ") in"), stepperConfig);
    } else {
      log.warn('The `activeStep` prop is undefined, therefore the component created by `createStepperContentFromConfig` will render null');
    }

    return null;
  };
};
function StepperNavigationBack(_ref4) {
  var onBackClick = _ref4.onBackClick;
  return /*#__PURE__*/react.createElement(_default$a, {
    onClick: onBackClick
  }, /*#__PURE__*/react.createElement(_default, null));
}
function StepperNavigationForward(_ref5) {
  var onForwardClick = _ref5.onForwardClick;
  return /*#__PURE__*/react.createElement(_default$a, {
    onClick: onForwardClick
  }, /*#__PURE__*/react.createElement(_default$1, null));
}
function createStepperNavigation(BackwardButton, ForwardButton) {
  var styles = {
    buttons: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: '4rem 1rem 1rem'
    }
  };

  var StepperNavigation = function StepperNavigation(_ref6) {
    var children = _ref6.children;
    return /*#__PURE__*/react.createElement("div", {
      style: styles.buttons
    }, /*#__PURE__*/react.createElement(BackwardButton, null), children, /*#__PURE__*/react.createElement(ForwardButton, null));
  };

  return StepperNavigation;
} // ////////////////////////////////////////////////////////////////
// Redux specfic helpers, don't move to

var mapDispatchToProps = function mapDispatchToProps(actionCreators) {
  return function (dispatch) {
    return bindActionCreators(actionCreators, dispatch);
  };
};

var createConnectedForwardButton = function createConnectedForwardButton(nextStepActionCreator) {
  return connect(undefined, mapDispatchToProps({
    onForwardClick: nextStepActionCreator
  }))(StepperNavigationForward);
};
var createConnectedBackwardButton = function createConnectedBackwardButton(previousStepAcionCreator) {
  return connect(undefined, mapDispatchToProps({
    onBackClick: previousStepAcionCreator
  }))(StepperNavigationBack);
};

export { CancelButton$1 as C, applyRulesToFieldConfigs as a, addUniqueValidatorWhenUnique as b, createFieldConfigForModelTypes as c, getStepFields as d, createStepper as e, fieldGroups as f, getRulesForModelType as g, createStepperFromConfig as h, createFieldConfigsFor as i, addPropsToFieldConfig as j, createStepperContentFromConfig as k, createConnectedForwardButton as l, createConnectedBackwardButton as m, createStepperNavigation as n, createFormFor as o };
