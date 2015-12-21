import React from 'react';
import classes from 'classnames';

import log from 'loglevel';

const Form = React.createClass({
    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.node,
            React.PropTypes.arrayOf(React.PropTypes.node),
        ]),
        headerFields: React.PropTypes.arrayOf(React.PropTypes.string),
        model: React.PropTypes.object.isRequired,
        name: React.PropTypes.string.isRequired,
        style: React.PropTypes.object,
    },

    childContextTypes: {
        updateForm: React.PropTypes.func.isRequired,
        setStatus: React.PropTypes.func.isRequired,
    },

    getChildContext() {
        return {
            updateForm: this.updateForm,
            setStatus: this.setStatus,
        };
    },

    getInitialState() {
        return {
            formStatus: false,
        };
    },

    render() {
        const classList = classes('d2-form');

        const children = React.Children.map(this.props.children, child => {
            if (child) {
                return React.addons.cloneWithProps(child, {isFormValid: this.isValid, style: this.props.style});
            }
        });

        return (
            <form className={classList} name={this.props.name}>
                {children}
            </form>
        );
    },

    formFieldStates: {},

    updateForm(fieldName, newValue, oldValue) {
        // TODO: Ideally we would like the model to be immutable. It would be better if we could emit a model change here
        // on some model observer that would propagate down through the props.
        this.setValue(fieldName, newValue);

        // Force an update of the component as there might be fields that depend on values of others
        // skip logic etc.
        this.forceUpdate();

        log.debug(`Form updated because of change to ${fieldName} from '${oldValue}' to '${newValue}'`);
    },

    setStatus(fieldName, isValid) {
        this.formFieldStates[fieldName] = isValid;
        // log.debug(`${fieldName} is now ${isValid ? 'Valid' : 'Invalid'}`);

        const formStatus = Object.keys(this.formFieldStates)
            .reduce((collector, formFieldName) => {
                return collector && this.formFieldStates[formFieldName];
            }, true);

        // log.debug(`FormStatus: ${formStatus}`);

        if (formStatus !== this.state.formStatus) {
            this.setState({
                formStatus: formStatus,
            }, () => {
                // log.debug(`This current form status is: ${formStatus ? 'Valid' : 'Invalid'}`);
            });
        }
    },

    isValid() {
        return this.state.formStatus;
    },

    setValue(fieldName, newValue) {
        if (!fieldName || !this.props.model) { return undefined; }

        const keyParts = fieldName.split('.');
        let value = this.props.model;

        while (keyParts.length > 1) {
            value = value[keyParts.shift()];
        }
        value[keyParts[0]] = newValue;
    },
});

export default Form;
