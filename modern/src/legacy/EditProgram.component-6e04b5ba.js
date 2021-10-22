import { al as fp, aw as connect, cu as bindActionCreators, cB as changeStep, cC as steps$1, S as pure, U as SvgIcon, r as react, q as _objectWithoutProperties, s as _extends, a4 as _objectSpread2, cD as _default$6, cE as eventProgramStore, aj as _default$7, cj as _default$8, cF as _default$9, cG as _default$a, cH as _default$b, cI as _default$c, A as _defineProperty, cJ as RenderTypeSelectField, cK as MOBILE, cL as DESKTOP, cM as addDataElementsToStage, cN as removeDataElementsFromStage, cO as editProgramStageDataElement, ae as Store, cP as getRenderTypeOptions, cQ as DATA_ELEMENT_CLAZZ, F as _default$d, a5 as _default$e, ai as GroupEditor, cR as commonjs, cS as DragHandle, cT as grey200_1, cU as ActionButton$1, cV as grey100_1, k as _inherits, l as _createSuper, m as _classCallCheck, B as _assertThisInitialized, n as _createClass, a8 as _default$f, cW as grey800_1, cX as grey300_1, aa as _default$g, H as Heading, at as _default$h, as as _default$i, cY as _default$j, cZ as PROGRAM_STAGE_SECTION_RENDER_TYPES, c_ as DEFAULT_PROGRAM_STAGE_RENDER_TYPE, a9 as _default$k, c$ as DataElementPicker, d0 as _default$l, p as log, O as Observable, bV as Action, bU as _default$m, bT as _default$n, af as _default$o, P as PropTypes, d1 as getProgramStageDataElementsByStageId, d2 as dataEntryFormChanged, d3 as dataEntryFormRemove, d4 as getStageSectionsById, d5 as Tab, d6 as Tabs_1, d7 as changeProgramStageDataElementOrder, d8 as changeProgramStageSectionOrder, d9 as addProgramStageSection, da as removeProgramStageSection, db as updateProgramStageSection, cq as _toConsumableArray, dc as yellow800_1, dd as _default$q, de as _default$r, df as _default$s, dg as editFieldChanged, dh as editProgramStageField, di as branch, dj as renderComponent, dk as OrganisationUnitTreeMultiSelect, dl as _default$t, ak as _default$u, am as _default$v, a1 as _default$w, aJ as DataTable, dm as setStageNotificationValue, dn as setSelectedProgramStage, dp as modelToEditSelector, aC as Dropdown, c4 as FormBuilder, dq as lifecycle, ad as snackActions, dr as _default$y, ds as setEditModel, dt as saveProgramNotification, du as getNotificationType, dv as isProgramNotification, dw as saveStageNotification, dx as _default$z, dy as getStageNotifications, dz as getProgramStageDataElements, dA as getProgramStages, dB as removeStageNotification, dC as setAddModel, ax as fieldOrder, c6 as goToAndScrollUp, dD as saveEventProgram, dE as nextStep, dF as previousStep, dG as isStoreStateDirty, dH as steps$2, $ as _default$A, a0 as addD2Context, dI as getProgramNotifications, dJ as getProgramStageById, dK as removeProgramNotification, dL as _default$B, dM as addAttributesToProgram, dN as removeAttributesFromProgram, dO as editProgramAttributes, dP as setAttributesOrder, dQ as TRACKED_ENTITY_ATTRIBUTE_CLAZZ, dR as ProgramAttributeRow, dS as GroupEditorWithOrdering, dT as Table_1, dU as TableHeader, dV as TableRow, dW as TableHeaderColumn, dX as TableBody, dY as programDataEntryFormChanged, dZ as programDataEntryFormRemove, d_ as changeProgramSectionOrder, d$ as addProgramSection, e0 as removeProgramSection, e1 as updateProgramSection, e2 as editProgramStage, e3 as addProgramStage, e4 as confirmDeleteProgramStage, e5 as getTableColumnsForType, e6 as translationSaved, e7 as translationError, E as _default$C, G as propTypes, e8 as getActiveProgramStageStep, e9 as changeStep$1, ea as steps$3, eb as compose, ec as changeStepperDisabledState, ed as saveProgramStageEdit, ee as cancelProgramStageEdit, ef as editProgramStageReset, eg as getCurrentProgramStageId, eh as getIsStageBeingEdited, ei as previousTrackerStep, ej as nextTrackerStep, ek as isProgramStageStepperActive, el as LoadingMask$1 } from './index-44839b1a.js';
import { l as lib } from './HelpLink.component-39e74935.js';
import { F as FormHeading } from './FormHeading-92e31a13.js';
import { F as FormSubHeading } from './FormSubHeading-cef65695.js';
import { h as createStepperFromConfig, i as createFieldConfigsFor, f as fieldGroups, j as addPropsToFieldConfig, k as createStepperContentFromConfig, C as CancelButton, l as createConnectedForwardButton, m as createConnectedBackwardButton, n as createStepperNavigation, o as createFormFor } from './stepper-8c66bd06.js';
import { w as withRouter, S as SpeedDial_1, B as BubbleList_1, a as BubbleListItem_1, g as getTranslatablePropertiesForModelType, D as DetailsBoxWithScroll } from './List.component-3129d511.js';
import { L as LoadingMask } from './LoadingMask.component-7e1e1a02.js';
import { _ as _default$p } from './warning-61e60ff8.js';
import { S as SharingDialog } from './pagination-df227617.js';
import { _ as _default$x } from './add-6f307f86.js';
import { S as SaveButton } from './SaveButton.component-265ebd88.js';
import { T as TranslationDialog } from './TranslationDialog.component-38658f53.js';
import { w as withAuth } from './Auth-bde7a9a8.js';

var activeStepSelector = fp.get('eventProgram.step.activeStep');
var disabledSelector = fp.get('eventProgram.step.disabled');
var isSaving = fp.get('eventProgram.step.isSaving');

var mapStateToProps$a = function mapStateToProps(state) {
  return {
    activeStep: activeStepSelector(state)
  };
};

var mapDispatchToProps$d = function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    stepperClicked: changeStep
  }, dispatch);
};

var EventProgramStepper$1 = connect(mapStateToProps$a, mapDispatchToProps$d)(createStepperFromConfig(steps$1));

var visibility = {};

Object.defineProperty(visibility, "__esModule", {
  value: true
});

var _react$5 = react;

var _react2$5 = _interopRequireDefault$5(_react$5);

var _pure$5 = pure;

var _pure2$5 = _interopRequireDefault$5(_pure$5);

var _SvgIcon$5 = SvgIcon;

var _SvgIcon2$5 = _interopRequireDefault$5(_SvgIcon$5);

function _interopRequireDefault$5(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ActionVisibility = function ActionVisibility(props) {
  return _react2$5.default.createElement(
    _SvgIcon2$5.default,
    props,
    _react2$5.default.createElement('path', { d: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z' })
  );
};
ActionVisibility = (0, _pure2$5.default)(ActionVisibility);
ActionVisibility.displayName = 'ActionVisibility';
ActionVisibility.muiName = 'SvgIcon';

var _default$5 = visibility.default = ActionVisibility;

var visibilityOff = {};

Object.defineProperty(visibilityOff, "__esModule", {
  value: true
});

var _react$4 = react;

var _react2$4 = _interopRequireDefault$4(_react$4);

var _pure$4 = pure;

var _pure2$4 = _interopRequireDefault$4(_pure$4);

var _SvgIcon$4 = SvgIcon;

var _SvgIcon2$4 = _interopRequireDefault$4(_SvgIcon$4);

function _interopRequireDefault$4(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ActionVisibilityOff = function ActionVisibilityOff(props) {
  return _react2$4.default.createElement(
    _SvgIcon2$4.default,
    props,
    _react2$4.default.createElement('path', { d: 'M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z' })
  );
};
ActionVisibilityOff = (0, _pure2$4.default)(ActionVisibilityOff);
ActionVisibilityOff.displayName = 'ActionVisibilityOff';
ActionVisibilityOff.muiName = 'SvgIcon';

var _default$4 = visibilityOff.default = ActionVisibilityOff;

var _excluded$7 = ["children"],
    _excluded2 = ["children"],
    _excluded3 = ["children"],
    _excluded4 = ["children"],
    _excluded5 = ["children", "style"],
    _excluded6 = ["children", "style"];
var Table = function Table(_ref) {
  var children = _ref.children,
      props = _objectWithoutProperties(_ref, _excluded$7);

  return /*#__PURE__*/react.createElement("table", _extends({}, props, {
    style: {
      padding: '0 3rem',
      borderSpacing: 0,
      width: '100%'
    }
  }), children);
};

Table.Head = function (_ref2) {
  var children = _ref2.children,
      props = _objectWithoutProperties(_ref2, _excluded2);

  return /*#__PURE__*/react.createElement("thead", _extends({}, props, {
    style: {
      textAlign: 'left',
      verticalAlign: 'top'
    }
  }), children);
};

Table.Body = function (_ref3) {
  var children = _ref3.children,
      props = _objectWithoutProperties(_ref3, _excluded3);

  return /*#__PURE__*/react.createElement("tbody", props, children);
};

Table.Row = function (_ref4) {
  var children = _ref4.children,
      props = _objectWithoutProperties(_ref4, _excluded4);

  return /*#__PURE__*/react.createElement("tr", props, children);
};

Table.CellHead = function (_ref5) {
  var children = _ref5.children;
      _ref5.style;
      var props = _objectWithoutProperties(_ref5, _excluded5);

  return /*#__PURE__*/react.createElement("th", _extends({}, props, {
    style: {
      height: '56px',
      padding: '0 5px 10px'
    }
  }), children);
};

Table.Cell = function (_ref6) {
  var children = _ref6.children,
      style = _ref6.style,
      props = _objectWithoutProperties(_ref6, _excluded6);

  return /*#__PURE__*/react.createElement("td", _extends({}, props, {
    style: _objectSpread2({
      padding: '10px 5px',
      borderTop: '1px solid #bdbdbd'
    }, style || {})
  }), children);
};

var _excluded$6 = ["dataElement"];
var getFirstProgramStage$1 = _default$6(fp.first, fp.get('programStages')); // Use programStage$ prop if present, else use first programStage

var programStage$ = function programStage$(props$) {
  return props$.take(1).flatMap(function (props) {
    return props.programStage$ ? props.programStage$ : eventProgramStore.map(getFirstProgramStage$1);
  });
};

var availableTrackerDataElements$ = eventProgramStore.map(fp.get('availableDataElements')).take(1);
var renderingOptions$$1 = eventProgramStore.map(fp.get('renderingOptions')).take(1);

var mapDispatchToProps$c = function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    addDataElementsToStage: addDataElementsToStage,
    removeDataElementsFromStage: removeDataElementsFromStage,
    editProgramStageDataElement: editProgramStageDataElement
  }, dispatch);
};

var enhance$7 = _default$6(withRouter, _default$7(function (props) {
  return _objectSpread2(_objectSpread2({}, props), {}, {
    groupName: props.params.groupName,
    modelType: props.schema,
    modelId: props.params.modelId
  });
}), connect(null, mapDispatchToProps$c), _default$8(function (props$) {
  return props$.combineLatest(programStage$(props$), availableTrackerDataElements$, renderingOptions$$1, function (props, programStage, trackerDataElements, renderingOptions) {
    return _objectSpread2(_objectSpread2({}, props), {}, {
      trackerDataElements: trackerDataElements,
      renderingOptions: renderingOptions,
      model: programStage,
      items: programStage.programStageDataElements
    });
  });
}), _default$9({
  onAssignItems: function onAssignItems(props) {
    return function (dataElements) {
      var model = props.model,
          addDataElementsToStage = props.addDataElementsToStage;
      addDataElementsToStage({
        programStage: model.id,
        dataElements: dataElements
      });
      return Promise.resolve();
    };
  },
  onRemoveItems: function onRemoveItems(_ref) {
    var model = _ref.model,
        removeDataElementsFromStage = _ref.removeDataElementsFromStage;
    return function (dataElements) {
      removeDataElementsFromStage({
        programStage: model.id,
        dataElements: dataElements
      });
      return Promise.resolve();
    };
  },
  onEditProgramStageDataElement: function onEditProgramStageDataElement(_ref2) {
    var model = _ref2.model,
        editProgramStageDataElement = _ref2.editProgramStageDataElement;
    return function (programStageDataElement) {
      return editProgramStageDataElement({
        programStage: model.id,
        programStageDataElement: programStageDataElement
      });
    };
  }
}), _default$a('dataElementFilter', 'setDataElementFilter', '') // withProgramStageFromProgramStage$,
);

var flipBooleanPropertyOn = function flipBooleanPropertyOn(object, key) {
  return _objectSpread2(_objectSpread2({}, object), {}, _defineProperty({}, key, !object[key]));
};

var ProgramStageDataElement = _default$b(function (_ref3) {
  var programStageDataElement = _ref3.programStageDataElement,
      onEditProgramStageDataElement = _ref3.onEditProgramStageDataElement;
  var isDateValue = programStageDataElement.dataElement.valueType === 'DATE';

  var onChangeFlipBooleanForProperty = function onChangeFlipBooleanForProperty(propertyName) {
    return function () {
      return onEditProgramStageDataElement(flipBooleanPropertyOn(programStageDataElement, propertyName));
    };
  };

  var isCheckedForProp = fp.getOr(false, fp.__, programStageDataElement);
  return /*#__PURE__*/react.createElement(Table.Row, null, /*#__PURE__*/react.createElement(Table.Cell, {
    title: programStageDataElement.dataElement.displayName,
    style: {
      maxWidth: 250,
      paddingLeft: 0
    }
  }, programStageDataElement.dataElement.displayName), /*#__PURE__*/react.createElement(Table.Cell, null, /*#__PURE__*/react.createElement(_default$c, {
    checked: isCheckedForProp('compulsory'),
    onClick: onChangeFlipBooleanForProperty('compulsory')
  })), /*#__PURE__*/react.createElement(Table.Cell, null, /*#__PURE__*/react.createElement(_default$c, {
    checked: isCheckedForProp('allowProvidedElsewhere'),
    onClick: onChangeFlipBooleanForProperty('allowProvidedElsewhere')
  })), /*#__PURE__*/react.createElement(Table.Cell, null, /*#__PURE__*/react.createElement(_default$c, {
    checked: isCheckedForProp('displayInReports'),
    checkedIcon: /*#__PURE__*/react.createElement(_default$5, null),
    uncheckedIcon: /*#__PURE__*/react.createElement(_default$4, null),
    onClick: onChangeFlipBooleanForProperty('displayInReports')
  })), /*#__PURE__*/react.createElement(Table.Cell, null, isDateValue ? /*#__PURE__*/react.createElement(_default$c, {
    checked: isCheckedForProp('allowFutureDate'),
    onClick: onChangeFlipBooleanForProperty('allowFutureDate')
  }) : null), /*#__PURE__*/react.createElement(Table.Cell, null, /*#__PURE__*/react.createElement(_default$c, {
    checked: isCheckedForProp('skipSynchronization'),
    onClick: onChangeFlipBooleanForProperty('skipSynchronization')
  })), /*#__PURE__*/react.createElement(Table.Cell, null, /*#__PURE__*/react.createElement(RenderTypeSelectField, {
    device: MOBILE,
    target: programStageDataElement,
    options: programStageDataElement.dataElement.renderTypeOptions,
    changeHandler: onEditProgramStageDataElement
  })), /*#__PURE__*/react.createElement(Table.Cell, {
    style: {
      paddingRight: 0
    }
  }, /*#__PURE__*/react.createElement(RenderTypeSelectField, {
    device: DESKTOP,
    target: programStageDataElement,
    options: programStageDataElement.dataElement.renderTypeOptions,
    changeHandler: onEditProgramStageDataElement
  })));
});

function addDisplayProperties$1(dataElements, renderingOptions) {
  return function (_ref4) {
    var dataElement = _ref4.dataElement,
        other = _objectWithoutProperties(_ref4, _excluded$6);

    var deDisplayProps = dataElements.find(function (_ref5) {
      var id = _ref5.id;
      return id === dataElement.id;
    });
    var renderTypeOptions = getRenderTypeOptions(dataElement, DATA_ELEMENT_CLAZZ, renderingOptions);

    if (!deDisplayProps) {
      console.warn("Could not find tracker-element with id", dataElement.id); //fallback to info that is already contained, and add renderType

      return _objectSpread2(_objectSpread2({}, other), {}, {
        dataElement: _objectSpread2(_objectSpread2({}, dataElement), {}, {
          renderTypeOptions: renderTypeOptions
        })
      });
    }

    var displayName = deDisplayProps.displayName,
        valueType = deDisplayProps.valueType,
        optionSet = deDisplayProps.optionSet;
    return _objectSpread2(_objectSpread2({}, other), {}, {
      dataElement: _objectSpread2(_objectSpread2({}, dataElement), {}, {
        displayName: displayName,
        valueType: valueType,
        optionSet: optionSet,
        renderTypeOptions: renderTypeOptions
      })
    });
  };
}

function AssignDataElements(props, _ref6) {
  var d2 = _ref6.d2;
  var itemStore = Store.create();
  var assignedItemStore = Store.create();
  var dataElementIds = new Set();
  var dataElements = props.trackerDataElements.map(function (dataElement) {
    dataElementIds.add(dataElement.id);
    return {
      id: dataElement.id,
      text: dataElement.displayName,
      value: dataElement.id
    };
  });
  /* Fix for DHIS2-4369 where some program stages may contain other dataelements than TRACKER
  This is due to a database inconsistency. This fix makes it possible to show and be able to remove these
  elements from the UI.
  itemStore needs to be a superset of all assigned items, so we add the items that are assigned,
  but may not be in prop.trackerDataElements  */

  var otherElems = props.model.programStageDataElements.filter(function (_ref7) {
    var dataElement = _ref7.dataElement;
    return dataElement.domainType !== "TRACKER" && !dataElementIds.has(dataElement.id);
  }).map(function (_ref8) {
    var dataElement = _ref8.dataElement;
    return {
      id: dataElement.id,
      text: dataElement.displayName,
      value: dataElement.id
    };
  });
  itemStore.setState(dataElements.concat(otherElems));
  assignedItemStore.setState(props.model.programStageDataElements.map(function (v) {
    return v.dataElement.id;
  }));
  var tableRows = props.model.programStageDataElements.map(addDisplayProperties$1(props.trackerDataElements, props.renderingOptions)).map(function (programStageDataElement, index) {
    return /*#__PURE__*/react.createElement(ProgramStageDataElement, {
      key: programStageDataElement.id,
      programStageDataElement: programStageDataElement,
      onEditProgramStageDataElement: props.onEditProgramStageDataElement
    });
  });
  return /*#__PURE__*/react.createElement(_default$d, null, /*#__PURE__*/react.createElement("div", {
    style: _objectSpread2({
      padding: '2rem 3rem 4rem'
    }, props.outerDivStyle)
  }, /*#__PURE__*/react.createElement(_default$e, {
    hintText: d2.i18n.getTranslation('search_available_selected_items'),
    onChange: _default$6(props.setDataElementFilter, fp.getOr('', 'target.value')),
    value: props.dataElementFilter,
    fullWidth: true
  }), /*#__PURE__*/react.createElement(GroupEditor, {
    itemStore: itemStore,
    assignedItemStore: assignedItemStore,
    height: 250,
    filterText: props.dataElementFilter,
    onAssignItems: props.onAssignItems,
    onRemoveItems: props.onRemoveItems
  })), /*#__PURE__*/react.createElement(Table, {
    style: {
      borderSpacing: 0
    }
  }, /*#__PURE__*/react.createElement(Table.Head, null, /*#__PURE__*/react.createElement(Table.Row, null, /*#__PURE__*/react.createElement(Table.CellHead, null, d2.i18n.getTranslation('name')), /*#__PURE__*/react.createElement(Table.CellHead, null, d2.i18n.getTranslation('compulsory')), /*#__PURE__*/react.createElement(Table.CellHead, null, d2.i18n.getTranslation('allow_provided_elsewhere')), /*#__PURE__*/react.createElement(Table.CellHead, null, d2.i18n.getTranslation('display_in_reports')), /*#__PURE__*/react.createElement(Table.CellHead, null, d2.i18n.getTranslation('date_in_future')), /*#__PURE__*/react.createElement(Table.CellHead, null, d2.i18n.getTranslation('skip_synchronization')), /*#__PURE__*/react.createElement(Table.CellHead, null, d2.i18n.getTranslation('render_type_mobile')), /*#__PURE__*/react.createElement(Table.CellHead, null, d2.i18n.getTranslation('render_type_desktop')))), /*#__PURE__*/react.createElement(Table.Body, null, tableRows)));
}

AssignDataElements.contextTypes = {
  d2: react.PropTypes.object,
  outerDivStyle: react.PropTypes.object
};
var AssignDataElements$1 = enhance$7(AssignDataElements);

var styles$f = {
  dataElement: {
    padding: '1rem 1rem',
    backgroundColor: grey200_1,
    marginBottom: '4px',
    borderRadius: '8px'
  },
  row: {
    userSelect: 'none',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  horizontalSpace: {
    paddingLeft: '1rem'
  }
};

var DataElement = function DataElement(_ref) {
  var dataElement = _ref.dataElement;
  return /*#__PURE__*/react.createElement("div", {
    style: styles$f.dataElement
  }, /*#__PURE__*/react.createElement("div", {
    style: styles$f.row
  }, /*#__PURE__*/react.createElement(DragHandle, null), /*#__PURE__*/react.createElement("div", {
    style: styles$f.horizontalSpace
  }), dataElement.displayName));
};

DataElement.propTypes = {
  dataElement: react.PropTypes.shape({
    id: react.PropTypes.string.isRequired,
    displayName: react.PropTypes.string.isRequired
  })
};
var SortableDataElement = commonjs.SortableElement(DataElement);
var SortableDataList = commonjs.SortableContainer(function (_ref2) {
  var dataElements = _ref2.dataElements,
      isSortingIndex = _ref2.isSortingIndex;
  return /*#__PURE__*/react.createElement("div", null, dataElements.map(function (dataElement, index) {
    return /*#__PURE__*/react.createElement(SortableDataElement, {
      dataElement: dataElement,
      index: index,
      isSortingIndex: isSortingIndex,
      key: "item-".concat(index),
      sortIndex: index
    });
  }));
});

var DefaultForm = function DefaultForm(_ref) {
  var availableDataElements = _ref.availableDataElements,
      onChange = _ref.onChange;
  return /*#__PURE__*/react.createElement(SortableDataList, {
    darkItems: true,
    dataElements: availableDataElements,
    onSortEnd: onChange
  });
};

DefaultForm.propTypes = {
  availableDataElements: react.PropTypes.array.isRequired,
  onChange: react.PropTypes.func.isRequired
};

var styles$e = {
  dataElement: {
    height: '55px',
    display: 'flex',
    paddingLeft: '1rem',
    backgroundColor: grey100_1,
    borderRadius: '6px',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  row: {
    userSelect: 'none',
    MozUserSelect: 'none',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  horizontalSpace: {
    paddingLeft: '1rem'
  }
};

var SectionDataElement = function SectionDataElement(_ref) {
  var first = _ref.first,
      dataElement = _ref.dataElement,
      onRemove = _ref.onRemove;

  var divStyle = _objectSpread2(_objectSpread2({}, styles$e.dataElement), {}, {
    marginTop: first ? '0px' : '4px'
  });

  return /*#__PURE__*/react.createElement("div", {
    style: divStyle
  }, /*#__PURE__*/react.createElement("div", {
    style: styles$e.row
  }, /*#__PURE__*/react.createElement(DragHandle, null), /*#__PURE__*/react.createElement("div", {
    style: styles$e.horizontalSpace
  }), dataElement.displayName), /*#__PURE__*/react.createElement(ActionButton$1, {
    onClick: onRemove,
    icon: "clear"
  }));
};

SectionDataElement.propTypes = {
  dataElement: react.PropTypes.shape({
    id: react.PropTypes.string.isRequired,
    displayName: react.PropTypes.string.isRequired
  })
};
var SortableSectionDataElement = commonjs.SortableElement(SectionDataElement);
var SortableSectionDataList = commonjs.SortableContainer(function (_ref2) {
  var sectionDataElements = _ref2.sectionDataElements,
      onDataElementRemoved = _ref2.onDataElementRemoved;
  return /*#__PURE__*/react.createElement("div", null, sectionDataElements.map(function (dataElement, index) {
    return /*#__PURE__*/react.createElement(SortableSectionDataElement, {
      first: index === 0,
      dataElement: dataElement,
      onRemove: function onRemove() {
        onDataElementRemoved(dataElement.id);
      },
      index: index,
      key: "item-".concat(index)
    });
  }));
});

var styles$d = {
  sectionContainer: {
    width: '100%',
    borderRadius: '8px',
    borderStyle: 'solid',
    borderColor: grey300_1,
    borderWidth: '3px',
    marginBottom: '1.2rem'
  },
  noDataElementsMessage: {
    height: '4rem',
    lineHeight: '4rem',
    borderRadius: '6px',
    backgroundColor: 'white',
    paddingLeft: '1.5rem'
  },
  sectionContent: {
    backgroundColor: grey300_1
  },
  sectionHeader: {
    color: 'black',
    backgroundColor: grey300_1,
    borderRadius: '4px 4px 0 0',
    paddingLeft: '1rem'
  },
  sectionTopBar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  collapsibleArrow: {
    color: 'black',
    cursor: 'pointer',
    transition: 'none',
    userSelect: 'none'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  sectionName: {
    textAlign: 'left',
    color: 'black',
    fontSize: '1.7rem',
    fontWeight: '400',
    wordWrap: 'break-word',
    minWidth: '180px'
  },
  filterField: {
    marginTop: '-12px',
    marginBottom: '6px'
  },
  hiddenByFilter: {
    margin: 0,
    padding: '5px',
    textAlign: 'center'
  }
};
var HiddenElementsText = function HiddenElementsText(_ref) {
  var numberOfHiddenElements = _ref.numberOfHiddenElements,
      getTranslation = _ref.getTranslation;

  if (numberOfHiddenElements < 1) {
    return null;
  }

  return /*#__PURE__*/react.createElement("p", {
    style: {
      margin: 0,
      padding: '5px',
      textAlign: 'center'
    }
  }, numberOfHiddenElements === 1 ? getTranslation('element_hidden_by_filter') : getTranslation('$$total$$_elements_hidden_by_filter', {
    total: numberOfHiddenElements
  }));
};

var ActionButton = function ActionButton(_ref2) {
  var onClick = _ref2.onClick,
      icon = _ref2.icon;

  var noPropagation = function noPropagation(e) {
    if (e) e.stopPropagation();
    onClick();
  };

  return /*#__PURE__*/react.createElement(_default$h, {
    style: {
      transition: 'none'
    },
    iconStyle: {
      transition: 'none'
    },
    onClick: noPropagation
  }, /*#__PURE__*/react.createElement(_default$i, {
    color: "gray",
    className: "material-icons"
  }, icon));
};

var Section = /*#__PURE__*/function (_Component) {
  _inherits(Section, _Component);

  var _super = _createSuper(Section);

  function Section(props, context) {
    var _this;

    _classCallCheck(this, Section);

    _this = _super.call(this, props, context);

    _defineProperty(_assertThisInitialized(_this), "onSortEnd", function (oldIndex, newIndex) {
      _this.props.sortItems(oldIndex, newIndex);
    });

    _defineProperty(_assertThisInitialized(_this), "openRemovalDialog", function () {
      _this.setState({
        showRemovalDialog: true
      });
    });

    _defineProperty(_assertThisInitialized(_this), "closeRemovalDialog", function () {
      _this.setState({
        showRemovalDialog: false
      });
    });

    _defineProperty(_assertThisInitialized(_this), "confirmSectionRemoval", function () {
      _this.closeRemovalDialog();

      _this.props.onSectionRemoved();
    });

    _defineProperty(_assertThisInitialized(_this), "handleFilterElemenets", function (event) {
      _this.setState({
        filter: event.target.value
      });
    });

    _this.state = {
      showRemovalDialog: false,
      filter: ''
    };
    _this.getTranslation = context.d2.i18n.getTranslation.bind(context.d2.i18n);
    return _this;
  }

  _createClass(Section, [{
    key: "getFilteredElements",
    value: function getFilteredElements() {
      var filter = this.state.filter;
      return this.props.elements.filter(function (element) {
        return !filter.length || element.displayName.toLowerCase().includes(filter.toLowerCase());
      });
    }
  }, {
    key: "render",
    value: function render() {
      var elements = this.props.elements;
      var filteredElements = this.getFilteredElements();
      var numberOfHiddenElements = elements.length - filteredElements.length;
      var removalDialogActions = [/*#__PURE__*/react.createElement(_default$f, {
        primary: true,
        label: this.getTranslation('cancel'),
        onTouchTap: this.closeRemovalDialog
      }), /*#__PURE__*/react.createElement(_default$f, {
        primary: true,
        label: this.getTranslation('delete'),
        onTouchTap: this.confirmSectionRemoval
      })];
      var sectionContent = elements && elements.length > 0 ? /*#__PURE__*/react.createElement("div", {
        style: styles$d.sectionContent
      }, /*#__PURE__*/react.createElement(SortableSectionDataList, {
        distance: 4,
        onSortEnd: this.onSortEnd,
        onDataElementRemoved: this.props.onDataElementRemoved,
        sectionDataElements: filteredElements
      }), /*#__PURE__*/react.createElement(HiddenElementsText, {
        numberOfHiddenElements: numberOfHiddenElements,
        getTranslation: this.getTranslation
      })) : /*#__PURE__*/react.createElement("div", {
        style: styles$d.noDataElementsMessage
      }, this.props.elementPath === 'dataElements' ? this.getTranslation('no_data_elements') : this.getTranslation('no_attributes'));
      return /*#__PURE__*/react.createElement("div", {
        style: _objectSpread2(_objectSpread2({}, styles$d.sectionContainer), {}, {
          borderColor: this.props.selected ? grey800_1 : grey300_1
        })
      }, /*#__PURE__*/react.createElement("div", {
        onClick: this.props.onSelect,
        style: styles$d.sectionHeader
      }, /*#__PURE__*/react.createElement("div", {
        style: styles$d.sectionTopBar
      }, /*#__PURE__*/react.createElement("div", {
        style: styles$d.row
      }, /*#__PURE__*/react.createElement(DragHandle, null), /*#__PURE__*/react.createElement(ActionButton, {
        onClick: this.props.onToggleEdit,
        icon: "mode_edit"
      }), /*#__PURE__*/react.createElement("div", {
        style: styles$d.sectionName
      }, this.props.section.displayName)), /*#__PURE__*/react.createElement("div", {
        style: styles$d.row
      }, /*#__PURE__*/react.createElement(ActionButton, {
        onClick: this.props.onToggleOpen,
        icon: this.props.collapsed ? 'keyboard_arrow_down' : 'keyboard_arrow_up'
      }), /*#__PURE__*/react.createElement(ActionButton, {
        onClick: this.openRemovalDialog,
        icon: "clear"
      }))), !this.props.collapsed && /*#__PURE__*/react.createElement(_default$e, {
        style: styles$d.filterField,
        hintText: this.getTranslation('filter_elements'),
        onChange: this.handleFilterElemenets
      })), !this.props.collapsed && sectionContent, /*#__PURE__*/react.createElement(_default$g, {
        title: this.getTranslation('delete_section_message'),
        actions: removalDialogActions,
        open: this.state.showRemovalDialog,
        onRequestClose: this.closeRemovalDialog,
        autoScrollBodyContent: true
      }, /*#__PURE__*/react.createElement(Heading, {
        level: 2
      }, this.props.section.displayName)));
    }
  }]);

  return Section;
}(react.Component);

Section.propTypes = {
  section: react.PropTypes.object.isRequired,
  selected: react.PropTypes.bool.isRequired,
  collapsed: react.PropTypes.bool.isRequired,
  onSectionRemoved: react.PropTypes.func.isRequired,
  onDataElementRemoved: react.PropTypes.func.isRequired,
  onToggleEdit: react.PropTypes.func.isRequired,
  onToggleOpen: react.PropTypes.func.isRequired,
  onSelect: react.PropTypes.func.isRequired,
  sortItems: react.PropTypes.func.isRequired
};
Section.contextTypes = {
  d2: react.PropTypes.object
};
var Section$1 = commonjs.SortableElement(Section);

var SectionList = function SectionList(_ref) {
  var sections = _ref.sections,
      selectedSectionId = _ref.selectedSectionId,
      onToggleEditing = _ref.onToggleEditing,
      collapsedSections = _ref.collapsedSections,
      onToggleSection = _ref.onToggleSection,
      onSelectSection = _ref.onSelectSection,
      _onSectionRemoved = _ref.onSectionRemoved,
      _onDataElementRemoved = _ref.onDataElementRemoved,
      _sortItems = _ref.sortItems,
      elementPath = _ref.elementPath;
  return /*#__PURE__*/react.createElement("div", {
    style: {
      minHeight: 410
    }
  }, sections.map(function (section, index) {
    var elements = section[elementPath];
    return /*#__PURE__*/react.createElement(Section$1, {
      key: "section-".concat(index),
      index: index,
      section: section,
      selected: fp.isEqual(section.id, selectedSectionId),
      collapsed: collapsedSections.includes(section.id),
      onToggleEdit: function onToggleEdit() {
        onToggleEditing(section);
      },
      onToggleOpen: function onToggleOpen() {
        onToggleSection(section.id);
      },
      onSelect: function onSelect() {
        onSelectSection(section.id);
      },
      onSectionRemoved: function onSectionRemoved() {
        _onSectionRemoved(section);
      },
      onDataElementRemoved: function onDataElementRemoved(dataElementId) {
        _onDataElementRemoved(dataElementId, section.id);
      },
      sortItems: function sortItems(_ref2) {
        var oldIndex = _ref2.oldIndex,
            newIndex = _ref2.newIndex;

        _sortItems(index, oldIndex, newIndex);
      },
      elements: elements,
      elementPath: elementPath
    });
  }));
};

var SectionList$1 = commonjs.SortableContainer(SectionList);

var styles$c = {
  container: {
    textAlign: 'right',
    width: '100%'
  }
};
var initialState = {
  section: {
    id: null,
    name: '',
    description: '',
    renderType: {
      MOBILE: {
        type: DEFAULT_PROGRAM_STAGE_RENDER_TYPE
      },
      DESKTOP: {
        type: DEFAULT_PROGRAM_STAGE_RENDER_TYPE
      }
    }
  }
};

var AddOrEditSection = /*#__PURE__*/function (_Component) {
  _inherits(AddOrEditSection, _Component);

  var _super = _createSuper(AddOrEditSection);

  function AddOrEditSection(props) {
    var _this;

    _classCallCheck(this, AddOrEditSection);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "onNameChanged", function (event, sectionName) {
      _this.setState({
        section: _objectSpread2(_objectSpread2({}, _this.state.section), {}, {
          name: sectionName
        })
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onDescriptionChanged", function (event, sectionDescription) {
      _this.setState({
        section: _objectSpread2(_objectSpread2({}, _this.state.section), {}, {
          description: sectionDescription
        })
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onRenderTypeChanged", function (newSectionState) {
      _this.setState({
        section: newSectionState
      });
    });

    _defineProperty(_assertThisInitialized(_this), "getTranslation", function (key) {
      return _this.context.d2.i18n.getTranslation(key);
    });

    _defineProperty(_assertThisInitialized(_this), "closeDialog", function () {
      _this.props.clearEditingSection();

      _this.setState(_objectSpread2({}, initialState));
    });

    _defineProperty(_assertThisInitialized(_this), "openDialog", function () {
      _this.setState({
        dialogOpen: true
      });
    });

    _defineProperty(_assertThisInitialized(_this), "confirmAddNewSection", function () {
      _this.closeDialog();

      _this.props.onSectionAdded(_this.state.section);
    });

    _defineProperty(_assertThisInitialized(_this), "confirmUpdateSection", function () {
      var section = _this.state.section;

      _this.closeDialog();

      _this.props.onSectionUpdated(section.id, section);
    });

    _defineProperty(_assertThisInitialized(_this), "focusOnSectionName", function (input) {
      if (input) {
        setTimeout(function () {
          input.focus();
        }, 20);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "render", function () {
      var _this$state$section = _this.state.section,
          id = _this$state$section.id,
          name = _this$state$section.name,
          description = _this$state$section.description;
      var titleTxt;
      var confirmHandler;
      var confirmTxt;

      if (id) {
        titleTxt = _this.getTranslation('update_section');
        confirmHandler = _this.confirmUpdateSection;
        confirmTxt = _this.getTranslation('update');
      } else {
        titleTxt = _this.getTranslation('add_new_section');
        confirmHandler = _this.confirmAddNewSection;
        confirmTxt = _this.getTranslation('add');
      }

      var actions = [/*#__PURE__*/react.createElement(_default$f, {
        primary: true,
        label: _this.getTranslation('cancel'),
        onTouchTap: _this.closeDialog
      }), /*#__PURE__*/react.createElement(_default$f, {
        primary: true,
        label: confirmTxt,
        disabled: !name,
        onTouchTap: confirmHandler
      })];
      return /*#__PURE__*/react.createElement("div", {
        style: styles$c.container
      }, /*#__PURE__*/react.createElement(_default$g, {
        title: titleTxt,
        actions: actions,
        open: _this.props.open,
        onRequestClose: _this.closeDialog,
        autoScrollBodyContent: true
      }, /*#__PURE__*/react.createElement(_default$j, {
        ref: _this.focusOnSectionName,
        hintText: _this.getTranslation('name'),
        onChange: _this.onNameChanged,
        value: name,
        fullWidth: true
      }), /*#__PURE__*/react.createElement(_default$j, {
        hintText: _this.getTranslation('description'),
        onChange: _this.onDescriptionChanged,
        value: description,
        fullWidth: true,
        multiLine: true,
        rows: 2,
        rowsMax: 4
      }), /*#__PURE__*/react.createElement(RenderTypeSelectField, {
        device: MOBILE,
        target: _this.state.section,
        options: PROGRAM_STAGE_SECTION_RENDER_TYPES,
        inDialog: true,
        changeHandler: _this.onRenderTypeChanged
      }), /*#__PURE__*/react.createElement(RenderTypeSelectField, {
        device: DESKTOP,
        target: _this.state.section,
        options: PROGRAM_STAGE_SECTION_RENDER_TYPES,
        inDialog: true,
        changeHandler: _this.onRenderTypeChanged
      })));
    });

    _this.state = _objectSpread2({}, initialState);
    return _this;
  }

  _createClass(AddOrEditSection, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (this.props.editingSection && !prevProps.editingSection) {
        this.showDialogForEditingModel(this.props.editingSection);
      }
    }
  }, {
    key: "getSaveData",
    value: function getSaveData() {
      var section = this.state.section;
      return _objectSpread2(_objectSpread2({}, section), {}, {
        renderType: {
          MOBILE: {
            type: section.renderType
          },
          DESKTOP: {
            type: section.renderType
          }
        }
      });
    }
  }, {
    key: "showDialogForEditingModel",
    value: function showDialogForEditingModel(editingSection) {
      var id = editingSection.id,
          name = editingSection.name,
          description = editingSection.description,
          renderType = editingSection.renderType;
      this.setState({
        section: {
          id: id,
          name: name,
          description: description,
          renderType: {
            MOBILE: {
              type: renderType ? renderType.MOBILE.type : DEFAULT_PROGRAM_STAGE_RENDER_TYPE
            },
            DESKTOP: {
              type: renderType ? renderType.DESKTOP.type : DEFAULT_PROGRAM_STAGE_RENDER_TYPE
            }
          }
        }
      });
    }
  }]);

  return AddOrEditSection;
}(react.Component);

AddOrEditSection.propTypes = {
  onSectionAdded: react.PropTypes.func.isRequired,
  onSectionUpdated: react.PropTypes.func.isRequired,
  editingSection: react.PropTypes.object,
  clearEditingSection: react.PropTypes.func.isRequired
};
AddOrEditSection.defaultProps = {
  editingSection: null
};
AddOrEditSection.contextTypes = {
  d2: react.PropTypes.object
};

var styles$b = {
  sectionForm: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'space-between'
  }
};

var getActiveElements = function getActiveElements(sections, elementPath) {
  return fp.flatten(sections.map(function (section) {
    return section[elementPath];
  }));
};

var SectionForm = /*#__PURE__*/function (_Component) {
  _inherits(SectionForm, _Component);

  var _super = _createSuper(SectionForm);

  function SectionForm(props, context) {
    var _this;

    _classCallCheck(this, SectionForm);

    _this = _super.call(this, props, context);

    _defineProperty(_assertThisInitialized(_this), "getElementsForSection", function (section) {
      var elems = section[_this.props.elementPath];
      return elems;
    });

    _defineProperty(_assertThisInitialized(_this), "onToggleEditing", function (section) {
      _this.setState({
        editingSection: _this.state.editingSection && fp.isEqual(section.id, _this.state.editingSection.id) ? null : section,
        sectionEditOpen: !_this.state.sectionEditOpen
      });
    });

    _defineProperty(_assertThisInitialized(_this), "clearEditingSection", function () {
      _this.setState({
        editingSection: null,
        sectionEditOpen: false
      });
    });

    _defineProperty(_assertThisInitialized(_this), "openSection", function (sectionId) {
      _this.setState({
        collapsedSections: fp.pull(sectionId, _this.state.collapsedSections)
      });
    });

    _defineProperty(_assertThisInitialized(_this), "closeSection", function (sectionId) {
      var collapsedSections = _this.state.collapsedSections;
      collapsedSections.push(sectionId);

      _this.setState({
        collapsedSections: collapsedSections
      });
    });

    _defineProperty(_assertThisInitialized(_this), "selectSection", function (sectionId) {
      _this.setState({
        selectedSectionId: sectionId
      });
    });

    _defineProperty(_assertThisInitialized(_this), "openNoSelectionSectionMessage", function () {
      _this.setState({
        showNoSelectionSectionMessage: true
      });
    });

    _defineProperty(_assertThisInitialized(_this), "closeNoSelectionSectionMessage", function () {
      _this.setState({
        showNoSelectionSectionMessage: false
      });
    });

    _defineProperty(_assertThisInitialized(_this), "isSectionCollapsed", function (sectionId) {
      return _this.state.collapsedSections.includes(sectionId);
    });

    _defineProperty(_assertThisInitialized(_this), "onToggleSection", function (sectionId) {
      _this.isSectionCollapsed(sectionId) ? _this.openSection(sectionId) : _this.closeSection(sectionId);
    });

    _defineProperty(_assertThisInitialized(_this), "openSectionIfClosed", function (sectionId) {
      _this.isSectionCollapsed(sectionId) && _this.openSection(sectionId);
    });

    _defineProperty(_assertThisInitialized(_this), "onSelectSection", function (sectionId) {
      _this.openSectionIfClosed(sectionId);

      _this.selectSection(sectionId);
    });

    _defineProperty(_assertThisInitialized(_this), "onSectionUpdated", function (sectionId, newSectionData) {
      _this.props.onSectionUpdated(sectionId, newSectionData);

      _this.clearEditingSection();
    });

    _defineProperty(_assertThisInitialized(_this), "onSortEnd", function (_ref) {
      var oldIndex = _ref.oldIndex,
          newIndex = _ref.newIndex;

      _this.props.onSectionOrderChanged(commonjs.arrayMove(_this.props.sections, oldIndex, newIndex));
    });

    _defineProperty(_assertThisInitialized(_this), "onElementPicked", function (elementId) {
      var elementToAdd = fp.find(function (element) {
        return fp.isEqual(element.id, elementId);
      }, _this.props.availableElements);
      if (!elementToAdd) return;
      var currentSelectedSectionIndex = fp.findIndex(function (section) {
        return fp.isEqual(_this.state.selectedSectionId, section.id);
      }, _this.props.sections);

      if (currentSelectedSectionIndex === -1) {
        _this.openNoSelectionSectionMessage();

        return;
      }

      var currentSelectedSection = _this.props.sections[currentSelectedSectionIndex];

      var updatedSectionElements = _this.getElementsForSection(currentSelectedSection).concat(elementToAdd);

      var updatedSections = _this.props.sections;
      currentSelectedSection[_this.props.elementPath] = updatedSectionElements;

      _this.props.onSectionOrderChanged(updatedSections);

      _this.openSectionIfClosed(currentSelectedSection.id);
    });

    _defineProperty(_assertThisInitialized(_this), "removeElementFromSection", function (elementId, sectionId) {
      var sectionIndex = fp.findIndex(function (section) {
        return fp.isEqual(section.id, sectionId);
      }, _this.props.sections);
      var currentSection = _this.props.sections[sectionIndex];

      var elements = _this.getElementsForSection(currentSection);

      var updatedElements = fp.filter(fp.negate(function (element) {
        return fp.isEqual(element.id, elementId);
      }), elements);
      var allSections = _this.props.sections;
      var currSection = _this.props.sections[sectionIndex];
      currSection[_this.props.elementPath] = updatedElements;

      _this.props.onSectionOrderChanged(allSections);
    });

    _defineProperty(_assertThisInitialized(_this), "sortItems", function (sectionIndex, oldIndex, newIndex) {
      var currentSection = _this.props.sections[sectionIndex];

      var oldElements = _this.getElementsForSection(currentSection);

      var elements = commonjs.arrayMove(oldElements, oldIndex, newIndex);
      var sections = _this.props.sections;
      sections[sectionIndex][_this.props.elementPath] = elements;

      _this.props.onSectionOrderChanged(sections);
    });

    _defineProperty(_assertThisInitialized(_this), "handleFilterAvailableElements", function (event) {
      _this.setState({
        availableDataElementsFilter: event.target.value
      });
    });

    _defineProperty(_assertThisInitialized(_this), "render", function () {
      var filteredAvailableElements = _this.getFilteredAvailableElements();

      var numberOfHiddenElements = _this.props.availableElements.length - filteredAvailableElements.length;
      return /*#__PURE__*/react.createElement("div", {
        style: styles$b.sectionForm
      }, /*#__PURE__*/react.createElement("div", {
        style: {
          flex: 2
        }
      }, /*#__PURE__*/react.createElement(SectionList$1, {
        useDragHandle: true,
        distance: 4,
        sections: _this.props.sections,
        selectedSectionId: _this.state.selectedSectionId,
        collapsedSections: _this.state.collapsedSections,
        onToggleSection: _this.onToggleSection,
        onToggleEditing: _this.onToggleEditing,
        onSelectSection: _this.onSelectSection,
        onSectionRemoved: _this.props.onSectionRemoved,
        onDataElementRemoved: _this.removeElementFromSection,
        onSortEnd: _this.onSortEnd,
        sortItems: _this.sortItems,
        elementPath: _this.props.elementPath
      }), /*#__PURE__*/react.createElement(AddOrEditSection, {
        onSectionAdded: _this.props.onSectionAdded,
        onSectionUpdated: _this.onSectionUpdated,
        editingSection: _this.state.editingSection,
        clearEditingSection: _this.clearEditingSection,
        open: _this.state.sectionEditOpen
      })), /*#__PURE__*/react.createElement("div", {
        style: {
          flex: 1
        }
      }, /*#__PURE__*/react.createElement(_default$k, {
        style: {
          marginBottom: 15,
          marginLeft: '1.5rem'
        },
        label: _this.getTranslation('add_section_to_form'),
        primary: true,
        fullWidth: false,
        onClick: function onClick() {
          return _this.setState({
            sectionEditOpen: true
          });
        }
      }), /*#__PURE__*/react.createElement(DataElementPicker, {
        availableDataElements: fp.sortBy(['displayName'], filteredAvailableElements),
        activeDataElements: _this.state.activeElements,
        onElementPicked: _this.onElementPicked,
        onFilter: _this.handleFilterAvailableElements,
        filterText: _this.getTranslation('filter_elements'),
        heading: _this.props.elementPath === 'dataElements' ? _this.getTranslation('available_data_elements') : _this.getTranslation('available_attributes')
      }), /*#__PURE__*/react.createElement(HiddenElementsText, {
        numberOfHiddenElements: numberOfHiddenElements,
        getTranslation: _this.getTranslation
      })), /*#__PURE__*/react.createElement(_default$l, {
        open: _this.state.showNoSelectionSectionMessage,
        message: _this.getTranslation('no_section_selected_error'),
        autoHideDuration: 3000,
        onRequestClose: _this.closeNoSelectionSectionMessage
      }));
    });

    _this.state = {
      collapsedSections: [],
      activeElements: getActiveElements(props.sections, props.elementPath),
      selectedSectionId: props.sections[0] && props.sections[0].id || -1,
      editingSection: null,
      showNoSelectionSectionMessage: false,
      availableDataElementsFilter: '',
      sectionEditOpen: false
    };
    _this.getTranslation = context.d2.i18n.getTranslation.bind(context.d2.i18n);
    return _this;
  }

  _createClass(SectionForm, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(newProps) {
      if (newProps.sections !== this.props.sections) {
        this.setState({
          activeElements: getActiveElements(newProps.sections, this.props.elementPath)
        });
        var newSectionAdded = fp.difference(newProps.sections, this.props.sections)[0];

        if (newSectionAdded) {
          this.selectSection(newSectionAdded.id);
        }
      }
    }
  }, {
    key: "getFilteredAvailableElements",
    value: function getFilteredAvailableElements() {
      var filter = this.state.availableDataElementsFilter;
      return this.props.availableElements.filter(function (element) {
        return !filter.length || element.displayName.toLowerCase().includes(filter.toLowerCase());
      });
    }
  }]);

  return SectionForm;
}(react.Component);

SectionForm.PropTypes = {
  onSectionUpdated: react.PropTypes.func.isRequired,
  onSectionOrderChanged: react.PropTypes.func.isRequired,
  onSectionAdded: react.PropTypes.func.isRequired,
  onSectionRemoved: react.PropTypes.func.isRequired,
  availableElements: react.PropTypes.array.isRequired,
  sections: react.PropTypes.arrayOf(react.PropTypes.shape({
    id: react.PropTypes.string.isRequired,
    sortOrder: react.PropTypes.number.isRequired,
    displayName: react.PropTypes.string.isRequired
  })).isRequired
};
SectionForm.contextTypes = {
  d2: react.PropTypes.object
};

var CKEditor = /*#__PURE__*/function (_Component) {
  _inherits(CKEditor, _Component);

  var _super = _createSuper(CKEditor);

  function CKEditor(props, context) {
    var _this;

    _classCallCheck(this, CKEditor);

    _this = _super.call(this, props, context);

    _defineProperty(_assertThisInitialized(_this), "setContainerRef", function (textarea) {
      _this.editorContainer = textarea;
    });

    _this.subscriptions = new Set();
    return _this;
  }

  _createClass(CKEditor, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var _this$props = this.props,
          _this$props$onEditorC = _this$props.onEditorChange,
          onEditorChange = _this$props$onEditorC === void 0 ? fp.noop : _this$props$onEditorC,
          _this$props$onEditorI = _this$props.onEditorInitialized,
          onEditorInitialized = _this$props$onEditorI === void 0 ? fp.noop : _this$props$onEditorI;

      if (!window.CKEDITOR) {
        log.error('CKEDITOR namespace can not be found on the window. You probably forgot to load the CKEditor script');
      }

      this.editor = window.CKEDITOR.replace(this.editorContainer, {
        plugins: ['a11yhelp', 'basicstyles', 'bidi', 'blockquote', 'clipboard', 'colorbutton', 'colordialog', 'contextmenu', 'dialogadvtab', 'div', 'elementspath', 'enterkey', 'entities', 'filebrowser', 'find', 'floatingspace', 'font', 'format', 'horizontalrule', 'htmlwriter', 'image', 'indentlist', 'indentblock', 'justify', 'link', 'list', 'liststyle', 'magicline', 'maximize', 'forms', 'pastefromword', 'pastetext', 'preview', 'removeformat', 'resize', 'selectall', 'showblocks', 'showborders', 'sourcearea', 'specialchar', 'stylescombo', 'tab', 'table', 'tabletools', 'toolbar', 'undo', 'wsc', 'wysiwygarea'].join(','),
        removePlugins: 'scayt,wsc,about',
        allowedContent: true,
        extraPlugins: 'div',
        height: 500
      });
      this.editor.setData(this.props.initialContent); // editor 'change'-event is not fired in source-mode,
      // This results in the need to switch back to HTML-mode to save source-data
      // Therefore we setup this observable when switching to source
      // See https://jira.dhis2.org/browse/DHIS2-5276

      var sourceChange$ = Observable.fromEventPattern(function (x) {
        return _this2.editor.on('mode', x);
      }).switchMap(function (e) {
        if (e.editor.mode === 'source') {
          var editable = e.editor.editable();
          return Observable.fromEventPattern(function (x) {
            return editable.attachListener(editable, 'input', x);
          });
        }

        return Observable.empty();
      });
      var editorChangeSubscription = Observable.fromEventPattern(function (x) {
        _this2.editor.on('change', x);
      }).merge(sourceChange$).debounceTime(250).subscribe(function () {
        onEditorChange(_this2.editor.getData());
      });
      this.subscriptions.add(editorChangeSubscription); // Callback to the parent to pass the editor instance so the parent can call functions on it like insertHTML.

      onEditorInitialized(this.editor);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.editor) {
        this.editor.destroy();
      }

      this.subscriptions.forEach(function (subscription) {
        return subscription.unsubscribe();
      });
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate() {
      return false;
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/react.createElement("textarea", {
        ref: this.setContainerRef
      });
    }
  }]);

  return CKEditor;
}(react.Component);
CKEditor.propTypes = {
  /**
   * Change handler that will be called when the content of the editor changed.
   */
  onEditorChange: react.PropTypes.func,

  /**
   * This callback will be called when the editor is mounted to the DOM. It will receive the instance of the CKEditor
   * that was mounted.
   */
  onEditorInitialized: react.PropTypes.func,

  /**
   * This is the initial content that the editor should render with. This content will only be added on the
   * `componentDidMount` lifecycle, updating the content will need to be done though setting it on the editor instance
   * directly by calling CKEditor functions like `editor.insertHtml()`.
   */
  initialContent: react.PropTypes.string
};

function PaletteSection(_ref, _ref2) {
  var keySet = _ref.keySet,
      label = _ref.label,
      filter = _ref.filter,
      expand = _ref.expand,
      expandClick = _ref.expandClick,
      usedIds = _ref.usedIds,
      insertFn = _ref.insertFn,
      styles = _ref.styles;
  var d2 = _ref2.d2;
  var filteredItems = Object.keys(keySet).filter(function (key) {
    return !filter.length || filter.every(function (filter) {
      return keySet[key].toLowerCase().indexOf(filter.toLowerCase()) !== -1;
    });
  });
  var cellClass = label === expand ? 'cell expanded' : 'cell';
  return /*#__PURE__*/react.createElement("div", {
    className: cellClass
  }, /*#__PURE__*/react.createElement("div", {
    style: _objectSpread2({}, styles),
    className: "header",
    onClick: expandClick
  }, /*#__PURE__*/react.createElement("div", {
    className: "arrow"
  }, "\u25B8"), d2.i18n.getTranslation(label), ":", /*#__PURE__*/react.createElement("div", {
    className: "count"
  }, filteredItems.length)), /*#__PURE__*/react.createElement("div", {
    className: "items"
  }, filteredItems.sort(function (a, b) {
    return keySet[a] ? keySet[a].localeCompare(keySet[b]) : a.localeCompare(b);
  }).map(function (key) {
    // Active items are items that are not already added to the form
    var isActive = usedIds.indexOf(key) === -1;
    var className = isActive ? 'item active' : 'item inactive';
    var name = keySet[key].name || keySet[key];
    return /*#__PURE__*/react.createElement("div", {
      key: key,
      className: className,
      title: name
    }, /*#__PURE__*/react.createElement("a", {
      onClick: insertFn[key]
    }, name));
  })));
}

PaletteSection.contextTypes = {
  d2: react.PropTypes.object
};
var PurePaletteSection$2 = _default$b(PaletteSection);

var inputPattern = /<input.*?\/>/gi;

var allPatterns = /attributeid="(\w*?)"|programid="(\w*?)"|id="((\w*?)-(\w*?)-val)"/; //Map over the position of the match of the pattern in the allPattern.
//matchIndexes[attributeid] will be the id of the element matched.

var matchIndexes = {
  'attributeid': 1,
  'programid': 2,
  'id': 3
};
function generateHtmlForField(id, styleAttr, disabledAttr, label) {
  var nameAttr = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "entryfield";
  var fieldType = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'id';
  var style = styleAttr ? " style=".concat(styleAttr) : '';
  var disabled = disabledAttr ? " disabled=".concat(disabledAttr) : '';
  var name = nameAttr ? "name=\"".concat(nameAttr, "\"") : '';
  var attr = "".concat(name, " title=\"").concat(label, "\" value=\"[ ").concat(label, " ]\"").concat(style).concat(disabled).trim();
  return "<input ".concat(fieldType, "=\"").concat(id, "\" ").concat(attr, "/>");
}
/**
 * Gets the id and idString from a matched element.
 *
 *  The idString is the entire string to be used as a html-attribute.
 *  Ie. attributeid="IpHINAT79UW"
 *  The id is then "IpHINAT79UW".
 *
 * @param match the Regex-match object to use
 * @returns {*} an object with idString, id and fieldType of the element.
 */

function getFieldInfoFromMatch(match) {
  if (!match) return null;

  for (var patternId in matchIndexes) {
    var index = matchIndexes[patternId];
    var elemId = match[index];

    if (elemId) {
      var id = elemId;
      return {
        idString: match[0],
        id: id,
        fieldType: patternId
      };
    }
  }

  return null;
}
/**
 * Processes the formData and generates the output.
 * This is used when the form is loaded, and we parse through
 * the html and generate meta-data, like the ids used in the form.
 * @param formData to use (raw html)
 * @param elements elements that can be in the form. Object with
 * the shape of inputPattern: Name of element. Like: { kffjgj5kf12: Name, kggjgj5kf12: Gender  }
 * @returns {{usedIds: Array, outHtml: string}}
 */


function processFormData(formData, elements) {
  var inHtml = formData;
  var outHtml = '';
  var usedIds = [];
  var inputElement = inputPattern.exec(inHtml);
  var inPos = 0;

  while (inputElement !== null) {
    outHtml += inHtml.substr(inPos, inputElement.index - inPos);
    inPos = inputPattern.lastIndex;
    var inputHtml = inputElement[0];
    var inputStyle = (/style="(.*?)"/.exec(inputHtml) || ['', ''])[1];
    var inputDisabled = /disabled/.exec(inputHtml) !== null;
    var allMatch = allPatterns.exec(inputHtml);
    var fieldInfo = getFieldInfoFromMatch(allMatch);

    if (fieldInfo && fieldInfo.idString && fieldInfo.id) {
      var id = fieldInfo.id,
          fieldType = fieldInfo.fieldType;
      usedIds.push(id);
      var label = elements && elements[id];
      var nameAttr = fieldType === "id" ? "entryfield" : null; //used for data-entry

      outHtml += generateHtmlForField(id, inputStyle, inputDisabled, label, nameAttr, fieldType);
    } else {
      outHtml += inputHtml;
    }

    inputElement = inputPattern.exec(inHtml);
  }

  outHtml += inHtml.substr(inPos);
  return {
    usedIds: usedIds,
    outHtml: outHtml
  };
}
/**
 * Helper to bind the keys of an object to given function
 * So that multiple elements can be bound to the same function.
 * The first parameter of each bound function will be the key.
 * @param obj Object with keys to bind
 * @param func Function to bind each key to
 * @param selfArg this context of the function
 * @param extraArgs An object of extra arguments
 * @returns {{}} - And object where each property is a bound function
 */

function bindFuncsToKeys(obj, func, selfArg, extraArgs) {
  var boundFuncs = {};
  Object.keys(obj).forEach(function (x) {
    boundFuncs[x] = func.bind(selfArg, x, extraArgs);
  });
  return boundFuncs;
}
function insertElement(id, label, editor) {
  var fieldType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'id';
  var nameAttr = fieldType === "id" ? "entryfield" : null; //used for data-entry

  var elementHtml = generateHtmlForField(id, null, null, label, nameAttr, fieldType);
  editor.insertHtml(elementHtml, 'unfiltered_html'); // Move the current selection to just after the newly inserted element

  var range = editor.getSelection().getRanges()[0];
  range && range.moveToElementEditablePosition(range.endContainer, true);
}

var _excluded$5 = ["programStage"];

var programStageDataElementWithProgramStageId = function programStageDataElementWithProgramStageId(programStageId) {
  return function (programStageDataElement) {
    return {
      id: "".concat(programStageId, ".").concat(programStageDataElement.id),
      displayName: programStageDataElement.displayName
    };
  };
};

var PurePaletteSection$1 = PurePaletteSection$2;
var styles$a = {
  heading: {
    paddingBottom: 18
  },
  formContainer: {},
  formPaper: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    margin: '0 auto 2rem',
    padding: '4rem 4rem',
    alignItems: 'center'
  },
  formSection: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  cancelButton: {
    marginLeft: '2rem'
  },
  deleteButton: {
    marginLeft: '2rem'
  },
  paletteHeader: {},
  paletteFilter: {
    padding: '0 8px 8px'
  },
  paletteFilterField: {
    width: '100%'
  },
  greySwitch: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8
  }
};

var EditDataEntryForm$2 = /*#__PURE__*/function (_React$Component) {
  _inherits(EditDataEntryForm, _React$Component);

  var _super = _createSuper(EditDataEntryForm);

  function EditDataEntryForm(props, context) {
    var _this;

    _classCallCheck(this, EditDataEntryForm);

    _this = _super.call(this, props, context);

    _defineProperty(_assertThisInitialized(_this), "handleEditorChanged", function (editorData) {
      // prevent changes when not active
      if (!_this.props.isActive) {
        return;
      } //prevent creation of new dataEntryForm when empty


      if (!editorData && !_this.props.dataEntryForm) {
        return;
      }

      var _processFormData = processFormData(editorData, _this.operands),
          usedIds = _processFormData.usedIds,
          outHtml = _processFormData.outHtml;

      _this.setState({
        usedIds: usedIds
      }, function () {
        // Emit a value when the html changed
        if (!_this.props.dataEntryForm || _this.props.dataEntryForm.htmlCode !== outHtml) {
          _this.props.onFormChange(outHtml);
        }
      });
    });

    var dataEntryForm = props.dataEntryForm;
    _this.state = {
      usedIds: [],
      filter: '',
      expand: 'data_elements',
      insertFn: {}
    };
    _this.disposables = new Set();
    var programStage = props.programStage,
        dataElements = props.dataElements; // Load flags

    _this.disposables.add(Observable.fromPromise(context.d2.Api.getApi().get('system/flags')).subscribe(function (flags) {
      // Operands with ID's that contain a dot ('.') are combined dataElementId's and categoryOptionId's
      // The API returns "dataElementId.categoryOptionId", which are transformed to the format expected by
      // custom forms: "dataElementId-categoryOptionId-val"
      _this.operands = dataElements.map(programStageDataElementWithProgramStageId(programStage.id)).filter(function (op) {
        return op.id.indexOf('.') !== -1;
      }).reduce(function (out, op) {
        var id = "".concat(op.id.split('.').join('-'), "-val");
        out[id] = op.displayName; // eslint-disable-line

        return out;
      }, {});
      _this.flags = flags.reduce(function (out, flag) {
        out[flag.path] = flag.name; // eslint-disable-line

        return out;
      }, {}); // Create inserter functions for all insertable elements
      // This avoids having to bind the functions during rendering

      var boundOps = bindFuncsToKeys(_this.operands, _this.insertElement, _assertThisInitialized(_this));
      var boundFlags = bindFuncsToKeys(_this.flags, _this.insertFlag, _assertThisInitialized(_this));

      var insertFn = _objectSpread2(_objectSpread2({}, boundOps), boundFlags);

      var _processFormData2 = processFormData(fp.getOr('', 'htmlCode', dataEntryForm), _this.operands),
          usedIds = _processFormData2.usedIds,
          outHtml = _processFormData2.outHtml;

      var formHtml = dataEntryForm ? outHtml : '';

      _this.setState({
        usedIds: usedIds,
        insertFn: insertFn,
        formHtml: formHtml,
        dataEntryForm: dataEntryForm,
        formTitle: _this.props.formTitle
      });
    })); // Create element filtering action


    _this.filterAction = Action.create('filter');

    _this.disposables.add(_this.filterAction.map(function (_ref) {
      var data = _ref.data,
          complete = _ref.complete,
          error = _ref.error;
      return {
        data: data[1],
        complete: complete,
        error: error
      };
    }).debounceTime(75).subscribe(function (args) {
      var filter = args.data.split(' ').filter(function (x) {
        return x.length;
      });

      _this.setState({
        filter: filter
      });
    }));

    _this.getTranslation = _this.context.d2.i18n.getTranslation.bind(_this.context.d2.i18n);
    _this.handleDeleteClick = _this.handleDeleteClick.bind(_assertThisInitialized(_this));
    _this.handleStyleChange = _this.handleStyleChange.bind(_assertThisInitialized(_this));
    _this.setEditorReference = _this.setEditorReference.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(EditDataEntryForm, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.disposables.forEach(function (disposable) {
        return disposable.unsubscribe();
      });
    } //Used for when the form is deleted, to update the form

  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(_ref2) {
      var dataEntryForm = _ref2.dataEntryForm;

      if (this.props.dataEntryForm && (!dataEntryForm || !dataEntryForm.id)) {
        this._editor.setData('');
      }
    }
  }, {
    key: "handleDeleteClick",
    value: function handleDeleteClick() {
      this.props.onFormDelete();
    }
  }, {
    key: "handleStyleChange",
    value: function handleStyleChange(e, i, value) {
      if (this.state.dataEntryForm.style !== value) {
        this.props.onStyleChange(value);
      }
    }
  }, {
    key: "insertElement",
    value: function insertElement$1(id) {
      if (this.state.usedIds.indexOf(id) !== -1) {
        return;
      }

      return insertElement(id, this.operands[id], this._editor);
    }
  }, {
    key: "insertFlag",
    value: function insertFlag(img) {
      this._editor.insertHtml("<img src=\"../dhis-web-commons/flags/".concat(img, "\" />"), 'unfiltered_html');

      var range = this._editor.getSelection().getRanges()[0];

      range.moveToElementEditablePosition(range.endContainer, true);
    }
  }, {
    key: "setEditorReference",
    value: function setEditorReference(editor) {
      this._editor = editor;
    }
  }, {
    key: "renderPalette",
    value: function renderPalette() {
      var _this2 = this;

      return /*#__PURE__*/react.createElement("div", {
        className: "paletteContainer",
        style: {}
      }, /*#__PURE__*/react.createElement("div", {
        className: "palette"
      }, /*#__PURE__*/react.createElement("div", {
        style: styles$a.paletteFilter
      }, /*#__PURE__*/react.createElement(_default$e, {
        hintText: this.getTranslation('filter_elements'),
        style: styles$a.paletteFilterField,
        onChange: this.filterAction,
        fullWidth: true
      })), /*#__PURE__*/react.createElement("div", {
        className: "elements"
      }, /*#__PURE__*/react.createElement(PurePaletteSection$1, {
        keySet: this.operands,
        label: "data_elements",
        filter: this.state.filter,
        expand: this.state.expand,
        expandClick: function expandClick() {
          _this2.setState({
            expand: 'data_elements'
          });
        },
        usedIds: this.state.usedIds,
        insertFn: this.state.insertFn
      }), /*#__PURE__*/react.createElement(PurePaletteSection$1, {
        keySet: this.flags,
        label: "flags",
        filter: this.state.filter,
        expand: this.state.expand,
        expandClick: function expandClick() {
          _this2.setState({
            expand: 'flags'
          });
        },
        usedIds: this.state.usedIds,
        insertFn: this.state.insertFn
      }))));
    }
  }, {
    key: "render",
    value: function render() {
      var props = this.props;
      return this.state.formHtml === undefined ? /*#__PURE__*/react.createElement(LoadingMask, null) : /*#__PURE__*/react.createElement("div", {
        style: Object.assign({}, styles$a.formContainer, {})
      }, /*#__PURE__*/react.createElement("div", {
        className: "programStageEditForm"
      }, /*#__PURE__*/react.createElement("div", {
        className: "left"
      }, /*#__PURE__*/react.createElement(CKEditor, {
        onEditorChange: this.handleEditorChanged,
        onEditorInitialized: this.setEditorReference,
        initialContent: this.state.formHtml
      }), /*#__PURE__*/react.createElement(_default$d, {
        style: styles$a.formPaper
      }, /*#__PURE__*/react.createElement("div", {
        style: styles$a.formSection
      }, /*#__PURE__*/react.createElement(_default$m, {
        value: fp.getOr('NORMAL', 'style', props.dataEntryForm),
        floatingLabelText: "Form display style",
        onChange: this.handleStyleChange
      }, /*#__PURE__*/react.createElement(_default$n, {
        value: 'NORMAL',
        primaryText: this.getTranslation('normal')
      }), /*#__PURE__*/react.createElement(_default$n, {
        value: 'COMFORTABLE',
        primaryText: this.getTranslation('comfortable')
      }), /*#__PURE__*/react.createElement(_default$n, {
        value: 'COMPACT',
        primaryText: this.getTranslation('compact')
      }), /*#__PURE__*/react.createElement(_default$n, {
        value: 'NONE',
        primaryText: this.getTranslation('none')
      }))), /*#__PURE__*/react.createElement("div", {
        style: styles$a.formSection
      }, props.dataEntryForm && props.dataEntryForm.id ? /*#__PURE__*/react.createElement(_default$o, {
        primary: true,
        label: this.getTranslation('delete'),
        style: styles$a.deleteButton,
        onClick: this.handleDeleteClick
      }) : undefined))), /*#__PURE__*/react.createElement("div", {
        className: "right"
      }, this.renderPalette())));
    }
  }]);

  return EditDataEntryForm;
}(react.Component);

EditDataEntryForm$2.propTypes = {
  params: PropTypes.object,
  onFormChange: PropTypes.func,
  onStyleChange: PropTypes.func,
  onFormDelete: PropTypes.func,
  elements: PropTypes.array
};
EditDataEntryForm$2.defaultProps = {
  onFormChange: fp.noop,
  onStyleChange: fp.noop,
  onFormDelete: fp.noop
};
EditDataEntryForm$2.contextTypes = {
  d2: PropTypes.any
};

var mapDispatchToPropsForProgramStage = function mapDispatchToPropsForProgramStage(dispatch, _ref3) {
  var programStage = _ref3.programStage;
  return bindActionCreators({
    onFormChange: fp.curry(dataEntryFormChanged)(programStage.id)('htmlCode'),
    onStyleChange: fp.curry(dataEntryFormChanged)(programStage.id)('style'),
    onFormDelete: dataEntryFormRemove.bind(undefined, programStage.id)
  }, dispatch);
};

var programStageDataEntryForm = fp.compose(_default$8(function (props$) {
  return props$.combineLatest(eventProgramStore, function (_ref4, state) {
    var programStage = _ref4.programStage,
        props = _objectWithoutProperties(_ref4, _excluded$5);

    return _objectSpread2(_objectSpread2({}, props), {}, {
      programStage: programStage,
      dataEntryForm: state.dataEntryFormForProgramStage[programStage.id],
      dataElements: getProgramStageDataElementsByStageId(state)(programStage.id),
      formTitle: programStage.displayName
    });
  });
}), connect(undefined, mapDispatchToPropsForProgramStage));
var EditCustomFormProgramStage = programStageDataEntryForm(EditDataEntryForm$2);

var CustomForm = function CustomForm(props) {
  return /*#__PURE__*/react.createElement(EditCustomFormProgramStage, props);
};

var getCurrentProgramStage = function getCurrentProgramStage(state) {
  return state.eventProgram.programStageStepper.stageId;
};

var program$$2 = eventProgramStore.map(fp.get('program'));
var programStages$$2 = eventProgramStore.map(fp.get('programStages'));
var getFirstProgramStage = fp.compose(fp.first, fp.get('programStages'));
var firstProgramStage$ = eventProgramStore.map(getFirstProgramStage);
/**
 * Maps the programStage$ observable to a normal object to read the values in the component.
 */

var withProgramStageFromProgramStage$ = _default$8(function (props$) {
  return props$.combineLatest(props$.flatMap(function (x) {
    return x.programStage$;
  }), function (props, programStage) {
    return _objectSpread2(_objectSpread2({}, props), {}, {
      programStage: programStage
    });
  });
});
/**
 * Adds program and programStages as props to the enhanced components.
 */

var withProgramAndStages = fp.compose(_default$8(function (props$) {
  return props$.combineLatest(program$$2, programStages$$2, function (props, program, programStages) {
    return _objectSpread2(_objectSpread2({}, props), {}, {
      program: program,
      programStages: programStages
    });
  });
}));
var getProgramStageById$ = function getProgramStageById$(stageId) {
  return programStages$$2.flatMap(function (x) {
    return x;
  }).filter(function (stage) {
    return stage.id && stage.id === stageId;
  });
}; // Use programStage$ prop if present, else use first programStage

var getProgramStageOrFirstFromProps$ = function getProgramStageOrFirstFromProps$(props$) {
  return props$.take(1).flatMap(function (props) {
    return props.programStage$ ? props.programStage$ : eventProgramStore.map(getFirstProgramStage);
  });
};

var _excluded$4 = ["trackerDataElements"];
var formIndices$1 = {
  basic: 0,
  section: 1,
  custom: 2
};
var styles$9 = {
  tabContent: {
    padding: '3rem'
  },
  helpText: {
    color: 'gray',
    marginBottom: '2rem'
  }
};

var CreateDataEntryForm$1 = /*#__PURE__*/function (_Component) {
  _inherits(CreateDataEntryForm, _Component);

  var _super = _createSuper(CreateDataEntryForm);

  function CreateDataEntryForm(props) {
    var _this;

    _classCallCheck(this, CreateDataEntryForm);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "onTabChange", function (_, __, tab) {
      var curTab = tab.props.index;

      _this.setState({
        curTab: curTab
      });
    });

    _defineProperty(_assertThisInitialized(_this), "programDataElementOrderChanged", function (_ref) {
      var oldIndex = _ref.oldIndex,
          newIndex = _ref.newIndex;

      _this.props.onChangeDefaultOrder(commonjs.arrayMove(_this.props.availableDataElements.map(function (dataElement) {
        return dataElement.id;
      }), oldIndex, newIndex));
    });

    _defineProperty(_assertThisInitialized(_this), "renderTab", function (label, contentToRender) {
      return /*#__PURE__*/react.createElement(Tab, {
        style: styles$9.tab,
        label: label
      }, /*#__PURE__*/react.createElement("div", {
        style: styles$9.tabContent
      }, /*#__PURE__*/react.createElement(HelpText$1, null), contentToRender));
    });

    _defineProperty(_assertThisInitialized(_this), "getTranslation", function (key) {
      return _this.context.d2.i18n.getTranslation(key);
    });

    var hasCustomForm = _this.props.programStage && _this.props.programStage.dataEntryForm;
    _this.state = {
      curTab: hasCustomForm ? formIndices$1.custom : formIndices$1.section
    };
    return _this;
  }

  _createClass(CreateDataEntryForm, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/react.createElement(_default$d, null, /*#__PURE__*/react.createElement(Tabs_1, {
        initialSelectedIndex: this.state.curTab,
        onChange: this.onTabChange
      }, this.renderTab(this.getTranslation('basic'), /*#__PURE__*/react.createElement(DefaultForm, {
        availableDataElements: this.props.availableDataElements,
        onChange: this.programDataElementOrderChanged
      })), this.renderTab(this.getTranslation('section'), /*#__PURE__*/react.createElement(SectionForm, {
        availableElements: this.props.availableDataElements,
        sections: this.props.programStageSections,
        onSectionUpdated: this.props.onSectionUpdated,
        onSectionOrderChanged: this.props.onSectionOrderChanged,
        onSectionAdded: this.props.onSectionAdded,
        onSectionRemoved: this.props.onSectionRemoved,
        elementPath: "dataElements"
      })), this.renderTab(this.getTranslation('custom'), /*#__PURE__*/react.createElement(CustomForm, {
        isActive: this.state.curTab === formIndices$1.custom,
        programStage: this.props.programStage
      }))));
    }
  }]);

  return CreateDataEntryForm;
}(react.Component);

CreateDataEntryForm$1.contextTypes = {
  d2: react.PropTypes.object
};

var HelpText$1 = function HelpText(_, _ref2) {
  var d2 = _ref2.d2;
  return /*#__PURE__*/react.createElement("div", {
    style: styles$9.helpText
  }, d2.i18n.getTranslation('program_forms_help_text'));
};

HelpText$1.contextTypes = {
  d2: react.PropTypes.object
};
CreateDataEntryForm$1.propTypes = {
  onChangeDefaultOrder: react.PropTypes.func.isRequired,
  onSectionOrderChanged: react.PropTypes.func.isRequired,
  onSectionUpdated: react.PropTypes.func.isRequired,
  onSectionAdded: react.PropTypes.func.isRequired,
  onSectionRemoved: react.PropTypes.func.isRequired,
  programStageSections: react.PropTypes.arrayOf(react.PropTypes.shape({
    id: react.PropTypes.string.isRequired,
    sortOrder: react.PropTypes.number.isRequired,
    displayName: react.PropTypes.string.isRequired,
    dataElements: react.PropTypes.arrayOf(react.PropTypes.shape({
      id: react.PropTypes.string.isRequired,
      displayName: react.PropTypes.string.isRequired
    })).isRequired
  })).isRequired
};

var mapStateToProps$9 = function mapStateToProps(state) {
  return {
    currentProgramStageId: getCurrentProgramStage(state)
  };
};

var mapDispatchToProps$b = function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    changeProgramStageDataElementOrder: changeProgramStageDataElementOrder,
    changeProgramStageSectionOrder: changeProgramStageSectionOrder,
    addProgramStageSection: addProgramStageSection,
    removeProgramStageSection: removeProgramStageSection,
    updateProgramStageSection: updateProgramStageSection
  }, dispatch);
};

var programStageSections$ = eventProgramStore.map(fp.getOr([], 'programStageSections'));
var trackerDataElements$ = eventProgramStore.map(fp.getOr([], 'availableDataElements'));
var enhance$6 = fp.compose(connect(mapStateToProps$9, mapDispatchToProps$b), _default$8(function (props$) {
  return props$.combineLatest(getProgramStageOrFirstFromProps$(props$), programStageSections$, trackerDataElements$, eventProgramStore, function (props, programStage, programStageSections, trackerDataElements, store) {
    return _objectSpread2(_objectSpread2({}, props), {}, {
      programStage: programStage,
      programStageSections: getStageSectionsById(store, programStage.id) || [],
      trackerDataElements: trackerDataElements
    });
  });
}), _default$7(function (_ref3) {
  var trackerDataElements = _ref3.trackerDataElements,
      props = _objectWithoutProperties(_ref3, _excluded$4);

  var getDisplayNameForDataElement = function getDisplayNameForDataElement(dataElement) {
    return dataElement.displayName || fp.get('displayName', fp.find(function (trackerDataElement) {
      return dataElement.id === trackerDataElement.id;
    }, trackerDataElements));
  };

  var availableDataElements = props.programStage.programStageDataElements;
  return _objectSpread2(_objectSpread2({}, props), {}, {
    programStageSections: fp.sortBy(['sortOrder'], props.programStageSections.map(function (section) {
      section.dataElements = Array.from(section.dataElements.values()).map(function (dataElement) {
        return {
          id: dataElement.id,
          displayName: getDisplayNameForDataElement(dataElement)
        };
      });
      return section;
    })),
    availableDataElements: fp.sortBy(['sortOrder'], availableDataElements.map(function (programDataElement) {
      return _objectSpread2(_objectSpread2({}, programDataElement.dataElement), {}, {
        displayName: getDisplayNameForDataElement(programDataElement.dataElement),
        sortOrder: programDataElement.sortOrder
      });
    }))
  });
}), _default$9({
  onChangeDefaultOrder: function onChangeDefaultOrder(_ref4) {
    var programStage = _ref4.programStage,
        changeProgramStageDataElementOrder = _ref4.changeProgramStageDataElementOrder;
    return function (newDataElementOrder) {
      changeProgramStageDataElementOrder({
        programStage: programStage.id,
        newDataElementOrder: newDataElementOrder
      });
    };
  },
  onSectionUpdated: function onSectionUpdated(_ref5) {
    var programStage = _ref5.programStage,
        updateProgramStageSection = _ref5.updateProgramStageSection;
    return function (sectionId, newSectionData) {
      updateProgramStageSection({
        programStage: programStage.id,
        programStageSectionId: sectionId,
        newProgramStageSectionData: newSectionData
      });
    };
  },
  onSectionOrderChanged: function onSectionOrderChanged(_ref6) {
    var programStage = _ref6.programStage,
        changeProgramStageSectionOrder = _ref6.changeProgramStageSectionOrder;
    return function (programStageSections) {
      changeProgramStageSectionOrder({
        programStage: programStage.id,
        programStageSections: programStageSections
      });
    };
  },
  onSectionAdded: function onSectionAdded(_ref7) {
    var programStage = _ref7.programStage,
        addProgramStageSection = _ref7.addProgramStageSection;
    return function (newSectionData) {
      addProgramStageSection({
        programStage: programStage.id,
        newSectionData: newSectionData
      });
    };
  },
  onSectionRemoved: function onSectionRemoved(_ref8) {
    var programStage = _ref8.programStage,
        removeProgramStageSection = _ref8.removeProgramStageSection;
    return function (programStageSection) {
      removeProgramStageSection({
        programStage: programStage.id,
        programStageSection: programStageSection
      });
    };
  }
}));
var EditDataEntryForm$1 = enhance$6(CreateDataEntryForm$1);

var arrowDownward = {};

Object.defineProperty(arrowDownward, "__esModule", {
  value: true
});

var _react$3 = react;

var _react2$3 = _interopRequireDefault$3(_react$3);

var _pure$3 = pure;

var _pure2$3 = _interopRequireDefault$3(_pure$3);

var _SvgIcon$3 = SvgIcon;

var _SvgIcon2$3 = _interopRequireDefault$3(_SvgIcon$3);

function _interopRequireDefault$3(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NavigationArrowDownward = function NavigationArrowDownward(props) {
  return _react2$3.default.createElement(
    _SvgIcon2$3.default,
    props,
    _react2$3.default.createElement('path', { d: 'M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z' })
  );
};
NavigationArrowDownward = (0, _pure2$3.default)(NavigationArrowDownward);
NavigationArrowDownward.displayName = 'NavigationArrowDownward';
NavigationArrowDownward.muiName = 'SvgIcon';

var _default$3 = arrowDownward.default = NavigationArrowDownward;

var doneAll = {};

Object.defineProperty(doneAll, "__esModule", {
  value: true
});

var _react$2 = react;

var _react2$2 = _interopRequireDefault$2(_react$2);

var _pure$2 = pure;

var _pure2$2 = _interopRequireDefault$2(_pure$2);

var _SvgIcon$2 = SvgIcon;

var _SvgIcon2$2 = _interopRequireDefault$2(_SvgIcon$2);

function _interopRequireDefault$2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ActionDoneAll = function ActionDoneAll(props) {
  return _react2$2.default.createElement(
    _SvgIcon2$2.default,
    props,
    _react2$2.default.createElement('path', { d: 'M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z' })
  );
};
ActionDoneAll = (0, _pure2$2.default)(ActionDoneAll);
ActionDoneAll.displayName = 'ActionDoneAll';
ActionDoneAll.muiName = 'SvgIcon';

var _default$2 = doneAll.default = ActionDoneAll;

var done = {};

Object.defineProperty(done, "__esModule", {
  value: true
});

var _react$1 = react;

var _react2$1 = _interopRequireDefault$1(_react$1);

var _pure$1 = pure;

var _pure2$1 = _interopRequireDefault$1(_pure$1);

var _SvgIcon$1 = SvgIcon;

var _SvgIcon2$1 = _interopRequireDefault$1(_SvgIcon$1);

function _interopRequireDefault$1(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ActionDone = function ActionDone(props) {
  return _react2$1.default.createElement(
    _SvgIcon2$1.default,
    props,
    _react2$1.default.createElement('path', { d: 'M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z' })
  );
};
ActionDone = (0, _pure2$1.default)(ActionDone);
ActionDone.displayName = 'ActionDone';
ActionDone.muiName = 'SvgIcon';

var _default$1 = done.default = ActionDone;

var clear = {};

Object.defineProperty(clear, "__esModule", {
  value: true
});

var _react = react;

var _react2 = _interopRequireDefault(_react);

var _pure = pure;

var _pure2 = _interopRequireDefault(_pure);

var _SvgIcon = SvgIcon;

var _SvgIcon2 = _interopRequireDefault(_SvgIcon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ContentClear = function ContentClear(props) {
  return _react2.default.createElement(
    _SvgIcon2.default,
    props,
    _react2.default.createElement('path', { d: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' })
  );
};
ContentClear = (0, _pure2.default)(ContentClear);
ContentClear.displayName = 'ContentClear';
ContentClear.muiName = 'SvgIcon';

var _default = clear.default = ContentClear;

var Toolbar = function Toolbar(_ref, _ref2) {
  var selectAll = _ref.selectAll,
      selectSimilar = _ref.selectSimilar,
      deselectAll = _ref.deselectAll,
      areAllSelected = _ref.areAllSelected,
      areNoneSelected = _ref.areNoneSelected;
  var d2 = _ref2.d2;

  var translate = function translate(s) {
    return d2.i18n.getTranslation(s);
  };

  return /*#__PURE__*/react.createElement("div", {
    style: {
      alignSelf: 'flex-end',
      height: 60,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    }
  }, /*#__PURE__*/react.createElement(_default$f, {
    primary: true,
    labelPosition: "before",
    disabled: areNoneSelected,
    style: {
      height: 45
    },
    icon: /*#__PURE__*/react.createElement(_default, null),
    label: translate("deselect_all"),
    onClick: deselectAll
  }), /*#__PURE__*/react.createElement(_default$f, {
    primary: true,
    labelPosition: "before",
    style: {
      height: 45
    },
    icon: /*#__PURE__*/react.createElement(_default$1, null),
    label: translate("select_similar"),
    onClick: selectSimilar
  }), /*#__PURE__*/react.createElement(_default$f, {
    primary: true,
    labelPosition: "before",
    disabled: areAllSelected,
    style: {
      height: 45
    },
    icon: /*#__PURE__*/react.createElement(_default$2, null),
    label: translate("select_all"),
    onClick: selectAll
  }));
};

Toolbar.contextTypes = {
  d2: PropTypes.object
};

var areSharingPropertiesSimilar = function areSharingPropertiesSimilar(a, b) {
  if (a.publicAccess !== b.publicAccess) return false;
  if (!!a.externalAccess !== !!b.externalAccess) return false;

  var compareFunction = function compareFunction(a, b) {
    return a.id < b.id;
  };

  if (!fp.isEqual(Array.sort(a.userAccesses || [], compareFunction), Array.sort(b.userAccesses || [], compareFunction))) {
    return false;
  }

  return fp.isEqual(Array.sort(a.userGroupAccesses || [], compareFunction), Array.sort(b.userGroupAccesses || [], compareFunction));
};

var getPublicAccessDescription = function getPublicAccessDescription(publicAccess) {
  if (publicAccess.substr(0, 4) === '----') return 'No public access';
  if (publicAccess.substr(0, 4) === 'rwrw') return 'Complete public access';
  var description = '';

  switch (publicAccess.substr(0, 2)) {
    case 'rw':
      description += 'Public metadata read- and write access';
      break;

    case 'r-':
      description += 'Public metadata read access';
      break;

    default:
      description += 'No public metadata access';
      break;
  }

  description = description += ', ';

  switch (publicAccess.substr(2, 2)) {
    case 'rw':
      return description + 'public data read- and write access';

    case 'r-':
      return description + 'public data read access';

    default:
      return description + 'no public data access';
  }
};

var generateSharingDescription = function generateSharingDescription(_ref) {
  var publicAccess = _ref.publicAccess,
      userGroupAccesses = _ref.userGroupAccesses,
      userAccesses = _ref.userAccesses;
  var publicAccessDescription = getPublicAccessDescription(publicAccess);
  var userGroupCount = userGroupAccesses ? userGroupAccesses.length : 0;
  var userCount = userAccesses ? userAccesses.length : 0;
  var description = publicAccessDescription;

  if (userCount || userGroupCount) {
    description += ', accessible to ';

    if (userCount) {
      var plural = userCount > 1 ? 's' : '';
      description += "".concat(userCount, " user").concat(plural);
    }

    if (userGroupCount) {
      if (userCount) description += ' and ';

      var _plural = userGroupCount > 1 ? 's' : '';

      description += "".concat(userGroupCount, " user group").concat(_plural);
    }
  }

  return description;
};

var styles$8 = {
  container: {
    paddingTop: 32,
    display: 'flex',
    flexDirection: 'column'
  },
  vertical: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  horizontal: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  programHeading: {
    padding: '5px 0px'
  },
  accessDescription: {
    color: '#aaa',
    fontWeight: 400,
    overflow: 'hidden'
  },
  programStageList: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row'
  },
  warningIcon: {
    top: '22px',
    height: '32px',
    width: '32px'
  },
  stageSharingItem: {
    height: '80px'
  }
};
var sharingFields = ['publicAccess', 'userAccesses', 'userGroupAccesses'];

var ProgramStagesAccess = /*#__PURE__*/function (_React$Component) {
  _inherits(ProgramStagesAccess, _React$Component);

  var _super = _createSuper(ProgramStagesAccess);

  function ProgramStagesAccess(props) {
    var _this;

    _classCallCheck(this, ProgramStagesAccess);

    _this = _super.call(this, props); // Get (supersets of) sharing structures

    _defineProperty(_assertThisInitialized(_this), "translate", function (s) {
      return _this.context.d2.i18n.getTranslation(s);
    });

    _defineProperty(_assertThisInitialized(_this), "toggleStageSelection", function (id) {
      return function (_, isChecked) {
        _this.setState({
          selectedStages: isChecked ? [].concat(_toConsumableArray(_this.state.selectedStages), [id]) : _this.state.selectedStages.filter(function (stage) {
            return stage !== id;
          })
        }, _this.updateInternalState);
      };
    });

    _defineProperty(_assertThisInitialized(_this), "selectSimilarStages", function () {
      var selectedStages = [];

      _this.state.stagesSharing.forEach(function (stage) {
        if (areSharingPropertiesSimilar(stage, _this.state.programSharing)) {
          selectedStages.push(stage.id);
        }
      });

      _this.setState({
        selectedStages: selectedStages
      });
    });

    _defineProperty(_assertThisInitialized(_this), "selectAllStages", function () {
      _this.setState({
        selectedStages: _this.state.stagesSharing.map(function (stage) {
          return stage.id;
        })
      });
    });

    _defineProperty(_assertThisInitialized(_this), "deselectAllStages", function () {
      _this.setState({
        selectedStages: []
      });
    });

    _defineProperty(_assertThisInitialized(_this), "openSharingDialog", function (model, sharingType) {
      var objectToShare = {
        meta: {
          allowPublicAccess: true,
          allowExternalAccess: false
        },
        object: {
          user: model.user,
          displayName: model.displayName || model.name,
          userAccesses: model.userAccesses,
          userGroupAccesses: model.userGroupAccesses,
          publicAccess: model.publicAccess,
          externalAccess: false
        }
      };

      _this.setState({
        sharingDialogOpen: true,
        sharingType: sharingType,
        sharingId: model.id,
        objectToShare: objectToShare
      });
    });

    _defineProperty(_assertThisInitialized(_this), "closeSharingDialog", function () {
      _this.setState({
        sharingDialogOpen: false
      });
    });

    _defineProperty(_assertThisInitialized(_this), "confirmAndCloseSharingDialog", function (updatedSharing) {
      if (!updatedSharing.userAccesses) updatedSharing.userAccesses = [];
      if (!updatedSharing.userGroupAccesses) updatedSharing.userGroupAccesses = [];

      if (updatedSharing.id === _this.state.programSharing.id) {
        _this.updateProgramAccess(updatedSharing);
      } else {
        _this.updateStageAccess(updatedSharing);
      }

      _this.closeSharingDialog();
    });

    _defineProperty(_assertThisInitialized(_this), "updateProgramAccess", function (updatedSharing) {
      _this.storeProgramChanges(updatedSharing);

      _this.setState({
        programSharing: updatedSharing
      }, _this.updateInternalState);
    });

    _defineProperty(_assertThisInitialized(_this), "updateStageAccess", function (updatedSharing) {
      _this.storeStageChanges(updatedSharing.id, updatedSharing);

      _this.setState({
        stagesSharing: _this.state.stagesSharing.map(function (stage) {
          return updatedSharing.id === stage.id ? updatedSharing : stage;
        })
      }, _this.updateInternalState);
    });

    _defineProperty(_assertThisInitialized(_this), "storeProgramChanges", function (program) {
      sharingFields.forEach(function (property) {
        _this.props.editFieldChanged(property, program[property]);
      });
    });

    _defineProperty(_assertThisInitialized(_this), "storeStageChanges", function (stageId, sharingProperties) {
      sharingFields.forEach(function (property) {
        _this.props.editProgramStageField(stageId, property, sharingProperties[property]);
      });
    });

    _defineProperty(_assertThisInitialized(_this), "propagateAccess", function (event) {
      event.stopPropagation();

      _this.state.stagesSharing.forEach(function (stage) {
        if (_this.state.selectedStages.includes(stage.id)) {
          _this.storeStageChanges(stage.id, _this.state.programSharing);
        }
      });

      var propagateIfSelected = function propagateIfSelected(stage) {
        if (_this.state.selectedStages.includes(stage.id)) {
          return _objectSpread2(_objectSpread2({}, _this.state.programSharing), {}, {
            id: stage.id,
            displayName: stage.displayName || stage.name
          });
        } else return stage;
      };

      _this.setState({
        stagesSharing: _this.state.stagesSharing.map(propagateIfSelected)
      }, _this.updateInternalState);
    });

    _defineProperty(_assertThisInitialized(_this), "updateInternalState", function () {
      var stagesWithSimilarAccessAsProgram = _this.state.stagesSharing.filter(function (stage) {
        return areSharingPropertiesSimilar(_this.state.programSharing, stage);
      }).map(function (stage) {
        return stage.id;
      });

      _this.setState({
        stagesWithSimilarAccessAsProgram: stagesWithSimilarAccessAsProgram
      });
    });

    _defineProperty(_assertThisInitialized(_this), "render", function () {
      var stageSharingList = _this.state.stagesSharing.map(function (stage) {
        var leftAvatar = _this.state.stagesWithSimilarAccessAsProgram.includes(stage.id) ? /*#__PURE__*/react.createElement("div", null) : /*#__PURE__*/react.createElement(_default$h, {
          style: {
            pointer: 'default'
          },
          tooltip: _this.translate("differs_from_program")
        }, /*#__PURE__*/react.createElement(_default$p, {
          style: styles$8.warningIcon,
          color: yellow800_1
        }));
        return /*#__PURE__*/react.createElement(_default$q, {
          style: styles$8.stageSharingItem,
          onClick: function onClick() {
            return _this.openSharingDialog(stage, 'programStage');
          },
          leftAvatar: leftAvatar,
          key: stage.id,
          primaryText: stage.displayName || stage.name,
          secondaryText: generateSharingDescription(stage)
        });
      });

      var checkBoxList = _this.state.stagesSharing.map(function (stage) {
        return /*#__PURE__*/react.createElement(_default$r, {
          key: stage.id,
          style: {
            height: '80px',
            paddingTop: '24px',
            paddingLeft: '32px'
          },
          onCheck: _this.toggleStageSelection(stage.id),
          checked: _this.state.selectedStages.includes(stage.id)
        });
      });

      return /*#__PURE__*/react.createElement("div", {
        style: styles$8.container
      }, /*#__PURE__*/react.createElement(_default$q, {
        onClick: function onClick() {
          return _this.openSharingDialog(_this.props.model, 'program');
        },
        primaryText: _this.props.model.displayName || _this.props.model.name,
        secondaryText: generateSharingDescription(_this.state.programSharing),
        rightIconButton: /*#__PURE__*/react.createElement(_default$f, {
          primary: true,
          disabled: _this.state.selectedStages.length === 0,
          style: {
            height: 45
          },
          icon: /*#__PURE__*/react.createElement(_default$3, null),
          label: _this.translate("apply_to_selected_stages"),
          labelPosition: "before",
          onClick: _this.propagateAccess
        })
      }), /*#__PURE__*/react.createElement(_default$s, null), /*#__PURE__*/react.createElement(Toolbar, {
        selectAll: _this.selectAllStages,
        deselectAll: _this.deselectAllStages,
        selectSimilar: _this.selectSimilarStages,
        areNoneSelected: _this.state.selectedStages.length === 0,
        areAllSelected: _this.state.selectedStages.length === _this.state.stagesSharing.length
      }), _this.state.stagesSharing.length !== 0 && /*#__PURE__*/react.createElement("div", {
        style: styles$8.programStageList
      }, /*#__PURE__*/react.createElement("div", {
        style: {
          flex: 1
        }
      }, stageSharingList), /*#__PURE__*/react.createElement("div", null, checkBoxList)), /*#__PURE__*/react.createElement(SharingDialog, {
        doNotPost: true,
        sharedObject: _this.state.objectToShare,
        open: _this.state.sharingDialogOpen,
        id: _this.state.sharingId,
        type: _this.state.sharingType,
        onRequestClose: _this.closeSharingDialog,
        onConfirm: _this.confirmAndCloseSharingDialog,
        d2: _this.context.d2
      }));
    });

    var programSharing = _this.props.model.dataValues;
    var stagesSharing = Array.from(_this.props.model.dataValues.programStages.valuesContainerMap).map(function (stage) {
      return stage[1];
    }); // Pre-select stages with similar sharing settings as program

    var _selectedStages = [];
    var _stagesWithSimilarAccessAsProgram = [];
    stagesSharing.forEach(function (stage) {
      if (areSharingPropertiesSimilar(programSharing, stage)) {
        _stagesWithSimilarAccessAsProgram.push(stage.id);

        _selectedStages.push(stage.id);
      }
    });
    _this.state = {
      sharingDialogOpen: false,
      stagesSharing: stagesSharing,
      programSharing: programSharing,
      selectedStages: _selectedStages,
      stagesWithSimilarAccessAsProgram: _stagesWithSimilarAccessAsProgram
    };
    return _this;
  }

  return ProgramStagesAccess;
}(react.Component);

ProgramStagesAccess.contextTypes = {
  d2: PropTypes.object
};

var mapStateToProps$8 = function mapStateToProps() {
  return {};
};

var mapDispatchToProps$a = function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    editFieldChanged: editFieldChanged,
    editProgramStageField: editProgramStageField
  }, dispatch);
};

var ProgramStagesAccess$1 = connect(mapStateToProps$8, mapDispatchToProps$a)(ProgramStagesAccess);

var styles$7 = {
  paper: {
    padding: '3rem'
  },
  padding: {
    paddingTop: '3rem'
  }
};

var ProgramNotSavedMessage = function ProgramNotSavedMessage() {
  return /*#__PURE__*/react.createElement("div", null, "Save the program in order to access sharing settings");
};

var ProgramStagesAccessHOC = branch(function (props) {
  return !props.model.dataValues.publicAccess;
}, renderComponent(ProgramNotSavedMessage))(ProgramStagesAccess$1);

var ProgramAccess = function ProgramAccess(_ref, _ref2) {
  var modelToEdit = _ref.modelToEdit;
  var d2 = _ref2.d2;

  if (!modelToEdit) {
    return null;
  }

  return /*#__PURE__*/react.createElement(_default$d, {
    style: styles$7.paper
  }, /*#__PURE__*/react.createElement(Heading, null, d2.i18n.getTranslation("organisation_units")), /*#__PURE__*/react.createElement(OrganisationUnitTreeMultiSelect, {
    value: modelToEdit.organisationUnits,
    model: modelToEdit,
    modelDefinition: modelToEdit.modelDefinition
  }), /*#__PURE__*/react.createElement(Heading, {
    style: styles$7.padding
  }, d2.i18n.getTranslation("roles_and_access")), /*#__PURE__*/react.createElement(ProgramStagesAccessHOC, {
    model: modelToEdit
  }));
};

ProgramAccess.contextTypes = {
  d2: PropTypes.object
};

function AddButton(_ref) {
  var onAddClick = _ref.onAddClick;
  var cssStyles = {
    textAlign: 'right',
    marginTop: '1rem',
    bottom: '1.5rem',
    right: '1.5rem',
    position: 'fixed',
    zIndex: 10
  };
  return /*#__PURE__*/react.createElement("div", {
    style: cssStyles
  }, /*#__PURE__*/react.createElement(_default$w, {
    onClick: onAddClick
  }, /*#__PURE__*/react.createElement(_default$x, null)));
}

var hideIfNotAuthorizedToCreate = _default$6(_default$t({
  d2: react.PropTypes.object
}), _default$u(function (_ref2) {
  var d2 = _ref2.d2,
      modelType = _ref2.modelType;
  return !d2.currentUser.canCreate(d2.models[modelType]);
}, _default$v));
var AddButtonWithAuthCheck = hideIfNotAuthorizedToCreate(AddButton);
function NotificationList(_ref3) {
  var notifications = _ref3.notifications,
      onRemoveNotification = _ref3.onRemoveNotification,
      onEditNotification = _ref3.onEditNotification,
      onAddNotification = _ref3.onAddNotification,
      addButton = _ref3.addButton,
      showProgramStage = _ref3.showProgramStage,
      showAddButton = _ref3.showAddButton;
  var columns = showProgramStage ? ['name', 'programStage', 'lastUpdated'] : ['name', 'lastUpdated'];
  var AddButtonToUse = addButton ? addButton : AddButtonWithAuthCheck;
  return /*#__PURE__*/react.createElement("div", null, showAddButton && /*#__PURE__*/react.createElement(AddButtonToUse, {
    modelType: "programNotificationTemplate",
    onAddClick: onAddNotification
  }), /*#__PURE__*/react.createElement(DataTable, {
    rows: notifications,
    columns: columns,
    contextMenuActions: {
      // TODO: Check for permissions
      edit: onEditNotification,
      "delete": onRemoveNotification
    },
    primaryAction: onEditNotification
  }));
}
NotificationList.propTypes = {
  notifications: react.PropTypes.array,
  showAddButton: react.PropTypes.bool //  addButton: PropTypes.node

};
NotificationList.defaultProps = {
  showAddButton: true
};

var _excluded$3 = ["d2", "name"];

var DeleteDialog = function DeleteDialog(_ref) {
  var onCancel = _ref.onCancel,
      onConfirm = _ref.onConfirm,
      question = _ref.question,
      open = _ref.open,
      t = _ref.t;
  var actions = [/*#__PURE__*/react.createElement(_default$f, {
    label: t('cancel'),
    primary: true,
    onTouchTap: onCancel
  }), /*#__PURE__*/react.createElement(_default$f, {
    label: t('delete'),
    primary: true,
    onTouchTap: onConfirm
  })];
  return /*#__PURE__*/react.createElement(_default$g, {
    actions: actions,
    modal: false,
    open: open,
    onRequestClose: onCancel,
    autoScrollBodyContent: true
  }, question);
};

DeleteDialog.propTypes = {
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  question: PropTypes.string,
  t: PropTypes.func
};
var enhance$5 = _default$6(_default$t({
  d2: PropTypes.object
}), _default$7(function (_ref2) {
  var d2 = _ref2.d2,
      name = _ref2.name,
      props = _objectWithoutProperties(_ref2, _excluded$3);

  return _objectSpread2({
    t: d2.i18n.getTranslation.bind(d2.i18n),
    question: "".concat(d2.i18n.getTranslation('delete'), " ").concat(name, "?")
  }, props);
}));
var NotificationDeleteDialog = enhance$5(DeleteDialog);

var mapStateToProps$7 = function mapStateToProps(state) {
  return {
    model: modelToEditSelector(state)
  };
};

var mapDispatchToProps$9 = function mapDispatchToProps(dispatch) {
  return {
    onUpdateField: function onUpdateField(fieldName, value) {
      dispatch(setStageNotificationValue(fieldName, value));
    },
    handleProgramStageSelect: function handleProgramStageSelect(stage) {
      dispatch(setSelectedProgramStage(stage));
    }
  };
};

var programStagesToOptions = function programStagesToOptions(programStages) {
  return programStages.map(function (elem, i) {
    return {
      text: elem.displayName,
      value: elem.id
    };
  });
};

var WhatToSendStep = /*#__PURE__*/function (_Component) {
  _inherits(WhatToSendStep, _Component);

  var _super = _createSuper(WhatToSendStep);

  function WhatToSendStep(props) {
    var _this;

    _classCallCheck(this, WhatToSendStep);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "handleProgramStage", function (event) {
      var sId = event.target.value;

      var selectedStage = _this.props.programStages.find(function (stage) {
        return stage.id === sId;
      });

      _this.setState(_objectSpread2(_objectSpread2({}, _this.state), {}, {
        programStageId: sId
      }));

      _this.props.handleProgramStageSelect(selectedStage);
    });

    _defineProperty(_assertThisInitialized(_this), "createProgramStageDropdown", function () {
      return {
        name: 'programStage',
        component: Dropdown,
        props: {
          options: programStagesToOptions(_this.props.programStages),
          labelText: 'Program stage',
          fullWidth: true,
          value: _this.state.programStageId,
          onChange: _this.handleProgramStage
        }
      };
    });

    _this.state = {
      programStageId: props.model.programStage ? props.model.programStage.id : null
    };
    return _this;
  }

  _createClass(WhatToSendStep, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          fieldConfigs = _this$props.fieldConfigs,
          onUpdateField = _this$props.onUpdateField,
          isTracker = _this$props.isTracker,
          isProgram = _this$props.isProgram,
          dataElements = _this$props.dataElements,
          attributes = _this$props.attributes;
      var fieldsToUse = isTracker && !isProgram ? [this.createProgramStageDropdown()].concat(_toConsumableArray(fieldConfigs)) : fieldConfigs;
      var propsToField = {
        dataElements: dataElements,
        attributes: attributes,
        isProgram: isProgram
      };
      return /*#__PURE__*/react.createElement(FormBuilder, {
        fields: fieldsToUse.map(addPropsToFieldConfig(propsToField, ['messageTemplate'])),
        onUpdateField: onUpdateField
      });
    }
  }]);

  return WhatToSendStep;
}(react.Component);

WhatToSendStep = _default$6(connect(mapStateToProps$7, function (dispatch) {
  return {
    onUpdateField: function onUpdateField(fieldName, value) {
      dispatch(setStageNotificationValue(fieldName, value));
    },
    handleProgramStageSelect: function handleProgramStageSelect(stage) {
      dispatch(setSelectedProgramStage(stage));
    }
  };
}, undefined, {
  pure: false
}), createFieldConfigsFor('programNotificationTemplate', fieldGroups["for"]('programStageNotificationTemplate')[0].fields))(WhatToSendStep);

var stepToFormBuilder = function stepToFormBuilder(_ref) {
  var _ref$fieldConfigs = _ref.fieldConfigs,
      fieldConfigs = _ref$fieldConfigs === void 0 ? [] : _ref$fieldConfigs,
      onUpdateField = _ref.onUpdateField,
      dataElements = _ref.dataElements,
      isTracker = _ref.isTracker,
      isProgram = _ref.isProgram,
      attributes = _ref.attributes;
  var fieldProps = {
    dataElements: dataElements,
    isTracker: isTracker,
    isProgram: isProgram,
    attributes: attributes
  };
  var fieldsToUse = fieldConfigs; //TODO cleanup this
  //Remove PROGRAM_ATTRIBUTE options when it's an event-program

  if (!isTracker) {
    fieldsToUse = fieldsToUse.map(function (field) {
      if (field.name === 'notificationRecipient') {
        var removedOptions = field.props.options.filter(function (opt) {
          return opt.value !== "PROGRAM_ATTRIBUTE";
        });

        var propsWithRemovedRecipient = _objectSpread2(_objectSpread2({}, field.props), {}, {
          options: removedOptions
        });

        return _objectSpread2(_objectSpread2({}, field), {}, {
          props: _objectSpread2({}, propsWithRemovedRecipient)
        });
      }

      return field;
    });
  }

  return /*#__PURE__*/react.createElement(FormBuilder, {
    fields: fieldsToUse.map(addPropsToFieldConfig(fieldProps, ['recipientDataElement', 'recipientProgramAttribute'])),
    onUpdateField: onUpdateField
  });
};

var connectSteps = connect(mapStateToProps$7, mapDispatchToProps$9, undefined, {
  pure: false
});
var programStageSteps = [{
  key: 'what',
  name: 'what_to_send',
  content: WhatToSendStep
}, {
  key: 'when',
  name: 'when_to_send_it',
  content: _default$6(connectSteps, createFieldConfigsFor('programNotificationTemplate', fieldGroups["for"]('programStageNotificationTemplate')[1].fields, undefined, null, true, 'programStageNotificationTemplate'))(stepToFormBuilder)
}, {
  key: 'who',
  name: 'who_to_send_it_to',
  content: _default$6(connectSteps, createFieldConfigsFor('programNotificationTemplate', fieldGroups["for"]('programStageNotificationTemplate')[2].fields, undefined, null, true, 'programStageNotificationTemplate'))(stepToFormBuilder)
}];
var programSteps = [{
  key: 'what',
  name: 'what_to_send',
  content: WhatToSendStep
}, {
  key: 'when',
  name: 'when_to_send_it',
  content: _default$6(connectSteps, createFieldConfigsFor('programNotificationTemplate', fieldGroups["for"]('programNotificationTemplate')[1].fields))(stepToFormBuilder)
}, {
  key: 'who',
  name: 'who_to_send_it_to',
  content: _default$6(connectSteps, createFieldConfigsFor('programNotificationTemplate', fieldGroups["for"]('programNotificationTemplate')[2].fields))(stepToFormBuilder)
}];

var emptyComponent = function emptyComponent() {
  return null;
};
var RenderSnackbarError = lifecycle({
  componentDidMount: function componentDidMount() {
    snackActions.show(this.props.snackAction);
  }
})(emptyComponent);
/**
 * Return a component that renders nothing, but fires
 * the snackbar-action
 * @param test - test to pass to recompose branch
 * @param snackAction - snackBarAction to fire if test passes
 * @returns {*} A component that renders nothing if test passes
 */

var branchWithMessage = function branchWithMessage(test, snackAction) {
  return branch(test, function (_) {
    return function (_) {
      return /*#__PURE__*/react.createElement(RenderSnackbarError, {
        snackAction: snackAction
      });
    };
  });
};

var _excluded$2 = ["model", "onCancel", "onConfirm", "dataElements", "isTracker", "isProgram"];
var withStepper = _default$6(_default$a('activeStep', 'setActiveStep', 0), _default$y(function (_ref) {
  var setActiveStep = _ref.setActiveStep,
      dataElements = _ref.dataElements;
  return {
    stepperClicked: function stepperClicked(stepKey) {
      setActiveStep(programStageSteps.findIndex(function (step) {
        return step.key === stepKey;
      }));
    },
    dataElements: dataElements
  };
}));

var stepperForSteps = function stepperForSteps(steps) {
  return withStepper(createStepperFromConfig(steps, 'vertical'));
};

var ProgramStageStepper$1 = stepperForSteps(programStageSteps);
var ProgramStepper = stepperForSteps(programSteps);
var notificationDialogStyle = {
  content: {
    width: '60%',
    minWidth: 700,
    maxWidth: 'none'
  },
  titleStyle: {
    fontWeight: 400,
    margin: 0
  }
};

var DialogTitle = function DialogTitle(props) {
  return /*#__PURE__*/react.createElement("div", {
    style: _objectSpread2(_objectSpread2({}, props.style), {}, {
      paddingBottom: 10
    })
  }, /*#__PURE__*/react.createElement("h3", {
    style: notificationDialogStyle.titleStyle
  }, props.title), /*#__PURE__*/react.createElement(_default$z, null, props.subtitle));
};

var NotificationDialog = function NotificationDialog(_ref2, _ref3) {
  var model = _ref2.model,
      onCancel = _ref2.onCancel,
      onConfirm = _ref2.onConfirm,
      dataElements = _ref2.dataElements,
      isTracker = _ref2.isTracker,
      isProgram = _ref2.isProgram,
      props = _objectWithoutProperties(_ref2, _excluded$2);

  var d2 = _ref3.d2;
  var t = d2.i18n.getTranslation.bind(d2.i18n);
  var stepperProps = {
    attributes: isTracker ? props.program.programTrackedEntityAttributes : [],
    programStages: props.programStages,
    dataElements: dataElements,
    isTracker: isTracker,
    isProgram: isProgram
  };
  var actions = [/*#__PURE__*/react.createElement(_default$f, {
    label: t('cancel'),
    primary: true,
    onTouchTap: onCancel
  }), /*#__PURE__*/react.createElement(_default$f, {
    label: t('done'),
    primary: true,
    onTouchTap: function onTouchTap() {
      return onConfirm(model);
    }
  })];
  var title = "".concat(!isTracker || isProgram ? t('program_notification') : t('program_stage_notification'));
  var StepperComponent = isProgram ? ProgramStepper : ProgramStageStepper$1;
  return /*#__PURE__*/react.createElement(_default$g, {
    actions: actions,
    open: !!model,
    onRequestClose: onCancel,
    title: /*#__PURE__*/react.createElement(DialogTitle, {
      title: title,
      subtitle: model.displayName
    }),
    autoDetectWindowHeight: true,
    repositionOnUpdate: false,
    autoScrollBodyContent: true,
    contentStyle: notificationDialogStyle.content,
    style: {
      paddingTop: 0
    }
  }, /*#__PURE__*/react.createElement(StepperComponent, stepperProps));
};

NotificationDialog.contextTypes = {
  d2: react.PropTypes.object
};
NotificationDialog.propTypes = {
  model: react.PropTypes.object.isRequired,
  onCancel: react.PropTypes.func.isRequired,
  onConfirm: react.PropTypes.func.isRequired,
  dataElements: react.PropTypes.array,
  isTracker: react.PropTypes.bool,
  isProgram: react.PropTypes.bool
};
NotificationDialog.defaultProps = {
  isProgram: false,
  isTracker: false
};

var mapStateToProps$6 = function mapStateToProps(state, _ref4) {
  var model = _ref4.model,
      availableDataElements = _ref4.availableDataElements,
      programStages = _ref4.programStages,
      dataElements = _ref4.dataElements;
  var selectedPSId = model && model.programStage && model.programStage.id || programStages.length > 0 && programStages[0].id || null;
  return {
    model: model,
    dataElements: dataElements || getProgramStageDataElementsByStageId({
      availableDataElements: availableDataElements,
      programStages: programStages
    })(selectedPSId)
  };
};

var mapDispatchToPropsForDialog = function mapDispatchToPropsForDialog(dispatch) {
  return bindActionCreators({
    onCancel: setEditModel.bind(null, null),
    onConfirm: saveStageNotification
  }, dispatch);
};

var ProgramStageNotificationDialog = _default$6(branchWithMessage(function (_ref5) {
  var programStages = _ref5.programStages;
  return programStages && programStages.length < 1;
}, {
  message: 'cannot_create_program_notification_without_program_stage',
  translate: true
}), connect(mapStateToProps$6, mapDispatchToPropsForDialog))(NotificationDialog);
var ProgramNotificationDialog = connect(null, function (dispatch) {
  return bindActionCreators({
    onCancel: setEditModel.bind(null, null),
    onConfirm: saveProgramNotification
  }, dispatch);
})(NotificationDialog);
/* Chooses what dialog to display according to isProgram prop */

var NotificationDialogChooser = function NotificationDialogChooser(props) {
  return props.isProgram ? /*#__PURE__*/react.createElement(ProgramNotificationDialog, _extends({}, props, {
    dialogStyle: notificationDialogStyle
  })) : /*#__PURE__*/react.createElement(ProgramStageNotificationDialog, _extends({}, props, {
    dialogStyle: notificationDialogStyle
  }));
};
var EnhancedDialog = _default$6(connect(function (state) {
  return {
    notificationType: getNotificationType(state),
    isProgram: isProgramNotification(state),
    model: modelToEditSelector(state)
  };
}), _default$u(function (_ref6) {
  var model = _ref6.model;
  return !model;
}, _default$v))(NotificationDialogChooser);

var notifications$ = eventProgramStore.map(getStageNotifications);
var programStageDataElements$ = eventProgramStore.map(getProgramStageDataElements);
var programStages$$1 = eventProgramStore.map(getProgramStages);

function EventProgramNotifications(_ref) {
  var notifications = _ref.notifications,
      askForConfirmation = _ref.askForConfirmation,
      onCancel = _ref.onCancel,
      onDelete = _ref.onDelete,
      open = _ref.open,
      setOpen = _ref.setOpen,
      modelToDelete = _ref.modelToDelete,
      setEditModel = _ref.setEditModel,
      setAddModel = _ref.setAddModel,
      dataElements = _ref.dataElements,
      programStages = _ref.programStages;
  return /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement(NotificationList, {
    notifications: notifications,
    onRemoveNotification: askForConfirmation,
    onEditNotification: setEditModel,
    onAddNotification: setAddModel
  }), /*#__PURE__*/react.createElement(EnhancedDialog, {
    dataElements: dataElements,
    programStages: programStages
  }), /*#__PURE__*/react.createElement(NotificationDeleteDialog, {
    setOpen: setOpen,
    open: open,
    onCancel: onCancel,
    onConfirm: onDelete,
    name: modelToDelete && modelToDelete.name
  }));
}

EventProgramNotifications.propTypes = {
  notifications: react.PropTypes.any.isRequired,
  askForConfirmation: react.PropTypes.any.isRequired,
  onCancel: react.PropTypes.any.isRequired,
  onDelete: react.PropTypes.any.isRequired,
  open: react.PropTypes.any.isRequired,
  setOpen: react.PropTypes.any.isRequired,
  modelToDelete: react.PropTypes.any,
  setEditModel: react.PropTypes.any.isRequired,
  setAddModel: react.PropTypes.any.isRequired,
  dataElements: react.PropTypes.any.isRequired
};

var mapDispatchToProps$8 = function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    removeStageNotification: removeStageNotification,
    setEditModel: function setEditModel$1(model) {
      return setEditModel(model, 'PROGRAM_STAGE_NOTIFICATION');
    },
    setAddModel: setAddModel
  }, dispatch);
};

var enhance$4 = _default$6( // TODO: Impure connect when the reducer is fixed to emit a pure model this can be a pure action
connect(undefined, mapDispatchToProps$8, undefined, {
  pure: false
}), _default$a('open', 'setOpen', false), _default$a('modelToDelete', 'setModelToDelete', null), _default$9({
  onCancel: function onCancel(_ref2) {
    var setOpen = _ref2.setOpen;
    return function () {
      return setOpen(false);
    };
  },
  onDelete: function onDelete(_ref3) {
    var setOpen = _ref3.setOpen,
        removeStageNotification = _ref3.removeStageNotification,
        modelToDelete = _ref3.modelToDelete;
    return function () {
      setOpen(false);
      removeStageNotification(modelToDelete);
    };
  },
  askForConfirmation: function askForConfirmation(_ref4) {
    var setOpen = _ref4.setOpen,
        setModelToDelete = _ref4.setModelToDelete;
    return function (model) {
      setModelToDelete(model);
      setOpen(true);
    };
  }
}), _default$8(function (props$) {
  return props$.combineLatest(programStages$$1, notifications$, programStageDataElements$, function (props, programStages, notifications, dataElements) {
    return _objectSpread2(_objectSpread2({}, props), {}, {
      programStages: programStages,
      notifications: notifications,
      dataElements: dataElements
    });
  });
}));
var EventProgramNotifications$1 = enhance$4(EventProgramNotifications);

var wrapInPaperWithStyle = function wrapInPaperWithStyle(style) {
  return function (BaseComponent) {
    var styleToApply = fp.isNil(style) ? {
      padding: '3rem'
    } : style;
    return function WrappedInPaper(props) {
      return /*#__PURE__*/react.createElement(_default$d, {
        style: styleToApply
      }, /*#__PURE__*/react.createElement(BaseComponent, props));
    };
  };
};
var wrapInPaper = wrapInPaperWithStyle();
var flattenRouterProps = _default$7(function (props) {
  return _objectSpread2(_objectSpread2({}, props), {}, {
    groupName: props.params.groupName,
    modelType: props.schema,
    modelId: props.params.modelId
  });
});
var wrapVerticalStepInPaper = function wrapVerticalStepInPaper(BaseComponent) {
  return wrapInPaperWithStyle({
    padding: '3rem',
    marginTop: '15px'
  })(BaseComponent);
};

var eventProgramFields = fieldOrder["for"]('eventProgram');
var eventProgramStageFields = fieldOrder["for"]('eventProgramStage');

var ProgramForm = function ProgramForm(props) {
  return /*#__PURE__*/react.createElement(FormBuilder, {
    fields: props.fieldConfigs,
    onUpdateField: props.editFieldChanged
  });
};

ProgramForm = createFieldConfigsFor('program', eventProgramFields, undefined, true, true, 'eventProgram')(ProgramForm);

var ProgramStageForm = function ProgramStageForm(props) {
  return /*#__PURE__*/react.createElement(FormBuilder, {
    fields: props.fieldConfigs,
    onUpdateField: props.editProgramStageFieldChange
  });
};

ProgramStageForm = createFieldConfigsFor('programStage', eventProgramStageFields, undefined, null, true, 'eventProgramStage')(ProgramStageForm);

var EditProgramDetailsForm = function EditProgramDetailsForm(props) {
  return /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement(ProgramForm, {
    model: props.model,
    editFieldChanged: props.editFieldChanged
  }), /*#__PURE__*/react.createElement(ProgramStageForm, {
    model: props.programStage,
    editProgramStageFieldChange: props.editProgramStageFieldChange
  }));
};

var mapDispatchToProps$7 = function mapDispatchToProps(dispatch, ownProps) {
  return bindActionCreators({
    editFieldChanged: editFieldChanged,
    editProgramStageFieldChange: function editProgramStageFieldChange(field, value) {
      return editProgramStageField(ownProps.programStage.id, field, value);
    }
  }, dispatch);
};

EditProgramDetailsForm = connect(null, mapDispatchToProps$7)(wrapInPaper(EditProgramDetailsForm));

var stepperConfig$3 = function stepperConfig() {
  var stepComponents = {
    EditProgramDetailsForm: EditProgramDetailsForm,
    AssignDataElements: AssignDataElements$1,
    EditDataEntryForm: EditDataEntryForm$1,
    ProgramAccess: ProgramAccess,
    EventProgramNotifications: EventProgramNotifications$1
  };
  return steps$1.map(function (step) {
    step.component = stepComponents[step.componentName]; // eslint-disable-line no-param-reassign

    return step;
  });
};

var mapStateToProps$5 = function mapStateToProps(state) {
  return {
    activeStep: activeStepSelector(state)
  };
};

var EventProgramStepperContent = fp.compose(connect(mapStateToProps$5), _default$8(function (props$) {
  return props$.combineLatest(eventProgramStore, function (props, _ref) {
    var program = _ref.program,
        programStages = _ref.programStages;
    return _objectSpread2(_objectSpread2({}, props), {}, {
      modelToEdit: program,
      programStage: fp.first(programStages)
    });
  });
}))(createStepperContentFromConfig(stepperConfig$3()));

var styles$6 = {
  cancelButton: {
    marginLeft: '1rem'
  }
};
function FormActionButtons(_ref) {
  var onSaveAction = _ref.onSaveAction,
      onCancelAction = _ref.onCancelAction,
      isDirtyHandler = _ref.isDirtyHandler,
      isSaving = _ref.isSaving;
  return /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement(SaveButton, {
    onClick: onSaveAction,
    isSaving: isSaving
  }), /*#__PURE__*/react.createElement(CancelButton, {
    onClick: onCancelAction,
    isDirtyHandler: isDirtyHandler,
    style: styles$6.cancelButton
  }));
}
function createConnectedFormActionButtonsForSchema() {
  var mapDispatchToProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var mapStateToProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  var onCancelActionCreator = function onCancelActionCreator(groupName, schema) {
    return function () {
      return goToAndScrollUp("/list/".concat(groupName, "/").concat(schema));
    };
  };

  var enhance = fp.compose(_default$y(function (_ref2) {
    var groupName = _ref2.groupName,
        schema = _ref2.schema;
    return {
      onCancelAction: onCancelActionCreator(groupName, schema)
    };
  }), connect(mapStateToProps, mapDispatchToProps));
  return enhance(FormActionButtons);
}
FormActionButtons.propTypes = {
  onSaveAction: PropTypes.func.isRequired,
  onCancelAction: PropTypes.func.isRequired,
  isDirtyHandler: PropTypes.func,
  isSaving: PropTypes.bool
};
FormActionButtons.defaultProps = {
  isDirtyHandler: function isDirtyHandler() {},
  isSaving: false
};

var mapDispatchToProps$6 = function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onSaveAction: saveEventProgram
  }, dispatch);
};

var mapStateToProps$4 = function mapStateToProps(state) {
  return {
    isSaving: isSaving(state)
  };
};

var EventActionButtons = createConnectedFormActionButtonsForSchema(mapDispatchToProps$6, mapStateToProps$4);

var EventProgramStepperNavigationForward$1 = createConnectedForwardButton(nextStep);
var EventProgramStepperNavigationBackward$1 = createConnectedBackwardButton(previousStep);
var StepperNavigation$1 = createStepperNavigation(EventProgramStepperNavigationBackward$1, EventProgramStepperNavigationForward$1);
var styles$5 = {
  heading: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1rem'
  }
};

var isModelDirty$1 = function isModelDirty() {
  return {
    dirty: isStoreStateDirty(eventProgramStore.getState())
  };
};

function EditEventProgram(props) {
  var schema = props.params.modelType || 'program';
  var groupName = props.params.groupName;
  return /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement("div", {
    style: styles$5.heading
  }, /*#__PURE__*/react.createElement(FormHeading, {
    schema: schema,
    groupName: groupName,
    isDirtyHandler: isModelDirty$1
  }, "event_".concat(lib.camelCaseToUnderscores(schema))), /*#__PURE__*/react.createElement(FormSubHeading, null, props.model.displayName)), /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement(EventProgramStepper$1, null)), /*#__PURE__*/react.createElement(EventProgramStepperContent, _extends({
    schema: schema
  }, props)), /*#__PURE__*/react.createElement(StepperNavigation$1, null, /*#__PURE__*/react.createElement(EventActionButtons, {
    groupName: groupName,
    schema: schema,
    isDirtyHandler: isModelDirty$1
  })));
}

EditEventProgram.propTypes = {
  params: PropTypes.object.isRequired,
  isProgramStageStepperActive: PropTypes.bool,
  model: PropTypes.object.isRequired
};
EditEventProgram.defaultProps = {
  isProgramStageStepperActive: false
};

var mapStateToProps$3 = function mapStateToProps(state) {
  return {
    activeStep: activeStepSelector(state),
    disabled: disabledSelector(state)
  };
};

var mapDispatchToProps$5 = function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    stepperClicked: changeStep
  }, dispatch);
};

var EventProgramStepper = connect(mapStateToProps$3, mapDispatchToProps$5)(createStepperFromConfig(steps$2));

var TrackerNotificationAddButton = /*#__PURE__*/function (_React$Component) {
  _inherits(TrackerNotificationAddButton, _React$Component);

  var _super = _createSuper(TrackerNotificationAddButton);

  function TrackerNotificationAddButton(props, context) {
    var _this;

    _classCallCheck(this, TrackerNotificationAddButton);

    _this = _super.call(this, props, context);

    _defineProperty(_assertThisInitialized(_this), "handleOpen", function (_ref) {
      var isOpen = _ref.isOpen;

      _this.setState(_objectSpread2(_objectSpread2({}, _this.state), {}, {
        open: isOpen
      }));
    });

    _defineProperty(_assertThisInitialized(_this), "handleItemClick", function (item, event) {
      _this.setState(_objectSpread2(_objectSpread2({}, _this.state), {}, {
        open: false
      }));

      _this.props.onAddClick(item);
    });

    _this.state = {
      items: [{
        id: 'PROGRAM_NOTIFICATION',
        primaryText: context.d2.i18n.getTranslation('program_notification'),
        rightAvatar: /*#__PURE__*/react.createElement(_default$A, {
          className: "material-icons",
          icon: /*#__PURE__*/react.createElement(_default$i, null, "event")
        })
      }, {
        id: 'PROGRAM_STAGE_NOTIFICATION',
        primaryText: context.d2.i18n.getTranslation('program_stage_notification'),
        rightAvatar: /*#__PURE__*/react.createElement(_default$A, {
          className: "material-icons",
          icon: /*#__PURE__*/react.createElement(_default$i, null, "event_note")
        })
      }],
      open: false
    };
    return _this;
  }

  _createClass(TrackerNotificationAddButton, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      return /*#__PURE__*/react.createElement(SpeedDial_1, {
        hasBackdrop: true,
        isOpen: this.state.open,
        onChange: this.handleOpen
      }, /*#__PURE__*/react.createElement(BubbleList_1, null, this.state.items.map(function (item, index) {
        return /*#__PURE__*/react.createElement(BubbleListItem_1, _extends({
          key: item.id
        }, item, {
          onClick: _this2.handleItemClick.bind(_this2, item.id)
        }));
      })));
    }
  }]);

  return TrackerNotificationAddButton;
}(react.Component);

TrackerNotificationAddButton.propTypes = {
  onAddClick: PropTypes.func.isRequired
};
var TrackerNotificationAddButtonWithContext = hideIfNotAuthorizedToCreate(addD2Context(TrackerNotificationAddButton));

var _excluded$1 = ["programStages", "programStageNotifications", "programNotifications", "askForConfirmation", "onCancel", "onDelete", "open", "setOpen", "modelToDelete", "setEditProgramModel", "setEditProgramStageModel", "setAddModel", "availableDataElements", "model"];
var programStageTabIndex = 0;
var programStages$ = eventProgramStore.map(getProgramStages);
var stageNotifications$ = eventProgramStore.map(fp.get('programStageNotifications'));
var programNotifications$ = eventProgramStore.map(getProgramNotifications).map(function (n) {
  return n.toArray();
});
var availableDataElements = eventProgramStore.map(fp.get('availableDataElements'));

var TrackerProgramNotifications = function TrackerProgramNotifications(_ref, _ref2) {
  var programStages = _ref.programStages,
      programStageNotifications = _ref.programStageNotifications,
      programNotifications = _ref.programNotifications,
      askForConfirmation = _ref.askForConfirmation,
      onCancel = _ref.onCancel,
      onDelete = _ref.onDelete,
      open = _ref.open,
      setOpen = _ref.setOpen,
      modelToDelete = _ref.modelToDelete,
      setEditProgramModel = _ref.setEditProgramModel,
      setEditProgramStageModel = _ref.setEditProgramStageModel,
      setAddModel = _ref.setAddModel,
      availableDataElements = _ref.availableDataElements,
      model = _ref.model,
      props = _objectWithoutProperties(_ref, _excluded$1);

  var d2 = _ref2.d2;
  var stageNotificationsWithStageNames = []; //Flatten stageNotifications to be a list of notifications
  //with reference to the programStage

  var _loop = function _loop(stageId) {
    var notifications = programStageNotifications[stageId];
    var programStage = props.getProgramStageById(stageId);
    var programStageProps = fp.pick(['displayName', 'id'], programStage);
    notifications.forEach(function (nf) {
      nf.programStage = programStageProps;
      stageNotificationsWithStageNames.push(nf);
    });
  };

  for (var stageId in programStageNotifications) {
    _loop(stageId);
  }

  return /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement(Tabs_1, {
    initialSelectedIndex: programStageTabIndex
  }, /*#__PURE__*/react.createElement(Tab, {
    label: d2.i18n.getTranslation('program_stage_notifications')
  }, /*#__PURE__*/react.createElement(NotificationList, {
    showProgramStage: true,
    notifications: stageNotificationsWithStageNames,
    onRemoveNotification: askForConfirmation,
    onEditNotification: setEditProgramStageModel,
    onAddNotification: setAddModel,
    showAddButton: true,
    addButton: TrackerNotificationAddButtonWithContext
  })), /*#__PURE__*/react.createElement(Tab, {
    label: d2.i18n.getTranslation('program_notifications')
  }, /*#__PURE__*/react.createElement(NotificationList, {
    notifications: programNotifications,
    onRemoveNotification: askForConfirmation,
    onEditNotification: setEditProgramModel,
    onAddNotification: setAddModel,
    showAddButton: false
  }))), /*#__PURE__*/react.createElement(EnhancedDialog, {
    availableDataElements: availableDataElements,
    isTracker: true,
    program: model,
    programStages: programStages
  }), /*#__PURE__*/react.createElement(NotificationDeleteDialog, {
    setOpen: setOpen,
    open: open,
    onCancel: onCancel,
    onConfirm: onDelete,
    name: modelToDelete && modelToDelete.name
  }));
};

TrackerProgramNotifications.propTypes = {
  programStageNotifications: PropTypes.any.isRequired,
  programNotifications: PropTypes.any.isRequired,
  askForConfirmation: PropTypes.any.isRequired,
  onCancel: PropTypes.any.isRequired,
  onDelete: PropTypes.any.isRequired,
  open: PropTypes.any.isRequired,
  setOpen: PropTypes.any.isRequired,
  modelToDelete: PropTypes.any,
  setEditProgramStageModel: PropTypes.func.isRequired,
  setEditProgramModel: PropTypes.func.isRequired,
  setAddModel: PropTypes.any.isRequired
};
TrackerProgramNotifications.contextTypes = {
  d2: PropTypes.object
};

var mapDispatchToProps$4 = function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    removeStageNotification: removeStageNotification,
    removeProgramNotification: removeProgramNotification,
    setEditProgramStageModel: function setEditProgramStageModel(model) {
      return setEditModel(model, 'PROGRAM_STAGE_NOTIFICATION');
    },
    setEditProgramModel: function setEditProgramModel(model) {
      return setEditModel(model, 'PROGRAM_NOTIFICATION');
    },
    setAddModel: setAddModel
  }, dispatch);
};

var enhance$3 = _default$6( // TODO: Impure connect when the reducer is fixed to emit a pure model this can be a pure action
connect(function (state) {
  return {};
}, mapDispatchToProps$4, undefined, {
  pure: false
}), _default$a('open', 'setOpen', false), _default$a('modelToDelete', 'setModelToDelete', null), _default$9({
  onCancel: function onCancel(_ref3) {
    var setOpen = _ref3.setOpen;
    return function () {
      return setOpen(false);
    };
  },
  onDelete: function onDelete(_ref4) {
    var setOpen = _ref4.setOpen,
        removeStageNotification = _ref4.removeStageNotification,
        removeProgramNotification = _ref4.removeProgramNotification,
        modelToDelete = _ref4.modelToDelete;
    return function () {
      setOpen(false);

      if (modelToDelete.programStage) {
        removeStageNotification(modelToDelete);
      } else {
        removeProgramNotification(modelToDelete);
      }
    };
  },
  askForConfirmation: function askForConfirmation(_ref5) {
    var setOpen = _ref5.setOpen,
        setModelToDelete = _ref5.setModelToDelete;
    return function (model) {
      setModelToDelete(model);
      setOpen(true);
    };
  }
}), _default$8(function (props$) {
  return props$.combineLatest(programStages$, stageNotifications$, programNotifications$, availableDataElements, eventProgramStore, function (props, programStages, programStageNotifications, programNotifications, availableDataElements, store) {
    return _objectSpread2(_objectSpread2({}, props), {}, {
      programStages: programStages,
      programStageNotifications: programStageNotifications,
      programNotifications: programNotifications,
      availableDataElements: availableDataElements,
      getProgramStageById: getProgramStageById(store)
    });
  });
}));
var TrackerProgramNotifications$1 = enhance$3(TrackerProgramNotifications);

var _excluded = ["trackedEntityAttribute"];
var styles$4 = {
  groupEditor: {
    padding: '2rem 3rem 4rem',
    marginTop: '15px'
  },
  fieldname: {
    fontSize: 16,
    color: '#00000080'
  }
};
var program$$1 = eventProgramStore.map(fp.get('program'));
var availableAttributes$ = eventProgramStore.map(fp.get('availableAttributes')).take(1);
var renderingOptions$ = eventProgramStore.map(fp.get('renderingOptions')).take(1);

var mapDispatchToProps$3 = function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    addAttributesToProgram: addAttributesToProgram,
    removeAttributesFromProgram: removeAttributesFromProgram,
    editProgramAttributes: editProgramAttributes,
    setAttributesOrder: setAttributesOrder
  }, dispatch);
};
/**
 * Extracts attributes that are in TrackedEntityTypeAttributes, but not in
 * programTrackedEntityAttributes
 * @param programModel Program model to use for programTrackedEntityAttributes
 * @returns {Array} An array of TrackedEntityAttributes that are in tetAttributes, but
 * not in programTrackedEntityAttributes, or empty if none.
 */


function tetAttributesNotInProgram(programModel) {
  if (programModel && fp.has('trackedEntityType.trackedEntityTypeAttributes', programModel)) {
    return programModel.trackedEntityType.trackedEntityTypeAttributes.filter(function (teta) {
      var hasAttribute = programModel.programTrackedEntityAttributes.find(function (ptea) {
        return ptea.trackedEntityAttribute.id === teta.trackedEntityAttribute.id;
      });
      return !hasAttribute;
    });
  }

  return [];
}
var withAttributes = _default$8(function (props$) {
  return props$.combineLatest(program$$1, availableAttributes$, renderingOptions$, function (props, program, availableAttributes, renderingOptions) {
    return _objectSpread2(_objectSpread2({}, props), {}, {
      availableAttributes: availableAttributes,
      renderingOptions: renderingOptions,
      model: program,
      assignedAttributes: program.programTrackedEntityAttributes.map(addDisplayProperties(availableAttributes, renderingOptions))
    });
  });
});
var enhance$2 = _default$6(_default$y(function (props) {
  return {
    groupName: props.params.groupName,
    modelType: props.schema,
    modelId: props.params.modelId
  };
}), connect(null, mapDispatchToProps$3), _default$B({
  componentDidMount: function componentDidMount() {
    if (this.props.modelId === 'add') {
      // When creating a new program we add the TET's attributes to the programTrackedEntityAttributes
      // since this is most likely what is needed. On edit, we don't do this because:
      // a) the UI will not reflect the reality, for example if a TET has new attributes these won't be present 
      //    in the program's programTrackedEntityAttributes. In the UI it would look as if they were added already.
      // b) the program might have manualy removed one of the TET's attributes and now that attribute could be
      //    added again accidentally when clicking save
      var attributes = tetAttributesNotInProgram(this.props.model).map(function (a) {
        return a.trackedEntityAttribute.id;
      });
      this.props.addAttributesToProgram({
        attributes: attributes
      });
    }
  }
}), _default$a('attributeFilter', 'setAttributeFilter', ''), _default$9({
  onAssignItems: function onAssignItems(_ref) {
    var addAttributesToProgram = _ref.addAttributesToProgram;
    return function (attributes) {
      addAttributesToProgram({
        attributes: attributes
      });
      return Promise.resolve();
    };
  },
  onRemoveItems: function onRemoveItems(_ref2) {
    var removeAttributesFromProgram = _ref2.removeAttributesFromProgram;
    return function (attributes) {
      removeAttributesFromProgram({
        attributes: attributes
      });
      return Promise.resolve();
    };
  },
  onEditProgramAttribute: function onEditProgramAttribute(_ref3) {
    var editProgramAttributes = _ref3.editProgramAttributes;
    return function (attribute) {
      return editProgramAttributes({
        attribute: attribute
      });
    };
  },
  onAttributeFilter: function onAttributeFilter(_ref4) {
    var setAttributeFilter = _ref4.setAttributeFilter;
    return function (e) {
      return setAttributeFilter(e.target.value);
    };
  }
}));

function addDisplayProperties(attributes, renderingOptions) {
  return function (assignedAttribute) {
    var trackedEntityAttribute = assignedAttribute.trackedEntityAttribute,
        other = _objectWithoutProperties(assignedAttribute, _excluded);

    var _attributes$find = attributes.find(function (_ref5) {
      var id = _ref5.id;
      return id === trackedEntityAttribute.id;
    }),
        displayName = _attributes$find.displayName,
        valueType = _attributes$find.valueType,
        optionSet = _attributes$find.optionSet,
        unique = _attributes$find.unique;

    var renderTypeOptions = getRenderTypeOptions(trackedEntityAttribute, TRACKED_ENTITY_ATTRIBUTE_CLAZZ, renderingOptions);
    return _objectSpread2(_objectSpread2({}, other), {}, {
      trackedEntityAttribute: _objectSpread2(_objectSpread2({}, trackedEntityAttribute), {}, {
        displayName: displayName,
        valueType: valueType,
        optionSet: optionSet,
        unique: unique,
        renderTypeOptions: renderTypeOptions
      })
    });
  };
}

function AssignAttributes(props, _ref6) {
  var d2 = _ref6.d2;
  var availableItemStore = Store.create();
  var assignedItemStore = Store.create();
  availableItemStore.setState(props.availableAttributes.map(function (attribute) {
    return {
      id: attribute.id,
      text: attribute.displayName,
      value: attribute.id
    };
  })); // Assign existing attributes

  assignedItemStore.setState(props.assignedAttributes.map(function (a) {
    return a.trackedEntityAttribute.id;
  }));

  var onMoveAttributes = function onMoveAttributes(newAttributesOrderIds) {
    assignedItemStore.setState(newAttributesOrderIds);
    props.setAttributesOrder(newAttributesOrderIds);
  }; // Create edit-able rows for assigned attributes


  var tableRows = props.assignedAttributes.map(addDisplayProperties(props.availableAttributes, props.renderingOptions)).map(function (programAttribute) {
    return /*#__PURE__*/react.createElement(ProgramAttributeRow, {
      key: programAttribute.id,
      displayName: programAttribute.trackedEntityAttribute.displayName,
      attribute: programAttribute,
      onEditAttribute: props.onEditProgramAttribute,
      isDateValue: programAttribute.trackedEntityAttribute.valueType === 'DATE',
      isUnique: programAttribute.trackedEntityAttribute.unique,
      hasOptionSet: !!programAttribute.trackedEntityAttribute.optionSet,
      renderTypeOptions: programAttribute.trackedEntityAttribute.renderTypeOptions
    });
  });
  return /*#__PURE__*/react.createElement(_default$d, null, /*#__PURE__*/react.createElement("div", {
    style: styles$4.groupEditor
  }, /*#__PURE__*/react.createElement("div", {
    style: styles$4.fieldname
  }, d2.i18n.getTranslation('program_tracked_entity_attributes')), /*#__PURE__*/react.createElement(_default$e, {
    hintText: d2.i18n.getTranslation('search_available_program_tracked_entity_attributes'),
    onChange: props.onAttributeFilter,
    value: props.attributeFilter,
    fullWidth: true
  }), /*#__PURE__*/react.createElement(GroupEditorWithOrdering, {
    itemStore: availableItemStore,
    assignedItemStore: assignedItemStore,
    height: 250,
    filterText: props.attributeFilter,
    onAssignItems: props.onAssignItems,
    onRemoveItems: props.onRemoveItems,
    onOrderChanged: onMoveAttributes
  })), /*#__PURE__*/react.createElement(Table_1, null, /*#__PURE__*/react.createElement(TableHeader, {
    displaySelectAll: false,
    adjustForCheckbox: false
  }, /*#__PURE__*/react.createElement(TableRow, null, /*#__PURE__*/react.createElement(TableHeaderColumn, null, d2.i18n.getTranslation('name')), /*#__PURE__*/react.createElement(TableHeaderColumn, null, d2.i18n.getTranslation('display_in_list')), /*#__PURE__*/react.createElement(TableHeaderColumn, null, d2.i18n.getTranslation('mandatory')), /*#__PURE__*/react.createElement(TableHeaderColumn, null, d2.i18n.getTranslation('date_in_future')), /*#__PURE__*/react.createElement(TableHeaderColumn, null, d2.i18n.getTranslation('searchable')), /*#__PURE__*/react.createElement(TableHeaderColumn, null, d2.i18n.getTranslation('render_type_mobile')), /*#__PURE__*/react.createElement(TableHeaderColumn, null, d2.i18n.getTranslation('render_type_desktop')))), /*#__PURE__*/react.createElement(TableBody, {
    displayRowCheckbox: false
  }, tableRows)));
}

AssignAttributes.propTypes = {
  availableAttributes: PropTypes.array.isRequired,
  assignedAttributes: PropTypes.array.isRequired,
  onEditProgramAttribute: PropTypes.func.isRequired,
  attributeFilter: PropTypes.string.isRequired,
  onAttributeFilter: PropTypes.func.isRequired,
  onAssignItems: PropTypes.func.isRequired,
  onRemoveItems: PropTypes.func.isRequired
};
AssignAttributes.contextTypes = {
  d2: PropTypes.object
};
var AssignAttributes$1 = enhance$2(AssignAttributes);

var pteaToAttributes = function pteaToAttributes(_ref) {
  var programTrackedEntityAttributes = _ref.programTrackedEntityAttributes,
      availableAttributes = _ref.availableAttributes;
  var out = {};
  programTrackedEntityAttributes.map(function (ptea) {
    var attr = availableAttributes.find(function (attr) {
      return attr.id === ptea.trackedEntityAttribute.id;
    });
    out[attr.id] = attr.displayName;
  });
  return out;
};

var PurePaletteSection = PurePaletteSection$2;
var styles$3 = {
  heading: {
    paddingBottom: 18
  },
  formContainer: {},
  formPaper: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    margin: '0 auto 2rem',
    padding: '4rem 4rem',
    alignItems: 'center'
  },
  formSection: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  cancelButton: {
    marginLeft: '2rem'
  },
  deleteButton: {
    marginLeft: '2rem'
  },
  paletteHeader: {},
  paletteFilter: {
    padding: '0 8px 8px'
  },
  paletteFilterField: {
    width: '100%'
  },
  greySwitch: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8
  }
};

var EditDataEntryForm = /*#__PURE__*/function (_React$Component) {
  _inherits(EditDataEntryForm, _React$Component);

  var _super = _createSuper(EditDataEntryForm);

  function EditDataEntryForm(props, context) {
    var _this;

    _classCallCheck(this, EditDataEntryForm);

    _this = _super.call(this, props, context);

    _defineProperty(_assertThisInitialized(_this), "handleEditorChanged", function (editorData) {
      //prevent creation of new dataEntryForm when empty
      if (!editorData && !_this.props.dataEntryForm) {
        return;
      }

      var _processFormData = processFormData(editorData, _objectSpread2(_objectSpread2({}, _this.state.programElements), _this.props.elements)),
          usedIds = _processFormData.usedIds,
          outHtml = _processFormData.outHtml;

      _this.setState({
        usedIds: usedIds
      }, function () {
        // Emit a value when the html changed
        if (!_this.props.dataEntryForm || _this.props.dataEntryForm.htmlCode !== outHtml) {
          _this.props.onFormChange(outHtml);
        }
      });
    });

    _this.getTranslation = _this.context.d2.i18n.getTranslation.bind(_this.context.d2.i18n);
    var dataEntryForm = props.dataEntryForm;
    var programElements = {
      'incidentDate': _this.getTranslation('date_of_incident'),
      'enrollmentDate': _this.getTranslation('date_of_enrollment')
    };

    var _processFormData2 = processFormData(fp.getOr('', 'htmlCode', dataEntryForm), _objectSpread2(_objectSpread2({}, programElements), _this.props.elements)),
        _usedIds = _processFormData2.usedIds,
        _outHtml = _processFormData2.outHtml;

    var formHtml = dataEntryForm ? _outHtml : '';
    _this.state = {
      usedIds: _usedIds || [],
      filter: '',
      expand: 'attributes',
      insertFn: _objectSpread2(_objectSpread2({}, bindFuncsToKeys(props.elements, _this.insertElement, _assertThisInitialized(_this))), bindFuncsToKeys(programElements, _this.insertProgramElement, _assertThisInitialized(_this))),
      formTitle: _this.props.formTitle,
      formHtml: formHtml,
      programElements: programElements
    }; // Create element filtering action

    _this.filterAction = Action.create('filter');
    _this.disposables = new Set();

    _this.disposables.add(_this.filterAction.map(function (_ref2) {
      var data = _ref2.data,
          complete = _ref2.complete,
          error = _ref2.error;
      return {
        data: data[1],
        complete: complete,
        error: error
      };
    }).debounceTime(75).subscribe(function (args) {
      var filter = args.data.split(' ').filter(function (x) {
        return x.length;
      });

      _this.setState({
        filter: filter
      });
    }));

    _this.handleDeleteClick = _this.handleDeleteClick.bind(_assertThisInitialized(_this));
    _this.handleStyleChange = _this.handleStyleChange.bind(_assertThisInitialized(_this));
    _this.setEditorReference = _this.setEditorReference.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(EditDataEntryForm, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.disposables.forEach(function (disposable) {
        return disposable.unsubscribe();
      });
    } //Used for when the form is deleted, to update the form

  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(_ref3) {
      var dataEntryForm = _ref3.dataEntryForm;

      if (this.props.dataEntryForm && !dataEntryForm) {
        this._editor.setData('');
      }
    }
  }, {
    key: "handleDeleteClick",
    value: function handleDeleteClick() {
      this.props.onFormDelete();
    }
  }, {
    key: "handleStyleChange",
    value: function handleStyleChange(e, i, value) {
      if (this.props.dataEntryForm.style !== value) {
        this.props.onStyleChange(value);
      }
    }
  }, {
    key: "insertElement",
    value: function insertElement$1(id) {
      if (this.state.usedIds.indexOf(id) !== -1) {
        return;
      }

      return insertElement(id, this.props.elements[id], this._editor, 'attributeid');
    }
  }, {
    key: "insertProgramElement",
    value: function insertProgramElement(id) {
      if (this.state.usedIds.indexOf(id) !== -1) {
        return;
      }

      return insertElement(id, this.state.programElements[id], this._editor, 'programid');
    }
  }, {
    key: "setEditorReference",
    value: function setEditorReference(editor) {
      this._editor = editor;
    }
  }, {
    key: "renderPalette",
    value: function renderPalette() {
      var _this2 = this;

      return /*#__PURE__*/react.createElement("div", {
        className: "paletteContainer",
        style: {}
      }, /*#__PURE__*/react.createElement("div", {
        className: "palette"
      }, /*#__PURE__*/react.createElement("div", {
        style: styles$3.paletteFilter
      }, /*#__PURE__*/react.createElement(_default$e, {
        hintText: this.getTranslation('filter_elements'),
        style: styles$3.paletteFilterField,
        onChange: this.filterAction,
        fullWidth: true
      })), /*#__PURE__*/react.createElement("div", {
        className: "elements"
      }, /*#__PURE__*/react.createElement(PurePaletteSection, {
        keySet: this.props.elements,
        label: "attributes",
        filter: this.state.filter,
        expand: this.state.expand,
        expandClick: function expandClick() {
          _this2.setState({
            expand: 'attributes'
          });
        },
        usedIds: this.state.usedIds,
        insertFn: this.state.insertFn
      })), /*#__PURE__*/react.createElement("div", {
        className: "elements"
      }, /*#__PURE__*/react.createElement(PurePaletteSection, {
        keySet: this.state.programElements,
        label: "program",
        filter: this.state.filter,
        expand: this.state.expand,
        expandClick: function expandClick() {
          _this2.setState({
            expand: 'program'
          });
        },
        usedIds: this.state.usedIds,
        insertFn: this.state.insertFn
      }))));
    }
  }, {
    key: "render",
    value: function render() {
      var props = this.props;
      return this.state.formHtml === undefined ? /*#__PURE__*/react.createElement(LoadingMask, null) : /*#__PURE__*/react.createElement("div", {
        style: Object.assign({}, styles$3.formContainer, {})
      }, /*#__PURE__*/react.createElement("div", {
        className: "programStageEditForm"
      }, /*#__PURE__*/react.createElement("div", {
        className: "left"
      }, /*#__PURE__*/react.createElement(CKEditor, {
        onEditorChange: this.handleEditorChanged,
        onEditorInitialized: this.setEditorReference,
        initialContent: this.state.formHtml
      }), /*#__PURE__*/react.createElement(_default$d, {
        style: styles$3.formPaper
      }, /*#__PURE__*/react.createElement("div", {
        style: styles$3.formSection
      }, /*#__PURE__*/react.createElement(_default$e, {
        floatingLabelText: this.getTranslation('form_name'),
        defaultValue: this.props.program.displayName,
        onChange: this.props.onFormNameChange
      }), /*#__PURE__*/react.createElement(_default$m, {
        value: fp.getOr('NORMAL', 'style', props.dataEntryForm),
        floatingLabelText: "Form display style",
        onChange: this.handleStyleChange
      }, /*#__PURE__*/react.createElement(_default$n, {
        value: 'NORMAL',
        primaryText: this.getTranslation('normal')
      }), /*#__PURE__*/react.createElement(_default$n, {
        value: 'COMFORTABLE',
        primaryText: this.getTranslation('comfortable')
      }), /*#__PURE__*/react.createElement(_default$n, {
        value: 'COMPACT',
        primaryText: this.getTranslation('compact')
      }), /*#__PURE__*/react.createElement(_default$n, {
        value: 'NONE',
        primaryText: this.getTranslation('none')
      }))), /*#__PURE__*/react.createElement("div", {
        style: styles$3.formSection
      }, props.dataEntryForm && props.dataEntryForm.id ? /*#__PURE__*/react.createElement(_default$o, {
        primary: true,
        label: this.getTranslation('delete'),
        style: styles$3.deleteButton,
        onClick: this.handleDeleteClick
      }) : undefined))), /*#__PURE__*/react.createElement("div", {
        className: "right"
      }, this.renderPalette())));
    }
  }]);

  return EditDataEntryForm;
}(react.Component);

EditDataEntryForm.propTypes = {
  params: PropTypes.object,
  onFormChange: PropTypes.func,
  onStyleChange: PropTypes.func,
  onFormDelete: PropTypes.func
};
EditDataEntryForm.defaulRFFtProps = {
  onFormChange: fp.noop,
  onStyleChange: fp.noop,
  onFormDelete: fp.noop
};
EditDataEntryForm.contextTypes = {
  d2: PropTypes.any
};

var mapDispatchToPropsForProgram = function mapDispatchToPropsForProgram(dispatch, _ref4) {
  var program = _ref4.program;
  return bindActionCreators({
    onFormChange: fp.curry(programDataEntryFormChanged)('htmlCode'),
    onFormNameChange: function onFormNameChange(e) {
      return programDataEntryFormChanged('name', e.target.value);
    },
    onStyleChange: fp.curry(programDataEntryFormChanged)('style'),
    onFormDelete: programDataEntryFormRemove.bind(undefined, program.id)
  }, dispatch);
};

var programDataEntryForm = fp.compose(_default$8(function (props$) {
  return props$.combineLatest(eventProgramStore, function (props, _ref5) {
    var program = _ref5.program,
        availableAttributes = _ref5.availableAttributes;
    return _objectSpread2(_objectSpread2({}, props), {}, {
      program: program,
      dataEntryForm: program.dataEntryForm,
      elements: pteaToAttributes({
        programTrackedEntityAttributes: program.programTrackedEntityAttributes,
        availableAttributes: availableAttributes
      }),
      //getProgramStageDataElementsByStageId(state)(programStage.id),
      formTitle: program.displayName
    });
  });
}), connect(undefined, mapDispatchToPropsForProgram));
var CustomRegistrationDataEntryForm = programDataEntryForm(EditDataEntryForm);

var formIndices = {
  section: 0,
  custom: 1
};
var styles$2 = {
  tabContent: {
    padding: '3rem'
  },
  helpText: {
    color: 'gray',
    marginBottom: '2rem'
  }
};

var CreateEnrollmentDataEntryForm = /*#__PURE__*/function (_Component) {
  _inherits(CreateEnrollmentDataEntryForm, _Component);

  var _super = _createSuper(CreateEnrollmentDataEntryForm);

  function CreateEnrollmentDataEntryForm(props) {
    var _this;

    _classCallCheck(this, CreateEnrollmentDataEntryForm);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "onTabChange", function (_, __, tab) {
      var curTab = tab.props.index;

      _this.setState({
        curTab: curTab
      });
    });

    _defineProperty(_assertThisInitialized(_this), "programDataElementOrderChanged", function (_ref) {
      var oldIndex = _ref.oldIndex,
          newIndex = _ref.newIndex;

      _this.props.onChangeDefaultOrder(commonjs.arrayMove(_this.props.availableAttributes.map(function (dataElement) {
        return dataElement.id;
      }), oldIndex, newIndex));
    });

    _defineProperty(_assertThisInitialized(_this), "renderTab", function (label, contentToRender) {
      return /*#__PURE__*/react.createElement(Tab, {
        style: styles$2.tab,
        label: label
      }, /*#__PURE__*/react.createElement("div", {
        style: styles$2.tabContent
      }, /*#__PURE__*/react.createElement(HelpText, null), contentToRender));
    });

    _defineProperty(_assertThisInitialized(_this), "getTranslation", function (key) {
      return _this.context.d2.i18n.getTranslation(key);
    });

    var hasCustomForm = props.model && props.model.dataEntryForm;
    _this.state = {
      curTab: hasCustomForm ? formIndices.custom : formIndices.section
    };
    return _this;
  }

  _createClass(CreateEnrollmentDataEntryForm, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/react.createElement(_default$d, {
        style: {
          marginTop: '15px'
        }
      }, /*#__PURE__*/react.createElement(Tabs_1, {
        initialSelectedIndex: this.state.curTab,
        onChange: this.onTabChange
      }, this.renderTab(this.getTranslation('section'), /*#__PURE__*/react.createElement(SectionForm, {
        availableElements: this.props.assignedAttributes,
        sections: this.props.programSections,
        onSectionUpdated: this.props.onSectionUpdated,
        onSectionOrderChanged: this.props.onSectionOrderChanged,
        onSectionAdded: this.props.onSectionAdded,
        onSectionRemoved: this.props.onSectionRemoved,
        elementPath: "trackedEntityAttributes"
      })), this.renderTab(this.getTranslation('custom'), /*#__PURE__*/react.createElement(CustomRegistrationDataEntryForm, {
        isActive: this.state.curTab === formIndices.custom,
        programStage: this.props.programStage
      }))));
    }
  }]);

  return CreateEnrollmentDataEntryForm;
}(react.Component);

CreateEnrollmentDataEntryForm.contextTypes = {
  d2: react.PropTypes.object
};

var HelpText = function HelpText(_, _ref2) {
  var d2 = _ref2.d2;
  return /*#__PURE__*/react.createElement("div", {
    style: styles$2.helpText
  }, d2.i18n.getTranslation('program_forms_help_text'));
};

HelpText.contextTypes = {
  d2: react.PropTypes.object
};
CreateEnrollmentDataEntryForm.propTypes = {
  onSectionOrderChanged: react.PropTypes.func.isRequired,
  onSectionUpdated: react.PropTypes.func.isRequired,
  onSectionAdded: react.PropTypes.func.isRequired,
  onSectionRemoved: react.PropTypes.func.isRequired,
  programSections: react.PropTypes.arrayOf(react.PropTypes.shape({
    id: react.PropTypes.string.isRequired,
    sortOrder: react.PropTypes.number.isRequired,
    displayName: react.PropTypes.string.isRequired,
    attributes: react.PropTypes.arrayOf(react.PropTypes.shape({
      id: react.PropTypes.string.isRequired,
      displayName: react.PropTypes.string.isRequired
    })).isRequired
  })).isRequired
};

var mapDispatchToProps$2 = function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    changeProgramSectionOrder: changeProgramSectionOrder,
    addProgramSection: addProgramSection,
    removeProgramSection: removeProgramSection,
    updateProgramSection: updateProgramSection
  }, dispatch);
};

var sections$ = eventProgramStore.map(fp.getOr([], 'programSections'));
var enhance$1 = fp.compose(connect(null, mapDispatchToProps$2), _default$8(function (props$) {
  return props$.combineLatest(sections$, function (props, sections) {
    return _objectSpread2(_objectSpread2({}, props), {}, {
      programSections: sections
    });
  });
}), _default$y(function (_ref3) {
  var assignedAttributes = _ref3.assignedAttributes,
      programSections = _ref3.programSections;
  // We need to actually use the tea and not ptea, keep ptea sortOrder
  return {
    assignedAttributes: assignedAttributes.map(function (a) {
      return _objectSpread2(_objectSpread2({}, a.trackedEntityAttribute), {}, {
        sortOrder: a.sortOrder
      });
    }),
    programSections: programSections.map(function (s) {
      s.trackedEntityAttributes = Array.from(s.trackedEntityAttributes.values());
      return s;
    })
  };
}), _default$9({
  onSectionUpdated: function onSectionUpdated(_ref4) {
    var updateProgramSection = _ref4.updateProgramSection;
    return function (sectionId, newSectionData) {
      updateProgramSection({
        programSectionId: sectionId,
        newProgramSectionData: newSectionData
      });
    };
  },
  onSectionOrderChanged: function onSectionOrderChanged(_ref5) {
    var changeProgramSectionOrder = _ref5.changeProgramSectionOrder;
    return function (programSections) {
      changeProgramSectionOrder({
        programSections: programSections
      });
    };
  },
  onSectionAdded: function onSectionAdded(_ref6) {
    var addProgramSection = _ref6.addProgramSection;
    return function (newSectionData) {
      addProgramSection({
        newSectionData: newSectionData
      });
    };
  },
  onSectionRemoved: function onSectionRemoved(_ref7) {
    var removeProgramSection = _ref7.removeProgramSection;
    return function (programSection) {
      removeProgramSection({
        programSection: programSection
      });
    };
  }
}));
var CreateEnrollmentDataEntryForm$1 = enhance$1(CreateEnrollmentDataEntryForm);

var steps = [{
  key: 'assign_attributes',
  name: 'assign_attributes',
  componentName: 'AssignAttributes'
}, {
  key: 'create_registration_form',
  name: 'create_registration_form',
  componentName: 'CreateEnrollmentDataEntryForm'
}];

var stepperConfig$2 = function stepperConfig() {
  var stepComponents = {
    AssignAttributes: AssignAttributes$1,
    CreateEnrollmentDataEntryForm: CreateEnrollmentDataEntryForm$1
  };
  return steps.map(function (step) {
    step.component = stepComponents[step.componentName];
    step.content = stepComponents[step.componentName];
    return step;
  });
};

var Stepper = createStepperFromConfig(stepperConfig$2(), 'vertical');
var StepperWithAttributes = withAttributes(Stepper);

var AttributesStepper = /*#__PURE__*/function (_React$Component) {
  _inherits(AttributesStepper, _React$Component);

  var _super = _createSuper(AttributesStepper);

  function AttributesStepper(props) {
    var _this;

    _classCallCheck(this, AttributesStepper);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "changeStep", function (step) {
      _this.setState({
        activeStep: step
      });
    });

    _this.state = {
      activeStep: 0
    };
    return _this;
  }

  _createClass(AttributesStepper, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/react.createElement(StepperWithAttributes, _extends({}, this.props, {
        activeStep: this.state.activeStep,
        stepperClicked: this.changeStep
      }));
    }
  }]);

  return AttributesStepper;
}(react.Component);

var styles$1 = {
  fab: {
    textAlign: 'right',
    marginTop: '1rem',
    bottom: '1.5rem',
    right: '1.5rem',
    position: 'fixed',
    zIndex: 10
  },
  detailsBox: {
    flex: 1,
    marginLeft: '1rem',
    marginRight: '1rem',
    opacity: 1,
    flexGrow: 0,
    paddingLeft: '1rem'
  },
  detailsBoxWrap: {
    paddingLeft: '1rem'
  },
  listWrap: {
    flex: 1,
    display: 'flex',
    flexOrientation: 'row'
  },
  sharingDialogBody: {
    minHeight: '400px'
  }
};

var ProgramStageList = /*#__PURE__*/function (_Component) {
  _inherits(ProgramStageList, _Component);

  var _super = _createSuper(ProgramStageList);

  function ProgramStageList() {
    var _this;

    _classCallCheck(this, ProgramStageList);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      stages: _this.props.programStages,
      modelType: 'programStage',
      detailsObject: null,
      sharing: {
        id: null
      },
      translate: {
        model: null
      },
      tableColumns: getTableColumnsForType('programStage')
    });

    _defineProperty(_assertThisInitialized(_this), "openSharing", function (model) {
      _this.setState(_objectSpread2(_objectSpread2({}, _this.state), {}, {
        sharing: _objectSpread2(_objectSpread2({}, _this.state.sharing), {}, {
          id: model.id
        })
      }));
    });

    _defineProperty(_assertThisInitialized(_this), "closeSharing", function () {
      _this.setState(_objectSpread2(_objectSpread2({}, _this.state), {}, {
        sharing: _objectSpread2(_objectSpread2({}, _this.state.sharing), {}, {
          id: null
        })
      }));
    });

    _defineProperty(_assertThisInitialized(_this), "openDetails", function (model) {
      return _this.setState({
        detailsObject: model
      });
    });

    _defineProperty(_assertThisInitialized(_this), "closeDetails", function () {
      return _this.setState({
        detailsObject: null
      });
    });

    _defineProperty(_assertThisInitialized(_this), "openTranslate", function (model) {
      _this.setState(_objectSpread2(_objectSpread2({}, _this.state), {}, {
        translate: _objectSpread2(_objectSpread2({}, _this.state.translate), {}, {
          model: model
        })
      }));
    });

    _defineProperty(_assertThisInitialized(_this), "handleOnRequestClose", function () {
      _this.setState(_objectSpread2(_objectSpread2({}, _this.state), {}, {
        translate: _objectSpread2(_objectSpread2({}, _this.state.translate), {}, {
          model: null
        })
      }));
    });

    _defineProperty(_assertThisInitialized(_this), "swapStages", function (stageA, stageB) {
      _this.setState(function (state) {
        var swapOrder = stageA.sortOrder;
        stageA.sortOrder = stageB.sortOrder;
        stageB.sortOrder = swapOrder;
        return {
          sections: state.stages.sort(function (a, b) {
            return a.sortOrder - b.sortOrder;
          })
        };
      });
    });

    _defineProperty(_assertThisInitialized(_this), "contextActionChecker", function (model, action) {
      if (action === 'move_up') {
        return _this.state.stages.indexOf(model) > 0;
      } else if (action === 'move_down') {
        return _this.state.stages.indexOf(model) < _this.state.stages.length - 1;
      }

      return true;
    });

    _defineProperty(_assertThisInitialized(_this), "moveStageUp", function (stage) {
      var currentIndex = _this.state.stages.indexOf(stage);

      if (currentIndex > 0) {
        var swapStage = _this.state.stages[currentIndex - 1];

        _this.swapStages(swapStage, stage);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "moveStageDown", function (stage) {
      var currentIndex = _this.state.stages.indexOf(stage);

      if (currentIndex < _this.state.stages.length - 1) {
        var swapStage = _this.state.stages[currentIndex + 1];

        _this.swapStages(swapStage, stage);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "renderSharing", function () {
      return !!_this.state.sharing.id && /*#__PURE__*/react.createElement(SharingDialog, {
        id: _this.state.sharing.id,
        type: _this.state.modelType,
        open: !!_this.state.sharing.id,
        onRequestClose: _this.closeSharing,
        bodyStyle: styles$1.sharingDialogBody,
        d2: _this.context.d2
      });
    });

    _defineProperty(_assertThisInitialized(_this), "renderTranslate", function () {
      return !!_this.state.translate.model && /*#__PURE__*/react.createElement(TranslationDialog, {
        objectToTranslate: _this.state.translate.model,
        objectTypeToTranslate: _this.state.translate.model.modelDefinition,
        open: !!_this.state.translate.model,
        onTranslationSaved: translationSaved,
        onTranslationError: translationError,
        onRequestClose: _this.handleOnRequestClose,
        fieldsToTranslate: getTranslatablePropertiesForModelType(_this.state.modelType)
      });
    });

    _defineProperty(_assertThisInitialized(_this), "renderDetails", function () {
      return !!_this.state.detailsObject && /*#__PURE__*/react.createElement("div", {
        style: styles$1.detailsBoxWrap
      }, /*#__PURE__*/react.createElement(DetailsBoxWithScroll, {
        detailsObject: _this.state.detailsObject,
        onClose: _this.closeDetails,
        styles: styles$1.detailsBox
      }));
    });

    _defineProperty(_assertThisInitialized(_this), "renderFAB", function () {
      if (!_this.props.getCurrentUser().canCreate(_this.props.getModelDefinitionByName('programStage'))) {
        return null;
      }

      return /*#__PURE__*/react.createElement("div", {
        style: styles$1.fab
      }, /*#__PURE__*/react.createElement(_default$w, {
        onClick: _this.props.handleNewProgramStage
      }, /*#__PURE__*/react.createElement(_default$C, {
        className: "material-icons"
      }, "add")));
    });

    return _this;
  }

  _createClass(ProgramStageList, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (this.state.stages !== nextProps.programStages && this.props.programStages !== nextProps.programStages) {
        this.setState(_objectSpread2(_objectSpread2({}, this.state), {}, {
          stages: nextProps.programStages
        }));
      }
    }
  }, {
    key: "render",
    value: function render() {
      var contextActions = {
        edit: this.props.handleEditProgramStage,
        share: this.openSharing,
        "delete": this.props.handleDeleteProgramStage,
        details: this.openDetails,
        translate: this.openTranslate,
        move_up: this.moveStageUp,
        move_down: this.moveStageDown
      };
      var contextMenuIcons = {
        edit: 'edit',
        share: 'share',
        move_up: 'arrow_upward',
        move_down: 'arrow_downward'
      };
      return /*#__PURE__*/react.createElement("div", {
        style: styles$1.listWrap
      }, /*#__PURE__*/react.createElement(DataTable, {
        rows: this.state.stages,
        columns: this.props.tableColumns,
        primaryAction: this.props.handleEditProgramStage,
        contextMenuActions: contextActions,
        contextMenuIcons: contextMenuIcons,
        isContextActionAllowed: this.contextActionChecker
      }), this.renderDetails(), this.renderSharing(), this.renderTranslate(), this.renderFAB());
    }
  }]);

  return ProgramStageList;
}(react.Component);

ProgramStageList.propTypes = {
  programStages: PropTypes.array.isRequired,
  tableColumns: PropTypes.array,
  handleNewProgramStage: PropTypes.func.isRequired,
  handleEditProgramStage: PropTypes.func.isRequired,
  handleDeleteProgramStage: PropTypes.func.isRequired,
  getCurrentUser: PropTypes.func.isRequired,
  getModelDefinitionByName: PropTypes.func.isRequired
};
ProgramStageList.defaultProps = {
  tableColumns: ['name', 'lastUpdated']
};
ProgramStageList.contextTypes = {
  d2: PropTypes.object.isRequired
};
var ProgramStageList$1 = connect(null, function (dispatch) {
  return bindActionCreators({
    handleEditProgramStage: function handleEditProgramStage(model) {
      return editProgramStage(model.id);
    },
    handleNewProgramStage: function handleNewProgramStage() {
      return addProgramStage();
    },
    handleDeleteProgramStage: function handleDeleteProgramStage(model) {
      return confirmDeleteProgramStage(model.id);
    }
  }, dispatch);
})(withAuth(ProgramStageList));

var programStageFields = fieldOrder["for"]('programStage');
var EditProgramStageDetails = function EditProgramStageDetails(props) {
  var connectedEditForm = connect(null, function (dispatch) {
    return bindActionCreators({
      editFieldChanged: function editFieldChanged(field, value) {
        return editProgramStageField(props.programStage.id, field, value);
      }
    }, dispatch);
  });
  var ProgramStageDetailsForm = _default$b(connectedEditForm(wrapVerticalStepInPaper(createFormFor(props.programStage$, 'programStage', programStageFields))));
  return /*#__PURE__*/react.createElement(ProgramStageDetailsForm, props);
};
EditProgramStageDetails.propTypes = {
  programStage$: propTypes.exports.PropTypes.object.isRequired
};

var AssignProgramStageDataElements = (function (props) {
  return props.programStage$ && /*#__PURE__*/react.createElement(AssignDataElements$1, _extends({
    outerDivStyle: {
      marginTop: '15px'
    }
  }, props, {
    programStage$: props.programStage$
  }));
});

/* eslint-disable no-param-reassign */

var CreateDataEntryForm = function CreateDataEntryForm(props) {
  return /*#__PURE__*/react.createElement("div", {
    style: {
      marginTop: '15px'
    }
  }, /*#__PURE__*/react.createElement(EditDataEntryForm$1, props));
};

var stepperConfig$1 = function stepperConfig() {
  var stepComponents = {
    EditProgramStageDetails: EditProgramStageDetails,
    AssignProgramStageDataElements: AssignProgramStageDataElements,
    CreateDataEntryForm: CreateDataEntryForm
  };
  return steps$3.map(function (step) {
    step.component = stepComponents[step.componentName];
    step.content = stepComponents[step.componentName];
    return step;
  });
};

var ProgramStageVerticalStepper = connect(function (state) {
  return {
    activeStep: getActiveProgramStageStep(state)
  };
}, function (dispatch) {
  return bindActionCreators({
    stepperClicked: changeStep$1
  }, dispatch);
})(createStepperFromConfig(stepperConfig$1(), 'vertical'));
var ProgramStageStepper = _default$b(function (props) {
  return /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement(ProgramStageVerticalStepper, {
    programStage$: props.programStage$,
    programStage: props.programStage
  }));
});
ProgramStageStepper.propTypes = {
  /**
   * Programstage observable, needed to create custom forms
   */
  programStage$: PropTypes.object.isRequired,

  /**
   * Programstage-model object
   */
  programStage: PropTypes.object
};

var EditProgramStage = function EditProgramStage(props, context) {
  var styles = {
    buttons: {
      padding: '2rem 1rem 1rem',
      marginLeft: '10px'
    }
  };
  return /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement(ProgramStageStepper, {
    programStage$: props.programStage$,
    programStage: props.programStage
  }), /*#__PURE__*/react.createElement("div", {
    style: styles.buttons
  }, props.isEditing && /*#__PURE__*/react.createElement("div", {
    style: {
      padding: '10px 0',
      fontWeight: 'bold'
    }
  }, context.d2.i18n.getTranslation('stage_save_hint_text')), /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement(SaveButton, {
    onClick: props.saveProgramStageEdit,
    label: context.d2.i18n.getTranslation(!props.isEditing ? 'stage_add' : 'stage_update')
  }), /*#__PURE__*/react.createElement(CancelButton, {
    onClick: props.cancelProgramStageEdit,
    style: {
      marginLeft: '1rem'
    }
  }))));
};

EditProgramStage.contextTypes = {
  d2: PropTypes.object
};
var EditProgramStage$1 = compose(connect(null, function (dispatch) {
  return bindActionCreators({
    changeStepperDisabledState: changeStepperDisabledState,
    saveProgramStageEdit: saveProgramStageEdit,
    cancelProgramStageEdit: cancelProgramStageEdit,
    editProgramStageReset: editProgramStageReset
  }, dispatch);
}), lifecycle({
  componentWillMount: function componentWillMount() {
    this.props.changeStepperDisabledState(true);
  },
  componentWillUnmount: function componentWillUnmount() {
    this.props.changeStepperDisabledState(false);
    this.props.editProgramStageReset();
  },
  shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
    /* Do not update if programStage updates, this will make the form loose focus - as
    the component will re-render for every change when the observable changes(due getting a new object
    through withProgramStageFromProgramStage$ HoC. */
    if (nextProps.programStage !== this.props.programStage || !this.props.programStage && !nextProps.programStage) {
      return false;
    }

    return nextProps !== this.props;
  }
}), withProgramStageFromProgramStage$)(EditProgramStage);

var ProgramStage = /*#__PURE__*/function (_Component) {
  _inherits(ProgramStage, _Component);

  var _super = _createSuper(ProgramStage);

  function ProgramStage() {
    _classCallCheck(this, ProgramStage);

    return _super.apply(this, arguments);
  }

  _createClass(ProgramStage, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return nextProps.programStage === this.props.programStage;
    }
  }, {
    key: "render",
    value: function render() {
      var props = this.props;
      var programStage$ = props.currentProgramStageId !== 'add' && getProgramStageById$(props.currentProgramStageId).defaultIfEmpty(firstProgramStage$);
      return /*#__PURE__*/react.createElement("div", null, this.props.currentProgramStageId ? /*#__PURE__*/react.createElement(EditProgramStage$1, {
        programStage$: programStage$,
        isEditing: props.isEditing
      }) : /*#__PURE__*/react.createElement(ProgramStageList$1, {
        program: props.program,
        programStages: props.programStages
      }));
    }
  }]);

  return ProgramStage;
}(react.Component);

var mapStateToProps$2 = function mapStateToProps(state) {
  return {
    currentProgramStageId: getCurrentProgramStageId(state),
    isEditing: getIsStageBeingEdited(state)
  };
};

var mapDispatchToProps$1 = function mapDispatchToProps(dispatch) {
  return {
    editProgramStage: function editProgramStage$1(id) {
      dispatch(editProgramStage(id));
    }
  };
};

ProgramStage.propTypes = {
  programStage: propTypes.exports.PropTypes.object,
  currentProgramStageId: propTypes.exports.PropTypes.string
};
ProgramStage.defaultProps = {
  currentProgramStageId: '',
  programStage: {}
};
var ProgramStage$1 = compose(connect(mapStateToProps$2, mapDispatchToProps$1), withProgramAndStages)(ProgramStage);

var program$ = eventProgramStore.map(fp.get('program'));
var enrollmentFields = fieldOrder["for"]('enrollment');

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    editFieldChanged: editFieldChanged
  }, dispatch);
};

var connectEditForm = fp.compose(flattenRouterProps, connect(null, mapDispatchToProps));
var EnrollmentDetailsForm = connectEditForm(createFormFor(program$, 'program', enrollmentFields, false, 'enrollment'));

var EnrollmentDetails = function EnrollmentDetails(props) {
  return /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement(EnrollmentDetailsForm, props));
};

var EnrollmentDetails$1 = wrapInPaper(EnrollmentDetails);

var stepperConfig = function stepperConfig() {
  var program$ = eventProgramStore.map(fp.get('program'));

  var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      editFieldChanged: editFieldChanged
    }, dispatch);
  };

  var connectEditForm = fp.compose(flattenRouterProps, connect(null, mapDispatchToProps));
  var trackerDetailsFields = fieldOrder["for"]('trackerProgram');
  var stepComponents = {
    EditProgramDetailsForm: connectEditForm(wrapInPaper(createFormFor(program$, 'program', trackerDetailsFields, true, 'trackerProgram'))),
    Enrollment: EnrollmentDetails$1,
    AttributesStepper: AttributesStepper,
    ProgramStage: ProgramStage$1,
    EditDataEntryForm: EditDataEntryForm$1,
    ProgramAccess: ProgramAccess,
    TrackerProgramNotifications: TrackerProgramNotifications$1
  };
  return steps$2.map(function (step) {
    step.component = stepComponents[step.componentName]; // eslint-disable-line no-param-reassign

    return step;
  });
};

var mapStateToProps$1 = function mapStateToProps(state) {
  return {
    activeStep: activeStepSelector(state)
  };
};

var TrackerProgramStepperContent = fp.compose(connect(mapStateToProps$1), _default$8(function (props$) {
  return props$.combineLatest(eventProgramStore, function (props, _ref) {
    var program = _ref.program;
    return _objectSpread2(_objectSpread2({}, props), {}, {
      modelToEdit: program
    });
  });
}))(createStepperContentFromConfig(stepperConfig()));

var EventProgramStepperNavigationForward = createConnectedForwardButton(nextTrackerStep);
var EventProgramStepperNavigationBackward = createConnectedBackwardButton(previousTrackerStep);
var StepperNavigation = createStepperNavigation(EventProgramStepperNavigationBackward, EventProgramStepperNavigationForward);
var styles = {
  heading: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1rem'
  }
};

var isModelDirty = function isModelDirty() {
  return {
    dirty: isStoreStateDirty(eventProgramStore.getState())
  };
};

function EditTrackerProgram(props) {
  var schema = props.params.modelType || 'program';
  var groupName = props.params.groupName;
  return /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement("div", {
    style: styles.heading
  }, /*#__PURE__*/react.createElement(FormHeading, {
    schema: schema,
    groupName: groupName,
    isDirtyHandler: isModelDirty
  }, "tracker_".concat(lib.camelCaseToUnderscores(schema))), /*#__PURE__*/react.createElement(FormSubHeading, null, props.model.displayName)), /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement(EventProgramStepper, null)), /*#__PURE__*/react.createElement(TrackerProgramStepperContent, _extends({
    schema: schema
  }, props)), !props.isProgramStageStepperActive && /*#__PURE__*/react.createElement(StepperNavigation, null, /*#__PURE__*/react.createElement(EventActionButtons, {
    groupName: groupName,
    schema: schema,
    isDirtyHandler: isModelDirty
  })));
}

EditTrackerProgram.propTypes = {
  params: propTypes.exports.PropTypes.object.isRequired,
  isProgramStageStepperActive: propTypes.exports.PropTypes.bool,
  model: propTypes.exports.PropTypes.object.isRequired
};
EditTrackerProgram.defaultProps = {
  isProgramStageStepperActive: false
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    isLoading: state.eventProgram.step.isLoading,
    isProgramStageStepperActive: isProgramStageStepperActive(state)
  };
};

var spinnerWhileLoading = function spinnerWhileLoading(isLoading) {
  return branch(isLoading, renderComponent(LoadingMask$1));
};

var enhance = compose(connect(mapStateToProps), _default$8(function (props$) {
  return props$.combineLatest(eventProgramStore, function (props, eventProgramState) {
    return _objectSpread2(_objectSpread2({}, props), {}, {
      model: eventProgramState.program
    });
  });
}), spinnerWhileLoading(function (props) {
  return props.isLoading;
}));

function EditProgram(props) {
  return props.model.programType === 'WITH_REGISTRATION' ? /*#__PURE__*/react.createElement(EditTrackerProgram, props) : /*#__PURE__*/react.createElement(EditEventProgram, props);
}

var EditProgram_component = enhance(EditProgram);

export { EditProgram_component as default };
