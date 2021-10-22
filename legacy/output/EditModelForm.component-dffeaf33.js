import { r as react, T as Translate, F as _default, E as _default$1, ae as Store, bV as Action, i as getInstance, O as Observable, c8 as IndicatorExpressionManager, c9 as createActionToValidation$, ca as store, bW as CircularProgress, aC as Dropdown, A as _defineProperty, cb as store$1, k as _inherits, l as _createSuper, m as _classCallCheck, B as _assertThisInitialized, n as _createClass, c7 as modelToEditStore, a4 as _objectSpread2, af as _default$2, ag as _default$3, ah as _default$4, a0 as addD2Context, al as fp, e as appState, j as _slicedToArray, ad as snackActions, cc as objectActions, p as log, c4 as FormBuilder } from './index-44839b1a.js';
import { S as SaveButton } from './SaveButton.component-265ebd88.js';
import { c as createFieldConfigForModelTypes, a as applyRulesToFieldConfigs, g as getRulesForModelType, b as addUniqueValidatorWhenUnique, d as getStepFields, f as fieldGroups, e as createStepper, C as CancelButton } from './stepper-8c66bd06.js';
import { w as withAuth } from './Auth-bde7a9a8.js';
import { F as FormButtons } from './FormButtons.component-b34f3009.js';

var SharingNotification = react.createClass({
  displayName: "SharingNotification",
  propTypes: {
    modelType: react.PropTypes.string,
    style: react.PropTypes.object
  },
  mixins: [Translate],
  render: function render() {
    var modelDef = this.props.getModelDefinitionByName(this.props.modelType);
    var createPublic = this.props.getCurrentUser().canCreatePublic(modelDef);
    var createPrivate = this.props.getCurrentUser().canCreatePrivate(modelDef);
    var notificationStyle = Object.assign({}, this.props.style, {
      background: 'none',
      margin: '14px 0 0 -4px'
    });
    var notificationTextStyle = {
      verticalAlign: 'super',
      lineHeight: '24px',
      paddingLeft: '.5rem'
    };
    var toRender = null;

    if (createPublic) {
      toRender = /*#__PURE__*/react.createElement(_default, {
        style: notificationStyle,
        zDepth: 0
      }, /*#__PURE__*/react.createElement(_default$1, {
        className: "material-icons"
      }, "lock_open"), /*#__PURE__*/react.createElement("span", {
        style: notificationTextStyle
      }, this.getTranslation('object_will_created_public')));
    } else if (createPrivate) {
      toRender = /*#__PURE__*/react.createElement(_default, {
        style: notificationStyle,
        zDepth: 0
      }, /*#__PURE__*/react.createElement(_default$1, {
        className: "material-icons"
      }, "lock"), /*#__PURE__*/react.createElement("span", {
        style: notificationTextStyle
      }, this.getTranslation('object_will_created_private')));
    }

    return toRender;
  }
});
var SharingNotification$1 = withAuth(SharingNotification);

var indicatorExpressionStatusStore = Store.create();

var actionToValidation$ = createActionToValidation$('indicators/expression/description');
var indicatorExpressionStatusActions = Action.createActionsFromNames(['requestExpressionStatus']);
indicatorExpressionStatusActions.requestExpressionStatus.debounceTime(500).map(function (action) {
  var encodedFormula = encodeURIComponent(action.data);
  var url = "expressions/description?expression=".concat(encodedFormula);
  var request = getInstance().then(function (d2) {
    return d2.Api.getApi().get(url);
  });
  return Observable.fromPromise(request);
}).concatAll().subscribe(function (response) {
  indicatorExpressionStatusStore.setState(response);
});
var IndicatorExpressionManagerContainer = react.createClass({
  displayName: "IndicatorExpressionManagerContainer",
  propTypes: {
    indicatorExpressionChanged: react.PropTypes.func.isRequired,
    description: react.PropTypes.string,
    formula: react.PropTypes.string,
    titleText: react.PropTypes.string
  },
  mixins: [Translate],
  getInitialState: function getInitialState() {
    return {
      organisationUnitGroups: [],
      constants: [],
      programTrackedEntityAttributes: [],
      programIndicators: [],
      programDataElements: []
    };
  },
  componentDidMount: function componentDidMount() {
    var _this = this;

    getInstance().then(function (d2) {
      return d2.models.organisationUnitGroup.list({
        paging: false,
        fields: 'id,displayName'
      });
    }).then(function (collection) {
      return collection.toArray().map(function (model) {
        return {
          value: model.id,
          label: model.displayName
        };
      });
    }).then(function (organisationUnitGroups) {
      return _this.setState({
        organisationUnitGroups: organisationUnitGroups
      });
    });
    getInstance().then(function (d2) {
      return d2.models.constant.list({
        paging: false,
        fields: 'id,displayName'
      });
    }).then(function (collection) {
      return collection.toArray().map(function (model) {
        return {
          value: model.id,
          label: model.displayName
        };
      });
    }).then(function (constants) {
      return _this.setState({
        constants: constants
      });
    });
    this.refs.expressionManager.requestExpressionStatus();
  },
  getExpressionManager: function getExpressionManager() {
    return this.refs.expressionManager;
  },
  render: function render() {
    return /*#__PURE__*/react.createElement(IndicatorExpressionManager, {
      descriptionLabel: this.getTranslation('description'),
      descriptionValue: this.props.description,
      formulaValue: this.props.formula,
      expressionStatusStore: indicatorExpressionStatusStore,
      expressionChanged: this.props.indicatorExpressionChanged,
      titleText: this.props.titleText,
      validateExpression: actionToValidation$,
      ref: "expressionManager",
      expressionType: "indicator"
    });
  }
});

function getLoadingIndicator() {
  return /*#__PURE__*/react.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/react.createElement(CircularProgress, null));
}

function findValue$1(optionList, model) {
  return optionList.map(function (option) {
    return option.value;
  }).find(function (option) {
    return Array.from(model.indicatorGroups.values()).map(function (indicatorGroup) {
      return indicatorGroup.id;
    }).indexOf(option) !== -1;
  });
}

var DataIndicatorGroupsAssignment = react.createClass({
  displayName: "DataIndicatorGroupsAssignment.component",
  propTypes: {
    source: react.PropTypes.object.isRequired
  },
  getInitialState: function getInitialState() {
    store.setState({
      indicatorGroupValues: {},
      remove: [],
      save: []
    });
    return {
      indicatorGroupSets: null
    };
  },
  componentDidMount: function componentDidMount() {
    var _this = this;

    getInstance().then(function (d2) {
      return d2.Api.getApi().get('indicatorGroupSets', {
        fields: 'id,displayName,indicatorGroups[id,displayName]',
        filter: ['compulsory:eq:true'],
        paging: false
      });
    }).then(function (response) {
      return response.indicatorGroupSets;
    }).then(function (indicatorGroupSets) {
      return _this.setState({
        indicatorGroupSets: indicatorGroupSets
      });
    });
    this.subscription = store.subscribe(function () {
      return _this.forceUpdate();
    });
  },
  componentWillUnmount: function componentWillUnmount() {
    if (this.subscription) {
      this.subscription && this.subscription.unsubscribe();
    }
  },
  render: function render() {
    var _this2 = this;

    if (!this.state.indicatorGroupSets) {
      return getLoadingIndicator();
    }

    return /*#__PURE__*/react.createElement("div", null, this.state.indicatorGroupSets.map(function (indicatorGroupSet, key) {
      var optionList = indicatorGroupSet.indicatorGroups.map(function (ig) {
        return {
          value: ig.id,
          text: ig.displayName
        };
      });
      var value = Object.prototype.hasOwnProperty.call(store.state.indicatorGroupValues, indicatorGroupSet.id) ? store.state.indicatorGroupValues[indicatorGroupSet.id] : findValue$1(optionList, _this2.props.source);
      return /*#__PURE__*/react.createElement("div", {
        key: "dataIndicatorGroupAssignment".concat(key)
      }, /*#__PURE__*/react.createElement(Dropdown, {
        key: indicatorGroupSet.id,
        labelText: indicatorGroupSet.displayName,
        translateLabel: false,
        options: optionList,
        value: value,
        onChange: _this2._updateGroupStatus.bind(_this2, indicatorGroupSet.id, findValue$1(optionList, _this2.props.source)),
        fullWidth: true
      }));
    }));
  },
  _updateGroupStatus: function _updateGroupStatus(indicatorGroupSetId, oldValue, event) {
    // TODO: Very bad to change props and set d2.model.dirty manually
    this.props.source.dirty = true;
    store.setState({
      indicatorGroupValues: Object.assign({}, store.state.indicatorGroupValues, _defineProperty({}, indicatorGroupSetId, event.target.value ? event.target.value : null)),
      remove: Array.from(new Set(store.state.remove.concat([oldValue])).values())
    });
  }
});

function getLoadingdataElement() {
  return /*#__PURE__*/react.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/react.createElement(CircularProgress, null));
}

function findValue(optionList, model) {
  return optionList.map(function (option) {
    return option.value;
  }).find(function (option) {
    return Array.from(model.dataElementGroups.values()).map(function (dataElementGroup) {
      return dataElementGroup.id;
    }).indexOf(option) !== -1;
  });
}

var DataElementGroupsAssignment = react.createClass({
  displayName: "DataElementGroupsAssignment.component",
  propTypes: {
    source: react.PropTypes.object.isRequired
  },
  getInitialState: function getInitialState() {
    store$1.setState({
      dataElementGroupValues: {},
      remove: [],
      save: []
    });
    return {
      dataElementGroupSets: null
    };
  },
  componentDidMount: function componentDidMount() {
    var _this = this;

    getInstance().then(function (d2) {
      return d2.Api.getApi().get('dataElementGroupSets', {
        fields: 'id,displayName,dataElementGroups[id,displayName]',
        filter: ['compulsory:eq:true'],
        paging: false
      });
    }).then(function (response) {
      return response.dataElementGroupSets;
    }).then(function (dataElementGroupSets) {
      return _this.setState({
        dataElementGroupSets: dataElementGroupSets
      });
    });
    this.subscription = store$1.subscribe(function () {
      return _this.forceUpdate();
    });
  },
  componentWillUnmount: function componentWillUnmount() {
    if (this.subscription && this.subscription.unsubscribe) {
      this.subscription.unsubscribe();
    }
  },
  _updateGroupStatus: function _updateGroupStatus(dataElementGroupSetId, oldValue, event) {
    // TODO: Very bad to change props and set d2.model.dirty manually
    this.props.source.dirty = true;
    store$1.setState({
      dataElementGroupValues: Object.assign({}, store$1.state.dataElementGroupValues, _defineProperty({}, dataElementGroupSetId, event.target.value ? event.target.value : null)),
      remove: Array.from(new Set(store$1.state.remove.concat([oldValue])).values())
    });
  },
  render: function render() {
    var _this2 = this;

    if (!this.state.dataElementGroupSets) {
      return getLoadingdataElement();
    }

    return /*#__PURE__*/react.createElement("div", null, this.state.dataElementGroupSets.map(function (dataElementGroupSet) {
      var optionList = dataElementGroupSet.dataElementGroups.map(function (ig) {
        return {
          value: ig.id,
          text: ig.displayName
        };
      });
      var value = Object.prototype.hasOwnProperty.call(store$1.state.dataElementGroupValues, dataElementGroupSet.id) ? store$1.state.dataElementGroupValues[dataElementGroupSet.id] : findValue(optionList, _this2.props.source);
      return /*#__PURE__*/react.createElement("div", {
        key: dataElementGroupSet.id
      }, /*#__PURE__*/react.createElement(Dropdown, {
        labelText: dataElementGroupSet.displayName,
        translateLabel: false,
        options: optionList,
        value: value,
        onChange: _this2._updateGroupStatus.bind(_this2, dataElementGroupSet.id, findValue(optionList, _this2.props.source)),
        fullWidth: true
      }));
    }));
  }
});

var styles = {
  saveButton: {
    marginRight: '1rem'
  },
  customContentStyle: {
    width: '95%',
    maxWidth: 'none'
  }
};

var IndicatorExtraFields = /*#__PURE__*/function (_React$Component) {
  _inherits(IndicatorExtraFields, _React$Component);

  var _super = _createSuper(IndicatorExtraFields);

  function IndicatorExtraFields(props, state) {
    var _this;

    _classCallCheck(this, IndicatorExtraFields);

    _this = _super.call(this, props, state);
    _this.state = {
      dialogValid: true,
      dialogOpen: false
    };
    _this.setNumerator = _this.setNumerator.bind(_assertThisInitialized(_this));
    _this.setDenominator = _this.setDenominator.bind(_assertThisInitialized(_this));
    _this.closeDialog = _this.closeDialog.bind(_assertThisInitialized(_this));
    _this.saveToModelAndCloseDialog = _this.saveToModelAndCloseDialog.bind(_assertThisInitialized(_this));
    _this.indicatorExpressionChanged = _this.indicatorExpressionChanged.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(IndicatorExtraFields, [{
    key: "setNumerator",
    value: function setNumerator() {
      this.setState({
        type: 'numerator',
        dialogOpen: true
      });
    }
  }, {
    key: "setDenominator",
    value: function setDenominator() {
      this.setState({
        type: 'denominator',
        dialogOpen: true
      });
    }
  }, {
    key: "closeDialog",
    value: function closeDialog() {
      this.setState({
        dialogOpen: false
      });
    }
  }, {
    key: "saveToModelAndCloseDialog",
    value: function saveToModelAndCloseDialog() {
      if (this.state.expressionStatus.isValid) {
        this.props.modelToEdit[this.state.type] = this.state.expressionFormula;
        this.props.modelToEdit["".concat(this.state.type, "Description")] = this.state.expressionDescription;
        modelToEditStore.setState(this.props.modelToEdit);
      }

      this.setState({
        dialogOpen: false
      });
    }
  }, {
    key: "indicatorExpressionChanged",
    value: function indicatorExpressionChanged(data) {
      var expressionValues = {};

      if (data.expressionStatus.isValid) {
        expressionValues.expressionStatus = data.expressionStatus;
        expressionValues.expressionDescription = data.description;
        expressionValues.expressionFormula = data.formula;
      }

      this.setState(_objectSpread2({
        dialogValid: data.expressionStatus.isValid && Boolean(data.description.trim())
      }, expressionValues));
    }
  }, {
    key: "renderExpressionManager",
    value: function renderExpressionManager() {
      return /*#__PURE__*/react.createElement(IndicatorExpressionManagerContainer, {
        indicatorExpressionChanged: this.indicatorExpressionChanged,
        formula: this.props.modelToEdit[this.state.type] || '',
        description: this.props.modelToEdit["".concat(this.state.type, "Description")] || '',
        ref: "expressionManagerContainer"
      });
    }
  }, {
    key: "render",
    value: function render() {
      var d2 = this.context.d2;
      var dialogActions = [
      /*#__PURE__*/
      // TODO: This button should "commit" the change to the model where a cancel button will discard any changes made
      react.createElement(_default$2, {
        label: d2.i18n.getTranslation('cancel'),
        onTouchTap: this.closeDialog
      }), /*#__PURE__*/react.createElement(_default$2, {
        label: d2.i18n.getTranslation('done'),
        onTouchTap: this.saveToModelAndCloseDialog,
        disabled: !this.state.dialogValid
      })];
      return /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement("div", {
        style: {
          marginTop: '2rem'
        }
      }, /*#__PURE__*/react.createElement(_default$3, {
        label: d2.i18n.getTranslation('edit_numerator'),
        onClick: this.setNumerator,
        style: {
          marginRight: '2rem'
        }
      }), /*#__PURE__*/react.createElement(_default$3, {
        label: d2.i18n.getTranslation('edit_denominator'),
        onClick: this.setDenominator
      }), /*#__PURE__*/react.createElement(_default$4, {
        title: d2.i18n.getTranslation("edit_".concat(this.state.type)),
        open: this.state.dialogOpen,
        modal: true,
        actions: dialogActions,
        contentStyle: styles.customContentStyle,
        autoScrollBodyContent: true,
        repositionOnUpdate: false
      }, this.state ? this.renderExpressionManager() : null)), /*#__PURE__*/react.createElement("div", {
        style: {
          marginTop: '2rem'
        }
      }, /*#__PURE__*/react.createElement(DataIndicatorGroupsAssignment, {
        source: this.props.modelToEdit
      })));
    }
  }]);

  return IndicatorExtraFields;
}(react.Component);

IndicatorExtraFields.propTypes = {
  modelToEdit: react.PropTypes.object.isRequired
};
var extraFields = {
  dataElement: [{
    name: 'dataElementGroupAssignment',
    component: function component(props) {
      return /*#__PURE__*/react.createElement("div", {
        style: {
          marginTop: '2rem'
        }
      }, /*#__PURE__*/react.createElement(DataElementGroupsAssignment, {
        source: props.modelToEdit
      }));
    }
  }],
  indicator: [{
    name: 'indicatorGroupAssignmentAndGroupAssignments',
    component: addD2Context(IndicatorExtraFields)
  }]
};

var category = ['dataDimensionType'];

var categoryCombo = ['dataDimensionType'];

var categoryOptionCombo = ['name'];

var categoryOptionGroup = ['dataDimensionType'];

var categoryOptionGroupSet = ['dataDimensionType'];

var optionSet = ['valueType'];

var programRule = ['program'];

var optionGroup = ['optionSet'];

var optionGroupSet = ['optionSet'];

var disabledByType = {
  category: category,
  categoryCombo: categoryCombo,
  categoryOptionCombo: categoryOptionCombo,
  categoryOptionGroup: categoryOptionGroup,
  categoryOptionGroupSet: categoryOptionGroupSet,
  optionSet: optionSet,
  programRule: programRule,
  optionGroup: optionGroup,
  optionGroupSet: optionGroupSet
};
var disabledOnEdit = {
  "for": function _for(schemaName) {
    if (schemaName && disabledByType[schemaName]) {
      return disabledByType[schemaName];
    }

    return [];
  }
};

var extractFirstMessageFromErrorReports = fp.compose(fp.get('message'), fp.first, fp.getOr([], 'errorReports'), fp.get('response'));
var extractFirstMessageFromMessages = fp.compose(fp.get('message'), fp.first, fp.get('messages'));
var firstNotUndefinedIn = fp.compose(fp.first, fp.filter(fp.identity));
function extractFirstErrorMessageFromServer(response) {
  var messages = [extractFirstMessageFromErrorReports(response), extractFirstMessageFromMessages(response)];
  return firstNotUndefinedIn(messages);
}

/* *
 * The result coming from FormBuilder validateField will contain an error message on fail and
 * a boolean true if it succeeds.
 */

var isInvalidField = function isInvalidField(validatedResult) {
  return validatedResult !== true;
};

var isRequiredField = function isRequiredField(field) {
  return fp.get('isRequired', field.fieldOptions) === true;
};

var isDirtyField = function isDirtyField(field) {
  return field.value;
};

var isRequiredOrDirtyField = function isRequiredOrDirtyField(field) {
  return isRequiredField(field) || isDirtyField(field);
};

var validateField = function validateField(field, formRef, formRefStateClone) {
  var validateResult = formRef.validateField(formRefStateClone, field.name, field.value);
  return {
    invalid: isInvalidField(validateResult),
    step: field.step,
    name: field.translatedName,
    message: validateResult
  };
};
/* *
 * Constructs the error message to present to the snackBar.
 * Adds the step that the field can be found on (if present).
 */


var getErrorMessage = function getErrorMessage(field) {
  var fieldStep = field.step ? ": ".concat(field.name, ". On step ").concat(field.step) : '';
  var errorMessage = "".concat(field.message).concat(fieldStep);
  return errorMessage;
};
/**
 * Will first filter out all the fields that are invalid.
 * This includes fields that are:
 * - Required.
 * - Fields that are dirty.
 * Then it will validate the fields using a reference to the formBuilder.
 * Lastly it will fetch the first field with a failing validator.
 */


var getFirstInvalidField = function getFirstInvalidField(fieldConfigs, formRef, formRefStateClone) {
  return fieldConfigs.filter(function (fieldConfig) {
    return isRequiredOrDirtyField(fieldConfig);
  }).map(function (fieldConfig) {
    return validateField(fieldConfig, formRef, formRefStateClone);
  }).find(function (field) {
    return field.invalid;
  });
};
/**
 * Validate checks all the fields that are required or has a invalid value in the form.
 * The validation will set the fields as invalid in the formbuilder and set
 * the new state of the form.
 *
 * If any the fields are not valid, it will create a message string
 * of the first invalid field.
 *
 * @returns {string}
 * The name and step/group of the invalid field.
 * If no invalid field, it will return an empty string.
 */


function getFirstInvalidFieldMessage(fieldConfigs, formRef) {
  var formRefStateClone = formRef.getStateClone();
  var firstInvalidField = getFirstInvalidField(fieldConfigs, formRef, formRefStateClone);

  if (!firstInvalidField) {
    return '';
  }

  formRef.setState(formRefStateClone);
  var errorMessage = getErrorMessage(firstInvalidField);
  return errorMessage;
}

var currentSection$ = appState.filter(function (state) {
  return state.sideBar && state.sideBar.currentSection;
}).map(function (state) {
  return state.sideBar.currentSubSection;
}).filter(function (state) {
  return state;
}).distinctUntilChanged();
var editFormFieldsForCurrentSection$ = currentSection$.flatMap(function (modelType) {
  return Observable.fromPromise(createFieldConfigForModelTypes(modelType));
});

var isAddOperation = function isAddOperation(model) {
  return model.id === undefined;
};

var d2$ = Observable.fromPromise(getInstance());
var modelToEditAndModelForm$ = Observable.combineLatest(modelToEditStore, editFormFieldsForCurrentSection$, currentSection$, d2$).filter(function (_ref) {
  var _ref2 = _slicedToArray(_ref, 3),
      modelToEdit = _ref2[0];
      _ref2[1];
      var currentType = _ref2[2];

  if (modelToEdit && modelToEdit.modelDefinition && modelToEdit.modelDefinition.name) {
    return modelToEdit.modelDefinition.name === currentType;
  }

  return false;
}).map(function (_ref3) {
  var _ref4 = _slicedToArray(_ref3, 4),
      modelToEdit = _ref4[0],
      editFormFieldsForCurrentModelType = _ref4[1],
      modelType = _ref4[2];
      _ref4[3];

  var fieldConfigs = editFormFieldsForCurrentModelType // TODO: When switching to the FormBuilder that manages state this function for all values
  // would need to be executed only for the field that actually changed and/or the values that
  // change because of it.
  .map(function (fieldConfig) {
    fieldConfig.fieldOptions.model = modelToEdit;

    if (!isAddOperation(modelToEdit) && disabledOnEdit["for"](modelType).indexOf(fieldConfig.name) !== -1) {
      fieldConfig.props.disabled = true;
    } // Check if value is an attribute


    if (Object.keys(modelToEdit.attributes || []).indexOf(fieldConfig.name) >= 0) {
      fieldConfig.isAttribute = true;
      fieldConfig.value = modelToEdit.attributes[fieldConfig.name];
      return fieldConfig;
    } // The value is passes through a converter before being set onto the field config.
    // This is useful for when a value is a number and might have to be translated to a
    // value of the type Number.


    if (fieldConfig.beforePassToFieldConverter) {
      fieldConfig.value = fieldConfig.beforePassToFieldConverter(modelToEdit[fieldConfig.name]);
    } else {
      fieldConfig.value = modelToEdit[fieldConfig.name];
    }

    return fieldConfig;
  });
  var fieldConfigsAfterRules = applyRulesToFieldConfigs(getRulesForModelType(modelToEdit.modelDefinition.name), fieldConfigs, modelToEdit);
  var fieldConfigsWithAttributeFields = [].concat(fieldConfigsAfterRules, // getAttributeFieldConfigs(d2, modelToEdit),
  (extraFields[modelType] || []).map(function (config) {
    config.props = config.props || {};
    config.props.modelToEdit = modelToEdit;
    return config;
  }));
  var fieldConfigsWithAttributeFieldsAndUniqueValidators = fieldConfigsWithAttributeFields.map(function (fieldConfig) {
    return addUniqueValidatorWhenUnique(fieldConfig, modelToEdit);
  });
  return {
    fieldConfigs: fieldConfigsWithAttributeFieldsAndUniqueValidators,
    modelToEdit: modelToEdit,
    isLoading: false
  };
});
var EditModelForm = react.createClass({
  displayName: "EditModelForm.component",
  propTypes: {
    modelId: react.PropTypes.string.isRequired,
    modelType: react.PropTypes.string.isRequired,
    onSaveSuccess: react.PropTypes.func.isRequired,
    onSaveError: react.PropTypes.func,
    onCancel: react.PropTypes.func.isRequired
  },
  mixins: [Translate],
  getInitialState: function getInitialState() {
    return {
      modelToEdit: undefined,
      isLoading: true,
      formState: {
        validating: false,
        valid: true,
        pristine: true
      },
      activeStep: 0
    };
  },
  isAddOperation: function isAddOperation() {
    return this.props.modelId === 'add';
  },
  componentWillMount: function componentWillMount() {
    var _this = this;

    this.subscription = modelToEditAndModelForm$.subscribe(function (newState) {
      _this.setState(newState);

      _this.setActiveStep(_this.state.activeStep);
    }, function (errorMessage) {
      snackActions.show({
        message: errorMessage,
        action: 'ok'
      });
    });
  },
  componentWillUnmount: function componentWillUnmount() {
    this.subscription && this.subscription.unsubscribe();
    this.saveSubscription && this.saveSubscription.unsubscribe();
  },

  /*
   *  Sets the style of the fields that are not part of the active steps to 'none'
   *  so that they are "hidden". For this to work, the components needs to have
   *  an outer div that receives the props.style.
   */
  setActiveStep: function setActiveStep(step) {
    this.setState({
      activeStep: step,
      fieldConfigs: getStepFields(step, this.state.fieldConfigs, this.props.modelType)
    });
  },
  setFormRef: function setFormRef(form) {
    this.formRef = form;
  },
  _onUpdateField: function _onUpdateField(fieldName, value) {
    var fieldConfig = this.state.fieldConfigs.find(function (fieldConfig) {
      return fieldConfig.name === fieldName;
    });

    if (fieldConfig && fieldConfig.beforeUpdateConverter) {
      return objectActions.update({
        fieldName: fieldName,
        value: fieldConfig.beforeUpdateConverter(value)
      });
    }

    return objectActions.update({
      fieldName: fieldName,
      value: value
    });
  },
  _onUpdateFormStatus: function _onUpdateFormStatus(formState) {
    this.setState({
      formState: formState
    });
  },
  saveSuccess: function saveSuccess(message) {
    snackActions.show({
      message: message,
      translate: true
    });
    this.props.onSaveSuccess(this.state.modelToEdit);
  },
  saveFail: function saveFail(error) {
    // TODO: d2 queries require a JSON body on 200 OK, an empty body is not valid JSON
    this.setState({
      isSaving: false
    });

    if (error.httpStatusCode === 200) {
      log.warn('Save errored due to empty 200 OK body');
      snackActions.show({
        message: 'success',
        action: 'ok',
        translate: true
      });
      this.props.onSaveSuccess(this.state.modelToEdit);
    } else {
      var firstErrorMessage;

      if (typeof error === 'string') {
        firstErrorMessage = error;
      } else {
        firstErrorMessage = extractFirstErrorMessageFromServer(error);
      }

      snackActions.show({
        message: firstErrorMessage,
        action: 'ok'
      });
      this.props.onSaveError && this.props.onSaveError(error);
      log.error(error);
    }
  },
  _saveAction: function _saveAction(event) {
    var _this2 = this;

    event.preventDefault();
    var invalidFieldMessage = getFirstInvalidFieldMessage(this.state.fieldConfigs, this.formRef);

    if (invalidFieldMessage) {
      snackActions.show({
        message: invalidFieldMessage,
        action: 'ok'
      });
      return;
    } // Set state to saving so forms actions are being prevented


    this.setState({
      isSaving: true
    });
    this.saveSubscription = objectActions.saveObject({
      id: this.props.modelId,
      modelType: this.props.modelType
    }).subscribe(this.saveSuccess, this.saveFail, function () {
      return _this2.setState({
        isSaving: false
      });
    });
  },
  _closeAction: function _closeAction(event) {
    event.preventDefault();
    this.props.onCancel();
  },
  renderSharingNotification: function renderSharingNotification() {
    var formPaperStyle = {
      width: '100%',
      margin: '0 auto 3rem',
      position: 'relative'
    };

    if (this.isAddOperation()) {
      return /*#__PURE__*/react.createElement(SharingNotification$1, {
        style: formPaperStyle,
        modelType: this.props.modelType
      });
    }

    return null;
  },
  renderStepper: function renderStepper() {
    var steps = fieldGroups["for"](this.props.modelType);
    var stepCount = steps.length;
    return stepCount > 1 && createStepper({
      steps: steps,
      activeStep: this.state.activeStep,
      stepperClicked: this.setActiveStep
    });
  },
  renderForm: function renderForm() {
    var formPaperStyle = {
      width: '100%',
      margin: '0 auto 2rem',
      padding: '2rem 5rem 4rem',
      position: 'relative'
    };

    if (this.state.isLoading) {
      return /*#__PURE__*/react.createElement(CircularProgress, null);
    }

    return /*#__PURE__*/react.createElement("div", {
      style: formPaperStyle
    }, this.renderStepper(), this.renderSharingNotification(), /*#__PURE__*/react.createElement(FormBuilder, {
      fields: this.state.fieldConfigs,
      onUpdateField: this._onUpdateField,
      onUpdateFormStatus: this._onUpdateFormStatus,
      ref: this.setFormRef
    }), /*#__PURE__*/react.createElement(FormButtons, null, /*#__PURE__*/react.createElement(SaveButton, {
      onClick: this._saveAction,
      isValid: this.state.formState.valid && !this.state.formState.validating,
      isSaving: this.state.isSaving
    }), /*#__PURE__*/react.createElement(CancelButton, {
      onClick: this._closeAction
    })));
  },
  render: function render() {
    if (this.state.loading) {
      return /*#__PURE__*/react.createElement("div", null, "Loading data....");
    }

    return this.renderForm();
  }
});

export { EditModelForm as E, getFirstInvalidFieldMessage as g };
