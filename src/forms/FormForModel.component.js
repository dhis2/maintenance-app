import React from 'react';
import classes from 'classnames';

import FormFieldsForModel from './FormFieldsForModel';
import FormFieldsManager from './FormFieldsManager';

import Form from 'd2-ui/lib/forms/Form.component';
//import InputField from './InputField.component';
//import FormFields from './FormFields.component';

const FormForModel = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired,
        model: React.PropTypes.object.isRequired,
        formFieldsManager: React.PropTypes.instanceOf(FormFieldsManager),
        children: React.PropTypes.arrayOf(React.PropTypes.node),
        formStyle: React.PropTypes.object,
    },

    getInitialState() {
        return {
            formFieldsManager: this.props.formFieldsManager || new FormFieldsManager(new FormFieldsForModel(this.props.d2.models)),
        };
    },

    render() {
        const classList = classes('form-for-model');
        const headerFields = [].concat(this.state.formFieldsManager.getHeaderFieldsForModel(this.props.model));
        const fields = [].concat(this.state.formFieldsManager.getNonHeaderFieldsForModel(this.props.model));

        const children = this.props.children || [];

        return (
            <div className={classList}>
                <Form name={this.props.name}
                      headerFields={this.state.formFieldsManager.headerFields}
                      model={this.props.model}
                      style={this.props.formStyle}
                    >
                    <FormFields className="d2-form-header-fields" highlight>
                        {headerFields.map(field => {
                            return (<InputField formName={'userForm'} key={field.key} model={this.props.model}
                                                fieldConfig={field}/>);
                        })}
                    </FormFields>
                    <FormFields>
                        {fields.map((field) => {
                            return (<InputField formName={'userForm'} key={field.key} model={this.props.model}
                                                fieldConfig={field}/>);
                        })}
                    </FormFields>
                    {children}
                </Form>
            </div>
        );
    },
});

export default FormForModel;
