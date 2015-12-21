import {isFunction} from 'd2-utils';
import log from 'loglevel';

import React from 'react';
import FormUpdateContext from './FormUpdateContext.mixin';

const InputField = React.createClass({
    propTypes: {
        formName: React.PropTypes.string.isRequired,
        fieldConfig: React.PropTypes.shape({
            key: React.PropTypes.string.isRequired,
            type: React.PropTypes.constructor.isRequired,
            wrapper: React.PropTypes.constructor,
            templateOptions: React.PropTypes.object,
        }).isRequired,

        model: React.PropTypes.object.isRequired,
    },

    mixins: [FormUpdateContext],

    getDefaultProps() {
        return {
            fieldConfig: {},
            model: {},
        };
    },

    componentWillMount() {
        if (!this.props.fieldConfig.type) {
            throw new Error('`fieldConfig.type` is required to render the input field');
        }

        // Run initial validation to show invalid fields after loading
        this.runValidation();
    },

    componentWillReceiveProps() {
        this.runValidation();
    },

    render() {
        const fc = this.props.fieldConfig;

        // Don't render the component when the hide property is or returns true
        if (fc.hide === true || (isFunction(fc.hide) && fc.hide(this.props.model, fc))) {
            return null;
        }

        const renderedField = <fc.type ref="field" isValid={this.state.validation.isValid} {...this.props} validationClasses={this.state.validation.validationClasses} contentUpdated={this.runValidation} />;

        if (fc.wrapper) {
            return (
                <fc.wrapper {...this.props} isValid={this.state.validation.isValid} validationClasses={this.state.validation.validationClasses} contentUpdated={this.runValidation} ref="wrapper">
                    {renderedField}
                </fc.wrapper>
            );
        }
        return renderedField;
    },

    isValid() {
        return this.runValidation().isValid;
    },

    runValidation() {
        const fc = this.props.fieldConfig;
        const to = fc.templateOptions || {};
        const validators = fc.validators || {};

        if (to.required && !validators.required) {
            validators.required = () => {
                return !!this.props.model[this.props.fieldConfig.key] || this.props.model[this.props.fieldConfig.key] === false;
            };
        }

        // Log warning if there are no validators found
        if (!Object.keys(validators).length) {
            log.debug(`Warning: No validator object found for field '${this.props.fieldConfig.key}'`);
        }

        const validationClasses = []; // Validate class is used by materialize to show red and green states
        const validationStatus = Object.keys(validators || {}).reduce((vs, validatorName) => {
            vs[validatorName] = validators[validatorName].apply(this);
            if (vs[validatorName] === false) {
                validationClasses.push('invalid-' + validatorName);
            }
            return vs;
        }, {});

        const isValid = Object.keys(validationStatus).reduce((status, validatorName) => {
            return status && validationStatus[validatorName];
        }, true);

        const validationResult = {
            isValid: isValid,
            validationClasses: isValid ? validationClasses : validationClasses.concat(['invalid']),
        };

        this.setState({validation: validationResult});
        this.context.setStatus && this.context.setStatus(fc.key, isValid);

        return validationResult;
    },
});

export default InputField;
