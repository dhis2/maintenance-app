import React, { Component } from 'react';
import TextField from 'material-ui/lib/text-field';
import Action from 'd2-ui/lib/action/Action';

export default class TextFormField extends Component {
    constructor(props, ...args) {
        super(props, ...args);
        this.state = {
            fieldValue: props.value,
        };

        this.updateOnChange = Action.create(`updateOnKeyUp - ${props.name}`);
        this._onValueChanged = this._onValueChanged.bind(this);
    }

    componentDidMount() {
        // Debounce the value, so the request handler does not get executed on each change event
        this.disposable = this.updateOnChange
            .debounce(300)
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
        if (this.disposable && this.disposable.dispose) {
            this.disposable.dispose();
        }
    }

    componentWillReceiveProps(newProps) {
        // Keep local state in sync with the passed in value
        if (newProps.value !== this.props.value) {
            this.setState({
                fieldValue: newProps.value,
            });
        }
    }

    render() {
        const props = this.props;
        const errorStyle = {
            lineHeight: props.multiLine ? '48px' : '12px',
            marginTop: props.multiLine ? -16 : -12,
        };

        return (
            <TextField
                errorStyle={errorStyle}
                {...props}
                value={this.state.fieldValue}
                floatingLabelText={props.labelText}
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
