import { S as pure, U as SvgIcon, r as react } from './index-44839b1a.js';

var add = {};

Object.defineProperty(add, "__esModule", {
  value: true
});

var _react = react;

var _react2 = _interopRequireDefault(_react);

var _pure = pure;

var _pure2 = _interopRequireDefault(_pure);

var _SvgIcon = SvgIcon;

var _SvgIcon2 = _interopRequireDefault(_SvgIcon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ContentAdd = function ContentAdd(props) {
  return _react2.default.createElement(
    _SvgIcon2.default,
    props,
    _react2.default.createElement('path', { d: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z' })
  );
};
ContentAdd = (0, _pure2.default)(ContentAdd);
ContentAdd.displayName = 'ContentAdd';
ContentAdd.muiName = 'SvgIcon';

var _default = add.default = ContentAdd;

export { _default as _, add as a };
