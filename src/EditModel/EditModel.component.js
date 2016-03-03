import React from 'react';
import {hashHistory} from 'react-router';
import fieldOverrides from '../config/field-overrides/index';
import fieldOrderNames from '../config/field-config/field-order';
import disabledOnEdit from '../config/disabled-on-edit';
import FormFieldsForModel from '../forms/FormFieldsForModel';
import FormFieldsManager from '../forms/FormFieldsManager';
import { getInstance as getD2 } from 'd2/lib/d2';
import modelToEditStore from './modelToEditStore';
import objectActions from './objectActions';
import snackActions from '../Snackbar/snack.actions';
import SaveButton from './SaveButton.component';
import CancelButton from './CancelButton.component';
import Paper from 'material-ui/lib/paper';
import { isString, camelCaseToUnderscores } from 'd2-utilizr';
import SharingNotification from './SharingNotification.component';
import FormButtons from './FormButtons.component';
import Form from 'd2-ui/lib/forms/Form.component';
import log from 'loglevel';
import FormHeading from './FormHeading';
import ExtraFields from './ExtraFields';
import AttributeFields from './AttributeFields';
import createFormValidator from 'd2-ui/lib/forms/FormValidator';
import CircularProgress from 'material-ui/lib/circular-progress';

import BackButton from './BackButton.component';
import Translate from 'd2-ui/lib/i18n/Translate.mixin';

// TODO: Gives a flash of the old content when switching models (Should probably display a loading bar)
export default React.createClass({
    propTypes: {
        modelId: React.PropTypes.string.isRequired,
        modelType: React.PropTypes.string.isRequired,
    },

    mixins: [Translate],

    getInitialState() {
        return {
            modelToEdit: undefined,
            isLoading: true,
        };
    },

    componentWillMount() {
        const modelType = this.props.modelType;

        getD2().then(d2 => {
            const formFieldsManager = new FormFieldsManager(new FormFieldsForModel(d2.models));
            formFieldsManager.setFieldOrder(fieldOrderNames.for(modelType));

            for (const [fieldName, overrideConfig] of fieldOverrides.for(modelType)) {
                formFieldsManager.addFieldOverrideFor(fieldName, overrideConfig);
            }

            console.log('Ask for loading');
            console.log(this.props, modelToEditStore.getState());
            this.disposable = modelToEditStore
                .subscribe((modelToEdit) => {
                    const fieldConfigs = this.state.fieldConfigs || formFieldsManager.getFormFieldsForModel(modelToEdit)
                            .map(fieldConfig => {
                                if (this.props.modelId !== 'add' && disabledOnEdit.for(modelType).indexOf(fieldConfig.name) !== -1) {
                                    fieldConfig.fieldOptions.disabled = true;
                                }
                                return fieldConfig;
                            });

                    const formValidator = this.state.formValidator || createFormValidator(fieldConfigs);

                    this.setState({
                        formValidator: formValidator,
                        fieldConfigs: fieldConfigs,
                        modelToEdit: modelToEdit,
                        isLoading: false,
                    });
                }, (errorMessage) => {
                    snackActions.show({ message: errorMessage });
                });

            this.setState({
                formFieldsManager: formFieldsManager,
            });
        });
    },

    componentWillReceiveProps() {
        this.setState({
            isLoading: true,
        });
    },

    componentWillUnmount() {
        this.disposable && this.disposable.dispose();
    },

    getTranslatedPropertyName(propertyName) {
        return this.getTranslation(camelCaseToUnderscores(propertyName));
    },

    render() {
        const formPaperStyle = {
            width: '100%',
            margin: '3rem auto 2rem',
            padding: '2rem 5rem 4rem',
            position: 'relative',
        };

        const renderForm = () => {
            if (this.state.isLoading) {
                return (
                    <CircularProgress mode="indeterminate" />
                );
            }

            const saveButtonStyle = {
                marginRight: '1rem',
            };

            const backButtonStyle = {
                position: 'absolute',
                left: 5,
                top: 5,
            };

            return (
                <Paper style={formPaperStyle}>
                    <div style={backButtonStyle}><BackButton onClick={this._goBack} toolTip="back_to_list" /></div>
                    <FormHeading text={camelCaseToUnderscores(this.props.modelType)} />
                    <Form source={this.state.modelToEdit} fieldConfigs={this.state.fieldConfigs} onFormFieldUpdate={this._updateForm} formValidator={this.state.formValidator}>
                        <AttributeFields model={this.state.modelToEdit} updateFn={objectActions.updateAttribute} registerValidator={this._registerValidator} />
                        <ExtraFields modelToEdit={this.state.modelToEdit} />
                        <FormButtons style={{ paddingTop: '2rem' }}>
                            <SaveButton style={saveButtonStyle} onClick={this.saveAction} />
                            <CancelButton onClick={this.closeAction} />
                        </FormButtons>
                    </Form>
                </Paper>
            );
        };

        const wrapStyle = {
            paddingTop: '2rem',
        };

        return (
            <div style={wrapStyle}>
                <SharingNotification style={formPaperStyle} modelType={this.props.modelType} />
                {this.state.isLoading ? 'Loading data...' : renderForm()}
            </div>
        );
    },

    _goBack() {
        hashHistory.goBack();
    },

    _registerValidator(attributeValidator) {
        this.setState({
            attributeValidatorRunner: attributeValidator,
        });
    },

    _updateForm(fieldName, value) {
        objectActions.update({ fieldName, value });
    },

    saveAction(event) {
        event.preventDefault();

        this.state.fieldConfigs
            .forEach(v => {
                this.state.formValidator.runFor(v.name, this.state.modelToEdit[v.name], this.state.modelToEdit);
            });

        this.state.attributeValidatorRunner && this.state.attributeValidatorRunner();

        objectActions.saveObject({ id: this.props.modelId })
            .subscribe(
            (message) => {
                snackActions.show({ message, action: 'ok', translate: true });

                hashHistory.push(`/list/${this.props.modelType}`);
            },
            (errorMessage) => {
                if (isString(errorMessage)) {
                    log.debug(errorMessage.messages);
                    snackActions.show({ message: errorMessage });
                }

                if (errorMessage.messages && errorMessage.messages.length > 0) {
                    log.debug(errorMessage.messages);
                    snackActions.show({ message: `${this.getTranslatedPropertyName(errorMessage.messages[0].property)}: ${errorMessage.messages[0].message} ` });
                }
            }
        );
    },

    closeAction(event) {
        event.preventDefault();

        hashHistory.push(`/list/${this.props.modelType}`);
    },
});
