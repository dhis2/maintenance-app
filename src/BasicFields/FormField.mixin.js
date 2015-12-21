import React from 'react';
import log from 'loglevel';

const noop = () => {
};

const FormFieldMixin = {
    contextTypes: {
        updateForm: React.PropTypes.func.isRequired,
        setStatus: React.PropTypes.func.isRequired,
    },

    getDefaultProps() {
        return {
            fieldConfig: {
                templateOptions: {},
                validators: {},
            },
            model: {},
            type: 'text',
            whenFocusReceived: noop,
            whenFocusLost: noop,
            contentUpdated: noop,
        };
    },

    getInitialState() {
        const fc = this.props.fieldConfig;

        this.validators = fc.validators || {};

        return {
            hasFocus: false,
        };
    },

    componentWillMount() {
        this.formFieldHandlers = {
            onFocus: this.handleFocus,
            onBlur: this.handleBlur,
            onChange: this.handleChange,
        };

        // Create a shortcut for the template options
        this.to = this.props.fieldConfig.templateOptions || {};
        this.fc = this.props.fieldConfig;
    },

    hasContent() {
        return !!this.getValue();
    },

    handleFocus() {
        this.setState({
            hasFocus: true,
        }, this.props.whenFocusReceived);
    },

    handleBlur() {
        this.setState({
            hasFocus: false,
        }, this.props.whenFocusLost);
    },

    handleChange(event) {
        const newValue = event && event.target ? event.target.value : undefined;

        // If we have an updateForm method we will delay the forced update to be triggered by the form instead
        if (this.context.updateForm) {
            this.props.contentUpdated(!!newValue, newValue, this);
            this.context.updateForm(this.props.fieldConfig.key, newValue, this.getValue());
        } else {
            // TODO: Deprecate this when we are sure we can
            log.warn('Warning: Using FormFields without a updateForm context is not recommended.');
            this.props.model[this.props.fieldConfig.key] = newValue;

            this.forceUpdate(() => {
                this.props.contentUpdated(this.hasContent(), newValue, this);
            });
        }
    },

    getId() {
        return [this.props.formName, this.props.fieldConfig.key].filter(part => part).join('__');
    },

    getValue() {
        if (!this.props.fieldConfig.key || !this.props.model) { return undefined; }

        const keyParts = this.props.fieldConfig.key.split('.');
        let value = this.props.model;

        while (keyParts.length > 0) {
            value = value[keyParts.shift()];
        }

        return value;
    },
};

export default FormFieldMixin;
