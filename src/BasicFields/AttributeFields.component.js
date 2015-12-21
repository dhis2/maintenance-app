import React from 'react';
import InputField from './InputField.component';
import Input from './Input.component';
import Select from './Select.component';
import FormFields from './FormFields.component';
import LabelWrapper from './wrappers/LabelWrapper.component';

const AttributeFields = React.createClass({
    propTypes: {
        model: React.PropTypes.shape({
            modelDefinition: React.PropTypes.shape({
                attributeProperties: React.PropTypes.object,
            }).isRequired,
            attributes: React.PropTypes.object,
        }).isRequired,
        style: React.PropTypes.object,
    },

    render() {
        if (!this.props.model || !this.props.model.modelDefinition.attributeProperties) {
            return null;
        }

        return (
            <FormFields style={this.props.style}>
                {Object.keys(this.props.model.modelDefinition.attributeProperties).map(attributeName => {
                    const attributeDefinition = this.props.model.modelDefinition.attributeProperties[attributeName];
                    const field = {
                        key: 'attributes.' + attributeName,
                        type: attributeDefinition.optionSet ? Select : Input,
                        templateOptions: {
                            label: attributeName,
                            required: Boolean(attributeDefinition.mandatory),
                            translateLabel: false,
                        },
                        validators: {
                            required: () => {
                                // Not required, or required and has a value
                                return  !Boolean(attributeDefinition.mandatory) || !!this.props.model.attributes[attributeName];
                            },
                        },
                    };

                    if (attributeDefinition.optionSet) {
                        field.wrapper = LabelWrapper;
                    }

                    if (attributeDefinition.optionSet) {
                        field.templateOptions.options = attributeDefinition.optionSet.options;
                        field.toModelTransformer = valueOnModel => {
                            if (valueOnModel && valueOnModel.code) {
                                return valueOnModel.code;
                            }
                            return undefined;
                        };
                        field.fromModelTransformer = function transformAttribute(valueOnModel) {
                            return this.templateOptions.options.reduce((result, option) => {
                                if (!result && option.code === valueOnModel.attributes[attributeName]) {
                                    return option;
                                }
                                return result;
                            }, undefined);
                        }.bind(field);
                    }

                    return (<InputField formName={'userForm'} key={attributeName} model={this.props.model}
                                        fieldConfig={field}/>);
                })}
            </FormFields>
        );
    },
});

export default AttributeFields;
