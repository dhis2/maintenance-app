import React, { Component } from 'react';
import { get, compose } from 'lodash/fp';
import Checkbox from 'material-ui/Checkbox';
import programStore from '../eventProgramStore';
import addD2Context from 'd2-ui/lib/component-helpers/addD2Context';
import { CustomRegistrationDataEntryForm } from "../data-entry-form/EditCustomFormProgramStage";

class CustomRegistrationForm extends Component {
    state = {
        useCustom: !!this.props.model.dataEntryForm,
    };

    handleUseCustom = (e, checked) => {
        this.setState({ ...this.state, useCustom: checked });
    };

    renderCustomForm = () => {
        return <CustomRegistrationDataEntryForm />
    };

    render() {
        console.log(this.state.useCustom);
        return (
            <div>
                <Checkbox
                    checked={this.state.useCustom}
                    onCheck={this.handleUseCustom}
                    label={this.context.d2.i18n.getTranslation(
                        'use_custom_registration_form'
                    )}
                />
                {this.state.useCustom && this.renderCustomForm()}
            </div>
        );
    }
}
export default addD2Context(CustomRegistrationForm);
