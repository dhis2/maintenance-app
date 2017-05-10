import React, { Component } from 'react';
import TextField from 'material-ui/TextField/TextField';
import Action from 'd2-ui/lib/action/Action';

export default class TextFormField extends Component {
    constructor(props, ...args) {
        super(props, ...args);
        this.state = {
            fieldValue: props.value || props.value === 0 ? props.value : '',
        };

        this.updateOnChange = Action.create(`updateOnKeyUp - ${props.name}`);
        this._onValueChanged = this._onValueChanged.bind(this);
    }

    componentDidMount() {
        // Debounce the value, so the request handler does not get executed on each change event
        this.subscription = this.updateOnChange
            .debounceTime(300)
            .map(action => action.data)
            .distinctUntilChanged()
            .subscribe((value) => {
                this.props.onChange({
                    target: {
                        value,
                    },
                });
            });
    }

    componentWillUnmount() {
        if (this.subscription && this.subscription.unsubscribe) {
            this.subscription.unsubscribe();
        }
    }

    componentWillReceiveProps(newProps) {
        // Keep local state in sync with the passed in value
        if (newProps.value !== this.props.value) {
            this.setState({
                fieldValue: newProps.value ? newProps.value : '',
            });
        }
    }

    render() {
        const {
            label,
            labelText,
            multiLine,
            model,
            modelDefinition,
            models,
            referenceType,
            referenceProperty,
            isInteger,
            translateOptions,
            isRequired,
            options,
            ...rest
        } = this.props;
        const errorStyle = {
            lineHeight: multiLine ? '48px' : '12px',
            marginTop: multiLine ? -16 : -12,
        };

        return (
            <TextField
                errorStyle={errorStyle}
                label={label}
                multiLine={multiLine}
                {...rest}
                value={this.state.fieldValue}
                floatingLabelText={labelText}
                onChange={this._onValueChanged}
            />
        );
    }

    _onValueChanged(event) {
        event.preventDefault();
        event.stopPropagation();
        // Keep local state to keep the field responsiveness
        this.setState({
            fieldValue: event.currentTarget.value,
        });

        // Fire the update handler
        this.updateOnChange(event.currentTarget.value);
    }
}
TextFormField.propTypes = {
    labelText: React.PropTypes.string.isRequired,
    multiLine: React.PropTypes.bool,
};
