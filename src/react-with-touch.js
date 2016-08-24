import React from 'react';
import ReactDOM from 'react-dom';

React.addons = {
    update: require('react-addons-update'),
    createFragment: require('react-addons-create-fragment'),
    TransitionGroup: require('react-addons-transition-group'),
    PureRenderMixin: require('react-addons-pure-render-mixin'),
    CSSTransitionGroup: require('react-addons-css-transition-group'),
    LinkedStateMixin: require('react-addons-linked-state-mixin'),
    ShallowCompare: require('react-addons-shallow-compare'),
    cloneWithProps: require('react-addons-clone-with-props'),
};
// react-addons-shallow-compare@0 react-addons-linked-state-mixin@0 react-addons-create-fragment@0 react-addons-clone-with-props@0

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();


global.React = React;
global.ReactDOM = ReactDOM;

module.exports = React;
