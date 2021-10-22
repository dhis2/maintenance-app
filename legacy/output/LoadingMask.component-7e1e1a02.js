import { P as PropTypes, r as react, bW as CircularProgress } from './index-44839b1a.js';

var loadingStatusMask = {
    left: '45%',
    position: 'fixed',
    top: '45%'
};

function LoadingMask(_ref) {
    var _ref$style = _ref.style,
        style = _ref$style === undefined ? {} : _ref$style,
        _ref$large = _ref.large,
        large = _ref$large === undefined ? false : _ref$large,
        _ref$small = _ref.small,
        small = _ref$small === undefined ? false : _ref$small;

    return react.createElement(
        'div',
        { style: Object.assign({}, loadingStatusMask, style) },
        react.createElement(CircularProgress, { large: large, small: small })
    );
}

LoadingMask.propTypes = {
    style: PropTypes.object,
    large: PropTypes.bool,
    small: PropTypes.bool
};

export { LoadingMask as L };
