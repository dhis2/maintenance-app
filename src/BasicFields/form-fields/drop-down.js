import React from 'react/addons';
import SelectField from 'material-ui/lib/select-field';

import MuiThemeMixin from '../mui-theme.mixin';

export default React.createClass({
    propTypes: {
        defaultValue: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number,
            React.PropTypes.bool,
        ]),
        onFocus: React.PropTypes.func,
        onBlur: React.PropTypes.func,
    },

    mixins: [MuiThemeMixin],

    getInitialState() {
        return {value: this.props.defaultValue ? this.props.defaultValue : 'null'};
    },

    render() {
        const {onFocus, onBlur, ...other} = this.props;
        return (
            <SelectField
                value={this.state.value.toString()}
                {...other}/>
        );
    },
});
