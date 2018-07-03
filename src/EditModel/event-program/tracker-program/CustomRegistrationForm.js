import React, { Component } from 'react';
import Checkbox from 'material-ui/Checkbox';
import addD2Context from 'd2-ui/lib/component-helpers/addD2Context';
import { CustomRegistrationDataEntryForm } from '../data-entry-form/EditCustomRegistrationForm';
import { connect } from 'react-redux';
import { programDataEntryFormRemove } from '../data-entry-form/actions';

const styles = {
    outer: {
        marginTop: '24px',
    },
    checkbox: {
        marginBottom: '24px',
    },
};

class CustomRegistrationForm extends Component {
    state = {
        useCustom:
            !!this.props.model.dataEntryForm &&
            !!this.props.model.dataEntryForm.id,
    };

    handleUseCustom = (e, checked) => {
        if(!checked) {
            this.props.disableForm();
        }
        this.setState({ ...this.state, useCustom: checked });
    };

    renderCustomForm = () => {
        return <CustomRegistrationDataEntryForm />;
    };

    render() {
        return (
            <div style={styles.outer}>
                <Checkbox
                    checked={this.state.useCustom}
                    onCheck={this.handleUseCustom}
                    label={this.context.d2.i18n.getTranslation(
                        'use_custom_registration_form'
                    )}
                    style={styles.checkbox}
                />
                {this.state.useCustom && this.renderCustomForm()}
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    disableForm() {
        dispatch(programDataEntryFormRemove());
    },
});

export default connect(null, mapDispatchToProps)(
    addD2Context(CustomRegistrationForm)
);
