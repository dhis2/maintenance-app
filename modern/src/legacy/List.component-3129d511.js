import { v as createReactClass, C as ContextSubscriber, x as routerShape, y as invariant_1, r as react, z as hoistNonReactStatics_cjs, P as PropTypes, k as _inherits, l as _createSuper, m as _classCallCheck, A as _defineProperty, B as _assertThisInitialized, g as _default$1, n as _createClass, D as classes, E as _default$2, O as Observable, F as _default$3, G as propTypes, I as transitions, J as classCallCheck, K as createClass, L as possibleConstructorReturn, N as inherits, Q as simpleAssign, R as getPrototypeOf, S as pure, U as SvgIcon, V as colors, W as keys, X as _typeof, Y as FloatingActionButton, Z as _extends$1, $ as _default$4, h as goToRoute, s as _extends$2, a0 as addD2Context, a1 as _default$5, a2 as Subject, p as log, T as Translate, a3 as currentSubSection$, a4 as _objectSpread2, a5 as _default$6, a6 as _default$7, a7 as predictorDialogStore, a8 as _default$8, a9 as _default$9, aa as _default$a, ab as _default$b, ac as _default$c, f as _asyncToGenerator, ad as snackActions, i as getInstance, ae as Store, j as _slicedToArray, af as _default$d, ag as _default$e, ah as _default$f, H as Heading, ai as GroupEditor, aj as _default$g, ak as _default$h, al as fp, am as _default$i, an as _default$j, ao as _default$k, ap as addValueRenderer, aq as Translate$1, ar as _default$l, as as _default$m, at as _default$n, au as _default$o, av as _default$p, aw as connect, ax as fieldOrder, t as listActions, ay as translationStore, az as sharingStore, aA as dataElementOperandStore, aB as getFilterFieldsForType, aC as Dropdown, aD as DropDownAsync, o as listStore, aE as _default$q, aF as detailsStore, aG as DOWNLOAD_OBJECT, aH as contextActions, aI as Pagination, aJ as DataTable, aK as DialogRouter, aL as openColumnsDialog, aM as openDialog } from './index-44839b1a.js';
import { c as calculatePageValue, S as SharingDialog } from './pagination-df227617.js';
import { T as TranslationDialog } from './TranslationDialog.component-38658f53.js';
import { w as withAuth } from './Auth-bde7a9a8.js';
import { a as add } from './add-6f307f86.js';
import { H as HelpLink } from './HelpLink.component-39e74935.js';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function withRouter(WrappedComponent, options) {
  var withRef = options && options.withRef;

  var WithRouter = createReactClass({
    displayName: 'WithRouter',

    mixins: [ContextSubscriber('router')],

    contextTypes: { router: routerShape },
    propTypes: { router: routerShape },

    getWrappedInstance: function getWrappedInstance() {
      !withRef ? invariant_1(false, 'To access the wrapped instance, you need to specify ' + '`{ withRef: true }` as the second argument of the withRouter() call.')  : void 0;

      return this.wrappedInstance;
    },
    render: function render() {
      var _this = this;

      var router = this.props.router || this.context.router;
      if (!router) {
        return react.createElement(WrappedComponent, this.props);
      }

      var params = router.params,
          location = router.location,
          routes = router.routes;

      var props = _extends({}, this.props, { router: router, params: params, location: location, routes: routes });

      if (withRef) {
        props.ref = function (c) {
          _this.wrappedInstance = c;
        };
      }

      return react.createElement(WrappedComponent, props);
    }
  });

  WithRouter.displayName = 'withRouter(' + getDisplayName(WrappedComponent) + ')';
  WithRouter.WrappedComponent = WrappedComponent;

  return hoistNonReactStatics_cjs(WithRouter, WrappedComponent);
}

var DetailsBox = /*#__PURE__*/function (_Component) {
  _inherits(DetailsBox, _Component);

  var _super = _createSuper(DetailsBox);

  function DetailsBox() {
    var _this;

    _classCallCheck(this, DetailsBox);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "getTranslation", function (key) {
      return _this.context.d2.i18n.getTranslation(key);
    });

    _defineProperty(_assertThisInitialized(_this), "getDetailBoxContent", function () {
      if (!_this.props.source) {
        return /*#__PURE__*/react.createElement("div", {
          className: "detail-box__status"
        }, "Loading details...");
      }

      return _this.props.fields.filter(function (fieldName) {
        return _this.props.source[fieldName];
      }).map(function (fieldName) {
        var valueToRender = _this.getValueToRender(fieldName, _this.props.source[fieldName]);

        return /*#__PURE__*/react.createElement("div", {
          key: fieldName,
          className: "detail-field"
        }, /*#__PURE__*/react.createElement("div", {
          className: "detail-field__label detail-field__".concat(fieldName, "-label")
        }, _this.getTranslation(_default$1(fieldName))), /*#__PURE__*/react.createElement("div", {
          className: "detail-field__value detail-field__".concat(fieldName)
        }, valueToRender));
      });
    });

    _defineProperty(_assertThisInitialized(_this), "getDateString", function (dateValue) {
      var stringifiedDate = new Date(dateValue).toString();
      return stringifiedDate === 'Invalid Date' ? dateValue : stringifiedDate;
    });

    _defineProperty(_assertThisInitialized(_this), "getNamesToDisplay", function (value) {
      var namesToDisplay = value.map(function (v) {
        return v.displayName ? v.displayName : v.name;
      }).filter(function (name) {
        return name;
      });
      return /*#__PURE__*/react.createElement("ul", null, namesToDisplay.map(function (name) {
        return /*#__PURE__*/react.createElement("li", {
          key: name
        }, name);
      }));
    });

    _defineProperty(_assertThisInitialized(_this), "getJsonApiResource", function (value) {
      return /*#__PURE__*/react.createElement("a", {
        style: {
          wordBreak: 'break-all'
        },
        href: "".concat(value, ".json"),
        rel: "noopener noreferrer",
        target: "_blank"
      }, value);
    });

    _defineProperty(_assertThisInitialized(_this), "getValueToRender", function (fieldName, value) {
      if (Array.isArray(value) && value.length) {
        return _this.getNamesToDisplay(value);
      }

      if (fieldName === 'created' || fieldName === 'lastUpdated') {
        return _this.getDateString(value);
      }

      if (fieldName === 'href') {
        return _this.getJsonApiResource(value);
      }

      return value;
    });

    return _this;
  }

  _createClass(DetailsBox, [{
    key: "render",
    value: function render() {
      var classList = classes('details-box');
      var closeIcon = /*#__PURE__*/react.createElement(_default$2, {
        className: "details-box__close-button material-icons",
        onClick: this.props.onClose
      }, "close");

      if (this.props.showDetailBox === false) {
        return null;
      }

      return /*#__PURE__*/react.createElement("div", {
        className: classList
      }, closeIcon, /*#__PURE__*/react.createElement("div", null, this.getDetailBoxContent()));
    }
  }]);

  return DetailsBox;
}(react.Component);

DetailsBox.propTypes = {
  fields: PropTypes.array,
  showDetailBox: PropTypes.bool,
  source: PropTypes.object,
  onClose: PropTypes.func
};
DetailsBox.defaultProps = {
  source: PropTypes.object,
  fields: ['name', 'locale', 'shortName', 'code', 'displayDescription', 'created', 'lastUpdated', 'id', 'href'],
  showDetailBox: false,
  onClose: function onClose() {}
};
DetailsBox.contextTypes = {
  d2: PropTypes.object.isRequired
};

var DetailsBoxWithScroll = /*#__PURE__*/function (_Component) {
  _inherits(DetailsBoxWithScroll, _Component);

  var _super = _createSuper(DetailsBoxWithScroll);

  function DetailsBoxWithScroll() {
    _classCallCheck(this, DetailsBoxWithScroll);

    return _super.apply(this, arguments);
  }

  _createClass(DetailsBoxWithScroll, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this = this;

      this.subscription = Observable.fromEvent(global, 'scroll').debounceTime(200).map(function () {
        return document.querySelector('body').scrollTop;
      }).subscribe(function () {
        return _this.forceUpdate();
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.subscription && this.subscription.unsubscribe();
    }
  }, {
    key: "render",
    value: function render() {
      var paperStyle = {
        maxWidth: 500,
        minWidth: 300,
        marginTop: document.querySelector('body').scrollTop
      };
      return /*#__PURE__*/react.createElement("div", {
        style: this.props.style
      }, /*#__PURE__*/react.createElement(_default$3, {
        zDepth: 1,
        rounded: false,
        style: paperStyle
      }, /*#__PURE__*/react.createElement(DetailsBox, {
        source: this.props.detailsObject,
        showDetailBox: !!this.props.detailsObject,
        onClose: this.props.onClose
      })));
    }
  }]);

  return DetailsBoxWithScroll;
}(react.Component);

DetailsBoxWithScroll.propTypes = {
  style: PropTypes.object,
  detailsObject: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired
};
DetailsBoxWithScroll.defaultProps = {
  style: {}
};

var dist = {};

var speedDial = {};

var bubbleListItem = {};

var bubbleListItem_propTypes = {};

Object.defineProperty(bubbleListItem_propTypes, "__esModule", {
	value: true
});

var _propTypes$4 = propTypes.exports;

bubbleListItem_propTypes.default = {
	alignment: _propTypes$4.PropTypes.string,
	className: _propTypes$4.PropTypes.string,
	direction: _propTypes$4.PropTypes.string,
	href: _propTypes$4.PropTypes.string,
	isInTransition: _propTypes$4.PropTypes.bool,
	isOpen: _propTypes$4.PropTypes.bool,
	leftAvatar: _propTypes$4.PropTypes.object,
	positionV: _propTypes$4.PropTypes.string,
	primaryText: _propTypes$4.PropTypes.string,
	rightAvatar: _propTypes$4.PropTypes.object,
	style: _propTypes$4.PropTypes.object,
	styleText: _propTypes$4.PropTypes.object,
	tabIndex: _propTypes$4.PropTypes.oneOfType([_propTypes$4.PropTypes.string, _propTypes$4.PropTypes.number]),
	onBlur: _propTypes$4.PropTypes.func,
	onClick: _propTypes$4.PropTypes.func,
	onFocus: _propTypes$4.PropTypes.func,
	onKeyboardFocus: _propTypes$4.PropTypes.func,
	onKeyDown: _propTypes$4.PropTypes.func,
	onKeyUp: _propTypes$4.PropTypes.func,
	onMouseDown: _propTypes$4.PropTypes.func,
	onMouseEnter: _propTypes$4.PropTypes.func,
	onMouseLeave: _propTypes$4.PropTypes.func,
	onMouseUp: _propTypes$4.PropTypes.func
};

var bubbleListItem_defaultProps = {};

Object.defineProperty(bubbleListItem_defaultProps, "__esModule", {
	value: true
});
bubbleListItem_defaultProps.default = {
	isOpen: false,
	isInTransition: false,
	positionV: 'bottom',
	tabIndex: 1,
	onBlur: function onBlur() {},
	onClick: function onClick() {},
	onFocus: function onFocus() {},
	onKeyDown: function onKeyDown() {},
	onKeyUp: function onKeyUp() {},
	onMouseDown: function onMouseDown() {},
	onMouseEnter: function onMouseEnter() {},
	onMouseLeave: function onMouseLeave() {},
	onMouseUp: function onMouseUp() {},
	onTouchEnd: function onTouchEnd() {},
	onTouchStart: function onTouchStart() {}
};

var bubbleListItem_styles = {};

Object.defineProperty(bubbleListItem_styles, "__esModule", {
	value: true
});

var _transitions$2 = transitions;

var _transitions2$2 = _interopRequireDefault$b(_transitions$2);

function _interopRequireDefault$b(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

bubbleListItem_styles.default = function (_ref) {
	var paper = _ref.paper,
	    baseTheme = _ref.baseTheme;

	return {
		root: {
			main: {
				backgroundColor: 'transparent',
				listStyle: 'none',
				cursor: 'pointer',
				transition: _transitions2$2.default.easeOut()
			},

			// prop direction
			direction: {
				down: {
					marginBottom: 14
				},
				up: {
					marginTop: 14
				},
				right: {
					textAlign: 'left',
					float: 'left',
					marginRight: 14
				},
				left: {
					textAlign: 'right',
					float: 'right',
					marginLeft: 14
				}
			},

			// prop alignment
			alignment: {
				right: {},
				left: {}
			},

			// prop isOpen = true
			visible: {
				main: {
					opacity: 1,
					visibility: 'visible'
				},

				// prop direction
				direction: {
					down: {},
					up: {},
					right: {},
					left: {}
				}
			},

			// prop isOpen = false
			invisible: {
				main: {
					opacity: 0,
					visibility: 'hidden'
				},

				// prop direction
				direction: {
					left: {
						marginRight: -20
					},
					right: {
						marginLeft: -20
					},
					up: {
						marginTop: -40
					},
					down: {
						marginBottom: -40
					}
				}
			}
		},

		wrap: {
			main: {
				position: 'relative',
				display: 'inline-block',
				lineHeight: '40px',
				outline: 0,
				textDecoration: 'none'
			}
		},

		text: {
			main: {
				borderRadius: '5px',
				padding: '6px 12px 5px',
				fontSize: 14,
				color: baseTheme.palette.secondaryTextColor,
				backgroundColor: baseTheme.palette.canvasColor,
				boxShadow: paper.zDepthShadows[1],
				whiteSpace: 'nowrap'
			},

			// prop direction
			alignment: {
				left: {
					marginLeft: 24
				},
				right: {
					marginRight: 24
				},
				up: {
					display: 'none'
				},
				down: {
					display: 'none'
				}
			}
		},

		rightAvatar: {
			float: 'right',
			boxShadow: paper.zDepthShadows[1]
		},
		leftAvatar: {
			float: 'left',
			boxShadow: paper.zDepthShadows[1]
		},

		focus: {
			avatar: {
				boxShadow: paper.zDepthShadows[2]
			},
			text: {
				boxShadow: paper.zDepthShadows[2]
			}
		}
	};
};

Object.defineProperty(bubbleListItem, "__esModule", {
	value: true
});

var _getPrototypeOf$2 = getPrototypeOf.exports;

var _getPrototypeOf2$2 = _interopRequireDefault$a(_getPrototypeOf$2);

var _classCallCheck2$2 = classCallCheck;

var _classCallCheck3$2 = _interopRequireDefault$a(_classCallCheck2$2);

var _createClass2$2 = createClass;

var _createClass3$2 = _interopRequireDefault$a(_createClass2$2);

var _possibleConstructorReturn2$2 = possibleConstructorReturn;

var _possibleConstructorReturn3$2 = _interopRequireDefault$a(_possibleConstructorReturn2$2);

var _inherits2$2 = inherits;

var _inherits3$2 = _interopRequireDefault$a(_inherits2$2);

var _simpleAssign$3 = simpleAssign;

var _simpleAssign2$3 = _interopRequireDefault$a(_simpleAssign$3);

var _react$5 = react;

var _react2$5 = _interopRequireDefault$a(_react$5);

var _propTypes$3 = propTypes.exports;

var _propTypes2$2 = _interopRequireDefault$a(_propTypes$3);

var _bubbleListItem$2 = bubbleListItem_propTypes;

var _bubbleListItem2$2 = _interopRequireDefault$a(_bubbleListItem$2);

var _bubbleListItem3 = bubbleListItem_defaultProps;

var _bubbleListItem4 = _interopRequireDefault$a(_bubbleListItem3);

var _bubbleListItem5 = bubbleListItem_styles;

var _bubbleListItem6 = _interopRequireDefault$a(_bubbleListItem5);

function _interopRequireDefault$a(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Class BubbleListItem
 */
var BubbleListItem = function (_React$Component) {
	(0, _inherits3$2.default)(BubbleListItem, _React$Component);

	/**
  * @param {Object} props - component props
  * @param {Object} muiTheme - the muiTheme in context
  * @returns {void}
  */
	function BubbleListItem(props, _ref) {
		var muiTheme = _ref.muiTheme;
		(0, _classCallCheck3$2.default)(this, BubbleListItem);

		var _this = (0, _possibleConstructorReturn3$2.default)(this, (BubbleListItem.__proto__ || (0, _getPrototypeOf2$2.default)(BubbleListItem)).call(this, props));

		_this.state = {
			isKeyboardFocused: false
		};

		_this.styles = (0, _bubbleListItem6.default)(muiTheme);
		_this.getStylesMain = _this.getStylesMain.bind(_this);
		_this.getStylesText = _this.getStylesText.bind(_this);
		_this.getStylesFocus = _this.getStylesFocus.bind(_this);
		_this.setFocus = _this.setFocus.bind(_this);
		_this.handleFocus = _this.handleFocus.bind(_this);
		_this.handleKeyUp = _this.handleKeyUp.bind(_this);
		_this.handleBlur = _this.handleBlur.bind(_this);
		return _this;
	}

	/**
  * @returns {void}
  */


	(0, _createClass3$2.default)(BubbleListItem, [{
		key: 'handleBlur',
		value: function handleBlur() {
			this.setState({
				isKeyboardFocused: false
			});
			this.props.onBlur();
		}

		/**
   * @returns {void}
   */

	}, {
		key: 'handleFocus',
		value: function handleFocus() {
			this.setState({
				isKeyboardFocused: true
			});
			this.props.onFocus();
		}

		/**
   * @param {Object} event - the keyUp event object
   * @returns {void}
   */

	}, {
		key: 'handleKeyUp',
		value: function handleKeyUp(event) {
			if (!this.state.isKeyboardFocused || event.keyCode !== 13) {
				return;
			}

			this.props.onClick(event);
		}

		/**
   * @returns {void}
   */

	}, {
		key: 'setFocus',
		value: function setFocus() {
			this.refs.link.focus();
		}

		/**
   * @returns {Object} styles for root element
   */

	}, {
		key: 'getStylesMain',
		value: function getStylesMain() {
			var _props = this.props,
			    isOpen = _props.isOpen,
			    direction = _props.direction,
			    alignment = _props.alignment,
			    style = _props.style;

			var styles = this.styles;
			var visibleStr = isOpen ? 'visible' : 'invisible';
			return (0, _simpleAssign2$3.default)({}, styles.root.main, styles.root[visibleStr].main, styles.root.direction[direction], styles.root[visibleStr].direction[direction], styles.root.alignment[alignment], style);
		}

		/**
   * @param {string} elementName - the element name eg. (avatar|text)
   * @returns {Object} styles for focused element
   */

	}, {
		key: 'getStylesFocus',
		value: function getStylesFocus(elementName) {
			var isKeyboardFocused = this.state.isKeyboardFocused;


			if (!isKeyboardFocused) {
				return {};
			}

			return this.styles.focus[elementName];
		}

		/**
   * @returns {Object} styles for text element
   */

	}, {
		key: 'getStylesText',
		value: function getStylesText() {
			var _props2 = this.props,
			    alignment = _props2.alignment,
			    styleText = _props2.styleText;

			var styles = this.styles;

			return (0, _simpleAssign2$3.default)({}, styles.text.main, styles.text.alignment[alignment], this.getStylesFocus('text'), styleText);
		}

		/**
   * @param {string} name - the name in styles eg. (rightAvatar|leftAvatar)
   * @returns {XML} returns the cloned Avatar
   */

	}, {
		key: 'renderAvatar',
		value: function renderAvatar(name) {
			var styles = this.styles;
			var avatar = this.props[name];

			if (!avatar) {
				return null;
			}

			return _react2$5.default.cloneElement(avatar, {
				style: (0, _simpleAssign2$3.default)({}, avatar.props.style, styles[name], this.getStylesFocus('avatar'))
			});
		}

		/**
   * @returns {XML} returns the content
   */

	}, {
		key: 'renderContent',
		value: function renderContent() {
			var primaryText = this.props.primaryText;


			return _react2$5.default.createElement(
				'span',
				null,
				this.renderAvatar('leftAvatar'),
				_react2$5.default.createElement(
					'span',
					{ style: this.getStylesText() },
					primaryText
				),
				this.renderAvatar('rightAvatar')
			);
		}

		/**
   * @returns {XML} returns the link
   */

	}, {
		key: 'renderLink',
		value: function renderLink() {
			var _props3 = this.props,
			    href = _props3.href,
			    onClick = _props3.onClick,
			    tabIndex = _props3.tabIndex,
			    isOpen = _props3.isOpen;

			var styles = this.styles;

			if (href) {
				return _react2$5.default.createElement(
					'a',
					{
						href: href,
						ref: 'link',
						style: styles.wrap.main,
						tabIndex: isOpen ? tabIndex : -1,
						onBlur: this.handleBlur,
						onFocus: this.handleFocus
					},
					this.renderContent()
				);
			}

			return _react2$5.default.createElement(
				'a',
				{
					ref: 'link',
					style: styles.wrap.main,
					tabIndex: isOpen ? tabIndex : -1,
					onBlur: this.handleBlur,
					onFocus: this.handleFocus,
					onKeyUp: this.handleKeyUp,
					onClick: onClick
				},
				this.renderContent()
			);
		}

		/**
   * @returns {XML} returns the component
   */

	}, {
		key: 'render',
		value: function render() {
			var className = this.props.className;


			return _react2$5.default.createElement(
				'li',
				{ className: className, ref: 'item', style: this.getStylesMain() },
				this.renderLink()
			);
		}
	}]);
	return BubbleListItem;
}(_react2$5.default.Component);

BubbleListItem.displayName = 'BubbleListItem';
BubbleListItem.propTypes = _bubbleListItem2$2.default ;
BubbleListItem.defaultProps = _bubbleListItem4.default;
BubbleListItem.contextTypes = {
	muiTheme: _propTypes2$2.default.object.isRequired
};
bubbleListItem.default = BubbleListItem;

var speedDial_propTypes = {};

Object.defineProperty(speedDial_propTypes, "__esModule", {
	value: true
});

var _propTypes$2 = propTypes.exports;

speedDial_propTypes.default = {
	children: _propTypes$2.PropTypes.any,
	className: _propTypes$2.PropTypes.string,
	classNameBackdrop: _propTypes$2.PropTypes.string,
	classNameButtonWrap: _propTypes$2.PropTypes.string,
	classNameInTransition: _propTypes$2.PropTypes.string,
	classNameOpen: _propTypes$2.PropTypes.string,
	closeOnSecondClick: _propTypes$2.PropTypes.bool,
	closeOnScrollDown: _propTypes$2.PropTypes.bool,
	closeOnScrollUp: _propTypes$2.PropTypes.bool,
	floatingActionButtonProps: _propTypes$2.PropTypes.shape({
		backgroundColor: _propTypes$2.PropTypes.string,
		className: _propTypes$2.PropTypes.string,
		disabled: _propTypes$2.PropTypes.bool,
		iconClassName: _propTypes$2.PropTypes.string,
		iconStyle: _propTypes$2.PropTypes.object,
		mini: _propTypes$2.PropTypes.bool,
		secondary: _propTypes$2.PropTypes.bool,
		style: _propTypes$2.PropTypes.object,
		zDepth: _propTypes$2.PropTypes.number
	}),
	hasBackdrop: _propTypes$2.PropTypes.bool,
	icon: _propTypes$2.PropTypes.object,
	iconOpen: _propTypes$2.PropTypes.object,
	isInitiallyOpen: _propTypes$2.PropTypes.bool,
	isOpen: _propTypes$2.PropTypes.bool,
	positionH: _propTypes$2.PropTypes.string,
	positionV: _propTypes$2.PropTypes.string,
	primaryText: _propTypes$2.PropTypes.string,
	style: _propTypes$2.PropTypes.object,
	styleBackdrop: _propTypes$2.PropTypes.object,
	styleButtonWrap: _propTypes$2.PropTypes.object,
	tabIndex: _propTypes$2.PropTypes.oneOfType([_propTypes$2.PropTypes.string, _propTypes$2.PropTypes.number]),
	toolbox: _propTypes$2.PropTypes.shape({
		height: _propTypes$2.PropTypes.number.isRequired,
		className: _propTypes$2.PropTypes.string,
		classNameMorphButton: _propTypes$2.PropTypes.string
	}),
	onClickPrimaryButton: _propTypes$2.PropTypes.func,
	onChange: _propTypes$2.PropTypes.func,
	onChangeState: _propTypes$2.PropTypes.func
};

var speedDial_defaultProps = {};

var close = {};

Object.defineProperty(close, "__esModule", {
  value: true
});

var _react$4 = react;

var _react2$4 = _interopRequireDefault$9(_react$4);

var _pure$1 = pure;

var _pure2$1 = _interopRequireDefault$9(_pure$1);

var _SvgIcon$1 = SvgIcon;

var _SvgIcon2$1 = _interopRequireDefault$9(_SvgIcon$1);

function _interopRequireDefault$9(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NavigationClose = function NavigationClose(props) {
  return _react2$4.default.createElement(
    _SvgIcon2$1.default,
    props,
    _react2$4.default.createElement('path', { d: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' })
  );
};
NavigationClose = (0, _pure2$1.default)(NavigationClose);
NavigationClose.displayName = 'NavigationClose';
NavigationClose.muiName = 'SvgIcon';

close.default = NavigationClose;

Object.defineProperty(speedDial_defaultProps, "__esModule", {
	value: true
});

var _react$3 = react;

var _react2$3 = _interopRequireDefault$8(_react$3);

var _add = add;

var _add2 = _interopRequireDefault$8(_add);

var _close = close;

var _close2 = _interopRequireDefault$8(_close);

function _interopRequireDefault$8(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

speedDial_defaultProps.default = {
	closeOnSecondClick: true,
	closeOnScrollDown: false,
	closeOnScrollUp: false,
	hasBackdrop: true,
	icon: _react2$3.default.createElement(_add2.default, null),
	iconOpen: _react2$3.default.createElement(_close2.default, null),
	isInitiallyOpen: false,
	positionH: 'right',
	positionV: 'bottom',
	style: {},
	styleBackdrop: {},
	styleButtonWrap: {},
	tabIndex: 1,
	onClickPrimaryButton: function onClickPrimaryButton() {},
	onChangeState: function onChangeState() {}
};

var speedDial_styles = {};

Object.defineProperty(speedDial_styles, "__esModule", {
	value: true
});

var _colors$1 = colors;

var _transitions$1 = transitions;

var _transitions2$1 = _interopRequireDefault$7(_transitions$1);

function _interopRequireDefault$7(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

speedDial_styles.default = function (_ref) {
	var baseTheme = _ref.baseTheme;

	return {
		root: {
			main: {
				position: 'fixed',
				width: '100%',
				left: 0,
				zIndex: 9999
			},
			inline: {
				position: 'relative'
			},
			top: {
				top: 0
			},
			bottom: {
				bottom: 0
			}
		},

		actionButton: {
			invisible: {
				opacity: 0
			}
		},

		toolbox: {
			main: {
				position: 'relative',
				transition: _transitions2$1.default.easeOut(),
				height: 0,
				width: '100%'
			}
		},

		toolboxInner: {
			main: {
				transition: _transitions2$1.default.easeOut()
			},
			closed: {
				opacity: 0
			},
			closing: {
				opacity: 0
			},
			open: {
				opacity: 1
			},
			opening: {
				opacity: 0
			}
		},

		morphWrap: {
			position: 'absolute',
			width: '100%',
			height: '100%',
			left: 0,
			top: 0,
			overflow: 'hidden'
		},

		morphActionButton: {
			main: {
				display: 'inline-block',
				transition: _transitions2$1.default.easeOut(),
				height: 56,
				width: 56,
				background: _colors$1.cyan500,
				zIndex: 0,
				opacity: 1,
				borderRadius: '50%'
			},

			closed: {
				transition: 'none'
			},

			closing: {
				transition: 'none'
			},

			opening: {},

			open: {
				transition: 'none',
				position: 'absolute',
				width: 'auto',
				height: 'auto',
				top: 0,
				right: 0,
				bottom: 0,
				left: 0,
				opacity: 1,
				borderRadius: '0%'
			}
		},

		notBubbleList: {
			main: {
				transition: _transitions2$1.default.easeOut()
			},
			invisible: {
				opacity: 0
			},
			visible: {
				opacity: 1
			}
		},

		contentWrap: {
			main: {
				position: 'absolute'
			},
			top: {
				top: 88
			},
			bottom: {
				bottom: 88
			},
			left: {
				left: 23
			},
			right: {
				right: 23
			},

			// BubbleList direction
			direction: {
				up: {},
				down: {},
				left: {
					right: 88
				},
				right: {
					left: 88
				}
			},

			// BubbleList alignment
			alignment: {
				up: {
					bottom: 23
				},
				down: {
					top: 23
				},
				left: {},
				right: {}
			}
		},

		backdropWrap: {
			main: {
				position: 'fixed',
				width: '100%',
				height: '100%',
				overflow: 'hidden',
				top: 0,
				opacity: 1
			},
			invisible: {
				opacity: 0
			}
		},

		backdrop: {
			main: {
				position: 'absolute',
				backgroundColor: baseTheme.palette.borderColor,
				display: 'block',
				transition: _transitions2$1.default.easeOut(),
				width: '100%',
				height: '100%',
				top: 0,
				right: 0,
				opacity: 0.8
			},
			invisible: {
				opacity: 0
			},
			focus: {
				backgroundColor: baseTheme.palette.secondaryTextColor,
				opacity: 0.4
			}
		},

		btnWrap: {
			main: {
				transition: _transitions2$1.default.easeOut(),
				position: 'absolute',
				opacity: 1
			},
			inline: {
				top: -28
			},
			bottom: {
				bottom: 16
			},
			top: {
				top: 16
			},
			left: {
				left: 16
			},
			right: {
				right: 16
			},
			toolbox: {
				open: {
					opacity: 0
				},
				closed: {
					opacity: 1
				},
				opening: {
					opacity: 0
				},
				closing: {
					opacity: 0
				}
			}
		},

		iconClosed: {
			main: {
				position: 'absolute',
				transform: 'rotate(0deg)',
				opacity: 1
			},
			invisible: {
				position: 'absolute',
				transform: 'rotate(90deg)',
				opacity: 0
			}
		},

		iconOpen: {
			main: {
				transform: 'rotate(0deg)',
				opacity: 1
			},
			invisible: {
				transform: 'rotate(-90deg)',
				opacity: 0
			}
		},

		primaryText: {
			main: {
				position: 'absolute',
				bottom: 10,
				margin: 0,
				transition: _transitions2$1.default.easeOut()
			},
			true: {
				opacity: 1
			},
			false: {
				opacity: 0
			},
			left: {
				left: 33
			},
			right: {
				right: 73
			}
		}
	};
};

var speedDial_keyframes = {};

var createKeyframes$1 = {};

Object.defineProperty(createKeyframes$1, "__esModule", {
  value: true
});

var _keys = keys.exports;

var _keys2 = _interopRequireDefault$6(_keys);

var _simpleAssign$2 = simpleAssign;

var _simpleAssign2$2 = _interopRequireDefault$6(_simpleAssign$2);

function _interopRequireDefault$6(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaults = {
  className: 'animation',
  name: 'animationFrame',
  type: 'linear',
  duration: '0.45s',
  iterationCount: 1
};

/**
 *
 * const transformations = {};
 * transformations['0%'] = { translate: '0px,0px', rotate: '0deg' }
 * transformations['50%'] = { translate: '200px,0px', rotate: '180deg' }
 *
 * createKeyframes('element-animation', transformations)
 *
 * .element-animation{
 * 		animation: animationFrames linear 4s;
 * 		animation-iteration-count: 1;
 * }
 * @keyframes animationFrames{
 * 		0% {
 * 			transform:  translate(0px,0px)  rotate(0deg) ;
 * 		}
 * 		100% {
 * 			transform:  translate(200px,0px)  rotate(180deg) ;
 * 		}
 * }
 *
 * @param {Object} options - the animation options
 * @param {Object} transformations - transformation steps
 * @returns {string} the keyframe css string
 */
function createKeyframes(options, transformations) {
  var out = [];

  var _Object$assign = (0, _simpleAssign2$2.default)({}, defaults, options),
      className = _Object$assign.className,
      name = _Object$assign.name,
      type = _Object$assign.type,
      duration = _Object$assign.duration,
      iterationCount = _Object$assign.iterationCount;

  var animations = ['animation:' + name + ' ' + type + ' ' + duration + ';', 'animation-iteration-count:' + iterationCount + ';'];
  out.push('.' + className + '{' + animations.join('') + '}');
  out.push('@keyframes ' + name + '{');
  (0, _keys2.default)(transformations).forEach(function (step) {
    var transform = [];
    var transformObj = transformations[step];
    (0, _keys2.default)(transformObj).forEach(function (transName) {
      transform.push(transName + '(' + transformObj[transName] + ')');
    });
    out.push(step + '{transform:' + transform.join(' ') + '}');
  });
  out.push('}');
  return out.join('');
}

createKeyframes$1.default = createKeyframes;

Object.defineProperty(speedDial_keyframes, "__esModule", {
	value: true
});
speedDial_keyframes.getCssKeyFramesClosing = speedDial_keyframes.getCssKeyFrames = undefined;

var _createKeyframes = createKeyframes$1;

var _createKeyframes2 = _interopRequireDefault$5(_createKeyframes);

function _interopRequireDefault$5(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @returns {number} - the window width or maxWidth
 * @private
 */
function _getWidth() {
	return Number(window.innerWidth <= 1024 ? window.innerWidth : 1024);
}

speedDial_keyframes.getCssKeyFrames = function getCssKeyFrames(className, key, _ref) {
	var height = _ref.height,
	    btnHeight = _ref.btnHeight,
	    positionH = _ref.positionH;

	var width = _getWidth();
	var translateY = Number(height / 2) + 'px';
	var translateX = width / 2 - btnHeight + 'px';
	var translateClosed = '0px,0px';
	var translatePartA = '0px,' + translateY;
	var translateScale = width / 40;
	var translateOpened = '0px,0px';

	if (positionH === 'left') {
		translateOpened = translateX + ',' + translateY;
	} else {
		translateOpened = '-' + translateX + ',' + translateY;
	}

	return (0, _createKeyframes2.default)({
		className: className + key,
		name: className + key,
		iterationCount: 1
	}, {
		'0%': {
			translate: translateClosed,
			scaleX: 1,
			scaleY: 1
		},
		'20%': {
			translate: translatePartA,
			scaleX: 1,
			scaleY: 1
		},
		'40%': {
			translate: translateOpened,
			scaleX: translateScale / 2,
			scaleY: translateScale / 2
		},
		'100%': {
			translate: translateOpened,
			scaleX: translateScale,
			scaleY: translateScale
		}
	});
};

speedDial_keyframes.getCssKeyFramesClosing = function getCssKeyFramesClosing(className, key, _ref2) {
	var height = _ref2.height,
	    btnHeight = _ref2.btnHeight,
	    positionH = _ref2.positionH;

	var width = _getWidth();
	var translateY = Number(height / 2) + 'px';
	var translateX = width / 2 - btnHeight + 'px';
	var translateClosed = '0px,0px';
	var translatePartA = '0px,' + translateY;
	var translateScale = width / 40;
	var translateOpened = '0px,0px';

	if (positionH === 'left') {
		translateOpened = translateX + ',' + translateY;
	} else {
		translateOpened = '-' + translateX + ',' + translateY;
	}

	return (0, _createKeyframes2.default)({
		className: className + key,
		name: className + key,
		iterationCount: 1
	}, {
		'0%': {
			translate: translateOpened,
			scaleX: translateScale,
			scaleY: translateScale
		},
		'20%': {
			translate: translatePartA,
			scaleX: translateScale / 2,
			scaleY: translateScale / 2
		},
		'40%': {
			translate: translateClosed,
			scaleX: 1,
			scaleY: 1
		},
		'100%': {
			translate: translateClosed,
			scaleX: 1,
			scaleY: 1
		}
	});
};

Object.defineProperty(speedDial, "__esModule", {
	value: true
});

var _extends2 = _extends$1;

var _extends3 = _interopRequireDefault$4(_extends2);

var _getPrototypeOf$1 = getPrototypeOf.exports;

var _getPrototypeOf2$1 = _interopRequireDefault$4(_getPrototypeOf$1);

var _classCallCheck2$1 = classCallCheck;

var _classCallCheck3$1 = _interopRequireDefault$4(_classCallCheck2$1);

var _createClass2$1 = createClass;

var _createClass3$1 = _interopRequireDefault$4(_createClass2$1);

var _possibleConstructorReturn2$1 = possibleConstructorReturn;

var _possibleConstructorReturn3$1 = _interopRequireDefault$4(_possibleConstructorReturn2$1);

var _inherits2$1 = inherits;

var _inherits3$1 = _interopRequireDefault$4(_inherits2$1);

var _typeof2$1 = _typeof;

var _typeof3$1 = _interopRequireDefault$4(_typeof2$1);

var _simpleAssign$1 = simpleAssign;

var _simpleAssign2$1 = _interopRequireDefault$4(_simpleAssign$1);

var _react$2 = react;

var _react2$2 = _interopRequireDefault$4(_react$2);

var _propTypes$1 = propTypes.exports;

var _propTypes2$1 = _interopRequireDefault$4(_propTypes$1);

var _FloatingActionButton = FloatingActionButton;

var _FloatingActionButton2 = _interopRequireDefault$4(_FloatingActionButton);

var _colors = colors;

var _bubbleListItem$1 = bubbleListItem;

var _bubbleListItem2$1 = _interopRequireDefault$4(_bubbleListItem$1);

var _speedDial$1 = speedDial_propTypes;

var _speedDial2$1 = _interopRequireDefault$4(_speedDial$1);

var _speedDial3 = speedDial_defaultProps;

var _speedDial4 = _interopRequireDefault$4(_speedDial3);

var _speedDial5 = speedDial_styles;

var _speedDial6 = _interopRequireDefault$4(_speedDial5);

var _speedDial7 = speedDial_keyframes;

function _interopRequireDefault$4(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var animTime = 450;
var keyFrameClassName = 'anim-btn-morph';
var keyFrameClosingClassName = 'anim-btn-morph-closing';

/**
 * @returns {number} returns the scroll top distance
 */
function scrollTop() {
	return document.body.scrollTop || document.documentElement.scrollTop;
}

/**
 * @param {Object} child - the child component or node
 * @param {string} displayName - the displayName
 * @returns {boolean} returns true if child is component with given displayName
 */
function isValidChild$1(child, displayName) {
	return child !== null && (typeof child === 'undefined' ? 'undefined' : (0, _typeof3$1.default)(child)) === 'object' && !(child instanceof Array) && child.type && child.type.displayName === displayName;
}

/**
 * Class SpeedDial
 */

var SpeedDial = function (_React$Component) {
	(0, _inherits3$1.default)(SpeedDial, _React$Component);

	/**
  * @param {Object} props - component props
  * @param {Object} context - component context
  * @returns {void}
  */
	function SpeedDial(props, context) {
		(0, _classCallCheck3$1.default)(this, SpeedDial);

		var _this = (0, _possibleConstructorReturn3$1.default)(this, (SpeedDial.__proto__ || (0, _getPrototypeOf2$1.default)(SpeedDial)).call(this, props, context));

		_this.state = {
			isOpen: props.isOpen || props.isInitiallyOpen,
			isInTransition: false,
			wasOpened: !props.isInitiallyOpen,
			isBackdropFocused: false,
			openedScrollPos: 0
		};

		_this.instanceKey = String(Math.random() * 10000).substring(0, 4);
		_this.isControlled = Boolean(typeof props.isOpen === 'boolean');
		_this.getStylesBackdrop = _this.getStylesBackdrop.bind(_this);
		_this.isChildrenBubbleList = _this.isChildrenBubbleList.bind(_this);
		_this.isToolbox = _this.isToolbox.bind(_this);
		_this.handleClickOpen = _this.handleClickOpen.bind(_this);
		_this.handleClickClose = _this.handleClickClose.bind(_this);
		_this.handleClickCloseToolbox = _this.handleClickCloseToolbox.bind(_this);
		_this.handleClickBackdrop = _this.handleClickBackdrop.bind(_this);
		_this.handleFocusFirstListItem = _this.handleFocusFirstListItem.bind(_this);
		_this.handleFocusPrimaryText = _this.handleFocusPrimaryText.bind(_this);
		_this.handleFocusBackdrop = _this.handleFocusBackdrop.bind(_this);
		_this.handleBlurBackdrop = _this.handleBlurBackdrop.bind(_this);
		_this.handleBackdropKeyUp = _this.handleBackdropKeyUp.bind(_this);
		_this.handleScroll = _this.handleScroll.bind(_this);
		_this.styles = (0, _speedDial6.default)(context.muiTheme);

		/* istanbul ignore next */
		if (_this.isControlled && typeof props.onChange !== 'function') {
			// eslint-disable-next-line
			console.error('Warning: Failed speed-dial propType: You provided a `isOpen` prop to a speed-dial without an `onChange` handler');
		}
		return _this;
	}

	/**
  * @returns {void}
  */


	(0, _createClass3$1.default)(SpeedDial, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _props = this.props,
			    closeOnScrollDown = _props.closeOnScrollDown,
			    closeOnScrollUp = _props.closeOnScrollUp;


			if (closeOnScrollDown === true || closeOnScrollUp === true) {
				window.addEventListener('scroll', this.handleScroll);
			}
		}

		/**
   * @param {Object} nextProps - the next props Object
   * @returns {void}
   */

	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			if (this.isControlled) {
				this.setState({
					isOpen: nextProps.isOpen
				});
			}
		}

		/**
   * @returns {void}
   */

	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			var _props2 = this.props,
			    closeOnScrollDown = _props2.closeOnScrollDown,
			    closeOnScrollUp = _props2.closeOnScrollUp;


			if (closeOnScrollDown === true || closeOnScrollUp === true) {
				window.removeEventListener('scroll', this.handleScroll);
			}
		}

		/**
   * @returns {void}
   */

	}, {
		key: 'handleScroll',
		value: function handleScroll() {
			var _props3 = this.props,
			    closeOnScrollDown = _props3.closeOnScrollDown,
			    closeOnScrollUp = _props3.closeOnScrollUp;
			var _state = this.state,
			    isOpen = _state.isOpen,
			    openedScrollPos = _state.openedScrollPos;


			if (isOpen) {
				var distance = Number(scrollTop() || 0) - openedScrollPos;
				if (closeOnScrollDown === true && distance >= 30) {
					this.handleClickClose();
				}
				if (closeOnScrollUp === true && distance <= -30) {
					this.handleClickClose();
				}
			}
		}

		/**
   * @returns {void}
   */

	}, {
		key: 'handleFocusFirstListItem',
		value: function handleFocusFirstListItem() {
			if (!this.refs.list || !this.refs.list.refs || !this.refs.list.refs.listItem0) {
				return;
			}

			this.refs.list.refs.listItem0.setFocus();
		}

		/**
   * @returns {void}
   */

	}, {
		key: 'handleClickOpen',
		value: function handleClickOpen() {
			var _this2 = this;

			this.updateState({
				wasOpened: false,
				isOpen: true,
				isInTransition: true,
				openedScrollPos: scrollTop()
			});

			/* istanbul ignore next */
			setTimeout(function () {
				_this2.updateState({
					wasOpened: false,
					isInTransition: false
				});
				_this2.handleFocusFirstListItem();
			}, animTime);
		}

		/**
   * @returns {void}
   */

	}, {
		key: 'handleClickClose',
		value: function handleClickClose() {
			var _this3 = this;

			this.props.onClickPrimaryButton();

			if (this.props.closeOnSecondClick) {
				this.updateState({
					wasOpened: true,
					isOpen: false,
					isInTransition: true
				});
			}

			/* istanbul ignore next */
			setTimeout(function () {
				_this3.updateState({
					wasOpened: false,
					isInTransition: false
				});
			}, animTime);
		}

		/**
   * @returns {void}
   */

	}, {
		key: 'handleClickCloseToolbox',
		value: function handleClickCloseToolbox() {
			var _this4 = this;

			/* istanbul ignore next */
			this.updateState({
				wasOpened: true,
				isOpen: false,
				isInTransition: true
			});

			/* istanbul ignore next */
			setTimeout(function () {
				_this4.updateState({
					wasOpened: false,
					isInTransition: false
				});
			}, animTime);
		}

		/**
   * @param {Event} event - the click event object
   * @returns {void}
   */

	}, {
		key: 'handleClickBackdrop',
		value: function handleClickBackdrop(event) {
			var _this5 = this;

			if (event && typeof event.stopPropagation === 'function') {
				event.stopPropagation();
			}

			/* istanbul ignore next */
			this.updateState({
				isOpen: false,
				isInTransition: true
			});

			/* istanbul ignore next */
			setTimeout(function () {
				_this5.updateState({
					isInTransition: false
				});
			}, animTime);
		}

		/**
   * @returns {void}
   */

	}, {
		key: 'handleFocusPrimaryText',
		value: function handleFocusPrimaryText() {
			this.refs.btn.refs.container.refs.enhancedButton.focus();
		}

		/**
   * @returns {void}
   */

	}, {
		key: 'handleFocusBackdrop',
		value: function handleFocusBackdrop() {
			this.updateState({
				isBackdropFocused: true
			});
		}

		/**
   * @returns {void}
   */

	}, {
		key: 'handleBlurBackdrop',
		value: function handleBlurBackdrop() {
			this.updateState({
				isBackdropFocused: false
			});
		}

		/**
   * @param {Object} event - the backdrop keyUp event
   * @returns {void}
   */

	}, {
		key: 'handleBackdropKeyUp',
		value: function handleBackdropKeyUp(event) {
			if (event.keyCode !== 13) {
				return;
			}

			this.handleClickBackdrop(event);
		}

		/**
   * @returns {string} transitionState (open|closed|opening|closing)
   */

	}, {
		key: 'getCurrentTransitionState',
		value: function getCurrentTransitionState() {
			var _state2 = this.state,
			    isOpen = _state2.isOpen,
			    isInTransition = _state2.isInTransition,
			    wasOpened = _state2.wasOpened;


			if (!isInTransition) {
				return isOpen ? 'open' : 'closed';
			}

			if (isOpen && !wasOpened) {
				return 'opening';
			}

			return 'closing';
		}

		/**
   * @returns {string} the BubbleList direction
   */

	}, {
		key: 'getDirection',
		value: function getDirection() {
			var _props4 = this.props,
			    children = _props4.children,
			    positionV = _props4.positionV;


			if (children && children.props && children.props.direction) {
				return children.props.direction;
			}

			return positionV === 'bottom' ? 'up' : 'down';
		}

		/**
   * @returns {string} the BubbleList alignment
   */

	}, {
		key: 'getAlignment',
		value: function getAlignment() {
			var _props5 = this.props,
			    children = _props5.children,
			    positionH = _props5.positionH;


			if (children && children.props && children.props.alignment) {
				return children.props.alignment;
			}

			return positionH;
		}

		/**
   * @returns {Object} the `ActionButton`
   */

	}, {
		key: 'getActionButton',
		value: function getActionButton() {
			try {
				return this.refs.btn.refs.container;
			} catch (err) {
				return {};
			}
		}

		/**
   * @returns {Object} the `ActionButton` style object
   */

	}, {
		key: 'getActionButtonStyles',
		value: function getActionButtonStyles() {
			try {
				return (0, _simpleAssign2$1.default)({}, this.getActionButton().refs.enhancedButton.style);
			} catch (err) {
				return {};
			}
		}

		/**
   * @returns {Object} merged styles for the `FloatingActionButton`
   */

	}, {
		key: 'getStylesBtn',
		value: function getStylesBtn() {
			var _props6 = this.props,
			    positionV = _props6.positionV,
			    positionH = _props6.positionH,
			    styleButtonWrap = _props6.styleButtonWrap;

			var transitionState = this.getCurrentTransitionState();
			var styles = this.styles;

			if (this.isToolbox()) {
				return (0, _simpleAssign2$1.default)({}, styles.btnWrap.main, styles.btnWrap[positionV], styles.btnWrap[positionH], styleButtonWrap, styles.btnWrap.toolbox[transitionState]);
			}

			return (0, _simpleAssign2$1.default)({}, styles.btnWrap.main, styles.btnWrap[positionV], styles.btnWrap[positionH], styleButtonWrap);
		}

		/**
   * @returns {Object} merged styles for the `FloatingActionButton`
   */

	}, {
		key: 'getStylesMain',
		value: function getStylesMain() {
			var _props7 = this.props,
			    positionV = _props7.positionV,
			    style = _props7.style;

			var styles = this.styles;

			return (0, _simpleAssign2$1.default)({}, styles.root.main, styles.root[positionV], style);
		}

		/**
   * @returns {Object} merged styles for the `FloatingActionButton`
   */

	}, {
		key: 'getStylesContentWrap',
		value: function getStylesContentWrap() {
			var _props8 = this.props,
			    positionV = _props8.positionV,
			    positionH = _props8.positionH;
			var isOpen = this.state.isOpen;

			var styles = this.styles;
			var stylesNotBubbleList = {};

			if (!this.isChildrenBubbleList()) {
				stylesNotBubbleList = (0, _simpleAssign2$1.default)({}, styles.notBubbleList.main, styles.notBubbleList[isOpen ? 'visible' : 'invisible']);
			}

			return (0, _simpleAssign2$1.default)({}, styles.contentWrap.main, styles.contentWrap[positionV], styles.contentWrap[positionH], styles.contentWrap.direction[this.getDirection()], styles.contentWrap.alignment[this.getAlignment()], stylesNotBubbleList);
		}

		/**
   * @returns {Object} merged styles for the primary text
   */

	}, {
		key: 'getStylesPrimaryText',
		value: function getStylesPrimaryText() {
			var positionH = this.props.positionH;
			var isOpen = this.state.isOpen;

			var styles = this.styles;

			return (0, _simpleAssign2$1.default)({}, styles.primaryText.main, styles.primaryText[String(isOpen)], styles.primaryText[positionH]);
		}

		/**
   * @returns {Object} styles for backdrop element
   */

	}, {
		key: 'getStylesBackdrop',
		value: function getStylesBackdrop() {
			var _state3 = this.state,
			    isOpen = _state3.isOpen,
			    isBackdropFocused = _state3.isBackdropFocused;

			var styles = this.styles;
			var stylesLink = isOpen ? styles.backdrop.main : styles.backdrop.invisible;
			var stylesLinkFocused = isBackdropFocused ? styles.backdrop.focus : {};

			return (0, _simpleAssign2$1.default)({}, stylesLink, stylesLinkFocused);
		}

		/**
   * @returns {Object} styles for toolbox element
   */

	}, {
		key: 'getStylesToolbox',
		value: function getStylesToolbox() {
			var isOpen = this.state.isOpen;
			var toolbox = this.props.toolbox;

			var styles = this.styles;

			if (!isOpen) {
				return (0, _simpleAssign2$1.default)({}, styles.toolbox.main);
			}

			var stylesOpen = {
				height: toolbox.height
			};

			return (0, _simpleAssign2$1.default)({}, styles.toolbox.main, stylesOpen);
		}

		/**
   * @returns {Object} styles for toolbox inner elements
   */

	}, {
		key: 'getStylesToolboxInner',
		value: function getStylesToolboxInner() {
			return (0, _simpleAssign2$1.default)({}, this.styles.toolboxInner.main, this.styles.toolboxInner[this.getCurrentTransitionState()]);
		}

		/**
   * @returns {Object} styles for toolbox element
   */

	}, {
		key: 'getStylesMorphActionButton',
		value: function getStylesMorphActionButton() {
			var styles = this.styles;
			var stylesWrap = this.getStylesBtn();
			var stylesButton = this.getActionButtonStyles();
			var stylesMain = (0, _simpleAssign2$1.default)({}, styles.morphActionButton.main, {
				backgroundColor: stylesButton.backgroundColor || _colors.cyan500,
				width: stylesButton.width || 56,
				height: stylesButton.height || 56
			});

			return (0, _simpleAssign2$1.default)({}, stylesWrap, stylesMain, styles.morphActionButton[this.getCurrentTransitionState()]);
		}

		/**
   * @param {Object} newState - the new state
   * @returns {void}
   */

	}, {
		key: 'updateState',
		value: function updateState(newState) {
			this.setState(newState);
			this.props.onChangeState(newState);
			if (this.isControlled && typeof newState.isOpen === 'boolean') {
				this.props.onChange({
					isOpen: newState.isOpen
				});
			}
		}

		/**
   * @returns {boolean} returns true if the children component is `BubbleList` component
   */

	}, {
		key: 'isChildrenBubbleList',
		value: function isChildrenBubbleList() {
			var children = this.props.children;

			return isValidChild$1(children, 'BubbleList');
		}

		/**
   * @returns {boolean} returns true if toolbox object exist and the height is set
   */

	}, {
		key: 'isToolbox',
		value: function isToolbox() {
			var toolbox = this.props.toolbox;

			return Boolean(toolbox && typeof toolbox.height === 'number');
		}

		/**
   * @returns {Array} returns the icon component's
   */

	}, {
		key: 'renderIcon',
		value: function renderIcon() {
			var _props9 = this.props,
			    icon = _props9.icon,
			    iconOpen = _props9.iconOpen;
			var isOpen = this.state.isOpen;


			return [_react2$2.default.cloneElement(icon, {
				key: '0',
				style: isOpen ? this.styles.iconClosed.invisible : this.styles.iconClosed.main
			}), _react2$2.default.cloneElement(iconOpen, {
				key: '1',
				style: isOpen ? this.styles.iconOpen.main : this.styles.iconOpen.invisible
			})];
		}

		/**
   * @returns {XML} returns the children toolbox eg. `BottomNavigation` component
   */

	}, {
		key: 'renderToolbox',
		value: function renderToolbox() {
			var _props10 = this.props,
			    toolbox = _props10.toolbox,
			    children = _props10.children;


			if (!this.isToolbox()) {
				return null;
			}

			return _react2$2.default.createElement(
				'div',
				{ className: toolbox.className, style: this.getStylesToolbox() },
				_react2$2.default.createElement(
					'div',
					{ style: this.styles.morphWrap },
					this.renderMorphActionButton()
				),
				_react2$2.default.createElement(
					'div',
					{ style: this.getStylesToolboxInner() },
					_react2$2.default.cloneElement(children, {
						onClickCloseToolbox: this.handleClickCloseToolbox
					})
				)
			);
		}

		/**
   * @returns {XML} returns the children (list)
   */

	}, {
		key: 'renderChildren',
		value: function renderChildren() {
			var _props11 = this.props,
			    children = _props11.children,
			    positionV = _props11.positionV;
			var _state4 = this.state,
			    isOpen = _state4.isOpen,
			    isInTransition = _state4.isInTransition;


			if (this.isToolbox()) {
				return null;
			}

			if (!isValidChild$1(children, 'BubbleList')) {
				return children;
			}

			return _react2$2.default.cloneElement(children, {
				isOpen: isOpen,
				isInTransition: isInTransition,
				direction: this.getDirection(),
				alignment: this.getAlignment(),
				positionV: positionV,
				ref: 'list'
			});
		}

		/**
   * @returns {XML} returns the backdrop
   */

	}, {
		key: 'renderBackdrop',
		value: function renderBackdrop() {
			var _props12 = this.props,
			    hasBackdrop = _props12.hasBackdrop,
			    classNameBackdrop = _props12.classNameBackdrop,
			    tabIndex = _props12.tabIndex,
			    styleBackdrop = _props12.styleBackdrop;
			var isOpen = this.state.isOpen;

			var styles = this.styles;
			var stylesWrap = isOpen ? styles.backdropWrap.main : styles.backdropWrap.invisible;

			if (!hasBackdrop || this.isToolbox()) {
				return null;
			}

			return _react2$2.default.createElement(
				'span',
				{ className: classNameBackdrop, style: (0, _simpleAssign2$1.default)({}, stylesWrap, styleBackdrop) },
				_react2$2.default.createElement('a', {
					style: this.getStylesBackdrop(),
					tabIndex: isOpen ? tabIndex + 1 : -1,
					onBlur: this.handleBlurBackdrop,
					onFocus: this.handleFocusBackdrop,
					onKeyUp: this.handleBackdropKeyUp,
					onClick: this.handleClickBackdrop
				})
			);
		}

		/**
   * @returns {XML} returns the primary text
   */

	}, {
		key: 'renderPrimaryText',
		value: function renderPrimaryText() {
			var _props13 = this.props,
			    primaryText = _props13.primaryText,
			    onClickPrimaryButton = _props13.onClickPrimaryButton,
			    tabIndex = _props13.tabIndex;
			var isOpen = this.state.isOpen;


			if (['left', 'right'].indexOf(this.getDirection()) >= 0) {
				return null;
			}

			if (!primaryText || primaryText === '') {
				return null;
			}

			return _react2$2.default.createElement(
				'ul',
				{ style: this.getStylesPrimaryText() },
				_react2$2.default.createElement(_bubbleListItem2$1.default, {
					isOpen: true,
					primaryText: primaryText,
					tabIndex: isOpen ? tabIndex : -1,
					onClick: onClickPrimaryButton,
					onFocus: this.handleFocusPrimaryText
				})
			);
		}

		/**
   * @returns {XML} returns the morphing ActionButton
   */

	}, {
		key: 'renderMorphActionButton',
		value: function renderMorphActionButton() {
			var transitionState = this.getCurrentTransitionState();
			var toolbox = this.props.toolbox;

			var classNames = [];

			if (toolbox.classNameMorphButton) {
				classNames.push(toolbox.classNameMorphButton);
			}

			if (transitionState === 'closing') {
				classNames.push(keyFrameClosingClassName + this.instanceKey);
			}

			if (transitionState === 'opening') {
				classNames.push(keyFrameClassName + this.instanceKey);
			}

			return _react2$2.default.createElement('div', { className: classNames.join(' '), ref: 'morphBtn', style: this.getStylesMorphActionButton() });
		}

		/**
   * @returns {XML} returns a style tag
   */

	}, {
		key: 'renderCssKeyframes',
		value: function renderCssKeyframes() {
			var _props14 = this.props,
			    toolbox = _props14.toolbox,
			    positionH = _props14.positionH;


			if (!this.isToolbox()) {
				return null;
			}

			var options = {
				height: toolbox.height,
				btnHeight: 56,
				positionH: positionH
			};

			return _react2$2.default.createElement(
				'style',
				null,
				(0, _speedDial7.getCssKeyFrames)(keyFrameClassName, this.instanceKey, options),
				(0, _speedDial7.getCssKeyFramesClosing)(keyFrameClosingClassName, this.instanceKey, options)
			);
		}

		/**
   * @returns {XML} returns the component
   */

	}, {
		key: 'render',
		value: function render() {
			var _props15 = this.props,
			    floatingActionButtonProps = _props15.floatingActionButtonProps,
			    className = _props15.className,
			    classNameInTransition = _props15.classNameInTransition,
			    classNameOpen = _props15.classNameOpen,
			    classNameButtonWrap = _props15.classNameButtonWrap,
			    tabIndex = _props15.tabIndex;
			var _state5 = this.state,
			    isOpen = _state5.isOpen,
			    isInTransition = _state5.isInTransition;

			var handleClick = isOpen ? this.handleClickClose : this.handleClickOpen;
			var classNames = [className];

			var btnProps = (0, _simpleAssign2$1.default)({}, floatingActionButtonProps, {
				onClick: handleClick
			});

			if (isInTransition && classNameInTransition) {
				classNames.push(classNameInTransition);
			}

			if (isOpen && classNameOpen) {
				classNames.push(classNameOpen);
			}

			return _react2$2.default.createElement(
				'div',
				{ className: classNames.join(' '), style: this.getStylesMain() },
				this.renderCssKeyframes(),
				this.renderToolbox(),
				this.renderBackdrop(),
				_react2$2.default.createElement(
					'div',
					{ style: this.getStylesContentWrap() },
					this.renderChildren()
				),
				_react2$2.default.createElement(
					'div',
					{ className: classNameButtonWrap, style: this.getStylesBtn() },
					this.renderPrimaryText(),
					_react2$2.default.createElement(
						_FloatingActionButton2.default,
						(0, _extends3.default)({ ref: 'btn', tabIndex: tabIndex }, btnProps),
						this.renderIcon()
					)
				)
			);
		}
	}]);
	return SpeedDial;
}(_react2$2.default.Component);

SpeedDial.displayName = 'SpeedDial';
SpeedDial.propTypes = _speedDial2$1.default ;
SpeedDial.defaultProps = _speedDial4.default;
SpeedDial.contextTypes = {
	muiTheme: _propTypes2$1.default.object.isRequired
};

speedDial.default = SpeedDial;

var bubbleList = {};

var bubbleList_styles = {};

Object.defineProperty(bubbleList_styles, "__esModule", {
	value: true
});

var _transitions = transitions;

var _transitions2 = _interopRequireDefault$3(_transitions);

function _interopRequireDefault$3(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

bubbleList_styles.default = function () {
	return {
		root: {
			main: {
				position: 'absolute',
				opacity: 1,
				padding: 0,
				margin: 0,
				width: 320,
				transition: _transitions2.default.easeOut()
			},

			// prop direction
			direction: {
				down: {
					top: 0
				},
				up: {
					bottom: 0
				},
				right: {
					left: 0
				},
				left: {
					right: 0
				},
				down_inline: {
					paddingTop: 40
				},
				up_inline: {
					paddingBottom: 40
				}
			},

			// prop alignment
			alignment: {
				down: {
					top: 0
				},
				up: {
					bottom: -7
				},
				right: {
					right: 0,
					textAlign: 'right'
				},
				left: {
					left: 0,
					textAlign: 'left'
				},
				middle: {
					top: -22
				}
			},

			// prop isOpen = true
			visible: {
				main: {
					opacity: 1
				}
			},

			// prop isOpen = false
			invisible: {
				main: {
					opacity: 0
				}
			}
		}
	};
};

Object.defineProperty(bubbleList, "__esModule", {
	value: true
});

var _getPrototypeOf = getPrototypeOf.exports;

var _getPrototypeOf2 = _interopRequireDefault$2(_getPrototypeOf);

var _classCallCheck2 = classCallCheck;

var _classCallCheck3 = _interopRequireDefault$2(_classCallCheck2);

var _createClass2 = createClass;

var _createClass3 = _interopRequireDefault$2(_createClass2);

var _possibleConstructorReturn2 = possibleConstructorReturn;

var _possibleConstructorReturn3 = _interopRequireDefault$2(_possibleConstructorReturn2);

var _inherits2 = inherits;

var _inherits3 = _interopRequireDefault$2(_inherits2);

var _typeof2 = _typeof;

var _typeof3 = _interopRequireDefault$2(_typeof2);

var _simpleAssign = simpleAssign;

var _simpleAssign2 = _interopRequireDefault$2(_simpleAssign);

var _react$1 = react;

var _react2$1 = _interopRequireDefault$2(_react$1);

var _propTypes = propTypes.exports;

var _propTypes2 = _interopRequireDefault$2(_propTypes);

var _bubbleList$1 = bubbleList_styles;

var _bubbleList2$1 = _interopRequireDefault$2(_bubbleList$1);

function _interopRequireDefault$2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {Object} child - the child component or node
 * @param {string} displayName - the displayName
 * @returns {boolean} returns true if child is component with given displayName
 */
function isValidChild(child, displayName) {
	return child !== null && (typeof child === 'undefined' ? 'undefined' : (0, _typeof3.default)(child)) === 'object' && !(child instanceof Array) && child.type && child.type.displayName === displayName;
}

/**
 * Class BubbleList
 */

var BubbleList = function (_React$Component) {
	(0, _inherits3.default)(BubbleList, _React$Component);

	/**
  * @param {Object} props - component props
  * @param {Object} muiTheme - the muiTheme in context
  * @returns {void}
  */
	function BubbleList(props, _ref) {
		var muiTheme = _ref.muiTheme;
		(0, _classCallCheck3.default)(this, BubbleList);

		var _this = (0, _possibleConstructorReturn3.default)(this, (BubbleList.__proto__ || (0, _getPrototypeOf2.default)(BubbleList)).call(this, props));

		_this.styles = (0, _bubbleList2$1.default)(muiTheme);
		_this.getStylesMain = _this.getStylesMain.bind(_this);
		_this.renderChild = _this.renderChild.bind(_this);
		return _this;
	}

	/**
  * @returns {Object} styles for root element
  */


	(0, _createClass3.default)(BubbleList, [{
		key: 'getStylesMain',
		value: function getStylesMain() {
			var _props = this.props,
			    isOpen = _props.isOpen,
			    _props$direction = _props.direction,
			    direction = _props$direction === undefined ? 'up' : _props$direction,
			    _props$alignment = _props.alignment,
			    alignment = _props$alignment === undefined ? 'right' : _props$alignment,
			    _props$positionV = _props.positionV,
			    positionV = _props$positionV === undefined ? 'bottom' : _props$positionV;

			var styles = this.styles;
			var visibleStr = isOpen ? 'visible' : 'invisible';
			return (0, _simpleAssign2.default)({}, styles.root.main, styles.root[visibleStr].main, styles.root.direction[direction], styles.root.direction[direction + '_' + positionV], styles.root.alignment[alignment]);
		}

		/**
   * @param {XML|Object} child - the child component
   * @param {string|undefined} child.type - the child component type
   * @param {string|undefined} child.type.displayName - the child component displayName
   * @param {number} index - the child index
   * @returns {XML} returns the cloned child component
   */

	}, {
		key: 'renderChild',
		value: function renderChild(child, index) {
			var _props2 = this.props,
			    isOpen = _props2.isOpen,
			    isInTransition = _props2.isInTransition,
			    _props2$direction = _props2.direction,
			    direction = _props2$direction === undefined ? 'up' : _props2$direction,
			    _props2$alignment = _props2.alignment,
			    alignment = _props2$alignment === undefined ? 'right' : _props2$alignment;


			if (!isValidChild(child, 'BubbleListItem')) {
				return child;
			}

			return _react2$1.default.cloneElement(child, {
				key: index,
				isOpen: isOpen,
				isInTransition: isInTransition,
				alignment: alignment,
				direction: direction,
				ref: 'listItem' + index
			});
		}

		/**
   * @returns {XML|Array} returns the children component's
   */

	}, {
		key: 'renderChildren',
		value: function renderChildren() {
			var children = this.props.children;


			if (!children) {
				return _react2$1.default.createElement('ul', { style: this.getStylesMain() });
			}

			if (!isValidChild(children, 'BubbleListItem')) {
				if (children instanceof Array) {
					return children.map(this.renderChild);
				}
				return children;
			}

			return this.renderChild(children, 0);
		}

		/**
   * @returns {XML} returns the component
   */

	}, {
		key: 'render',
		value: function render() {
			var className = this.props.className;


			return _react2$1.default.createElement(
				'ul',
				{ className: className, style: this.getStylesMain() },
				this.renderChildren()
			);
		}
	}]);
	return BubbleList;
}(_react2$1.default.Component);

BubbleList.displayName = 'BubbleList';
BubbleList.propTypes = {
	alignment: _propTypes2.default.string,
	children: _propTypes2.default.any,
	className: _propTypes2.default.string,
	direction: _propTypes2.default.string,
	isInTransition: _propTypes2.default.bool,
	isOpen: _propTypes2.default.bool,
	positionV: _propTypes2.default.string
} ;
BubbleList.defaultProps = {
	isOpen: false,
	isInTransition: false
};
BubbleList.contextTypes = {
	muiTheme: _propTypes2.default.object.isRequired
};

bubbleList.default = BubbleList;

var SpeedDial_1;
var BubbleList_1;

Object.defineProperty(dist, "__esModule", {
  value: true
});
var BubbleListItem_1 = dist.BubbleListItem = BubbleList_1 = dist.BubbleList = SpeedDial_1 = dist.SpeedDial = undefined;

var _speedDial = speedDial;

var _speedDial2 = _interopRequireDefault$1(_speedDial);

var _bubbleList = bubbleList;

var _bubbleList2 = _interopRequireDefault$1(_bubbleList);

var _bubbleListItem = bubbleListItem;

var _bubbleListItem2 = _interopRequireDefault$1(_bubbleListItem);

function _interopRequireDefault$1(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

SpeedDial_1 = dist.SpeedDial = _speedDial2.default;
BubbleList_1 = dist.BubbleList = _bubbleList2.default;
BubbleListItem_1 = dist.BubbleListItem = _bubbleListItem2.default;

var ProgramSpeedDial = /*#__PURE__*/function (_React$Component) {
  _inherits(ProgramSpeedDial, _React$Component);

  var _super = _createSuper(ProgramSpeedDial);

  function ProgramSpeedDial(props, context) {
    var _this;

    _classCallCheck(this, ProgramSpeedDial);

    _this = _super.call(this, props, context);
    _this.state = {
      items: [{
        id: 'WITHOUT_REGISTRATION',
        primaryText: context.d2.i18n.getTranslation('event_program'),
        rightAvatar: /*#__PURE__*/react.createElement(_default$4, {
          className: "material-icons",
          icon: /*#__PURE__*/react.createElement(_default$2, null, "event")
        })
      }, {
        id: 'WITH_REGISTRATION',
        primaryText: context.d2.i18n.getTranslation('tracker_program'),
        rightAvatar: /*#__PURE__*/react.createElement(_default$4, {
          className: "material-icons",
          icon: /*#__PURE__*/react.createElement(_default$2, null, "assignment")
        })
      }]
    };
    return _this;
  }

  _createClass(ProgramSpeedDial, [{
    key: "handleClick",
    value: function handleClick(item) {
      goToRoute("/edit/".concat(this.props.groupName, "/").concat(this.props.modelType, "/add?type=").concat(item.id));
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return /*#__PURE__*/react.createElement(SpeedDial_1, {
        hasBackdrop: true
      }, /*#__PURE__*/react.createElement(BubbleList_1, null, this.state.items.map(function (item, index) {
        return /*#__PURE__*/react.createElement(BubbleListItem_1, _extends$2({
          key: item.id
        }, item, {
          onClick: _this2.handleClick.bind(_this2, item)
        }));
      })));
    }
  }]);

  return ProgramSpeedDial;
}(react.Component);

ProgramSpeedDial = addD2Context(ProgramSpeedDial);
var ListActionBar = react.createClass({
  displayName: "ListActionBar",
  propTypes: {
    modelType: react.PropTypes.string.isRequired,
    groupName: react.PropTypes.string.isRequired
  },
  _addClick: function _addClick() {
    goToRoute("/edit/".concat(this.props.groupName, "/").concat(this.props.modelType, "/add"));
  },
  render: function render() {
    var cssStyles = {
      textAlign: 'right',
      marginTop: '1rem',
      bottom: '1.5rem',
      right: '1.5rem',
      position: 'fixed',
      zIndex: 10
    };
    var modelDefinition = this.props.getModelDefinitionByName(this.props.modelType);

    if (!this.props.getCurrentUser().canCreate(modelDefinition)) {
      return null;
    }

    if (this.props.modelType === 'program' && !this.props.getCurrentUser().canCreate(this.props.getModelDefinitionByName('programStage'))) {
      return null;
    }

    return /*#__PURE__*/react.createElement("div", {
      style: cssStyles
    }, this.props.modelType === 'program' ? /*#__PURE__*/react.createElement(ProgramSpeedDial, this.props) : /*#__PURE__*/react.createElement(_default$5, {
      onClick: this._addClick
    }, /*#__PURE__*/react.createElement(_default$2, {
      className: "material-icons"
    }, "add")));
  }
});
var ListActionBar$1 = withAuth(ListActionBar);

var ObservedEvents = {
  getInitialState: function getInitialState() {
    this.events = {};
    this.eventSubjects = {};
    return {};
  },
  createEventObserver: function createEventObserver() {
    var subjectMap = new Map();
    return function ObservedEventHandler(referenceName) {
      var subject;

      if (!subjectMap.has(referenceName)) {
        subject = new Subject();
        subjectMap.set(referenceName, subject);
      } else {
        subject = subjectMap.get(referenceName);
      }

      if (!this.events[referenceName]) {
        // Run a map that keeps a copy of the event
        this.events[referenceName] = subject.map(function (event) {
          return Object.assign({}, event);
        });
      }

      return function (event) {
        subject.next(event);
      };
    };
  }(),
  componentWillUnmount: function componentWillUnmount() {
    var _this = this;

    // Complete any eventsSubjects
    Object.keys(this.eventSubjects).forEach(function (eventSubjectKey) {
      log.debug("Completing: ".concat([_this.constructor.name, eventSubjectKey].join('.')));

      _this.eventSubjects[eventSubjectKey].completed();
    });
  }
};

var unsearchableSections = ['organisationUnit'];
var SearchBox = react.createClass({
  displayName: "SearchBox",
  propTypes: {
    searchObserverHandler: react.PropTypes.func.isRequired,
    initialValue: react.PropTypes.string
  },
  mixins: [ObservedEvents, Translate],
  getInitialState: function getInitialState() {
    return {
      showSearchField: false,
      value: this.props.initialValue || ''
    };
  },
  componentWillMount: function componentWillMount() {
    this.searchBoxCb = this.createEventObserver('searchBox');
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    // Searchbox is not remounted when switching sections,
    // Clear the value when this happens
    if (this.props.params.modelType !== nextProps.params.modelType) {
      this.setState({
        value: ''
      });
    }
  },
  componentDidMount: function componentDidMount() {
    var _this = this;

    var searchObserver = this.events.searchBox.debounceTime(400).map(function (event) {
      return event && event.target && event.target.value ? event.target.value : '';
    }).distinctUntilChanged();
    this.props.searchObserverHandler(searchObserver);
    this.subscription = currentSubSection$.subscribe(function (currentSection) {
      return _this.setState(_objectSpread2(_objectSpread2({}, _this.state), {}, {
        showSearchField: !unsearchableSections.includes(currentSection)
      }));
    });
  },
  componentWillUnmount: function componentWillUnmount() {
    this.subscription && this.subscription.unsubscribe && this.subscription.unsubscribe();
  },
  render: function render() {
    var style = {
      display: 'inline-block',
      marginRight: 16,
      position: 'relative',
      top: -15
    };
    return this.state.showSearchField ? /*#__PURE__*/react.createElement("div", {
      className: "search-list-items",
      style: style
    }, /*#__PURE__*/react.createElement(_default$6, {
      className: "list-search-field",
      value: this.state.value,
      fullWidth: false,
      type: "search",
      onChange: this._onKeyUp,
      floatingLabelText: "".concat(this.getTranslation('search_by_name_code_id'))
    })) : null;
  },
  _onKeyUp: function _onKeyUp(event) {
    this.setState({
      value: event.target.value
    });
    this.searchBoxCb(event);
  }
});
var SearchBox$1 = withRouter(SearchBox);

var LoadingStatus = react.createClass({
  displayName: "LoadingStatus.component",
  propTypes: {
    isLoading: react.PropTypes.bool.isRequired
  },
  getDefaultProps: function getDefaultProps() {
    return {
      isLoading: false
    };
  },
  render: function render() {
    if (!this.props.isLoading) {
      return null;
    }

    return /*#__PURE__*/react.createElement(_default$7, {
      mode: "indeterminate",
      style: {
        backgroundColor: 'lightblue'
      }
    });
  }
});

var PredictorDialog = /*#__PURE__*/function (_React$Component) {
  _inherits(PredictorDialog, _React$Component);

  var _super = _createSuper(PredictorDialog);

  function PredictorDialog() {
    var _this;

    _classCallCheck(this, PredictorDialog);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    _this.state = {
      open: false,
      running: false
    };
    _this.getTranslation = _this.context.d2.i18n.getTranslation.bind(_this.context.d2.i18n);
    _this.setStartDate = _this.setStartDate.bind(_assertThisInitialized(_this));
    _this.setEndDate = _this.setEndDate.bind(_assertThisInitialized(_this));
    _this.executeAction = _this.executeAction.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(PredictorDialog, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this.subscriptions = [];
      this.subscriptions.push(predictorDialogStore.subscribe(function (state) {
        return _this2.setState(state);
      }));
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.subscriptions.forEach(function (disposable) {
        return disposable.unsubscribe && disposable.unsubscribe();
      });
    }
  }, {
    key: "requestClose",
    value: function requestClose() {
      predictorDialogStore.setState(Object.assign({}, predictorDialogStore.state, {
        open: false
      }));
    }
  }, {
    key: "setStartDate",
    value: function setStartDate(e, value) {
      var d = new Date(value);
      this.setState({
        startDate: "".concat(d.getFullYear(), "-").concat(d.getMonth() + 1, "-").concat(d.getDate())
      });
    }
  }, {
    key: "setEndDate",
    value: function setEndDate(e, value) {
      var d = new Date(value);
      this.setState({
        endDate: "".concat(d.getFullYear(), "-").concat(d.getMonth() + 1, "-").concat(d.getDate())
      });
    }
  }, {
    key: "executeAction",
    value: function () {
      var _executeAction = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _this3 = this;

        var d2, href, targetUrl;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return getInstance();

              case 2:
                d2 = _context.sent;
                href = [this.state.model.modelDefinition.plural, this.state.model.id, 'run'].join('/');
                targetUrl = "".concat(href, "?startDate=").concat(this.state.startDate, "&endDate=").concat(this.state.endDate);
                this.setState({
                  running: true
                });
                d2.Api.getApi().post(targetUrl, {
                  startDate: this.state.startDate,
                  endDate: this.state.endDate
                }).then(function (res) {
                  snackActions.show({
                    message: res.message,
                    action: 'ok'
                  });

                  _this3.setState({
                    open: false,
                    running: false
                  });
                })["catch"](function (err) {
                  snackActions.show({
                    message: "".concat(_this3.getTranslation('failed_to_start_predictor'), ": ").concat(err.message),
                    action: 'ok'
                  });

                  _this3.setState({
                    open: false,
                    running: false
                  });

                  console.error(err);
                });

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function executeAction() {
        return _executeAction.apply(this, arguments);
      }

      return executeAction;
    }()
  }, {
    key: "render",
    value: function render() {
      var actions = [/*#__PURE__*/react.createElement(_default$8, {
        label: this.getTranslation('cancel'),
        onClick: this.requestClose,
        style: {
          marginRight: 16
        },
        disabled: this.state.running
      }), /*#__PURE__*/react.createElement(_default$9, {
        label: this.getTranslation('run_predictor'),
        primary: true,
        onClick: this.executeAction,
        disabled: !this.state.startDate || !this.state.endDate || this.state.running
      })];
      return /*#__PURE__*/react.createElement(_default$a, {
        open: this.state.open,
        actions: actions,
        title: this.getTranslation('run_predictor'),
        contentStyle: {
          maxWidth: 450
        },
        bodyStyle: {
          marginLeft: 64
        },
        autoScrollBodyContent: true
      }, this.state.running ? /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement("div", {
        style: {
          textAlign: 'center',
          marginRight: 64
        }
      }, this.getTranslation('running_predictor')), /*#__PURE__*/react.createElement("div", {
        style: {
          marginTop: 32,
          marginRight: 64,
          textAlign: 'center'
        }
      }, /*#__PURE__*/react.createElement(_default$b, null))) : /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement(_default$c, {
        autoOk: true,
        floatingLabelText: "".concat(this.getTranslation('start_date'), " (*)"),
        onChange: this.setStartDate
      }), /*#__PURE__*/react.createElement(_default$c, {
        autoOk: true,
        floatingLabelText: "".concat(this.getTranslation('end_date'), " (*)"),
        onChange: this.setEndDate
      })), /*#__PURE__*/react.createElement("div", {
        style: {
          marginBottom: 16
        }
      }));
    }
  }]);

  return PredictorDialog;
}(react.Component);

PredictorDialog.contextTypes = {
  d2: react.PropTypes.any
};

var itemsAvailableStore = Store.create();
var itemsSelectedStore = Store.create();

var CompulsoryDataElementOperandDialog = /*#__PURE__*/function (_Component) {
  _inherits(CompulsoryDataElementOperandDialog, _Component);

  var _super = _createSuper(CompulsoryDataElementOperandDialog);

  function CompulsoryDataElementOperandDialog(props, context) {
    var _this;

    _classCallCheck(this, CompulsoryDataElementOperandDialog);

    _this = _super.call(this, props, context);

    _defineProperty(_assertThisInitialized(_this), "_changeFilter", function (event) {
      _this.setState({
        filterText: event.target.value
      });
    });

    _defineProperty(_assertThisInitialized(_this), "_assignItems", /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(selectedItems) {
        var newState;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                newState = itemsSelectedStore.getState().concat(selectedItems);
                itemsSelectedStore.setState(newState);
                return _context.abrupt("return", Promise.resolve(true));

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());

    _defineProperty(_assertThisInitialized(_this), "_removeItems", function (selectedItems) {
      var newState = itemsSelectedStore.getState().filter(function (item) {
        return selectedItems.indexOf(item) === -1;
      });
      itemsSelectedStore.setState(newState);
      return Promise.resolve(true);
    });

    _defineProperty(_assertThisInitialized(_this), "_saveCollection", function () {
      var collectionToSave = itemsSelectedStore.getState().map(function (combinationId) {
        return combinationId.split('.');
      }).filter(function (ids) {
        return ids.length === 2;
      }).map(function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2),
            dataElementId = _ref3[0],
            categoryOptionComboId = _ref3[1];

        return {
          dataElement: {
            id: dataElementId
          },
          categoryOptionCombo: {
            id: categoryOptionComboId
          }
        };
      });

      _this.setState({
        isSaving: true
      }); // TODO: Should be done propery without modifying props and preferably without saving the whole model


      _this.props.model.compulsoryDataElementOperands = collectionToSave;

      _this.props.model.save().then(function () {
        snackActions.show({
          message: 'saved_compulsory_data_elements',
          translate: true
        });
      })["catch"](function () {
        snackActions.show({
          message: 'failed_to_save_compulsory_data_elements',
          action: 'ok',
          translate: true
        });
      }).then(function () {
        _this.setState({
          isSaving: false
        });

        _this.props.onRequestClose();
      });
    });

    _this.state = {
      filterText: '',
      isSaving: false
    };
    _this.i18n = context.d2.i18n;

    if (props.dataElementOperands && props.model) {
      itemsAvailableStore.setState(props.dataElementOperands.map(function (operand) {
        return {
          text: operand.displayName,
          value: "".concat(operand.dataElementId, ".").concat(operand.optionComboId)
        };
      }));
      itemsSelectedStore.setState(props.model.compulsoryDataElementOperands.filter(function (deo) {
        return deo.dataElement && deo.categoryOptionCombo;
      }).map(function (deo) {
        return "".concat(deo.dataElement.id, ".").concat(deo.categoryOptionCombo.id);
      }));
    }

    return _this;
  }

  _createClass(CompulsoryDataElementOperandDialog, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(props) {
      if (!props.open) {
        itemsAvailableStore.setState(undefined);
        itemsSelectedStore.setState([]);
      } else if (props.dataElementOperands && props.model) {
        itemsAvailableStore.setState(props.dataElementOperands.map(function (operand) {
          return {
            text: operand.displayName,
            value: [operand.dataElementId, operand.optionComboId].join('.')
          };
        }));
        itemsSelectedStore.setState(props.model.compulsoryDataElementOperands.filter(function (deo) {
          return deo.dataElement && deo.categoryOptionCombo;
        }).map(function (deo) {
          return [deo.dataElement.id, deo.categoryOptionCombo.id].join('.');
        }));
      }
    }
  }, {
    key: "render",
    value: function render() {
      var saveButtonText = this.state.isSaving ? this.i18n.getTranslation('saving') : this.i18n.getTranslation('save');
      var dialogActions = [/*#__PURE__*/react.createElement(_default$d, {
        disabled: this.state.isSaving,
        style: {
          marginRight: '1rem'
        },
        onClick: this.props.onRequestClose,
        label: this.i18n.getTranslation('close')
      }), /*#__PURE__*/react.createElement(_default$e, {
        labelColor: "white",
        disabled: this.state.isSaving,
        primary: true,
        onClick: this._saveCollection,
        label: saveButtonText
      })];
      return /*#__PURE__*/react.createElement(_default$f, {
        open: this.props.open,
        onRequestClose: this.props.onRequestClose,
        autoScrollBodyContent: true,
        modal: true,
        actions: dialogActions,
        contentStyle: {
          maxWidth: 'none',
          width: '95%'
        }
      }, /*#__PURE__*/react.createElement("div", {
        style: {
          marginBottom: '3.5rem'
        }
      }, /*#__PURE__*/react.createElement(Heading, null, this.i18n.getTranslation('edit_compulsory_data_elements'), " - ", this.props.model && this.props.model.displayName), /*#__PURE__*/react.createElement(_default$6, {
        floatingLabelText: this.i18n.getTranslation('filter'),
        style: {
          width: '100%'
        },
        onChange: this._changeFilter
      }), /*#__PURE__*/react.createElement(GroupEditor, {
        itemStore: itemsAvailableStore,
        assignedItemStore: itemsSelectedStore,
        onAssignItems: this._assignItems,
        onRemoveItems: this._removeItems,
        height: 350,
        filterText: this.state.filterText
      })));
    }
  }]);

  return CompulsoryDataElementOperandDialog;
}(react.Component);

var CompulsoryDataElementOperandDialog$1 = addD2Context(CompulsoryDataElementOperandDialog);

var remove = {};

Object.defineProperty(remove, "__esModule", {
  value: true
});

var _react = react;

var _react2 = _interopRequireDefault(_react);

var _pure = pure;

var _pure2 = _interopRequireDefault(_pure);

var _SvgIcon = SvgIcon;

var _SvgIcon2 = _interopRequireDefault(_SvgIcon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ContentRemove = function ContentRemove(props) {
  return _react2.default.createElement(
    _SvgIcon2.default,
    props,
    _react2.default.createElement('path', { d: 'M19 13H5v-2h14v2z' })
  );
};
ContentRemove = (0, _pure2.default)(ContentRemove);
ContentRemove.displayName = 'ContentRemove';
ContentRemove.muiName = 'SvgIcon';

var _default = remove.default = ContentRemove;

var removeProps = _default$g(function () {
  return {};
});
var renderNothingWhenValueIsNotAString = _default$h(function (_ref) {
  var value = _ref.value;
  return !fp.isString(value);
}, _default$i);
var BooleanCellField = _default$h(function (_ref2) {
  var value = _ref2.value;
  return value === true;
}, _default$j(removeProps(_default$k)))(removeProps(_default)); // For boolean valueTypes render a check mark icon when the value is true or a dash for when it is false.

addValueRenderer(function (_ref3) {
  var valueType = _ref3.valueType;
  return valueType === 'BOOLEAN';
}, BooleanCellField); // For a formType field render a translated version of the value (e.g "SECTION -> Sectie" for the nlNL locale)

addValueRenderer(function (_ref4) {
  var columnName = _ref4.columnName,
      valueType = _ref4.valueType;
  return columnName === 'formType' && valueType === 'CONSTANT';
}, renderNothingWhenValueIsNotAString(function (_ref5) {
  var value = _ref5.value;
  return /*#__PURE__*/react.createElement(Translate$1, null, value.toLowerCase());
}));

var ContextMenuHeader = /*#__PURE__*/function (_Component) {
  _inherits(ContextMenuHeader, _Component);

  var _super = _createSuper(ContextMenuHeader);

  function ContextMenuHeader() {
    var _this;

    _classCallCheck(this, ContextMenuHeader);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      open: false
    });

    _defineProperty(_assertThisInitialized(_this), "handleOpen", function (event) {
      // This prevents ghost click.
      event.preventDefault();

      _this.setState({
        open: true,
        anchorEl: event.currentTarget
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleRequestClose", function () {
      _this.setState({
        open: false
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleAction", function (action) {
      _this.handleRequestClose();

      action();
    });

    return _this;
  }

  _createClass(ContextMenuHeader, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var actions = this.props.actions.map(function (action) {
        return /*#__PURE__*/react.createElement(_default$l, {
          primaryText: action.title,
          key: action.title,
          leftIcon: /*#__PURE__*/react.createElement(_default$m, {
            className: "material-icons"
          }, action.icon),
          onClick: function onClick() {
            return _this2.handleAction(action.action);
          }
        });
      });
      return /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement(_default$n, {
        onClick: this.handleOpen
      }, /*#__PURE__*/react.createElement(_default$m, {
        color: "gray",
        className: "material-icons"
      }, "settings")), /*#__PURE__*/react.createElement(_default$o, {
        open: this.state.open,
        anchorEl: this.state.anchorEl,
        anchorOrigin: {
          horizontal: 'left',
          vertical: 'bottom'
        },
        targetOrigin: {
          horizontal: 'left',
          vertical: 'top'
        },
        onRequestClose: this.handleRequestClose
      }, /*#__PURE__*/react.createElement(_default$p, null, actions)));
    }
  }]);

  return ContextMenuHeader;
}(react.Component);

_defineProperty(ContextMenuHeader, "propTypes", {
  actions: PropTypes.array
});

var styles = {
  dataTableWrap: {
    display: 'flex',
    flexDirection: 'column',
    flex: 2
  },
  detailsBoxWrap: {
    flex: 1,
    marginLeft: '1rem',
    marginRight: '1rem',
    opacity: 1,
    flexGrow: 0
  },
  listDetailsWrap: {
    flex: 1,
    display: 'flex',
    flexOrientation: 'row'
  },
  filterWrap: {
    clear: 'both',
    minHeight: 80
  },
  box: {
    display: 'inline-block',
    marginRight: 16,
    width: 256
  },
  topPagination: {
    "float": 'right'
  },
  bottomPagination: {
    marginTop: '-2rem',
    paddingBottom: '0.5rem'
  },
  filtersDropDownAsync: {
    display: 'relative'
  }
}; // Filters out any actions `edit`, `clone` when the user can not update/edit this modelType

function actionsThatRequireCreate(action) {
  var modelDef = this.props.getModelDefinitionByName(this.props.params.modelType);

  if (action !== 'edit' && action !== 'clone' || this.props.getCurrentUser().canUpdate(modelDef)) {
    return true;
  }

  return false;
} // Filters out the `delete` when the user can not delete this modelType


function actionsThatRequireDelete(action) {
  var modelDef = this.props.getModelDefinitionByName(this.props.params.modelType);

  if (action !== 'delete' || this.props.getCurrentUser().canDelete(modelDef)) {
    return true;
  }

  return false;
}

function getTranslatablePropertiesForModelType(modelType, model) {
  var fieldsForModel = new Set(fieldOrder["for"](modelType));
  var defaultTranslatableProperties = ['name', 'shortName'];

  if (!model) {
    return defaultTranslatableProperties;
  }

  return model.modelDefinition.getTranslatableProperties().filter(function (prop) {
    return fieldsForModel.has(prop);
  }); // ensure translationkey is in model-form
}
var modelsThatMapToOtherDisplayName = {
  program: {
    programType: {
      WITH_REGISTRATION: 'TRACKER_PROGRAM',
      WITHOUT_REGISTRATION: 'EVENT_PROGRAM'
    }
  }
};

function getConstantDisplayNameOrOld(modelType, fieldName, oldVal) {
  return modelsThatMapToOtherDisplayName[modelType] && modelsThatMapToOtherDisplayName[modelType][fieldName] ? modelsThatMapToOtherDisplayName[modelType][fieldName][oldVal] : oldVal;
}

var List = /*#__PURE__*/function (_Component) {
  _inherits(List, _Component);

  var _super = _createSuper(List);

  function List() {
    var _this;

    _classCallCheck(this, List);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      dataRows: [],
      pager: {
        total: 0
      },
      isLoading: true,
      detailsObject: null,
      sharing: {
        model: null,
        open: false
      },
      translation: {
        model: null,
        open: false
      },
      orgunitassignment: {
        model: null,
        open: false
      },
      dataElementOperand: {
        model: null,
        open: false
      },
      predictorDialog: {
        open: false
      }
    });

    _defineProperty(_assertThisInitialized(_this), "getTranslation", function (key) {
      return _this.context.d2.i18n.getTranslation(key);
    });

    _defineProperty(_assertThisInitialized(_this), "translationSaved", function () {
      snackActions.show({
        message: 'translation_saved',
        translate: true
      });
    });

    _defineProperty(_assertThisInitialized(_this), "translationError", function (errorMessage) {
      log.error(errorMessage);
      snackActions.show({
        message: 'translation_save_error',
        action: 'ok',
        translate: true
      });
    });

    _defineProperty(_assertThisInitialized(_this), "isContextActionAllowed", function (model, action) {
      // Don't allow anything if we can't determine the access
      if (!model || !model.access) {
        return false;
      } // TODO: Remove categoryOptionCombo available actions hack when this is sorted through the API


      if (model.modelDefinition.name === 'categoryOptionCombo') {
        if (action === 'edit') {
          return model.access.write;
        }

        if (action === 'details') {
          return model.access.read;
        }

        return false;
      } // Shortcut for access detection where action names match to access properties


      if (model.access.hasOwnProperty(action)) {
        return model.access[action];
      }

      if (action === 'runNow' && model.modelDefinition.name === 'predictor') {
        return _this.context.d2.currentUser.authorities.has('F_PREDICTOR_RUN');
      } // Switch action for special cases


      switch (action) {
        case 'edit':
          return model.modelDefinition.name !== 'locale' && model.access.write;

        case 'clone':
          return !['dataSet', 'program', 'locale', 'sqlView', 'optionSet'].includes(model.modelDefinition.name) && model.access.write;

        case 'translate':
          return model.access.read && model.modelDefinition.identifiableObject && model.modelDefinition.name !== 'sqlView';

        case 'details':
          return model.access.read;

        case 'share':
          return model.modelDefinition.isShareable === true && model.access.write;

        case 'compulsoryDataElements':
          return model.modelDefinition.name === 'dataSet' && model.access.write;

        case 'sectionForm':
          return model.modelDefinition.name === 'dataSet' && model.access.write;

        case 'dataEntryForm':
          return model.modelDefinition.name === 'dataSet' && model.access.write;

        case 'pdfDataSetForm':
          return model.modelDefinition.name === 'dataSet' && model.access.read;

        case 'runNow':
          return model.modelDefinition.name === 'pushAnalysis' && model.access.write;

        case 'preview':
          return model.modelDefinition.name === 'pushAnalysis' && model.access.write;

        case 'executeQuery':
          return model.modelDefinition.name === 'sqlView' && model.access.read && ['MATERIALIZED_VIEW', 'VIEW'].includes(model.type);

        case 'refresh':
          return model.modelDefinition.name === 'sqlView' && model.access.read && model.type === 'MATERIALIZED_VIEW';

        case 'showSqlView':
          return model.modelDefinition.name === 'sqlView' && model.access.read;

        default:
          return true;
      }
    });

    _defineProperty(_assertThisInitialized(_this), "searchListByName", function (searchObserver) {
      var searchListByNameDisposable = searchObserver.subscribe(function (value) {
        _this.setState({
          isLoading: true
        });

        listActions.searchByName({
          modelType: _this.props.params.modelType,
          searchString: value
        }).subscribe(function () {}, function (error) {
          return log.error(error);
        });
      });

      _this.registerDisposable(searchListByNameDisposable);
    });

    _defineProperty(_assertThisInitialized(_this), "closeTranslationDialog", function () {
      translationStore.setState(Object.assign({}, translationStore.state, {
        open: false
      }));
    });

    _defineProperty(_assertThisInitialized(_this), "closeSharingDialog", function (sharingState) {
      var model = sharingState ? Object.assign(sharingStore.state.model, {
        publicAccess: sharingState.publicAccess
      }) : sharingStore.state.model;
      sharingStore.setState(Object.assign({}, sharingStore.state, {
        model: model,
        open: false
      }));
    });

    _defineProperty(_assertThisInitialized(_this), "closeDataElementOperandDialog", function () {
      dataElementOperandStore.setState(Object.assign({}, dataElementOperandStore.state, {
        open: false
      }));
    });

    _defineProperty(_assertThisInitialized(_this), "renderFilters", function () {
      var makeFilterSetter = function makeFilterSetter(filterField) {
        return function (e) {
          _this.setState({
            isLoading: true
          });

          listActions.setFilterValue({
            filterField: filterField,
            filterValue: e.target.value,
            modelType: _this.props.params.modelType
          });
        };
      };

      return /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement(SearchBox$1, {
        initialValue: _this.state.searchString,
        searchObserverHandler: _this.searchListByName
      }), getFilterFieldsForType(_this.props.params.modelType).map(function (filterField) {
        var modelDefinition = _this.context.d2.models[_this.props.params.modelType];
        var isConstantField = modelDefinition.modelProperties.hasOwnProperty(filterField) && modelDefinition.modelProperties[filterField].hasOwnProperty('constants');
        var constants = isConstantField && modelDefinition.modelProperties[filterField].constants.map(function (c) {
          return {
            text: getConstantDisplayNameOrOld(_this.props.params.modelType, filterField, c),
            value: c
          };
        });
        var referenceType = _this.context.d2.models.hasOwnProperty(filterField) ? filterField : "".concat(_this.props.params.modelType, ".").concat(filterField);
        return /*#__PURE__*/react.createElement("div", {
          key: filterField,
          style: styles.box
        }, isConstantField ? /*#__PURE__*/react.createElement(Dropdown, {
          labelText: _this.getTranslation(filterField),
          options: constants,
          onChange: makeFilterSetter(filterField),
          value: _this.state.filters ? _this.state.filters[filterField] : null,
          translateOptions: filterField !== 'periodType'
        }) : /*#__PURE__*/react.createElement(DropDownAsync, {
          labelText: _this.getTranslation(filterField),
          referenceType: referenceType,
          onChange: makeFilterSetter(filterField),
          value: _this.state.filters ? _this.state.filters[filterField] : null,
          quickAddLink: false,
          preventAutoDefault: true,
          style: styles.filterDrowDownAsync,
          limit: 1,
          top: -15
        }));
      }));
    });

    return _this;
  }

  _createClass(List, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      var _this2 = this;

      this.observerDisposables = [];
      var sourceStoreDisposable = listStore.subscribe(function (listStoreValue) {
        if (!_default$q(listStoreValue.list) || listStoreValue.modelType !== _this2.props.params.modelType) {
          _this2.setState({
            isLoading: true
          });

          return; // Received value is not iterable or not correct model, keep waiting
        }

        listActions.hideDetailsBox();

        _this2.setState({
          dataRows: listStoreValue.list,
          pager: listStoreValue.pager,
          tableColumns: listStoreValue.tableColumns,
          filters: listStoreValue.filters,
          isLoading: false,
          searchString: listStoreValue.searchString,
          modelDefinition: listStoreValue.modelDefinition
        });
      });
      var detailsStoreDisposable = detailsStore.subscribe(function (detailsObject) {
        _this2.setState({
          detailsObject: detailsObject
        });
      });
      var sharingStoreDisposable = sharingStore.subscribe(function (sharingState) {
        _this2.setState(function (state) {
          return {
            sharing: sharingState,
            dataRows: state.dataRows.map(function (row) {
              if (row.id === sharingState.model.id) {
                return Object.assign(row, {
                  publicAccess: sharingState.model.publicAccess
                });
              }

              return row;
            })
          };
        });
      });
      var translationStoreDisposable = translationStore.subscribe(function (translationState) {
        _this2.setState({
          translation: translationState
        });
      });
      var dataElementOperandStoreDisposable = dataElementOperandStore.subscribe(function (state) {
        _this2.setState({
          dataElementOperand: state
        });
      });
      var predictorDialogStoreDisposable = predictorDialogStore.subscribe(function (state) {
        _this2.setState({
          predictorDialog: state
        });
      });
      this.registerDisposable(sourceStoreDisposable);
      this.registerDisposable(detailsStoreDisposable);
      this.registerDisposable(sharingStoreDisposable);
      this.registerDisposable(translationStoreDisposable);
      this.registerDisposable(dataElementOperandStoreDisposable);
      this.registerDisposable(predictorDialogStoreDisposable);
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(newProps) {
      if (this.props.params.modelType !== newProps.params.modelType) {
        this.setState({
          isLoading: true,
          translation: Object.assign({}, this.state.translation, {
            open: false
          })
        });
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.observerDisposables.forEach(function (disposable) {
        return disposable.unsubscribe();
      });
    }
  }, {
    key: "registerDisposable",
    value: function registerDisposable(disposable) {
      this.observerDisposables.push(disposable);
    }
  }, {
    key: "renderContextMenuHeader",
    value: function renderContextMenuHeader() {
      var _this3 = this;

      var modelDefinition = this.state.modelDefinition;
      var queryParamFilters = modelDefinition.filters.getQueryFilterValues();
      var downloadObjectProps = {
        name: modelDefinition.name,
        pluralName: modelDefinition.plural,
        queryParamFilters: queryParamFilters,
        objectCount: this.state.pager.total
      };
      var actions = [{
        title: this.getTranslation('manage_columns'),
        icon: 'view_column',
        action: this.props.openColumnsDialog
      }, {
        title: this.getTranslation('download'),
        icon: 'get_app',
        action: function action() {
          return _this3.props.openDialog(DOWNLOAD_OBJECT, downloadObjectProps);
        }
      }];
      return /*#__PURE__*/react.createElement(ContextMenuHeader, {
        actions: actions
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var currentlyShown = calculatePageValue(this.state.pager);
      var paginationProps = {
        hasNextPage: function hasNextPage() {
          return Boolean(_this4.state.pager.hasNextPage) && _this4.state.pager.hasNextPage();
        },
        hasPreviousPage: function hasPreviousPage() {
          return Boolean(_this4.state.pager.hasPreviousPage) && _this4.state.pager.hasPreviousPage();
        },
        onNextPageClick: function onNextPageClick() {
          _this4.setState({
            isLoading: true
          });

          listActions.getNextPage();
        },
        onPreviousPageClick: function onPreviousPageClick() {
          _this4.setState({
            isLoading: true
          });

          listActions.getPreviousPage();
        },
        total: this.state.pager.total,
        currentlyShown: currentlyShown
      };
      var availableActions = Object.keys(contextActions).filter(actionsThatRequireCreate, this).filter(actionsThatRequireDelete, this).filter(function (actionName) {
        if (actionName === 'share') {
          return _this4.context.d2.models[_this4.props.params.modelType] && _this4.context.d2.models[_this4.props.params.modelType].isShareable;
        }

        return true;
      }).reduce(function (actions, actionName) {
        // TODO: Don't re-assign param?
        actions[actionName] = contextActions[actionName]; // eslint-disable-line no-param-reassign

        return actions;
      }, {});
      var contextMenuIcons = {
        clone: 'content_copy',
        sharing: 'share',
        sectionForm: 'assignment_turned_in',
        dataEntryForm: 'assignment',
        pdfDataSetForm: 'picture_as_pdf',
        compulsoryDataElements: 'border_color',
        runNow: 'queue_play_next',
        preview: 'dashboard',
        executeQuery: 'playlist_play',
        refresh: 'refresh',
        showSqlView: 'view_module'
      }; // For table columns like 'a___b', flatten values to b being a child of a

      var magicallyUnwrapChildValues = function magicallyUnwrapChildValues(row) {
        _this4.state.tableColumns.reduce(function (o, col) {
          if (col.includes('___')) {
            var objectName = col.substr(0, col.indexOf('___'));
            var objectProp = col.substr(col.indexOf('___') + 3);
            Object.assign(o, _defineProperty({}, col, row && row[objectName] ? row[objectName][objectProp] : ''));
          }

          return o;
        }, row);

        return row;
      }; // Because "default" really means "None" and that's something everybody knows duh


      var defaultReallyMeansNone = function defaultReallyMeansNone(row) {
        if (row.categoryCombo && row.categoryCombo.displayName && row.categoryCombo.displayName === 'default' && row.categoryCombo___displayName === row.categoryCombo.displayName) {
          row.categoryCombo___displayName = _this4.getTranslation('none');
          row.categoryCombo.displayName = _this4.getTranslation('none');
        }

        return row;
      }; // Get translations for row values that are constants
      // Some props are read only on the model object, which means the can not be translated - boo!


      var translateConstants = function translateConstants(row) {
        var untranslatableColumnNames = {
          organisationUnit: ['level'],
          dataSet: ['formType']
        };

        var isTranslatable = function isTranslatable(modelType, columnName) {
          var b = !(untranslatableColumnNames.hasOwnProperty(modelType) && untranslatableColumnNames[modelType].includes(columnName));
          return b;
        };

        return row.noMoreGottaTranslateCauseIsDone ? row : _this4.state.tableColumns.reduce(function (prow, columnName) {
          if (isTranslatable(row.modelDefinition.name, columnName) && row && row.modelDefinition && row.modelDefinition.modelProperties[columnName] && row.modelDefinition.modelProperties[columnName].constants) {
            // Hack it to fix another hack - sweeet
            row.noMoreGottaTranslateCauseIsDone = true;

            if (row[columnName]) {
              prow[columnName] = _this4.getTranslation(getConstantDisplayNameOrOld(row.modelDefinition.name, columnName, row[columnName]).toLowerCase());
            }
          }

          return prow;
        }, row);
      };

      var primaryAction = function primaryAction(model) {
        if (model.access.write && model.modelDefinition.name !== 'locale') {
          availableActions.edit(model);
        } else {
          // TODO: The no access message should be replaced with the read-only mode described in DHIS2-1773
          var msg = model.modelDefinition.name === 'locale' ? 'locales_can_only_be_created_and_deleted' : 'you_do_not_have_permissions_to_edit_this_object';
          snackActions.show({
            message: msg,
            translate: true,
            action: 'dismiss'
          });
        }
      };

      return /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement(Heading, null, this.getTranslation("".concat(_default$1(this.props.params.modelType), "_management")), /*#__PURE__*/react.createElement(HelpLink, {
        schema: this.props.params.modelType
      })), /*#__PURE__*/react.createElement(ListActionBar$1, {
        modelType: this.props.params.modelType,
        groupName: this.props.params.groupName
      })), /*#__PURE__*/react.createElement("div", {
        style: styles.filterWrap
      }, /*#__PURE__*/react.createElement("div", {
        style: styles.topPagination
      }, /*#__PURE__*/react.createElement(Pagination, paginationProps)), this.renderFilters()), /*#__PURE__*/react.createElement(LoadingStatus, {
        loadingText: ['Loading', this.props.params.modelType, 'list...'].join(' '),
        isLoading: this.state.isLoading
      }), this.state.isLoading ? /*#__PURE__*/react.createElement("div", null, "Loading...") : /*#__PURE__*/react.createElement("div", {
        style: styles.listDetailsWrap
      }, /*#__PURE__*/react.createElement("div", {
        style: styles.dataTableWrap
      }, !!this.state.dataRows && !!this.state.dataRows.length ? /*#__PURE__*/react.createElement(DataTable, {
        rows: this.state.dataRows.map(magicallyUnwrapChildValues).map(defaultReallyMeansNone).map(translateConstants),
        columns: this.state.tableColumns,
        contextMenuActions: availableActions,
        contextMenuIcons: contextMenuIcons,
        primaryAction: primaryAction,
        isContextActionAllowed: this.isContextActionAllowed,
        contextMenuHeader: this.renderContextMenuHeader()
      }) : /*#__PURE__*/react.createElement("div", null, this.getTranslation('no_results_found'))), !!this.state.detailsObject && /*#__PURE__*/react.createElement(DetailsBoxWithScroll, {
        style: styles.detailsBoxWrap,
        detailsObject: this.state.detailsObject,
        onClose: listActions.hideDetailsBox
      })), !!this.state.dataRows && !!this.state.dataRows.length && /*#__PURE__*/react.createElement("div", {
        style: styles.bottomPagination
      }, /*#__PURE__*/react.createElement(Pagination, paginationProps)), !!this.state.sharing.model && /*#__PURE__*/react.createElement(SharingDialog, {
        d2: this.context.d2,
        id: this.state.sharing.model.id,
        type: this.props.params.modelType,
        open: this.state.sharing.model && this.state.sharing.open,
        onRequestClose: this.closeSharingDialog,
        bodyStyle: {
          minHeight: '400px'
        }
      }), !!this.state.translation.model && /*#__PURE__*/react.createElement(TranslationDialog, {
        objectToTranslate: this.state.translation.model,
        objectTypeToTranslate: this.state.translation.model && this.state.translation.model.modelDefinition,
        open: this.state.translation.open,
        onTranslationSaved: this.translationSaved,
        onTranslationError: this.translationError,
        onRequestClose: this.closeTranslationDialog,
        fieldsToTranslate: getTranslatablePropertiesForModelType(this.props.params.modelType, this.state.translation.model)
      }), /*#__PURE__*/react.createElement(CompulsoryDataElementOperandDialog$1, {
        model: this.state.dataElementOperand.model,
        dataElementOperands: this.state.dataElementOperand.dataElementOperands,
        open: this.state.dataElementOperand.open,
        onRequestClose: this.closeDataElementOperandDialog
      }), this.state.predictorDialog && /*#__PURE__*/react.createElement(PredictorDialog, null), /*#__PURE__*/react.createElement(DialogRouter, {
        groupName: this.props.params.groupName,
        modelType: this.props.params.modelType
      }));
    }
  }]);

  return List;
}(react.Component);

List.propTypes = {
  params: PropTypes.shape({
    modelType: PropTypes.string.isRequired,
    groupName: PropTypes.string.isRequired
  }).isRequired
};
List.contextTypes = {
  d2: PropTypes.object.isRequired
};
var mapDispatchToProps = {
  openColumnsDialog: openColumnsDialog,
  openDialog: openDialog
};
var List$1 = connect(null, mapDispatchToProps)(withAuth(List));

var List_component = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getTranslatablePropertiesForModelType: getTranslatablePropertiesForModelType,
  'default': List$1
});

export { BubbleList_1 as B, DetailsBoxWithScroll as D, List$1 as L, SpeedDial_1 as S, BubbleListItem_1 as a, List_component as b, getTranslatablePropertiesForModelType as g, withRouter as w };
