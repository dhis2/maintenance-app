import { r as react, c5 as _default } from './index-44839b1a.js';

function FormButtons(props) {
  var defaultStyle = {
    marginTop: '1rem'
  };
  var buttonStyle = {
    marginRight: '1rem',
    width: '10rem'
  };
  var buttonsToRender = _default(props.children) ? props.children : [props.children];
  return /*#__PURE__*/react.createElement("div", {
    style: Object.assign(defaultStyle, props.style)
  }, buttonsToRender.map(function (child, index) {
    return /*#__PURE__*/react.cloneElement(child, {
      style: buttonStyle,
      key: index
    });
  }));
}
FormButtons.propTypes = {
  style: react.PropTypes.object,
  children: react.PropTypes.oneOfType([react.PropTypes.array, react.PropTypes.object]).isRequired,
  isFormValid: react.PropTypes.func
}; //
// export default React.createClass({
//
//
//    render() {
//        return (
//            <div style={this.props.style}>
//                {this.props.children.map((child, index) => {
//                    return React.cloneElement(child, {
//                        isFormValid: this.props.isFormValid,
//                        key: index,
//                    });
//                })}
//            </div>
//        );
//    },
// });

export { FormButtons as F };
