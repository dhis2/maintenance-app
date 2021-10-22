import { ae as Store, k as _inherits, l as _createSuper, m as _classCallCheck, A as _defineProperty, B as _assertThisInitialized, c7 as modelToEditStore, ad as snackActions, p as log, r as react, aC as Dropdown, a5 as _default, dS as GroupEditorWithOrdering, n as _createClass, ah as _default$1, s as _extends, af as _default$2, ag as _default$3, de as _default$4, cq as _toConsumableArray, cI as _default$5, q as _objectWithoutProperties, j as _slicedToArray, aJ as DataTable, a1 as _default$6, E as _default$7, P as PropTypes } from './index-44839b1a.js';
import { T as TranslationDialog } from './TranslationDialog.component-38658f53.js';
import { L as LoadingMask } from './LoadingMask.component-7e1e1a02.js';
import { F as FormHeading } from './FormHeading-92e31a13.js';
import { F as FormSubHeading } from './FormSubHeading-cef65695.js';
import './HelpLink.component-39e74935.js';

var dataElementStore = Store.create();
var assignedDataElementStore = Store.create();
var indicatorStore = Store.create();
var assignedIndicatorStore = Store.create();

var SectionDialog = /*#__PURE__*/function (_React$Component) {
  _inherits(SectionDialog, _React$Component);

  var _super = _createSuper(SectionDialog);

  function SectionDialog(props, context) {
    var _this;

    _classCallCheck(this, SectionDialog);

    _this = _super.call(this, props, context);

    _defineProperty(_assertThisInitialized(_this), "setAssignedDataElements", function (dataElements) {
      assignedDataElementStore.setState(dataElements);
    });

    _defineProperty(_assertThisInitialized(_this), "setAssignedIndicators", function (indicators) {
      assignedIndicatorStore.setState(indicators);
    });

    _defineProperty(_assertThisInitialized(_this), "removeIndicators", function (indicators) {
      assignedIndicatorStore.setState(assignedIndicatorStore.state.filter(function (i) {
        return indicators.indexOf(i) === -1;
      }));
      return Promise.resolve();
    });

    _defineProperty(_assertThisInitialized(_this), "assignIndicators", function (indicators) {
      assignedIndicatorStore.setState(assignedIndicatorStore.state.concat(indicators));
      return Promise.resolve();
    });

    _defineProperty(_assertThisInitialized(_this), "handleRowTotalsChange", function (e, value) {
      _this.setState({
        showRowTotals: value
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleColumnTotalsChange", function (e, value) {
      _this.setState({
        showColumnTotals: value
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleFilterChange", function (e) {
      _this.setState({
        filterText: e.target.value
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleNameChange", function (e) {
      var sectionArray = Array.isArray(modelToEditStore.getState().sections) ? modelToEditStore.getState().sections : modelToEditStore.getState().sections.toArray();
      var nameDupe = sectionArray.filter(function (s) {
        return s.id !== _this.props.sectionModel.id;
      }).reduce(function (res, s) {
        return res || s.name === e.target.value;
      }, false);

      _this.setState({
        name: e.target.value,
        nameError: nameDupe ? _this.getTranslation('value_not_unique') : ''
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleCodeChange", function (e) {
      var sectionArray = Array.isArray(modelToEditStore.getState().sections) ? modelToEditStore.getState().sections : modelToEditStore.getState().sections.toArray();
      var codeDupe = sectionArray.filter(function (s) {
        return s.id !== _this.props.sectionModel.id;
      }).reduce(function (res, s) {
        return res || s.code && s.code === e.target.value;
      }, false);

      _this.setState({
        code: e.target.value,
        codeError: codeDupe ? _this.getTranslation('value_not_unique') : ''
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleDescriptionChange", function (e) {
      _this.setState({
        description: e.target.value
      });
    });

    _defineProperty(_assertThisInitialized(_this), "assignDataElements", function (dataElements) {
      assignedDataElementStore.setState(assignedDataElementStore.state.concat(dataElements));
      return Promise.resolve();
    });

    _defineProperty(_assertThisInitialized(_this), "removeDataElements", function (dataElements) {
      assignedDataElementStore.setState(assignedDataElementStore.state.filter(function (de) {
        return dataElements.indexOf(de) === -1;
      }));
      return Promise.resolve();
    });

    _defineProperty(_assertThisInitialized(_this), "handleCategoryComboChange", function (event) {
      var categoryComboId = event.target.value;

      if (modelToEditStore.state.dataSetElements) {
        dataElementStore.setState(modelToEditStore.state.dataSetElements.filter(function (dse) {
          if (categoryComboId) {
            return dse.categoryCombo ? dse.categoryCombo.id === categoryComboId : dse.dataElement.categoryCombo.id === categoryComboId;
          }

          return true;
        }).filter(function (dse) {
          return _this.state.filterDataElementIds ? !_this.state.filterDataElementIds.includes(dse.dataElement.id) : true;
        }).map(function (dse) {
          return {
            value: dse.dataElement.id,
            text: dse.dataElement.displayName
          };
        }).sort(function (a, b) {
          return a.text.localeCompare(b.text);
        }));
      }

      _this.setState({
        categoryCombo: categoryComboId
      });
    });

    _defineProperty(_assertThisInitialized(_this), "saveSection", function () {
      if (!_this.state.name || _this.state.name.trim().length === 0) {
        snackActions.show({
          message: _this.getTranslation('name_is_required'),
          action: _this.getTranslation('ok')
        });
        return;
      }

      var sectionModel = _this.props.sectionModel.id ? _this.props.sectionModel : _this.props.sectionModel.modelDefinition.create();
      Object.assign(sectionModel, {
        dataSet: {
          id: modelToEditStore.state.id
        },
        name: _this.state.name,
        code: _this.state.code,
        description: _this.state.description,
        showRowTotals: _this.state.showRowTotals,
        showColumnTotals: _this.state.showColumnTotals,
        dataElements: assignedDataElementStore.state.map(function (de) {
          return {
            id: de
          };
        }),
        indicators: assignedIndicatorStore.state.map(function (i) {
          return {
            id: i
          };
        }),
        sortOrder: _this.props.sectionModel.sortOrder || modelToEditStore.state.sections.toArray().reduce(function (prev, s) {
          return Math.max(prev, s.sortOrder + 1);
        }, 0)
      });
      sectionModel.save().then(function (res) {
        snackActions.show({
          message: _this.getTranslation('section_saved')
        });

        _this.context.d2.models.sections.get(res.response.uid, {
          fields: [':all,dataElements[id,categoryCombo[id,displayName]]', 'greyedFields[categoryOptionCombo,dataElement]'].join(',')
        }).then(function (section) {
          _this.props.onSaveSection(section);
        });
      })["catch"](function (err) {
        log.warn('Failed to save section:', err);
        snackActions.show({
          message: _this.getTranslation('failed_to_save_section'),
          action: _this.getTranslation('ok')
        });
      });
    });

    _defineProperty(_assertThisInitialized(_this), "renderFilters", function () {
      var catCombos = [{
        value: false,
        text: _this.getTranslation('no_filter')
      }].concat(_this.props.categoryCombos.sort(function (a, b) {
        return a.text.localeCompare(b.text);
      }));
      return /*#__PURE__*/react.createElement("div", {
        style: {
          minWidth: 605
        }
      }, /*#__PURE__*/react.createElement(Dropdown, {
        options: catCombos,
        labelText: _this.getTranslation('category_combo_filter'),
        onChange: _this.handleCategoryComboChange,
        value: _this.state.categoryCombo,
        isRequired: true,
        disabled: _this.props.categoryCombos.length === 1,
        style: {
          width: 284
        }
      }), /*#__PURE__*/react.createElement(_default, {
        fullWidth: true,
        hintText: _this.getTranslation('search_available_selected_items'),
        defaultValue: _this.state.filterText,
        onChange: _this.handleFilterChange
      }));
    });

    _defineProperty(_assertThisInitialized(_this), "renderAvailableOptions", function () {
      var labelStyle = {
        position: 'relative',
        display: 'block',
        width: '100%',
        lineHeight: '24px',
        color: 'rgba(0,0,0,0.3)',
        marginTop: '1.25rem',
        fontSize: 16
      };
      var editorStyle = {
        marginBottom: 80
      };
      return /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement("div", {
        style: editorStyle
      }, /*#__PURE__*/react.createElement("label", {
        style: labelStyle
      }, _this.getTranslation('data_elements')), /*#__PURE__*/react.createElement(GroupEditorWithOrdering, {
        itemStore: dataElementStore,
        assignedItemStore: assignedDataElementStore,
        onAssignItems: _this.assignDataElements,
        onRemoveItems: _this.removeDataElements,
        onOrderChanged: _this.setAssignedDataElements,
        height: 250,
        filterText: _this.state.filterText
      })), indicatorStore.state.length ? /*#__PURE__*/react.createElement("div", {
        style: editorStyle
      }, /*#__PURE__*/react.createElement("label", {
        style: labelStyle
      }, _this.getTranslation('indicators')), /*#__PURE__*/react.createElement(GroupEditorWithOrdering, {
        itemStore: indicatorStore,
        assignedItemStore: assignedIndicatorStore,
        onAssignItems: _this.assignIndicators,
        onRemoveItems: _this.removeIndicators,
        onOrderChanged: _this.setAssignedIndicators,
        height: 250,
        filterText: _this.state.filterText
      })) : null);
    });

    _this.state = {
      categoryCombo: false
    };
    dataElementStore.setState([]);
    assignedDataElementStore.setState([]);
    indicatorStore.setState([]);
    assignedIndicatorStore.setState([]);
    _this.getTranslation = context.d2.i18n.getTranslation.bind(context.d2.i18n);
    return _this;
  }

  _createClass(SectionDialog, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this.subscriptions = [];
      this.subscriptions.push(assignedDataElementStore.subscribe(function () {
        _this2.forceUpdate();
      }));
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(props) {
      var _this3 = this;

      if (props.sectionModel) {
        var currentSectionId = props.sectionModel.id;
        var sections = modelToEditStore.state.sections;
        var sectionArray = Array.isArray(sections) ? sections : sections.toArray();
        var otherSections = sectionArray.filter(function (s) {
          return s.id !== currentSectionId;
        });
        var filterDataElementIds = otherSections.reduce(function (elements, section) {
          return elements.concat((Array.isArray(section.dataElements) ? section.dataElements : section.dataElements.toArray()).map(function (de) {
            return de.id;
          }));
        }, []); // Default category combo filter = no filter

        var categoryComboId = false;
        assignedDataElementStore.setState(props.sectionModel.dataElements ? props.sectionModel.dataElements.toArray().map(function (de) {
          return de.id;
        }) : []);
        indicatorStore.setState(modelToEditStore.state.indicators.toArray().map(function (i) {
          return {
            value: i.id,
            text: i.displayName
          };
        }).sort(function (a, b) {
          return a.text.localeCompare(b.text);
        }));
        assignedIndicatorStore.setState(props.sectionModel.indicators ? props.sectionModel.indicators.toArray().map(function (i) {
          return i.id;
        }) : []);
        this.setState({
          name: props.sectionModel.name,
          code: props.sectionModel.code,
          nameError: '',
          codeError: '',
          description: props.sectionModel.description,
          showRowTotals: props.sectionModel.showRowTotals,
          showColumnTotals: props.sectionModel.showColumnTotals,
          filterText: '',
          filterDataElementIds: filterDataElementIds
        }, function () {
          _this3.handleCategoryComboChange({
            target: {
              value: categoryComboId
            }
          });

          _this3.forceUpdate();
        });
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.subscriptions.forEach(function (disposable) {
        return disposable.unsubscribe();
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var title = this.getTranslation('add_section');
      var sectionIdDiv = null;

      if (this.props.sectionModel.id) {
        title = this.getTranslation('edit_section');
        sectionIdDiv = /*#__PURE__*/react.createElement("div", {
          style: {
            "float": 'left',
            padding: 8,
            color: 'rgba(0,0,0,0.5)'
          }
        }, this.getTranslation('section_id'), ":", /*#__PURE__*/react.createElement("span", {
          style: {
            fontFamily: 'monospace'
          }
        }, this.props.sectionModel.id));
      }

      var validateName = function validateName(e) {
        _this4.setState({
          nameError: e.target.value.trim().length > 0 ? '' : _this4.getTranslation('value_required')
        });
      };

      return /*#__PURE__*/react.createElement(_default$1, _extends({
        autoScrollBodyContent: true,
        title: title,
        actions: [sectionIdDiv, /*#__PURE__*/react.createElement(_default$2, {
          label: this.getTranslation('cancel'),
          onTouchTap: this.props.onRequestClose,
          style: {
            marginRight: 24
          }
        }), /*#__PURE__*/react.createElement(_default$3, {
          primary: true,
          label: this.getTranslation('save'),
          onTouchTap: this.saveSection
        })]
      }, this.props), /*#__PURE__*/react.createElement(_default, {
        floatingLabelText: "".concat(this.getTranslation('name'), " *"),
        value: this.state.name || '',
        style: {
          width: '100%'
        },
        onChange: this.handleNameChange,
        errorText: this.state.nameError,
        onBlur: validateName
      }), /*#__PURE__*/react.createElement(_default, {
        floatingLabelText: this.getTranslation('code'),
        value: this.state.code || '',
        style: {
          width: '100%'
        },
        onChange: this.handleCodeChange,
        errorText: this.state.codeError
      }), /*#__PURE__*/react.createElement(_default, {
        floatingLabelText: this.getTranslation('description'),
        value: this.state.description || '',
        style: {
          width: '100%'
        },
        multiLine: true,
        onChange: this.handleDescriptionChange
      }), /*#__PURE__*/react.createElement(_default$4, {
        label: this.getTranslation('show_row_totals'),
        checked: this.state.showRowTotals,
        style: {
          margin: '16px 0'
        },
        onCheck: this.handleRowTotalsChange
      }), /*#__PURE__*/react.createElement(_default$4, {
        label: this.getTranslation('show_column_totals'),
        checked: this.state.showColumnTotals,
        style: {
          margin: '16px 0'
        },
        onCheck: this.handleColumnTotalsChange
      }), this.renderFilters(), this.renderAvailableOptions());
    }
  }]);

  return SectionDialog;
}(react.Component);

SectionDialog.propTypes = {
  open: react.PropTypes.bool.isRequired,
  sectionModel: react.PropTypes.any.isRequired,
  categoryCombos: react.PropTypes.array.isRequired,
  onRequestClose: react.PropTypes.func.isRequired,
  onSaveSection: react.PropTypes.func.isRequired
};
SectionDialog.contextTypes = {
  d2: react.PropTypes.any.isRequired
};

var _excluded = ["open"];
var styles$1 = {
  dialogContent: {
    maxWidth: 'none'
  },
  dialogDiv: {
    overflowX: 'auto',
    overflowY: 'hidden'
  },
  table: {
    borderSpacing: 0,
    borderCollapse: 'collapse',
    margin: '32px auto'
  },
  th: {
    whiteSpace: 'nowrap',
    textAlign: 'center',
    border: '1px solid #e0e0e0',
    padding: 6
  },
  thDataElements: {
    whiteSpace: 'nowrap',
    border: '1px solid #e0e0e0',
    background: '#f0f0f0',
    textAlign: 'left',
    padding: 6
  },
  td: {
    whiteSpace: 'nowrap',
    padding: 2,
    border: '1px solid #e0e0e0',
    minWidth: 105
  },
  tdDataElement: {
    whiteSpace: 'nowrap',
    padding: 6,
    border: '1px solid #e0e0e0'
  }
};

var GreyFieldDialog = /*#__PURE__*/function (_React$Component) {
  _inherits(GreyFieldDialog, _React$Component);

  var _super = _createSuper(GreyFieldDialog);

  function GreyFieldDialog(props, context) {
    var _this;

    _classCallCheck(this, GreyFieldDialog);

    _this = _super.call(this, props, context);
    _this.state = {
      categories: []
    };
    _this.closeDialog = _this.closeDialog.bind(_assertThisInitialized(_this));
    _this.handleSaveClick = _this.handleSaveClick.bind(_assertThisInitialized(_this));
    _this.getTranslation = context.d2.i18n.getTranslation.bind(context.d2.i18n);
    return _this;
  }

  _createClass(GreyFieldDialog, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(props) {
      var _this2 = this;

      var d2 = this.context.d2;

      if (props.sectionModel) {
        var dataElements = props.sectionModel.dataElements.toArray();

        if (dataElements.length < 1) {
          log.info("Section ".concat(props.sectionModel.displayName, " contains no data elements"));
          snackActions.show({
            message: this.getTranslation('this_section_has_no_data_elements'),
            action: 'ok'
          });
          this.props.onRequestClose();
          return;
        }

        var cocMap = {};

        var categoryArrayToMap = function categoryArrayToMap(categories) {
          var appendage = null;

          var reduceAppendage = function reduceAppendage(prev, categoryOption) {
            var out = prev;
            out[categoryOption.id] = appendage;
            return out;
          };

          while (categories.length > 0) {
            appendage = categories.pop().categoryOptions.toArray().reduce(reduceAppendage, {});
          }

          return appendage;
        };

        var assignCocs = function assignCocs(cocMap, options, coc) {
          if (options.length > 0) {
            return Object.keys(cocMap).reduce(function (prev, key) {
              var out = prev;
              var keyPos = options.indexOf(key);

              if (keyPos !== -1) {
                options.splice(keyPos, 1);
                out[key] = assignCocs(cocMap[key], options, coc);
                return out;
              }

              out[key] = cocMap[key];
              return out;
            }, {});
          }

          return coc;
        }; // Use the categoryCombos associated with the section to get categories and their category options


        d2.models.categoryCombos.list({
          filter: "id:in:[".concat(props.sectionModel.categoryCombos.toArray().map(function (coc) {
            return coc.id;
          }), "]"),
          paging: false,
          fields: ['id,displayName', 'categories[id,displayName,categoryOptions[id,displayName]]', 'categoryOptionCombos[id,displayName', 'categoryOptions[id,displayName]]'].join(',')
        }).then(function (categoryCombos) {
          categoryCombos.forEach(function (categoryCombo) {
            // Build a nested map of categories:
            // { cat1_opt1 : { cat2_opt1: { cat3_opt1: null, cat3_opt2: null }, cat2_opt2: {...}, ... }, ... }
            //
            // Then convert to JSON and back as a fast way to remove any references within the structure
            Object.assign(cocMap, JSON.parse(JSON.stringify(categoryArrayToMap(categoryCombo.categories.toArray())))); // Fill in the leaf nodes in the cocMap with the actual coc's

            categoryCombo.categoryOptionCombos.toArray().forEach(function (coc) {
              var optionPath = coc.categoryOptions.toArray().map(function (o) {
                return o.id;
              });
              cocMap = assignCocs(cocMap, optionPath, {
                id: coc.id,
                displayName: coc.displayName
              });
            });
          });
          var greyedFields = props.sectionModel.greyedFields.reduce(function (prev, gf) {
            if (prev.hasOwnProperty(gf.dataElement.id)) {
              prev[gf.dataElement.id].push(gf.categoryOptionCombo.id);
              return prev;
            }

            var out = prev;
            out[gf.dataElement.id] = [gf.categoryOptionCombo.id];
            return out;
          }, {});

          _this2.setState({
            currentCategoryCombo: categoryCombos.toArray()[0].id,
            categoryCombos: categoryCombos,
            optionCount: categoryCombos.toArray().reduce(function (oc, cc) {
              oc[cc.id] = cc.categories.toArray().map(function (c) {
                return c.categoryOptions.size;
              });
              return oc;
            }, {}),
            cocMap: cocMap,
            greyedFields: greyedFields
          });
        });
      }
    }
  }, {
    key: "closeDialog",
    value: function closeDialog() {
      this.props.onRequestClose();
    }
  }, {
    key: "handleSaveClick",
    value: function handleSaveClick() {
      var _this3 = this;

      var greyedFields = [];
      Object.keys(this.state.greyedFields).forEach(function (dataElement) {
        _this3.state.greyedFields[dataElement].forEach(function (coc) {
          greyedFields.push({
            dataElement: {
              id: dataElement
            },
            categoryOptionCombo: {
              id: coc
            }
          });
        });
      });
      var section = Object.assign(this.props.sectionModel, {
        greyedFields: greyedFields
      });
      section.save().then(function (res) {
        log.info('Section updated', res);
        snackActions.show({
          message: _this3.getTranslation('section_saved')
        });

        _this3.props.onRequestSave(section);
      })["catch"](function (err) {
        log.error('Failed to save section:', err);
        snackActions.show({
          message: _this3.getTranslation('failed_to_save_section'),
          action: 'ok'
        });
      });
    }
  }, {
    key: "renderTableHeader",
    value: function renderTableHeader() {
      var _this4 = this;

      var prevRowColCount = 1;
      return this.state.currentCategoryCombo && this.state.categoryCombos.get(this.state.currentCategoryCombo).categories.toArray().map(function (cat, catNum) {
        var colSpan = _this4.state.optionCount[_this4.state.currentCategoryCombo].slice(catNum + 1).reduce(function (product, optionCount) {
          return optionCount * product;
        }, 1);

        var isLastHeader = catNum === _this4.state.categoryCombos.get(_this4.state.currentCategoryCombo).categories.size - 1;
        var row = /*#__PURE__*/react.createElement("tr", {
          key: catNum
        }, /*#__PURE__*/react.createElement("th", {
          style: styles$1.thDataElements
        }, isLastHeader && _this4.getTranslation('data_element')), // For each column in the previous row...
        Array.apply(void 0, _toConsumableArray(Array(prevRowColCount))).map(function (e, rep) {
          return (// ... render the columns for this row
            cat.categoryOptions.toArray().map(function (opt, optNum) {
              return /*#__PURE__*/react.createElement("th", {
                key: "".concat(optNum, ".").concat(rep),
                colSpan: colSpan,
                style: styles$1.th
              }, opt.displayName === 'default' ? '' : opt.displayName);
            })
          );
        }));
        prevRowColCount *= cat.categoryOptions.size;
        return row;
      });
    }
  }, {
    key: "renderCheckbox",
    value: function renderCheckbox(dataElement, fieldArray, fieldNum) {
      var _this5 = this;

      var resolveCoc = function resolveCoc(cocMap, fields) {
        if (fields.length === 0) {
          return cocMap;
        }

        var field = fields.shift();
        return resolveCoc(cocMap[field], fields);
      };

      var coc = resolveCoc(this.state.cocMap, fieldArray);
      var isGreyed = this.state.greyedFields.hasOwnProperty(dataElement.id) && this.state.greyedFields[dataElement.id].indexOf(coc.id) !== -1;

      var toggleBoggle = function (dataElementId, categoryOptionComboId, event, disable) {
        _this5.setState(function (state) {
          var greyedCocs = (state.greyedFields[dataElementId] || []).slice();

          if (disable) {
            if (greyedCocs.includes(categoryOptionComboId)) {
              greyedCocs.splice(greyedCocs.indexOf(categoryOptionComboId), 1);
            }
          } else if (!greyedCocs.includes(categoryOptionComboId)) {
            greyedCocs.push(categoryOptionComboId);
          }

          var greyedFields = Object.keys(state.greyedFields).reduce(function (prev, deId) {
            var out = prev;
            out[deId] = deId === dataElementId ? greyedCocs : state.greyedFields[deId];
            return out;
          }, {});

          if (greyedCocs.length > 0 && !greyedFields.hasOwnProperty(dataElementId)) {
            greyedFields[dataElementId] = greyedCocs;
          }

          return {
            greyedFields: greyedFields
          };
        });
      }.bind(this, dataElement.id, coc.id);

      return /*#__PURE__*/react.createElement("td", {
        key: fieldNum,
        style: styles$1.td
      }, /*#__PURE__*/react.createElement(_default$5, {
        checked: !isGreyed,
        label: isGreyed ? this.getTranslation('disabled') : this.getTranslation('enabled'),
        labelPosition: "right",
        labelStyle: {
          whiteSpace: 'nowrap'
        },
        onCheck: toggleBoggle
      }));
    }
  }, {
    key: "renderDataElements",
    value: function renderDataElements() {
      var _this6 = this;

      var getCocFields = function getCocFields() {
        return _this6.state.categoryCombos.get(_this6.state.currentCategoryCombo).categories.toArray().reduce(function (prev, cat) {
          if (prev.length > 0) {
            var out = [];
            prev.forEach(function (p) {
              cat.categoryOptions.toArray().forEach(function (opt) {
                var pout = p.slice();
                pout.push(opt.id);
                out.push(pout);
              });
            });
            return out;
          }

          cat.categoryOptions.toArray().forEach(function (opt) {
            prev.push([opt.id]);
          });
          return prev;
        }, []);
      };

      var currentSectionDataElementIds = this.props.sectionModel.dataElements.toArray().map(function (de) {
        return de.id;
      });
      return this.state.currentCategoryCombo ? modelToEditStore.state.dataSetElements.filter(function (dse) {
        return currentSectionDataElementIds.includes(dse.dataElement.id);
      }).filter(function (dse) {
        return (dse.categoryCombo ? dse.categoryCombo.id : dse.dataElement.categoryCombo.id) === _this6.state.currentCategoryCombo;
      }).sort(function (a, b) {
        return currentSectionDataElementIds.indexOf(a.dataElement.id) - currentSectionDataElementIds.indexOf(b.dataElement.id);
      }).map(function (dse, deNum) {
        var cocFields = getCocFields();
        return /*#__PURE__*/react.createElement("tr", {
          key: deNum,
          style: {
            background: deNum % 2 === 0 ? 'none' : '#f0f0f0'
          }
        }, /*#__PURE__*/react.createElement("td", {
          style: styles$1.tdDataElement
        }, dse.dataElement.displayName), cocFields.map(function (fields, fieldNum) {
          return _this6.renderCheckbox(dse.dataElement, fields, fieldNum);
        }));
      }) : null;
    }
  }, {
    key: "render",
    value: function render() {
      var _this7 = this;

      var title = this.props.sectionModel.displayName;

      var _this$props = this.props,
          open = _this$props.open,
          extraProps = _objectWithoutProperties(_this$props, _excluded);

      var uniqueCatComboIds = [],
          sectionDataElementIds = [],
          categoryCombosForSection = [];

      if (this.props.sectionModel) {
        // Get data element ids for the current section
        sectionDataElementIds = this.props.sectionModel.dataElements.toArray().map(function (de) {
          return de.id;
        }); // Get unique cat combos for data elements in current section

        categoryCombosForSection = modelToEditStore.state.dataSetElements.filter(function (dse) {
          return sectionDataElementIds.includes(dse.dataElement.id);
        }).map(function (dse) {
          return dse.categoryCombo || dse.dataElement.categoryCombo;
        }).reduce(function (catCombos, catCombo) {
          if (!uniqueCatComboIds.includes(catCombo.id)) {
            uniqueCatComboIds.push(catCombo.id);
            catCombos.push(catCombo);
          }

          return catCombos;
        }, []).sort(function (a, b) {
          return a.displayName.localeCompare(b.displayName);
        });
      }

      return /*#__PURE__*/react.createElement(_default$1, _extends({
        autoScrollBodyContent: true,
        autoDetectWindowHeight: true,
        title: "".concat(this.getTranslation('manage_grey_fields'), ": ").concat(title),
        style: {
          maxWidth: 'none'
        },
        contentStyle: styles$1.dialogContent,
        open: open && this.props.sectionModel.dataElements.size > 0
      }, extraProps, {
        actions: [/*#__PURE__*/react.createElement(_default$2, {
          label: this.getTranslation('cancel'),
          onTouchTap: this.closeDialog,
          style: {
            marginRight: 16
          }
        }), /*#__PURE__*/react.createElement(_default$3, {
          primary: true,
          label: this.getTranslation('save'),
          onTouchTap: this.handleSaveClick
        })],
        onRequestClose: this.closeDialog
      }), this.props.sectionModel && this.props.sectionModel.categoryCombos && this.props.sectionModel.categoryCombos.size > 1 ? /*#__PURE__*/react.createElement(Dropdown, {
        options: categoryCombosForSection.map(function (cc) {
          return {
            value: cc.id,
            text: cc.displayName === 'default' ? _this7.getTranslation('none') : cc.displayName
          };
        }),
        labelText: this.getTranslation('category_combo'),
        value: this.state.currentCategoryCombo,
        onChange: function onChange(e) {
          return _this7.setState({
            currentCategoryCombo: e.target.value
          });
        },
        style: {
          width: '33%'
        },
        isRequired: true
      }) : null, /*#__PURE__*/react.createElement("div", {
        style: styles$1.dialogDiv
      }, /*#__PURE__*/react.createElement("table", {
        style: styles$1.table
      }, /*#__PURE__*/react.createElement("tbody", null, this.renderTableHeader(), this.state.currentCategoryCombo && this.props.sectionModel && this.renderDataElements()))));
    }
  }]);

  return GreyFieldDialog;
}(react.Component);

GreyFieldDialog.contextTypes = {
  d2: react.PropTypes.any.isRequired
};
GreyFieldDialog.propTypes = {
  open: react.PropTypes.bool.isRequired,
  sectionModel: react.PropTypes.any.isRequired,
  onRequestClose: react.PropTypes.func.isRequired,
  onRequestSave: react.PropTypes.func.isRequired
};

var styles = {
  heading: {
    paddingBottom: 18
  },
  fab: {
    textAlign: 'right',
    marginTop: '1rem',
    bottom: '1.5rem',
    right: '1.5rem',
    position: 'fixed',
    zIndex: 10
  }
};

var EditDataSetSections = /*#__PURE__*/function (_Component) {
  _inherits(EditDataSetSections, _Component);

  var _super = _createSuper(EditDataSetSections);

  function EditDataSetSections(props, context) {
    var _this;

    _classCallCheck(this, EditDataSetSections);

    _this = _super.call(this, props, context);

    _defineProperty(_assertThisInitialized(_this), "handleTranslationSaved", function () {
      snackActions.show({
        message: 'translation_saved',
        translate: true
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleTranslationErrored", function (errorMessage) {
      log.error(errorMessage);
      snackActions.show({
        message: 'translation_save_error',
        action: 'ok',
        translate: true
      });
    });

    _this.state = {
      categoryCombos: null,
      editSectionModel: false,
      greyFieldSectionModel: false
    };
    Promise.all([context.d2.Api.getApi().get(['dataSets', props.params.modelId, 'categoryCombos'].join('/'), {
      fields: 'id,displayName',
      paging: false
    })]).then(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 1),
          catComboList = _ref2[0];

      var sections = modelToEditStore.state.sections;
      var sectionArray = Array.isArray(sections) ? sections : sections.toArray();

      _this.setState({
        sections: sectionArray.sort(function (a, b) {
          return a.sortOrder - b.sortOrder;
        }),
        categoryCombos: catComboList.categoryCombos.map(function (cc) {
          return {
            value: cc.id,
            text: cc.displayName === 'default' ? _this.getTranslation('none') : cc.displayName
          };
        })
      });
    });
    _this.handleAddSectionClick = _this.handleAddSectionClick.bind(_assertThisInitialized(_this));
    _this.handleEditSectionClick = _this.handleEditSectionClick.bind(_assertThisInitialized(_this));
    _this.handleSectionSaved = _this.handleSectionSaved.bind(_assertThisInitialized(_this));
    _this.handleDeleteSectionClick = _this.handleDeleteSectionClick.bind(_assertThisInitialized(_this));
    _this.handleTranslateSectionClick = _this.handleTranslateSectionClick.bind(_assertThisInitialized(_this));
    _this.handleTranslationSaved = _this.handleTranslationSaved.bind(_assertThisInitialized(_this));
    _this.handleTranslationErrored = _this.handleTranslationErrored.bind(_assertThisInitialized(_this));
    _this.handleSectionGreyFieldsClick = _this.handleSectionGreyFieldsClick.bind(_assertThisInitialized(_this));
    _this.swapSections = _this.swapSections.bind(_assertThisInitialized(_this));
    _this.moveSectionUp = _this.moveSectionUp.bind(_assertThisInitialized(_this));
    _this.moveSectionDown = _this.moveSectionDown.bind(_assertThisInitialized(_this));
    _this.getTranslation = context.d2.i18n.getTranslation.bind(context.d2.i18n);
    return _this;
  }

  _createClass(EditDataSetSections, [{
    key: "handleAddSectionClick",
    value: function handleAddSectionClick() {
      var newSection = this.context.d2.models.sections.create();
      this.setState(function (state) {
        return {
          editSectionModel: Object.assign(newSection, {
            dataSet: {
              id: modelToEditStore.state.id
            },
            sortOrder: state.sections.reduce(function (p, s) {
              return Math.max(s.sortOrder, p);
            }, 0) + 1
          })
        };
      });
    }
  }, {
    key: "handleEditSectionClick",
    value: function handleEditSectionClick(editSectionModel) {
      this.setState({
        editSectionModel: editSectionModel
      });
    }
  }, {
    key: "handleSectionSaved",
    value: function handleSectionSaved(savedSection) {
      var _this2 = this;

      this.setState(function (state) {
        var replaced = false;
        var sections = state.sections.map(function (s) {
          if (s.id === savedSection.id) {
            replaced = true;
            return savedSection;
          }

          return s;
        }).sort(function (a, b) {
          return a.sortOrder - b.sortOrder;
        });

        if (!replaced) {
          sections.push(savedSection);
        }

        modelToEditStore.setState(Object.assign(modelToEditStore.state, {
          sections: sections
        }));
        return {
          editSectionModel: false,
          greyFieldSectionModel: false,
          sections: sections
        };
      }, function () {
        _this2.forceUpdate();
      });
    }
  }, {
    key: "handleDeleteSectionClick",
    value: function handleDeleteSectionClick(section) {
      var _this3 = this;

      snackActions.show({
        message: "".concat(this.getTranslation('confirm_delete_section'), " ").concat(section.displayName),
        action: 'confirm',
        onActionTouchTap: function onActionTouchTap() {
          section["delete"]().then(function () {
            var newSections = modelToEditStore.state.sections;
            modelToEditStore.setState(Object.assign(modelToEditStore.state, {
              sections: (Array.isArray(newSections) ? newSections : newSections.toArray()).filter(function (s) {
                return s.id !== section.id;
              })
            }));
            snackActions.show({
              message: _this3.getTranslation('section_deleted')
            });

            _this3.setState(function (state) {
              return {
                sections: state.sections.filter(function (s) {
                  return s.id !== section.id;
                })
              };
            });
          })["catch"](function (err) {
            snackActions.show({
              message: _this3.getTranslation('failed_to_delete_section'),
              action: 'ok'
            });
            log.warn('Failed to delete section', err);
          });
        }
      });
    }
  }, {
    key: "handleTranslateSectionClick",
    value: function handleTranslateSectionClick(section) {
      this.setState({
        translationModel: section
      });
    }
  }, {
    key: "handleSectionGreyFieldsClick",
    value: function handleSectionGreyFieldsClick(section) {
      this.setState({
        greyFieldSectionModel: section
      });
    }
  }, {
    key: "swapSections",
    value: function swapSections(sectionA, sectionB) {
      var _this4 = this;

      this.setState(function (state) {
        var swapOrder = sectionA.sortOrder;
        sectionA.sortOrder = sectionB.sortOrder; // eslint-disable-line

        sectionB.sortOrder = swapOrder; // eslint-disable-line

        Promise.all([sectionA.save(), sectionB.save()]).then(function () {
          snackActions.show({
            message: _this4.getTranslation('section_moved')
          });
        })["catch"](function (err) {
          log.warn('Failed to swap sections:', err);
          snackActions.show({
            message: _this4.getTranslation('failed_to_move_section'),
            action: 'ok'
          });
        });
        return {
          sections: state.sections.sort(function (a, b) {
            return a.sortOrder - b.sortOrder;
          })
        };
      });
    }
  }, {
    key: "moveSectionUp",
    value: function moveSectionUp(section) {
      var currentIndex = this.state.sections.indexOf(section);

      if (currentIndex > 0) {
        var swapSection = this.state.sections[currentIndex - 1];
        this.swapSections(swapSection, section);
      }
    }
  }, {
    key: "moveSectionDown",
    value: function moveSectionDown(section) {
      var currentIndex = this.state.sections.indexOf(section);

      if (currentIndex < this.state.sections.length - 1) {
        var swapSection = this.state.sections[currentIndex + 1];
        this.swapSections(swapSection, section);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;

      var contextActions = {
        edit: this.handleEditSectionClick,
        "delete": this.handleDeleteSectionClick,
        translate: this.handleTranslateSectionClick,
        manage_grey_fields: this.handleSectionGreyFieldsClick,
        move_up: this.moveSectionUp,
        move_down: this.moveSectionDown
      };
      var contextMenuIcons = {
        edit: 'edit',
        move_up: 'arrow_upward',
        move_down: 'arrow_downward',
        manage_grey_fields: 'do_not_disturb'
      };

      var contextActionChecker = function contextActionChecker(model, action) {
        if (action === 'move_up') {
          return _this5.state.sections.indexOf(model) > 0;
        } else if (action === 'move_down') {
          return _this5.state.sections.indexOf(model) < _this5.state.sections.length - 1;
        }

        return true;
      };

      return this.state.sections === undefined ? /*#__PURE__*/react.createElement(LoadingMask, null) : /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement(FormHeading, {
        schema: "dataSet",
        groupName: "dataSetSection"
      }, 'section_management'), /*#__PURE__*/react.createElement(FormSubHeading, null, modelToEditStore.state.displayName), /*#__PURE__*/react.createElement(DataTable, {
        columns: ['name'],
        rows: this.state.sections,
        contextMenuActions: contextActions,
        contextMenuIcons: contextMenuIcons,
        primaryAction: contextActions.edit,
        isContextActionAllowed: contextActionChecker
      }), /*#__PURE__*/react.createElement(SectionDialog, {
        open: !!this.state.editSectionModel,
        sectionModel: this.state.editSectionModel,
        categoryCombos: this.state.categoryCombos,
        onRequestClose: function onRequestClose() {
          _this5.setState({
            editSectionModel: false
          });
        },
        onSaveSection: this.handleSectionSaved
      }), /*#__PURE__*/react.createElement(GreyFieldDialog, {
        open: !!this.state.greyFieldSectionModel,
        sectionModel: this.state.greyFieldSectionModel,
        onRequestClose: function onRequestClose() {
          _this5.setState({
            greyFieldSectionModel: false
          });
        },
        onRequestSave: this.handleSectionSaved
      }), this.state.translationModel ? /*#__PURE__*/react.createElement(TranslationDialog, {
        objectToTranslate: this.state.translationModel,
        objectTypeToTranslate: this.state.translationModel && this.state.translationModel.modelDefinition,
        open: !!this.state.translationModel,
        onTranslationSaved: this.handleTranslationSaved,
        onTranslationError: this.handleTranslationErrored,
        onRequestClose: function onRequestClose() {
          _this5.setState({
            translationModel: null
          });
        },
        fieldsToTranslate: ['name']
      }) : null, /*#__PURE__*/react.createElement("div", {
        style: styles.fab
      }, /*#__PURE__*/react.createElement(_default$6, {
        onClick: this.handleAddSectionClick
      }, /*#__PURE__*/react.createElement(_default$7, {
        className: "material-icons"
      }, "add"))));
    }
  }]);

  return EditDataSetSections;
}(react.Component);

EditDataSetSections.propTypes = {
  params: PropTypes.any.isRequired
};
EditDataSetSections.contextTypes = {
  d2: PropTypes.any.isRequired
};

export { EditDataSetSections as default };
