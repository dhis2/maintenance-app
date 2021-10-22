import { ae as Store, ax as fieldOrder, bV as Action, r as react, O as Observable, bK as ReplaySubject, a4 as _objectSpread2, i as getInstance, f as _asyncToGenerator, a5 as _default, g as _default$1, q as _objectWithoutProperties, bT as _default$2, bU as _default$3, s as _extends, a0 as addD2Context, k as _inherits, l as _createSuper, m as _classCallCheck, B as _assertThisInitialized, n as _createClass, ad as snackActions, w as withStateFrom, a6 as _default$4, c4 as FormBuilder, H as Heading, F as _default$5, _ as _default$6 } from './index-44839b1a.js';
import { S as SaveButton } from './SaveButton.component-265ebd88.js';
import { F as FormButtons } from './FormButtons.component-b34f3009.js';
import { T as TranslationDialog } from './TranslationDialog.component-38658f53.js';

var organisationUnitLevelsStore = Store.create();

var _excluded = ["options"];
var fieldForOrganisationUnitLevels = fieldOrder["for"]('organisationUnitLevel');
var actions = Action.createActionsFromNames(['initOrgUnitLevels', 'fieldUpdate', 'updateFormStatus', 'saveOrganisationUnitLevels']);

function DropDownFieldForOfflineLevels(props) {
  var options = props.options,
      otherProps = _objectWithoutProperties(props, _excluded);

  var availableOptions = [{
    value: undefined,
    text: 'Default',
    label: ' '
  }].concat(options.map(function (option) {
    return {
      value: option,
      text: option,
      label: option
    };
  })).map(function (option, index) {
    return /*#__PURE__*/react.createElement(_default$2, {
      key: index,
      primaryText: option.text,
      value: option.value,
      label: option.label
    });
  });
  return /*#__PURE__*/react.createElement(_default$3, _extends({}, otherProps, {
    onChange: function onChange(event, index, value) {
      return props.onChange({
        target: {
          value: value
        }
      });
    }
  }), availableOptions);
}

DropDownFieldForOfflineLevels.propTypes = {
  options: react.PropTypes.array
};
var fieldOptions = new Map([['name', {
  component: _default
}], ['offlineLevels', {
  component: DropDownFieldForOfflineLevels,
  props: {
    options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  }
}]]);

function loadOrganisationUnitLevels() {
  return _loadOrganisationUnitLevels.apply(this, arguments);
}

function _loadOrganisationUnitLevels() {
  _loadOrganisationUnitLevels = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var d2, api;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return getInstance();

          case 2:
            d2 = _context.sent;
            api = d2.Api.getApi();
            _context.next = 6;
            return api.get('filledOrganisationUnitLevels');

          case 6:
            return _context.abrupt("return", _context.sent);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _loadOrganisationUnitLevels.apply(this, arguments);
}

function isNameUnique(name) {
  return organisationUnitLevelsStore.state.fieldsForOrganisationUnitLevel.map(function (fieldConfigs) {
    return fieldConfigs.filter(function (fieldConfig) {
      return fieldConfig.name === 'name';
    }).some(function (fieldConfig) {
      return fieldConfig.value === name;
    });
  }).every(function (result) {
    return result === false;
  });
}

function getOrganisationUnitLevelFormFields() {
  return _getOrganisationUnitLevelFormFields.apply(this, arguments);
}

function _getOrganisationUnitLevelFormFields() {
  _getOrganisationUnitLevelFormFields = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var d2;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return getInstance();

          case 2:
            d2 = _context2.sent;
            return _context2.abrupt("return", fieldForOrganisationUnitLevels.map(function (fieldName) {
              var fieldOption = fieldOptions.get(fieldName) || {};
              return {
                name: fieldName,
                component: fieldOption.component || _default,
                props: Object.assign({
                  floatingLabelText: d2.i18n.getTranslation(_default$1(fieldName))
                }, fieldOption.props),
                validators: [{
                  validator: isNameUnique,
                  message: d2.i18n.getTranslation('value_not_unique')
                }]
              };
            }));

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _getOrganisationUnitLevelFormFields.apply(this, arguments);
}

var organisationUnitLevelFormFields$ = Observable.fromPromise(getOrganisationUnitLevelFormFields());

function getFieldConfigsForAllFields(organisationUnitLevels, organisationUnitLevelFormFields) {
  return organisationUnitLevels.map(function (ouLevel) {
    var result = organisationUnitLevelFormFields.map(function (fieldConfig) {
      return Object.assign({}, fieldConfig, {
        value: ouLevel[fieldConfig.name]
      });
    });
    result.organisationUnitLevel = ouLevel;
    return result;
  });
}

function buildFormStatus(_ref) {
  var data = _ref.data;
  return organisationUnitLevelsStore.getState().formStatus.map(function (status, index) {
    if (index === data.levelIndex) {
      return data.formStatus.valid;
    }

    return status;
  });
}

actions.updateFormStatus.map(buildFormStatus).subscribe(function (formStatusForAllLevels) {
  organisationUnitLevelsStore.setState(Object.assign({}, organisationUnitLevelsStore.getState(), {
    formStatus: formStatusForAllLevels
  }));
});
actions.initOrgUnitLevels.flatMap(function () {
  return Observable.combineLatest(Observable.fromPromise(loadOrganisationUnitLevels()), organisationUnitLevelFormFields$, function (organisationUnitLevels, organisationUnitLevelFormFields) {
    return {
      organisationUnitLevels: organisationUnitLevels,
      organisationUnitLevelFormFields: organisationUnitLevelFormFields
    };
  });
}).map(function (_ref2) {
  var organisationUnitLevels = _ref2.organisationUnitLevels,
      organisationUnitLevelFormFields = _ref2.organisationUnitLevelFormFields;
  var fieldConfigsForAllLevels = getFieldConfigsForAllFields(organisationUnitLevels, organisationUnitLevelFormFields);
  return {
    fieldConfigsForAllLevels: fieldConfigsForAllLevels,
    organisationUnitLevels: organisationUnitLevels
  };
}).subscribe(function (_ref3) {
  var fieldConfigsForAllLevels = _ref3.fieldConfigsForAllLevels,
      organisationUnitLevels = _ref3.organisationUnitLevels;
  organisationUnitLevelsStore.setState({
    isSaving: false,
    isLoading: false,
    fieldsForOrganisationUnitLevel: fieldConfigsForAllLevels,
    formStatus: fieldConfigsForAllLevels.map(function () {
      return true;
    }),
    organisationUnitLevels: organisationUnitLevels
  });
}); // FIXME: Weird solution to make an action usable with Observable.combineLatest. Also actions are never unsubscribed.

var fieldUpdateSubject$ = new ReplaySubject(1);
actions.fieldUpdate.subscribe(function (action) {
  return fieldUpdateSubject$.next(action);
});
Observable.combineLatest(fieldUpdateSubject$, organisationUnitLevelFormFields$, function (action, organisationUnitLevelFormFields) {
  return {
    action: action,
    organisationUnitLevelFormFields: organisationUnitLevelFormFields
  };
}).map(function (_ref4) {
  var action = _ref4.action,
      organisationUnitLevelFormFields = _ref4.organisationUnitLevelFormFields;
  return _objectSpread2(_objectSpread2({}, action.data), {}, {
    storeState: organisationUnitLevelsStore.getState(),
    organisationUnitLevelFormFields: organisationUnitLevelFormFields
  });
}).subscribe(function (_ref5) {
  var _ref5$storeState = _ref5.storeState,
      storeState = _ref5$storeState === void 0 ? {
    organisationUnitLevels: []
  } : _ref5$storeState,
      fieldName = _ref5.fieldName,
      fieldValue = _ref5.fieldValue,
      organisationUnitLevel = _ref5.organisationUnitLevel,
      organisationUnitLevelFormFields = _ref5.organisationUnitLevelFormFields;
  var organisationUnitToChangeValueFor = storeState.organisationUnitLevels.find(function (ouLevel) {
    return ouLevel === organisationUnitLevel;
  });

  if (organisationUnitToChangeValueFor && fieldName) {
    organisationUnitToChangeValueFor[fieldName] = fieldValue;
  }

  organisationUnitLevelsStore.setState(Object.assign({}, storeState, {
    organisationUnitLevels: storeState.organisationUnitLevels,
    fieldsForOrganisationUnitLevel: getFieldConfigsForAllFields(storeState.organisationUnitLevels, organisationUnitLevelFormFields)
  }));
});

function saveOrganisationUnitLevels$1(action) {
  var organisationUnitLevels = action.organisationUnitLevels,
      complete = action.complete,
      error = action.error;
  return getInstance().then(function (d2) {
    return d2.Api.getApi();
  }).then(function (api) {
    return api.post('filledOrganisationUnitLevels', {
      organisationUnitLevels: organisationUnitLevels
    }, {
      dataType: 'text'
    });
  }).then(function () {
    return complete;
  })["catch"](function () {
    return error;
  });
}

actions.saveOrganisationUnitLevels.map(function (action) {
  return _objectSpread2({
    organisationUnitLevels: organisationUnitLevelsStore.getState().organisationUnitLevels.map(function (_ref6) {
      var name = _ref6.name,
          level = _ref6.level,
          offlineLevels = _ref6.offlineLevels;
      return {
        name: name,
        level: level,
        offlineLevels: offlineLevels
      };
    })
  }, action);
})["do"](function () {
  organisationUnitLevelsStore.setState(_objectSpread2(_objectSpread2({}, organisationUnitLevelsStore.getState()), {}, {
    isSaving: true
  }));
}).flatMap(function (action) {
  return Observable.fromPromise(saveOrganisationUnitLevels$1(action));
}).subscribe(function (callback) {
  callback.call();
  actions.initOrgUnitLevels();
});
var actions$1 = actions;

function saveOrganisationUnitLevels(i18n) {
  actions$1.saveOrganisationUnitLevels().subscribe(function () {
    return snackActions.show({
      message: i18n.getTranslation('organisation_unit_levels_save_success')
    });
  }, function () {
    return snackActions.show({
      message: i18n.getTranslation('organisation_unit_levels_save_failed'),
      action: 'ok'
    });
  });
}

function OrganisationUnitLevels(props, context) {
  var canEdit = context.d2.currentUser.canUpdate(context.d2.models.organisationUnitLevel);

  if (props.isLoading) {
    return /*#__PURE__*/react.createElement(_default$4, null);
  }

  var styles = {
    paperWrap: {
      padding: '4rem 5rem',
      maxWidth: 700,
      marginTop: '2rem'
    },
    rowStyle: {
      display: 'flex',
      flexDirection: 'row',
      height: '5rem'
    },
    formWrapStyle: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row'
    },
    fieldWrapStyle: {
      flex: 1,
      paddingRight: '1rem'
    },
    translateButtonWrap: {
      alignItems: 'flex-end',
      display: 'flex',
      flex: '5rem',
      height: '5rem',
      verticalAlign: 'middle'
    }
  };
  var fieldRows = props.fieldsForOrganisationUnitLevel.map(function (fieldsForLevel, index) {
    var translateButton = null;

    if (fieldsForLevel.organisationUnitLevel.id && canEdit) {
      translateButton = /*#__PURE__*/react.createElement("div", {
        style: styles.translateButtonWrap
      }, /*#__PURE__*/react.createElement(_default$6, {
        iconClassName: "material-icons",
        onClick: function onClick() {
          return props.onTranslateClick(fieldsForLevel.organisationUnitLevel);
        }
      }, "translate"));
    }

    return /*#__PURE__*/react.createElement("div", {
      key: index,
      style: styles.rowStyle
    }, /*#__PURE__*/react.createElement(FormBuilder, {
      style: styles.formWrapStyle,
      fieldWrapStyle: styles.fieldWrapStyle,
      fields: fieldsForLevel.map(function (fieldConfig) {
        return _objectSpread2(_objectSpread2({}, fieldConfig), {}, {
          props: _objectSpread2(_objectSpread2({}, fieldConfig.props), {}, {
            disabled: !canEdit
          })
        });
      }),
      onUpdateField: function onUpdateField(fieldName, fieldValue) {
        actions$1.fieldUpdate({
          organisationUnitLevel: fieldsForLevel.organisationUnitLevel,
          fieldName: fieldName,
          fieldValue: fieldValue
        });
      },
      onUpdateFormStatus: function onUpdateFormStatus(formStatus) {
        return actions$1.updateFormStatus({
          levelIndex: index,
          formStatus: formStatus
        });
      }
    }), translateButton);
  });
  return /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement(Heading, null, context.d2.i18n.getTranslation('organisation_unit_level_management')), /*#__PURE__*/react.createElement(_default$5, {
    style: styles.paperWrap
  }, fieldRows, /*#__PURE__*/react.createElement(FormButtons, null, canEdit ? /*#__PURE__*/react.createElement(SaveButton, {
    onClick: function onClick() {
      return saveOrganisationUnitLevels(context.d2.i18n);
    },
    isValid: props.formStatus.every(function (v) {
      return v;
    }),
    isSaving: props.isSaving
  }) : [])));
}

OrganisationUnitLevels.defaultProps = {
  fieldsForOrganisationUnitLevel: [],
  formStatus: [false],
  isLoading: true,
  isSaving: false
};
OrganisationUnitLevels.propTypes = {
  fieldsForOrganisationUnitLevel: react.PropTypes.array,
  formStatus: react.PropTypes.array,
  isLoading: react.PropTypes.bool,
  isSaving: react.PropTypes.bool
};
var componentState$ = organisationUnitLevelsStore;
var OrganisationUnitLevelsWithState = withStateFrom(componentState$, addD2Context(OrganisationUnitLevels));
var OrganisationUnitLevels_component = addD2Context( /*#__PURE__*/function (_React$Component) {
  _inherits(_class, _React$Component);

  var _super = _createSuper(_class);

  function _class() {
    var _this;

    _classCallCheck(this, _class);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    _this.state = {
      translation: {
        open: false
      }
    };
    _this._onTranslateClick = _this._onTranslateClick.bind(_assertThisInitialized(_this));
    _this._closeTranslationDialog = _this._closeTranslationDialog.bind(_assertThisInitialized(_this));
    _this._translationSaved = _this._translationSaved.bind(_assertThisInitialized(_this));
    _this._translationErrored = _this._translationErrored.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(_class, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      actions$1.initOrgUnitLevels();
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement(OrganisationUnitLevelsWithState, {
        onTranslateClick: this._onTranslateClick
      }), this.state.translation.model ? /*#__PURE__*/react.createElement(TranslationDialog, {
        objectToTranslate: this.state.translation.model,
        objectTypeToTranslate: this.state.translation.model && this.state.translation.model.modelDefinition,
        open: this.state.translation.open,
        onTranslationSaved: this._translationSaved,
        onTranslationError: this._translationErrored,
        onRequestClose: this._closeTranslationDialog,
        fieldsToTranslate: ['name']
      }) : null);
    }
  }, {
    key: "_onTranslateClick",
    value: function _onTranslateClick(data) {
      var model = this.context.d2.models.organisationUnitLevel.create(data);
      this.setState({
        translation: {
          open: true,
          model: model
        }
      });
    }
  }, {
    key: "_translationSaved",
    value: function _translationSaved() {
      snackActions.show({
        message: this.context.d2.i18n.getTranslation('translation_saved')
      });
    }
  }, {
    key: "_translationErrored",
    value: function _translationErrored() {
      snackActions.show({
        message: this.context.d2.i18n.getTranslation('translation_save_error'),
        action: 'ok'
      });
    }
  }, {
    key: "_closeTranslationDialog",
    value: function _closeTranslationDialog() {
      this.setState({
        translation: {
          open: false,
          model: undefined
        }
      });
    }
  }]);

  return _class;
}(react.Component));

export { OrganisationUnitLevels_component as default };
