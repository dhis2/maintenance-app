import React from 'react';
import FormField from 'd2-ui/lib/forms/FormField.component';
import {createFieldConfig, typeToFieldMap} from '../forms/fields';
import createFormValidator from 'd2-ui/lib/forms/FormValidator';
import {FormFieldStatuses} from 'd2-ui/lib/forms/FormValidator';
import Translate from 'd2-ui/lib/i18n/Translate.mixin';

export default React.createClass({
    propTypes: {
        registerValidator: React.PropTypes.func.isRequired,
        model: React.PropTypes.shape({
            modelDefinition: React.PropTypes.shape({
                attributeProperties: React.PropTypes.object.isRequired,
            }).isRequired,
            attributes: React.PropTypes.object.isRequired,
        }).isRequired,
        updateFn: React.PropTypes.func.isRequired,
    },

    mixins: [Translate],

    componentWillMount() {
        const fieldConfigs = Object
            .keys(this.props.model.modelDefinition.attributeProperties)
            .map(attributeName => {
                const attribute = this.props.model.modelDefinition.attributeProperties[attributeName];

                return createFieldConfig({
                    name: attribute.name,
                    valueType: attribute.valueType,
                    type: typeToFieldMap.get(attribute.optionSet ? 'CONSTANT' : attribute.valueType),
                    required: Boolean(attribute.mandatory),
                    fieldOptions: {
                        labelText: attribute.name,
                        options: attribute.optionSet ? attribute.optionSet.options.map(option => {
                            return {
                                name: option.displayName || option.name,
                                value: option.code,
                            };
                        }) : [],
                    },
                });
            });

        const attributeFieldValidators = createFormValidator(fieldConfigs);

        this.props.registerValidator(this.runValidator.bind(this, attributeFieldValidators, fieldConfigs));

        attributeFieldValidators
            .status
            .subscribe(() => this.forceUpdate());

        this.setState({fieldConfigs, attributeFieldValidators});
    },

    componentDidMount() {
        this.state.attributeFieldValidators.status.subscribe(() => {
            // TODO: Should probably have some sort of check to see if it really needs to update? That update might be better at home in the formValidator however
            this.forceUpdate();
        });
    },

    renderField(fieldConfig) {
        const validationStatus = this.state.attributeFieldValidators.getStatusFor(fieldConfig.name);

        let errorMessage;

        if (validationStatus && validationStatus.messages && validationStatus.messages.length) {
            errorMessage = validationStatus.messages[0];
        }

        return (
            <FormField
                {...fieldConfig}
                isRequired={fieldConfig.required}
                value={this.props.model.attributes[fieldConfig.name]}
                updateFn={this._updateAtrribute.bind(this, fieldConfig)}
                isValidating={validationStatus.status === FormFieldStatuses.VALIDATING}
                errorMessage={errorMessage ? this.getTranslation(errorMessage) : undefined}
            />
        );
    },

    render() {
        if (!this.state || !this.state.fieldConfigs.length) {
            return null;
        }

        return (
            <div>{this.state.fieldConfigs.map(this.renderField)}</div>
        );
    },

    runValidator(attributeFieldValidators, fieldConfigs) {
        fieldConfigs
            .forEach(fieldConfig => {
                attributeFieldValidators.runFor(fieldConfig.name, this.props.model.attributes[fieldConfig.name]);
            });
    },

    _updateAtrribute(fieldConfig, event) {
        this.state.attributeFieldValidators.runFor(fieldConfig.name, event.target.value);

        this.props.updateFn({
            attributeName: fieldConfig.name,
            value: event.target.value,
        });
    },
});
