import { k as _inherits, l as _createSuper, m as _classCallCheck, j as _slicedToArray, B as _assertThisInitialized, bV as Action, em as Rx, n as _createClass, p as log, ad as snackActions, h as goToRoute, c7 as modelToEditStore, r as react, a5 as _default, cI as _default$1, H as Heading, F as _default$2, bU as _default$3, bT as _default$4, ag as _default$5, af as _default$6 } from './index-44839b1a.js';
import { L as LoadingMask } from './LoadingMask.component-7e1e1a02.js';

var inputPattern = /<input.*?\/>/gi;
var dataElementCategoryOptionIdPattern = /id="(\w*?)-(\w*?)-val"/;
var dataElementPattern = /dataelementid="(\w{11})"/;
var indicatorPattern = /indicatorid="(\w{11})"/;

function clampPaletteWidth(width) {
  return Math.min(750, Math.max(width, 250));
} // TODO?: Automatic labels <span label-id="{id}-{id}"></span> / <span label-id="{id}"></span>


var styles = {
  heading: {
    paddingBottom: 18
  },
  formContainer: {},
  formPaper: {
    width: '100%',
    margin: '0 auto 2rem',
    padding: '1px 4rem 4rem',
    position: 'relative'
  },
  formSection: {
    marginTop: 28
  },
  cancelButton: {
    marginLeft: '2rem'
  },
  deleteButton: {
    marginLeft: '2rem'
  },
  paletteHeader: {},
  paletteFilter: {
    position: 'absolute',
    top: -16,
    width: '100%',
    padding: '8px 8px 16px'
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
    _this.state = {
      usedIds: [],
      filter: '',
      paletteWidth: clampPaletteWidth(window.innerWidth / 3),
      expand: 'data_elements',
      insertGrey: false
    }; // Load form data, operands, indicators and flags

    Promise.all([context.d2.models.dataSets.get(props.params.modelId, {
      fields: 'id,displayName,dataEntryForm[id,style,htmlCode],indicators[id,displayName]'
    }), // TODO: Use d2.models when dataElementOperands are properly supported
    context.d2.Api.getApi().get('dataElementOperands', {
      paging: false,
      totals: true,
      fields: 'id,dimensionItem,displayName',
      dataSet: props.params.modelId
    }), context.d2.Api.getApi().get('system/flags')]).then(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 3),
          dataSet = _ref2[0],
          ops = _ref2[1],
          flags = _ref2[2];

      // Operands with ID's that contain a dot ('.') are combined dataElementId's and categoryOptionId's
      // The API returns "dataElementId.categoryOptionId", which are transformed to the format expected by
      // custom forms: "dataElementId-categoryOptionId-val"
      _this.operands = ops.dataElementOperands.filter(function (op) {
        return op.dimensionItem.indexOf('.') !== -1;
      }).reduce(function (out, op) {
        var id = "".concat(op.dimensionItem.split('.').join('-'), "-val");
        out[id] = op.displayName; // eslint-disable-line

        return out;
      }, {}); // Data element totals have only a single ID and thus no dot ('.')

      _this.totals = ops.dataElementOperands.filter(function (op) {
        return op.dimensionItem.indexOf('.') === -1;
      }).reduce(function (out, op) {
        out[op.id] = op.displayName; // eslint-disable-line

        return out;
      }, {});
      _this.indicators = dataSet.indicators.toArray().sort(function (a, b) {
        return a.displayName.localeCompare(b.displayName);
      }).reduce(function (out, i) {
        out[i.id] = i.displayName; // eslint-disable-line

        return out;
      }, {});
      _this.flags = flags.reduce(function (out, flag) {
        out[flag.path] = flag.name; // eslint-disable-line

        return out;
      }, {}); // Create inserter functions for all insertable elements
      // This avoids having to bind the functions during rendering

      _this.insertFn = {};
      Object.keys(_this.operands).forEach(function (x) {
        _this.insertFn[x] = _this.insertElement.bind(_assertThisInitialized(_this), x);
      });
      Object.keys(_this.totals).forEach(function (x) {
        _this.insertFn[x] = _this.insertElement.bind(_assertThisInitialized(_this), x);
      });
      Object.keys(_this.indicators).forEach(function (x) {
        _this.insertFn[x] = _this.insertElement.bind(_assertThisInitialized(_this), x);
      });
      Object.keys(_this.flags).forEach(function (flag) {
        _this.insertFn[flag] = _this.insertFlag.bind(_assertThisInitialized(_this), flag);
      }); // Create element filtering action

      _this.filterAction = Action.create('filter');

      _this.filterAction.map(function (_ref3) {
        var data = _ref3.data,
            complete = _ref3.complete,
            error = _ref3.error;
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
      });

      var formHtml = dataSet.dataEntryForm ? _this.processFormData(dataSet.dataEntryForm) : '';

      _this.setState({
        formTitle: dataSet.displayName,
        formHtml: formHtml,
        formStyle: dataSet.dataEntryForm && dataSet.dataEntryForm.style || 'NORMAL'
      }, function () {
        _this._editor = window.CKEDITOR.replace('designTextarea', {
          plugins: ['a11yhelp', 'basicstyles', 'bidi', 'blockquote', 'clipboard', 'colorbutton', 'colordialog', 'contextmenu', 'dialogadvtab', 'div', 'elementspath', 'enterkey', 'entities', 'filebrowser', 'find', 'floatingspace', 'font', 'format', 'horizontalrule', 'htmlwriter', 'image', 'indentlist', 'indentblock', 'justify', 'link', 'list', 'liststyle', 'magicline', 'maximize', 'forms', 'pastefromword', 'pastetext', 'preview', 'removeformat', 'resize', 'selectall', 'showblocks', 'showborders', 'sourcearea', 'specialchar', 'stylescombo', 'tab', 'table', 'tabletools', 'toolbar', 'undo', 'wsc', 'wysiwygarea'].join(','),
          removePlugins: 'scayt,wsc,about',
          allowedContent: true,
          extraPlugins: 'div',
          height: 500
        });

        _this._editor.setData(_this.state.formHtml);

        Rx.Observable.fromEventPattern(function (x) {
          _this._editor.on('change', x);
        }).debounceTime(250).subscribe(function () {
          _this.processFormData.call(_assertThisInitialized(_this), _this._editor.getData());
        });
      });
    });
    _this.getTranslation = _this.context.d2.i18n.getTranslation.bind(_this.context.d2.i18n);
    _this.handleSaveClick = _this.handleSaveClick.bind(_assertThisInitialized(_this));
    _this.handleCancelClick = _this.handleCancelClick.bind(_assertThisInitialized(_this));
    _this.handleDeleteClick = _this.handleDeleteClick.bind(_assertThisInitialized(_this));
    _this.handleStyleChange = _this.handleStyleChange.bind(_assertThisInitialized(_this));
    _this.startResize = _this.startResize.bind(_assertThisInitialized(_this));
    _this.doResize = _this.doResize.bind(_assertThisInitialized(_this));
    _this.endResize = _this.endResize.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(EditDataEntryForm, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this._editor) {
        this._editor.destroy();
      }
    }
  }, {
    key: "handleSaveClick",
    value: function handleSaveClick() {
      var _this2 = this;

      var payload = {
        style: this.state.formStyle,
        htmlCode: this._editor.getData()
      };
      this.context.d2.Api.getApi().post(['dataSets', this.props.params.modelId, 'form'].join('/'), payload).then(function () {
        log.info('Form saved successfully');
        snackActions.show({
          message: _this2.getTranslation('form_saved')
        });
        goToRoute('list/dataSetSection/dataSet');
      })["catch"](function (e) {
        log.warn('Failed to save form:', e);
        snackActions.show({
          message: "".concat(_this2.getTranslation('failed_to_save_form')).concat(e.message ? ": ".concat(e.message) : ''),
          action: _this2.context.d2.i18n.getTranslation('ok')
        });
      });
    }
  }, {
    key: "handleCancelClick",
    value: function handleCancelClick() {
      goToRoute('list/dataSetSection/dataSet');
    }
  }, {
    key: "handleDeleteClick",
    value: function handleDeleteClick() {
      var _this3 = this;

      snackActions.show({
        message: this.getTranslation('dataentryform_confirm_delete'),
        action: 'confirm',
        onActionTouchTap: function onActionTouchTap() {
          _this3.context.d2.Api.getApi()["delete"](['dataEntryForms', modelToEditStore.state.dataEntryForm.id].join('/')).then(function () {
            snackActions.show({
              message: _this3.getTranslation('form_deleted')
            });
            goToRoute('list/dataSetSection/dataSet');
          })["catch"](function (err) {
            log.error('Failed to delete form:', err);
            snackActions.show({
              message: _this3.getTranslation('failed_to_delete_form'),
              action: 'ok'
            });
          });
        }
      });
    }
  }, {
    key: "handleStyleChange",
    value: function handleStyleChange(e, i, value) {
      this.setState({
        formStyle: value
      });
    }
  }, {
    key: "startResize",
    value: function startResize(e) {
      this._startPos = e.clientX;
      this._startWidth = this.state.paletteWidth;
      window.addEventListener('mousemove', this.doResize);
      window.addEventListener('mouseup', this.endResize);
    }
  }, {
    key: "doResize",
    value: function doResize(e) {
      var _this4 = this;

      if (!e.buttons) {
        // If no buttons are pressed it probably simply means we missed a mouseUp event - so stop resizing
        this.endResize();
      }

      e.preventDefault();
      e.stopPropagation();
      var width = clampPaletteWidth(this._startWidth + (this._startPos - e.clientX));
      window.requestAnimationFrame(function () {
        _this4.setState({
          paletteWidth: width
        });
      });
    }
  }, {
    key: "endResize",
    value: function endResize() {
      window.removeEventListener('mousemove', this.doResize);
      window.removeEventListener('mouseup', this.endResize);
    }
  }, {
    key: "generateHtml",
    value: function generateHtml(id, styleAttr, disabledAttr) {
      var style = styleAttr ? " style=".concat(styleAttr) : '';
      var disabled = disabledAttr || this.state.insertGrey ? ' disabled="disabled"' : '';

      if (id.indexOf('-') !== -1) {
        var label = this.operands && this.operands[id];
        var attr = "name=\"entryfield\" title=\"".concat(label, "\" value=\"[ ").concat(label, " ]\"").concat(style).concat(disabled).trim();
        return "<input id=\"".concat(id, "\" ").concat(attr, "/>");
      } else if (this.totals.hasOwnProperty(id)) {
        var _label = this.totals[id];

        var _attr = "name=\"total\" readonly title=\"".concat(_label, "\" value=\"[ ").concat(_label, " ]\"").concat(style).concat(disabled).trim();

        return "<input dataelementid=\"".concat(id, "\" id=\"total").concat(id, "\" name=\"total\" ").concat(_attr, "/>");
      } else if (this.indicators.hasOwnProperty(id)) {
        var _label2 = this.indicators[id];

        var _attr2 = "name=\"indicator\" readonly title=\"".concat(_label2, "\" value=\"[ ").concat(_label2, " ]\"").concat(style).concat(disabled).trim();

        return "<input indicatorid=\"".concat(id, "\" id=\"indicator").concat(id, "\" ").concat(_attr2, "/>");
      }

      log.warn('Failed to generate HTML for ID:', id);
      return '';
    }
  }, {
    key: "processFormData",
    value: function processFormData(formData) {
      var inHtml = formData.hasOwnProperty('htmlCode') ? formData.htmlCode : formData || '';
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
        var idMatch = dataElementCategoryOptionIdPattern.exec(inputHtml);
        var dataElementTotalMatch = dataElementPattern.exec(inputHtml);
        var indicatorMatch = indicatorPattern.exec(inputHtml);

        if (idMatch) {
          var id = "".concat(idMatch[1], "-").concat(idMatch[2], "-val");
          usedIds.push(id);
          outHtml += this.generateHtml(id, inputStyle, inputDisabled);
        } else if (dataElementTotalMatch) {
          var _id = dataElementTotalMatch[1];
          usedIds.push(_id);
          outHtml += this.generateHtml(_id, inputStyle, inputDisabled);
        } else if (indicatorMatch) {
          var _id2 = indicatorMatch[1];
          usedIds.push(_id2);
          outHtml += this.generateHtml(_id2, inputStyle, inputDisabled);
        } else {
          outHtml += inputHtml;
        }

        inputElement = inputPattern.exec(inHtml);
      }

      outHtml += inHtml.substr(inPos);
      this.setState({
        usedIds: usedIds
      });
      return outHtml;
    }
  }, {
    key: "insertElement",
    value: function insertElement(id) {
      if (this.state.usedIds.indexOf(id) !== -1) {
        return;
      }

      this._editor.insertHtml(this.generateHtml(id), 'unfiltered_html');

      this.setState(function (state) {
        return {
          usedIds: state.usedIds.concat(id)
        };
      }); // Move the current selection to just after the newly inserted element

      var range = this._editor.getSelection().getRanges()[0];

      range.moveToElementEditablePosition(range.endContainer, true);
    }
  }, {
    key: "insertFlag",
    value: function insertFlag(img) {
      this._editor.insertHtml("<img src=\"../dhis-web-commons/flags/".concat(img, "\" />"), 'unfiltered_html');

      var range = this._editor.getSelection().getRanges()[0];

      range.moveToElementEditablePosition(range.endContainer, true);
    }
  }, {
    key: "renderPaletteSection",
    value: function renderPaletteSection(keySet, label) {
      var _this5 = this;

      var filteredItems = Object.keys(keySet).filter(function (key) {
        return !_this5.state.filter.length || _this5.state.filter.every(function (filter) {
          return keySet[key].toLowerCase().indexOf(filter.toLowerCase()) !== -1;
        });
      });
      var cellClass = label === this.state.expand ? 'cell expanded' : 'cell';

      var expandClick = function expandClick() {
        _this5.setState({
          expand: label
        });
      };

      return /*#__PURE__*/react.createElement("div", {
        className: cellClass
      }, /*#__PURE__*/react.createElement("div", {
        style: styles.paletteHeader,
        className: "header",
        onClick: expandClick
      }, /*#__PURE__*/react.createElement("div", {
        className: "arrow"
      }, "\u25B8"), this.getTranslation(label), ":", /*#__PURE__*/react.createElement("div", {
        className: "count"
      }, filteredItems.length)), /*#__PURE__*/react.createElement("div", {
        className: "items"
      }, filteredItems.sort(function (a, b) {
        return keySet[a] ? keySet[a].localeCompare(keySet[b]) : a.localeCompare(b);
      }).map(function (key) {
        // Active items are items that are not already added to the form
        var isActive = _this5.state.usedIds.indexOf(key) === -1;
        var className = isActive ? 'item active' : 'item inactive';
        var name = keySet[key].name || keySet[key];
        return /*#__PURE__*/react.createElement("div", {
          key: key,
          className: className,
          title: name
        }, /*#__PURE__*/react.createElement("a", {
          onClick: _this5.insertFn[key]
        }, name));
      })));
    }
  }, {
    key: "renderPalette",
    value: function renderPalette() {
      var _this6 = this;

      var toggleGrey = function toggleGrey(e, value) {
        _this6.setState({
          insertGrey: value
        });
      };

      return /*#__PURE__*/react.createElement("div", {
        className: "paletteContainer",
        style: {
          width: this.state.paletteWidth
        }
      }, /*#__PURE__*/react.createElement("div", {
        className: "resizeHandle",
        onMouseDown: this.startResize
      }), /*#__PURE__*/react.createElement("div", {
        className: "palette"
      }, /*#__PURE__*/react.createElement("div", {
        style: styles.paletteFilter
      }, /*#__PURE__*/react.createElement(_default, {
        floatingLabelText: this.getTranslation('filter_elements'),
        style: styles.paletteFilterField,
        onChange: this.filterAction
      })), /*#__PURE__*/react.createElement("div", {
        className: "elements"
      }, this.renderPaletteSection(this.operands, 'data_elements'), this.renderPaletteSection(this.totals, 'totals'), this.renderPaletteSection(this.indicators, 'indicators'), this.renderPaletteSection(this.flags, 'flags')), /*#__PURE__*/react.createElement(_default$1, {
        label: this.getTranslation('insert_grey_fields'),
        labelPosition: "right",
        style: styles.greySwitch,
        onCheck: toggleGrey,
        checked: this.state.insertGrey
      })));
    }
  }, {
    key: "render",
    value: function render() {
      return this.state.formHtml === undefined ? /*#__PURE__*/react.createElement(LoadingMask, null) : /*#__PURE__*/react.createElement("div", {
        style: Object.assign({}, styles.formContainer, {
          marginRight: this.state.paletteWidth
        })
      }, /*#__PURE__*/react.createElement(Heading, {
        style: styles.heading
      }, this.state.formTitle, " ", this.getTranslation('data_entry_form')), this.renderPalette(), /*#__PURE__*/react.createElement("textarea", {
        id: "designTextarea",
        name: "designTextarea"
      }), /*#__PURE__*/react.createElement(_default$2, {
        style: styles.formPaper
      }, /*#__PURE__*/react.createElement("div", {
        style: styles.formSection
      }, /*#__PURE__*/react.createElement(_default$3, {
        value: this.state.formStyle,
        floatingLabelText: "Form display style",
        onChange: this.handleStyleChange
      }, /*#__PURE__*/react.createElement(_default$4, {
        value: 'NORMAL',
        primaryText: this.getTranslation('normal')
      }), /*#__PURE__*/react.createElement(_default$4, {
        value: 'COMFORTABLE',
        primaryText: this.getTranslation('comfortable')
      }), /*#__PURE__*/react.createElement(_default$4, {
        value: 'COMPACT',
        primaryText: this.getTranslation('compact')
      }), /*#__PURE__*/react.createElement(_default$4, {
        value: 'NONE',
        primaryText: this.getTranslation('none')
      }))), /*#__PURE__*/react.createElement("div", {
        style: styles.formSection
      }, /*#__PURE__*/react.createElement(_default$5, {
        label: this.getTranslation('save'),
        primary: true,
        onClick: this.handleSaveClick
      }), /*#__PURE__*/react.createElement(_default$6, {
        label: this.getTranslation('cancel'),
        style: styles.cancelButton,
        onClick: this.handleCancelClick
      }), modelToEditStore.state.dataEntryForm && modelToEditStore.state.dataEntryForm.id ? /*#__PURE__*/react.createElement(_default$6, {
        primary: true,
        label: this.getTranslation('delete'),
        style: styles.deleteButton,
        onClick: this.handleDeleteClick
      }) : undefined)));
    }
  }]);

  return EditDataEntryForm;
}(react.Component);

EditDataEntryForm.propTypes = {
  params: react.PropTypes.object
};
EditDataEntryForm.contextTypes = {
  d2: react.PropTypes.any
};

export { EditDataEntryForm as default };
