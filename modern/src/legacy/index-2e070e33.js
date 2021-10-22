import { k as _inherits, l as _createSuper, m as _classCallCheck, A as _defineProperty, B as _assertThisInitialized, er as _typeof, r as react, n as _createClass, a9 as _default, es as _default$1, au as _default$2, av as _default$3, ar as _default$4, el as LoadingMask, F as _default$5, P as PropTypes, f as _asyncToGenerator, ad as snackActions, h as goToRoute } from './index-44839b1a.js';
import { F as FormHeading } from './FormHeading-92e31a13.js';
import './HelpLink.component-39e74935.js';

var backToList = function backToList() {
  goToRoute('list/otherSection/sqlView');
};

var styles = {
  menuItem: {
    paddingLeft: '1.5rem',
    paddingRight: '1.5rem'
  }
};

var SqlView = /*#__PURE__*/function (_Component) {
  _inherits(SqlView, _Component);

  var _super = _createSuper(SqlView);

  function SqlView(props, context) {
    var _this;

    _classCallCheck(this, SqlView);

    _this = _super.call(this, props, context);

    _defineProperty(_assertThisInitialized(_this), "openDownloadMenu", function (event) {
      _this.setState({
        downloadMenuOpen: true,
        downloadMenuAnchor: event.currentTarget
      });
    });

    _defineProperty(_assertThisInitialized(_this), "closeDownloadMenu", function () {
      _this.setState({
        downloadMenuOpen: false
      });
    });

    _defineProperty(_assertThisInitialized(_this), "renderCell", function (cell, index) {
      var isObject = _typeof(cell) === 'object' && cell != null;
      var formattedValue = isObject ? JSON.stringify(cell, null, 2) : cell;
      return /*#__PURE__*/react.createElement("td", {
        key: "cell".concat(index)
      }, formattedValue);
    });

    _defineProperty(_assertThisInitialized(_this), "renderRow", function (row, index) {
      return /*#__PURE__*/react.createElement("tr", {
        key: "row".concat(index)
      }, row.map(_this.renderCell));
    });

    _this.state = {
      listGrid: null,
      downloadMenuOpen: false,
      downloadMenuAnchor: null
    };
    return _this;
  }

  _createClass(SqlView, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.getSqlView();
    }
  }, {
    key: "getSqlView",
    value: function () {
      var _getSqlView = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var d2, modelId, url, queryParams, _yield$d2$Api$getApi$, listGrid;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                d2 = this.context.d2;
                modelId = this.props.params.modelId;
                url = "sqlViews/".concat(modelId, "/data");
                queryParams = {
                  paging: false
                };
                _context.prev = 4;
                _context.next = 7;
                return d2.Api.getApi().get(url, queryParams);

              case 7:
                _yield$d2$Api$getApi$ = _context.sent;
                listGrid = _yield$d2$Api$getApi$.listGrid;
                this.setState({
                  listGrid: listGrid
                });
                _context.next = 17;
                break;

              case 12:
                _context.prev = 12;
                _context.t0 = _context["catch"](4);
                console.error(_context.t0);
                backToList();
                snackActions.show({
                  message: d2.i18n.getTranslation('sql_query_error'),
                  action: 'ok'
                });

              case 17:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[4, 12]]);
      }));

      function getSqlView() {
        return _getSqlView.apply(this, arguments);
      }

      return getSqlView;
    }()
  }, {
    key: "openFileLink",
    value: function openFileLink(file) {
      var modelId = this.props.params.modelId;
      this.closeDownloadMenu();
      window.open("../api/sqlViews/".concat(modelId, "/").concat(file), '_blank');
    }
  }, {
    key: "renderHeader",
    value: function renderHeader() {
      var title = this.state.listGrid.title;
      var d2 = this.context.d2;
      var headerText = "".concat(d2.i18n.getTranslation('view_data_for'), " \"").concat(title, "\"");
      return /*#__PURE__*/react.createElement("div", {
        className: "sql-view__header"
      }, /*#__PURE__*/react.createElement(FormHeading, {
        level: 1,
        groupName: "otherSection",
        schema: "sqlView",
        skipTranslation: true
      }, headerText), this.renderDropDownButton());
    }
  }, {
    key: "renderDropDownButton",
    value: function renderDropDownButton() {
      var d2 = this.context.d2;
      return /*#__PURE__*/react.createElement("div", {
        className: "sql-view__dropdown-button"
      }, /*#__PURE__*/react.createElement(_default, {
        onClick: this.openDownloadMenu,
        className: "sql-view__download-btn",
        labelPosition: "before",
        primary: true,
        icon: /*#__PURE__*/react.createElement(_default$1, null),
        label: d2.i18n.getTranslation('download_as')
      }), /*#__PURE__*/react.createElement(_default$2, {
        open: this.state.downloadMenuOpen,
        anchorEl: this.state.downloadMenuAnchor,
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'bottom'
        },
        targetOrigin: {
          horizontal: 'right',
          vertical: 'top'
        },
        onRequestClose: this.closeDownloadMenu
      }, /*#__PURE__*/react.createElement(_default$3, null, this.renderDropDownMenuItems())));
    }
  }, {
    key: "renderDropDownMenuItems",
    value: function renderDropDownMenuItems() {
      var _this2 = this;

      var d2 = this.context.d2;
      return [{
        label: 'excel',
        file: 'data.xls'
      }, {
        label: 'csv',
        file: 'data.csv'
      }, {
        label: 'pdf',
        file: 'data.pdf'
      }, {
        label: 'html',
        file: 'data.html+css'
      }, {
        label: 'xml',
        file: 'data.xml'
      }, {
        label: 'json',
        file: 'data.json'
      }].map(function (_ref) {
        var label = _ref.label,
            file = _ref.file;
        return /*#__PURE__*/react.createElement(_default$4, {
          key: label,
          style: styles.menuItem,
          primaryText: d2.i18n.getTranslation(label),
          onClick: function onClick() {
            return _this2.openFileLink(file);
          } // eslint-disable-line react/jsx-no-bind

        });
      });
    }
    /* eslint-disable react/no-array-index-key */

  }, {
    key: "renderTable",
    value:
    /* eslint-enable react/no-array-index-key */
    function renderTable() {
      var _this$state$listGrid = this.state.listGrid,
          headers = _this$state$listGrid.headers,
          rows = _this$state$listGrid.rows;
      return /*#__PURE__*/react.createElement("table", {
        className: "sql-view__table"
      }, /*#__PURE__*/react.createElement("thead", null, /*#__PURE__*/react.createElement("tr", null, headers.map(function (_ref2) {
        var name = _ref2.name;
        return /*#__PURE__*/react.createElement("th", {
          key: name
        }, name);
      }))), /*#__PURE__*/react.createElement("tbody", null, rows.map(this.renderRow)));
    }
  }, {
    key: "render",
    value: function render() {
      if (!this.state.listGrid) {
        return /*#__PURE__*/react.createElement(LoadingMask, null);
      }

      return /*#__PURE__*/react.createElement("div", null, this.renderHeader(), /*#__PURE__*/react.createElement(_default$5, {
        className: "sql-view__content"
      }, this.renderTable()));
    }
  }]);

  return SqlView;
}(react.Component);

SqlView.propTypes = {
  params: PropTypes.shape({
    modelId: PropTypes.string
  }).isRequired
};
SqlView.contextTypes = {
  d2: PropTypes.object
};
var SqlView$1 = SqlView;

export { SqlView$1 as default };
