import React from 'react';
import SelectField from 'material-ui/lib/select-field';
import Translate from 'd2-ui/lib/i18n/Translate.mixin';
import isString from 'd2-utilizr/lib/isString';

import MuiThemeMixin from '../mui-theme.mixin';

import MenuItem from 'material-ui/lib/menus/menu-item';

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
        translateOptions: React.PropTypes.bool,
    },

    mixins: [MuiThemeMixin, Translate],

    getInitialState() {
        return {
            value: (this.props.value !== undefined && this.props.value !== null) ? this.props.value : '',
            options: this.getOptions(this.props.options, this.props.isRequired),
        };
    },

    componentWillReceiveProps(newProps) {
        this.setState({
            value: (newProps.defaultValue !== undefined && newProps.defaultValue !== null) ? newProps.defaultValue : '',
            options: this.getOptions(newProps.options, newProps.isRequired),
        });
    },

    getOptions(options, required = false) {
        let opts = options
            .map((option) => {
                return {
                    value: option.value,
                    text: option.text,
                };
            });

        const translatedOpts = opts
            .map(option => {
                if (option.text && this.props.translateOptions) {
                    option.text = isString(option.text) ? this.getTranslation(option.text.toLowerCase()) : option.text;
                }
                return option;
            });

        if (!required) {
            return [{value: null, text: this.getTranslation('no_value')}].concat(translatedOpts);
        }
        return translatedOpts;
    },

    _onChange(event, index, value) {
        this.props.onChange({
            target: {
                value,
            }
        });
    },

    render() {
        const {onFocus, onBlur, ...other} = this.props;

        return (
            <SelectField
                value={this.state.value}
                {...other}
                onChange={this._onChange}
                floatingLabelText={this.props.labelText}
            >
                {this.state.options.map((option, index) => {
                    return <MenuItem primaryText={option.text} key={index} value={option.value} />
                })}
            </SelectField>
        );
    },
});
