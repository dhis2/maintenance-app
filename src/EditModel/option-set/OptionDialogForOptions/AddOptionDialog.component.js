import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dialog from 'material-ui/Dialog/Dialog';
import FormBuilder from 'd2-ui/lib/forms/FormBuilder.component';
import Heading from 'd2-ui/lib/headings/Heading.component';

import FormButtons from '../../FormButtons.component';
import SaveButton from '../../SaveButton.component';
import CancelButton from '../../CancelButton.component';

import actions from '../actions';
import snackActions from '../../../Snackbar/snack.actions';
import getFirstInvalidFieldMessage from '../../form-helpers/validateFields';

class AddOptionDialog extends Component {
    state = {
        isFormValid: true,
        isSaving: false,
    };

    onUpdateField = (field, value) => {
        actions.updateModel(this.props.model, field, value);
    }

    onSaveOption = () => {
        const invalidFieldMessage = getFirstInvalidFieldMessage(this.props.fieldConfigs, this.formRef);
        if (invalidFieldMessage) {
            snackActions.show({
                message: invalidFieldMessage,
                action: 'ok',
            });
            return;
        }

        this.setState({ isSaving: true });
        actions.saveOption(this.props.model, this.props.parentModel)
            .subscribe(
                () => {
                    snackActions.show({
                        message: 'option_saved',
                        translate: true,
                    });

                    this.setState({ isSaving: false });

                    this.props.onRequestClose();

                    // After the save was successful we request the options from the server to get the updated list
                    actions.getOptionsFor(this.props.parentModel);
                },
                ({ message, translate }) => {
                    snackActions.show({
                        message,
                        action: 'ok',
                        translate,
                    });

                    this.setState({ isSaving: false });
                },
            );
    }

    setFormRef = form => this.formRef = form;

    translate = message => this.context.d2.i18n.getTranslation(message);

    render() {
        return (
            <Dialog
                open={this.props.isDialogOpen}
                modal
                onRequestClose={this.props.onRequestClose}
                autoScrollBodyContent
            >
                <Heading>{this.props.title}</Heading>
                <FormBuilder
                    fields={this.props.fieldConfigs}
                    onUpdateField={this.onUpdateField}
                    ref={this.setFormRef}
                />
                <FormButtons>
                    <SaveButton
                        isValid={this.state.isFormValid}
                        onClick={this.onSaveOption}
                        isSaving={this.state.isSaving}
                    />
                    <CancelButton onClick={this.props.onRequestClose} />
                </FormButtons>
            </Dialog>
        );
    }
}

AddOptionDialog.propTypes = {
    fieldConfigs: PropTypes.array,
    title: PropTypes.string,
    isDialogOpen: PropTypes.bool,
    model: PropTypes.object,
    onRequestClose: PropTypes.func.isRequired,
    parentModel: PropTypes.object,
};

AddOptionDialog.defaultProps = {
    parentModel: {},
    model: {},
    fieldConfigs: [],
    isDialogOpen: false,
    title: '',
};

AddOptionDialog.contextTypes = { d2: React.PropTypes.object };

export default AddOptionDialog;
