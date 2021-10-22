import { k as _inherits, l as _createSuper, m as _classCallCheck, n as _createClass, e as appState, o as listStore, j as _slicedToArray, p as log, q as _objectWithoutProperties, r as react, s as _extends, f as _asyncToGenerator, t as listActions, u as getQueryForSchema, M as ModelCollection, i as getInstance } from './index-44839b1a.js';
import { L as List } from './List.component-3129d511.js';
import './pagination-df227617.js';
import './TranslationDialog.component-38658f53.js';
import './Auth-bde7a9a8.js';
import './add-6f307f86.js';
import './HelpLink.component-39e74935.js';

var _excluded = ["params"];
/**
 * Create a monkey-patch to handle paging with prepended-orgunit
 * @param pager the orginial Pager-instance of the list to monkey-patch
 * @return the monkey-patched goToPage function that will add the selectedOrganisation unit
 * to the result of the paged-list
 */

var createGoToPagerForOrgunit = function createGoToPagerForOrgunit(pager, selectedOrganisationUnit, d2) {
  var monkeyPage = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(pageNr) {
      var orgList;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return pager.goToPage(pageNr);

            case 2:
              orgList = _context.sent;
              return _context.abrupt("return", createPrependedOrgUnitList(selectedOrganisationUnit, orgList, d2));

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function monkeyPage(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  return monkeyPage;
};
/**
 * Returns a ModelCollection with given organisationUnitList prepended by
 * selectedOrganisationUnit.
 */


var createPrependedOrgUnitList = function createPrependedOrgUnitList(selectedOrganisationUnit, organisationUnitList, d2) {
  var filteredOrgUnits = organisationUnitList.toArray();
  filteredOrgUnits.unshift(selectedOrganisationUnit);
  var prependedOrgUnitList = ModelCollection.create(d2.models.organisationUnit, filteredOrgUnits, organisationUnitList.pager);
  prependedOrgUnitList.pager.goToPage = createGoToPagerForOrgunit(organisationUnitList.pager, selectedOrganisationUnit, d2);
  return prependedOrgUnitList;
};

var OrganisationUnitList = /*#__PURE__*/function (_React$Component) {
  _inherits(OrganisationUnitList, _React$Component);

  var _super = _createSuper(OrganisationUnitList);

  function OrganisationUnitList() {
    _classCallCheck(this, OrganisationUnitList);

    return _super.apply(this, arguments);
  }

  _createClass(OrganisationUnitList, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.subscription = appState // Only do this is we're actually about to show organisation units
      .filter(function (appState) {
        return appState.sideBar.currentSubSection === 'organisationUnit';
      }).combineLatest(listStore.startWith({})).map(function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2),
            _ref3$ = _ref3[0],
            selectedOrganisationUnit = _ref3$.selectedOrganisationUnit,
            userOrganisationUnits = _ref3$.userOrganisationUnits,
            reload = _ref3[1];

        return [{
          selectedOrganisationUnit: selectedOrganisationUnit,
          userOrganisationUnitIds: userOrganisationUnits.toArray().map(function (model) {
            return model.id;
          })
        }, reload];
      }).filter(function (_ref4) {
        var _ref5 = _slicedToArray(_ref4, 1),
            state = _ref5[0];

        return state.selectedOrganisationUnit;
      }) // if list is null, we reload the list. distinctUntilChanged returns false and therefore emits
      .distinctUntilChanged(function (_ref6, _ref7) {
        var _ref8 = _slicedToArray(_ref6, 2),
            prevState = _ref8[0];
            _ref8[1];

        var _ref9 = _slicedToArray(_ref7, 2),
            state = _ref9[0],
            listState = _ref9[1];

        return prevState.selectedOrganisationUnit === state.selectedOrganisationUnit && listState.list !== null;
      }).subscribe( /*#__PURE__*/function () {
        var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref10) {
          var _ref12, _ref12$, selectedOrganisationUnit, d2, filteredOrganisationUnitList, fieldsForOrgUnit, _yield$Promise$all, _yield$Promise$all2, selectedOrgUnitWithFields, organisationUnitList, prependedOrgUnitList;

          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _ref12 = _slicedToArray(_ref10, 2), _ref12$ = _ref12[0], selectedOrganisationUnit = _ref12$.selectedOrganisationUnit;
                  _context2.next = 3;
                  return getInstance();

                case 3:
                  d2 = _context2.sent;

                  if (selectedOrganisationUnit.id) {
                    _context2.next = 6;
                    break;
                  }

                  return _context2.abrupt("return", listActions.setListSource(ModelCollection.create(d2.models.organisationUnit)));

                case 6:
                  filteredOrganisationUnitList = d2.models.organisationUnit.filter().on('name').notEqual('default').filter().on('parent.id').equals(selectedOrganisationUnit.id);
                  fieldsForOrgUnit = getQueryForSchema('organisationUnit').fields; // Load selectedOrganisationUnit again to get data for fields that may have been changed by configurable columns

                  _context2.next = 10;
                  return Promise.all([d2.models.organisationUnit.get(selectedOrganisationUnit.id, {
                    field: fieldsForOrgUnit
                  }), filteredOrganisationUnitList.list({
                    fields: fieldsForOrgUnit
                  })]);

                case 10:
                  _yield$Promise$all = _context2.sent;
                  _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 2);
                  selectedOrgUnitWithFields = _yield$Promise$all2[0];
                  organisationUnitList = _yield$Promise$all2[1];
                  // DHIS2-2160 Add the selected node to the list to
                  // avoid having to select the parent node to edit
                  // the selected node...
                  prependedOrgUnitList = createPrependedOrgUnitList(selectedOrgUnitWithFields, organisationUnitList, d2);
                  listActions.setListSource(prependedOrgUnitList);

                case 16:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));

        return function (_x2) {
          return _ref11.apply(this, arguments);
        };
      }(), function (error) {
        return log.error(error);
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.subscription && this.subscription.unsubscribe && this.subscription.unsubscribe();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          params = _this$props.params,
          otherProps = _objectWithoutProperties(_this$props, _excluded);

      return /*#__PURE__*/react.createElement(List, _extends({}, otherProps, {
        params: Object.assign({
          modelType: 'organisationUnit'
        }, params)
      }));
    }
  }]);

  return OrganisationUnitList;
}(react.Component);

export { OrganisationUnitList as default };
