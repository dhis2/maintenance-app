import { r as react, T as Translate, _ as _default, a as _default$1, b as _default$2, c as _default$3, d as _default$4, e as appState, O as Observable, f as _asyncToGenerator, g as _default$5, h as goToRoute, i as getInstance } from './index-44839b1a.js';

var MenuCards = react.createClass({
  displayName: "MenuCards.component",
  propTypes: {
    menuItems: react.PropTypes.arrayOf(react.PropTypes.shape({
      name: react.PropTypes.string,
      description: react.PropTypes.string
    }))
  },
  mixins: [Translate],
  getDefaultProps: function getDefaultProps() {
    return {
      menuItems: []
    };
  },
  renderCard: function renderCard(details, index) {
    var cardStyle = {
      padding: '0',
      margin: '.5rem',
      "float": 'left',
      width: '230px'
    };
    var headerStyle = {
      padding: '1rem',
      height: 'auto',
      borderBottom: '1px solid #ddd',
      cursor: 'pointer'
    };
    var textStyle = {
      height: '85px',
      padding: '.5rem 1rem'
    };
    var actionStyle = {
      textAlign: 'right'
    };
    var styles = {
      cardHeaderText: {
        paddingRight: 0
      }
    };
    var actionButtons = [];

    if (details.canCreate) {
      actionButtons.push( /*#__PURE__*/react.createElement(_default, {
        key: "add",
        iconClassName: "material-icons",
        tooltip: this.getTranslation('add'),
        tooltipPosition: "top-center",
        onClick: details.add
      }, "\uE145"));
    }

    actionButtons.push( /*#__PURE__*/react.createElement(_default, {
      key: "list",
      iconClassName: "material-icons",
      tooltip: this.getTranslation('list'),
      tooltipPosition: "top-center",
      onClick: details.list
    }, "\uE8EF"));
    return /*#__PURE__*/react.createElement(_default$1, {
      key: index,
      style: cardStyle
    }, /*#__PURE__*/react.createElement(_default$2, {
      onClick: details.list,
      style: headerStyle,
      title: details.name,
      textStyle: styles.cardHeaderText
    }), /*#__PURE__*/react.createElement(_default$3, {
      style: textStyle
    }, details.description), /*#__PURE__*/react.createElement(_default$4, {
      style: actionStyle
    }, actionButtons));
  },
  render: function render() {
    return /*#__PURE__*/react.createElement("div", null, this.props.menuItems.map(this.renderCard), /*#__PURE__*/react.createElement("div", {
      style: {
        clear: 'both'
      }
    }));
  }
});

function createCardsFromMetaDataSections(_x) {
  return _createCardsFromMetaDataSections.apply(this, arguments);
}

function _createCardsFromMetaDataSections() {
  _createCardsFromMetaDataSections = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(metaDataSections) {
    var d2;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return getInstance();

          case 2:
            d2 = _context.sent;
            return _context.abrupt("return", metaDataSections.map(function (metaDataSection) {
              return {
                key: metaDataSection.name,
                name: d2.i18n.getTranslation(_default$5(metaDataSection.name)),
                items: metaDataSection.items.map(function (_ref) {
                  var key = _ref.key,
                      label = _ref.label;
                  return {
                    name: label,
                    description: d2.i18n.getTranslation("intro_".concat(_default$5(key))),
                    canCreate: d2.currentUser.canCreate(d2.models[key]),
                    add: function add() {
                      return goToRoute("/edit/".concat(metaDataSection.name, "/").concat(key, "/add"));
                    },
                    list: function list() {
                      return goToRoute("/list/".concat(metaDataSection.name, "/").concat(key));
                    }
                  };
                })
              };
            }));

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _createCardsFromMetaDataSections.apply(this, arguments);
}

var menuCardsStore = appState.map(function (appState) {
  var cardState = appState.sideBar.mainSections.map(function (v) {
    return v.key;
  }).reduce(function (cardState, mainSectionName) {
    return cardState.concat([{
      name: mainSectionName,
      items: appState.sideBar[mainSectionName] || []
    }]);
  }, []);
  return cardState;
}).take(1).map(function (metaDataSections) {
  return Observable.fromPromise(createCardsFromMetaDataSections(metaDataSections));
}).concatAll();

export { MenuCards as M, menuCardsStore as m };
