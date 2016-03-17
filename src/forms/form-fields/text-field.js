import React from 'react';
import TextField from 'material-ui/lib/text-field';
import Translate from 'd2-ui/lib/i18n/Translate.mixin';

import MuiThemeMixin from '../mui-theme.mixin';

export default React.createClass({
    propTypes: {
        labelText: React.PropTypes.string.isRequired,
        multiLine: React.PropTypes.bool,
    },

    mixins: [MuiThemeMixin, Translate],

    render() {
        const errorStyle = {
            lineHeight: this.props.multiLine ? '48px' : '12px',
            marginTop: this.props.multiLine ? -16 : -12,
        };

        return (
            <TextField
                errorStyle={errorStyle}
                {...this.props}
                value={this.props.value}
                floatingLabelText={this.getTranslation(this.props.labelText)}
            />
        );
    },
});

//
//import React from 'react';
//import TextField from 'material-ui/lib/text-field';
//
//import MuiThemeMixin from '../mui-theme.mixin';
//
//
//// TODO: Rewrite as ES6 class
///* eslint-disable react/prefer-es6-class */
//export default React.createClass({
//    propTypes: {
//        value: React.PropTypes.string,
//        multiLine: React.PropTypes.bool,
//    },
//
//    mixins: [MuiThemeMixin],
//
//    getInitialState() {
//        return {
//            value: this.props.value,
//        };
//    },
//
//    componentWillReceiveProps(props) {
//        this.setState({ value: props.value });
//    },
//
//    _change(e) {
//        this.setState({ value: e.target.value });
//    },
//
//    render() {
//        const errorStyle = {
//            lineHeight: this.props.multiLine ? '48px' : '12px',
//            marginTop: this.props.multiLine ? -16 : 0,
//        };
//
//        return (
//            <TextField errorStyle={errorStyle} {...this.props} value={this.state.value} onChange={this._change} />
//        );
//    },
//});
//

