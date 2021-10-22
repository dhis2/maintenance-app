import { r as react, q as _objectWithoutProperties, H as Heading, s as _extends } from './index-44839b1a.js';

var _excluded = ["level", "children"];
var defaultStyle = {
  fontSize: '1.25rem',
  paddingTop: '.5rem',
  fontWeight: 100
};

function FormSubHeading(_ref) {
  var level = _ref.level,
      children = _ref.children,
      props = _objectWithoutProperties(_ref, _excluded);

  var style = Object.assign({}, defaultStyle, props.style);
  return /*#__PURE__*/react.createElement(Heading, _extends({}, props, {
    style: style,
    level: level || 3
  }), children);
}

FormSubHeading.propTypes = {
  children: react.PropTypes.string,
  level: react.PropTypes.number
};

export { FormSubHeading as F };
