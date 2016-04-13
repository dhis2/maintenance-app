import React from 'react';
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
        translateLabel: React.PropTypes.bool,
    },

    mixins: [MuiThemeMixin, Translate],

    getDefaultProps() {
        return {
            translateLabel: true,
        };
    },

    getInitialState() {
        return {
            value: (this.props.defaultValue !== undefined && this.props.defaultValue !== null) ? this.props.defaultValue : '',
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
                    payload: option.value,
                    text: option.text,
                };
            });

        if (!required && !(this.props.referenceProperty === 'categoryCombo')) {
            opts = [{payload: null, text: this.getTranslation('no_value')}].concat(opts);
        }

        return opts
            .map(option => {
                if (option.text && this.props.translate) {
                    option.text = this.getTranslation(option.text.toLowerCase());
                }
                return option;
            });
    },

    _onChange(event, index, value) {
        this.props.onChange({
            target: {
                value: value.payload,
            }
        });
    },

    render() {
        const {onFocus, onBlur, ...other} = this.props;

        return (
            <SelectField
                value={this.state.value.toString()}
                {...other}
                menuItems={this.state.options}
                onChange={this._onChange}
                floatingLabelText={this.props.translateLabel ? this.getTranslation(this.props.labelText) : this.props.labelText}
            />
        );
    },
});
