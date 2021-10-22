import { P as PropTypes, a0 as addD2Context, q as _objectWithoutProperties, r as react, ag as _default, s as _extends } from './index-44839b1a.js';

var _excluded = ["label", "isSaving", "isValid", "onClick"];

function SaveButton(props, _ref) {
  var d2 = _ref.d2;

  var label = props.label,
      isSaving = props.isSaving;
      props.isValid;
      var onClick = props.onClick,
      rest = _objectWithoutProperties(props, _excluded);

  var buttonText = label ? label : isSaving ? d2.i18n.getTranslation('saving') : d2.i18n.getTranslation('save');
  return /*#__PURE__*/react.createElement(_default, _extends({}, rest, {
    primary: true,
    onClick: onClick,
    label: buttonText,
    disabled: isSaving
  }));
}

SaveButton.propTypes = {
  label: PropTypes.string,
  isSaving: PropTypes.bool,
  isValid: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};
SaveButton.defaultProps = {
  label: '',
  isSaving: false,
  isValid: true
};
var SaveButton$1 = addD2Context(SaveButton);

export { SaveButton$1 as S };
