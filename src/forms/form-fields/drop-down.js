import React from 'react';
import SelectField from 'material-ui/SelectField/SelectField';
import TextField from 'material-ui/TextField';
import isString from 'd2-utilizr/lib/isString';
import Dialog from 'material-ui/Dialog';

import MenuItem from 'material-ui/MenuItem/MenuItem';

class Dropdown extends React.Component {
    constructor(...args) {
        super(...args);

        this.state = {
            value: (this.props.value !== undefined && this.props.value !== null) ? this.props.value : '',
            options: this.getOptions(this.props.options, this.props.isRequired),
            dialogOpen: false,
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            value: this.state.value || ((newProps.defaultValue !== undefined && newProps.defaultValue !== null) ? newProps.defaultValue : ''),
            options: this.getOptions(newProps.options, newProps.isRequired),
        });
    }

    getOptions(options, required = false) {
        let opts = options
            .map((option) => {
                return {
                    value: option.value,
                    text: option.text,
                };
            });

        return opts
            .map(option => {
                if (option.text && this.props.translateOptions) {
                    option.text = isString(option.text) ? this.getTranslation(option.text.toLowerCase()) : option.text;
                }
                return option;
            });
    }

    _onChange(event, index, value) {
        this.props.onChange({
            target: {
                value,
            }
        });
    }

    getOptionText(value) {
        return value && this.state.options.length
            ? this.state.options.find(option => option.value === value).text
            : '??';
    }

    render() {
        const {
            onFocus,
            onBlur,
            labelText,
            modelDefinition,
            models,
            referenceType,
            referenceProperty,
            isInteger,
            translateOptions,
            isRequired,
            options,
            model,
            limit,
            fullWidth,
            ...other
        } = this.props;

        return this.state.options.length > limit
            ? (
                <div style={{ width: fullWidth ? '100%' : 'inherit' }}>
                    <Dialog
                        title={labelText}
                        open={this.state.dialogOpen}
                        onRequestClose={() => { this.setState({ dialogOpen: false }); }}
                        autoScrollBodyContent
                        autoDetectWindowHeight
                        actions={[<div onClick={() => { this.setState({ dialogOpen: false }); }}>Cancel</div>]}
                    >
                        {this.state.options.map(o => (<div style={{ cursor: 'pointer', color: 'blue' }} key={o.value} onClick={() => { this.setState({ dialogOpen: false, value: o.value }) }}>{o.text}</div>))}
                    </Dialog>
                    <TextField
                        {...other}
                        fullWidth={fullWidth}
                        value={this.getOptionText(this.state.value)}
                        onChange={this._onChange}
                        onClick={() => { this.setState({ dialogOpen: true }) }}
                        floatingLabelText={labelText}
                    />
                </div>
            ) : (
                <SelectField
                    value={this.state.value}
                    {...other}
                    onChange={this._onChange}
                    floatingLabelText={labelText}
                >
                    {this.renderOptions()}
                </SelectField>
            );
    }

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
}

Dropdown.propTypes = {
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
    limit: React.PropTypes.number,
};
Dropdown.defaultProps = {
    limit: 50,
};

export default Dropdown;
