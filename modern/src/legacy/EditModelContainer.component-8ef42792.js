import { r as react, F as _default, s as _extends, c6 as goToAndScrollUp, P as PropTypes } from './index-44839b1a.js';
import { l as lib } from './HelpLink.component-39e74935.js';
import { E as EditModelForm } from './EditModelForm.component-dffeaf33.js';
import { F as FormHeading } from './FormHeading-92e31a13.js';
import './SaveButton.component-265ebd88.js';
import './stepper-8c66bd06.js';
import './Auth-bde7a9a8.js';
import './FormButtons.component-b34f3009.js';

function EditModel(props) {
  return /*#__PURE__*/react.createElement(_default, null, /*#__PURE__*/react.createElement(EditModelForm, _extends({}, props, {
    onCancel: function onCancel() {
      return goToAndScrollUp("/list/".concat(props.groupName, "/").concat(props.modelType));
    },
    onSaveSuccess: function onSaveSuccess() {
      return goToAndScrollUp("/list/".concat(props.groupName, "/").concat(props.modelType));
    }
  })));
}

function EditModelContainer(props) {
  var schema = props.params.modelType || 'organisationUnit';
  return /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: '1rem'
    }
  }, /*#__PURE__*/react.createElement(FormHeading, {
    schema: schema,
    groupName: props.params.groupName
  }, lib.camelCaseToUnderscores(schema))), /*#__PURE__*/react.createElement(EditModel, {
    groupName: props.params.groupName,
    modelType: schema,
    modelId: props.params.modelId
  }));
}

EditModelContainer.propTypes = {
  params: PropTypes.any.isRequired
};

export { EditModelContainer as default };
