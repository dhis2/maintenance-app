import { r as react, a0 as addD2Context, c7 as modelToEditStore, q as _objectWithoutProperties, _ as _default, s as _extends, P as PropTypes, H as Heading, c6 as goToAndScrollUp } from './index-44839b1a.js';
import { H as HelpLink } from './HelpLink.component-39e74935.js';

var _excluded$1 = ["tooltip", "onClick", "isDirtyHandler"];

function BackButton(props, context) {
  var tooltip = props.tooltip,
      onClick = props.onClick,
      _props$isDirtyHandler = props.isDirtyHandler,
      isDirtyHandler = _props$isDirtyHandler === void 0 ? modelToEditStore.getState.bind(modelToEditStore) : _props$isDirtyHandler,
      otherProps = _objectWithoutProperties(props, _excluded$1);

  var onClickWithConfirm = function onClickWithConfirm() {
    var isDirty = isDirtyHandler && isDirtyHandler() && isDirtyHandler().dirty;

    if (!isDirty) {
      onClick.apply(void 0, arguments);
    } else if ( // eslint-disable-next-line no-restricted-globals
    confirm(context.d2.i18n.getTranslation('abandon_unsaved_changes'))) {
      onClick.apply(void 0, arguments);
    }
  };

  return /*#__PURE__*/react.createElement(_default, _extends({
    tooltip: tooltip || context.d2.i18n.getTranslation('back'),
    tooltipPosition: "bottom-right",
    onClick: onClickWithConfirm
  }, otherProps, {
    iconClassName: "material-icons"
  }), "\uE5C4");
}

BackButton.propTypes = {
  tooltip: react.PropTypes.string
};
var BackButton$1 = addD2Context(BackButton);

var _excluded = ["level", "schema", "children", "groupName", "isDirtyHandler", "skipTranslation"];

function FormHeading(_ref, context) {
  var level = _ref.level,
      schema = _ref.schema,
      children = _ref.children,
      groupName = _ref.groupName,
      isDirtyHandler = _ref.isDirtyHandler,
      skipTranslation = _ref.skipTranslation,
      props = _objectWithoutProperties(_ref, _excluded);

  return /*#__PURE__*/react.createElement(Heading, _extends({}, props, {
    level: level
  }), /*#__PURE__*/react.createElement(BackButton$1, {
    onClick: function onClick() {
      return goToAndScrollUp("/list/".concat(groupName, "/").concat(schema));
    },
    iconStyle: {
      top: 3
    },
    isDirtyHandler: isDirtyHandler
  }), skipTranslation ? children : context.d2.i18n.getTranslation(children), schema && /*#__PURE__*/react.createElement(HelpLink, {
    schema: schema
  }));
}

FormHeading.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  level: PropTypes.number,
  isDirtyHandler: PropTypes.func,
  schema: PropTypes.string.isRequired,
  groupName: PropTypes.string.isRequired,
  skipTranslation: PropTypes.bool
};
FormHeading.defaultProps = {
  isDirtyHandler: function isDirtyHandler() {},
  level: 2,
  children: '',
  skipTranslation: false
};
var FormHeading$1 = addD2Context(FormHeading);

export { FormHeading$1 as F };
