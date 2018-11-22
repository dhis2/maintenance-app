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

    // First the component updates with the new model and dialog state open
    // But at this stage the fieldConfigs are stale
    // So it should not update yet - or better still - make sure all three props are set in one go

    // The below at least proves that the above is correct, but is not a proper solution
    shouldComponentUpdate(nextProps, nextState) {
        const isOpening = this.props.isDialogOpen === false && nextProps.isDialogOpen === true;
        const isNotFirstOpening = this.props.model.constructor.name === 'ModelBase';
        const hasNewModel = this.props.model !== nextProps.model;
        if (isOpening && isNotFirstOpening && hasNewModel) {
            return false;
        }
        return true;
    }

    onUpdateField = (field, value) => {
        actions.updateModel(this.props.model, field, value);
    }

    onSaveSuccess = () => {
        this.showSuccessMessage();
        this.setState({ isSaving: false });
        this.props.onRequestClose();
        // After the save was successful we request the options from the server to get the updated list
        actions.getOptionsFor(this.props.parentModel);
    }

    onSaveError = ({ message, translate }) => {
        this.showErrorMessage(message, translate);
        this.setState({ isSaving: false });
    }

    onSaveOption = () => {
        const invalidFieldMessage = getFirstInvalidFieldMessage(this.props.fieldConfigs, this.formRef);
        if (invalidFieldMessage) {
            this.showFirstValidationErrorMessage(invalidFieldMessage);
        } else {
            this.setState({ isSaving: true });

            actions
                .saveOption(this.props.model, this.props.parentModel)
                .subscribe(this.onSaveSuccess, this.onSaveError);
        }
    }

    setFormRef = (form) => {
        this.formRef = form;
    }

    showFirstValidationErrorMessage = (invalidFieldMessage) => {
        snackActions.show({
            message: invalidFieldMessage,
            action: 'ok',
        });
    }

    showSuccessMessage = () => {
        snackActions.show({
            message: 'option_saved',
            translate: true,
        });
    }

    showErrorMessage = (message, translate) => {
        snackActions.show({
            message,
            action: 'ok',
            translate,
        });
    }

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
