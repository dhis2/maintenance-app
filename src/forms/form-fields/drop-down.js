import React from 'react/addons';
import SelectField from 'material-ui/lib/select-field';
import Translate from 'd2-ui/lib/i18n/Translate.mixin';

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
        options: React.PropTypes.array.isRequired,
        isRequired: React.PropTypes.bool,
        labelText: React.PropTypes.string.isRequired,
        translate: React.PropTypes.bool,
    },

    mixins: [MuiThemeMixin, Translate],

    getInitialState() {
        return {
            value: this.props.defaultValue ? this.props.defaultValue : '',
            options: this.getOptions(this.props.options, this.props.isRequired),
        };
    },

    componentWillReceiveProps(newProps) {
        this.setState({
            value: newProps.defaultValue ? newProps.defaultValue : '',
            options: this.getOptions(newProps.options, newProps.isRequired),
        });
    },

    getOptions(options, required = false) {
        let opts = options
            .map((option) => {
                return {
                    payload: option.value,
                    text: option.text,
                };
            });

        if (!required) {
            opts = [{payload: undefined, text: ''}].concat(opts);
        }

        return opts
            .map(option => {
                if (option.text && this.props.translate) {
                    option.text = this.getTranslation(option.text.toLowerCase());
                }
                return option;
            });
    },

    render() {
        const {onFocus, onBlur, ...other} = this.props;
        return (
            <SelectField
                value={this.state.value.toString()}
                {...other}
                menuItems={this.state.options}
                floatingLabelText={this.getTranslation(this.props.labelText)}
            />
        );
    },
});
