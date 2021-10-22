import { c3 as _default, P as PropTypes, r as react, s as _extends } from './index-44839b1a.js';

var withAuth = function withAuth(WrappedComponent) {
  var WithAuth = function WithAuth(props, _ref) {
    var d2 = _ref.d2;
    var extraProps = {
      getCurrentUser: function getCurrentUser() {
        return d2.currentUser;
      },
      getModelDefinitionByName: function getModelDefinitionByName(modelType) {
        return d2.models[modelType];
      }
    };
    return /*#__PURE__*/react.createElement(WrappedComponent, _extends({}, props, extraProps));
  };

  WithAuth.displayName = "WithAuth(".concat(_default(WrappedComponent), ")");
  WithAuth.contextTypes = {
    d2: PropTypes.object
  };
  return WithAuth;
};

export { withAuth as w };
