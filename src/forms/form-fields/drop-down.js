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
        const { onFocus, onBlur, ...other } = this.props;

        return (
            <SelectField
                value={this.state.value}
                {...other}
                onChange={this._onChange}
                floatingLabelText={this.props.labelText}
            >
                {this.renderOptions()}
            </SelectField>
        );
    },

    renderOptions() {
        const options = this.state.options
            .map((option, index) => (
                <MenuItem
                    primaryText={option.text}
                    key={index}
                    value={option.value}
                    label={option.text}
                />
            ));

        if (!this.props.isRequired) {
            // When the value is not required we add an item that sets the value to null
            // For this value we pass an empty label to not show the label no_value
            // when this option is selected.
            options.unshift([
                <MenuItem
                    primaryText={this.getTranslation('no_value')}
                    key="no_value"
                    value={null}
                    label=" "
                />
            ]);
        }

        return options;
    }
});
