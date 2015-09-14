import React from 'react/addons';
import Router from 'react-router';

import FormForModel from 'd2-ui-basicfields/FormForModel.component';

import fieldOverrides from '../config/field-overrides/index';
import fieldOrderNames from '../config/field-config/field-order';
import headerFieldsNames from '../config/field-config/header-fields';

import FormFieldsForModel from 'd2-ui-basicfields/FormFieldsForModel';
import FormFieldsManager from 'd2-ui-basicfields/FormFieldsManager';
import AttributeFields from 'd2-ui-basicfields/AttributeFields.component';
import DataElementGroupsFields from './model-specific-components/DataElementGroupsFields.component';

import Button from 'd2-ui-button/Button.component';

import d2 from '../utils/d2';
import modelToEditStore from './modelToEditStrore';
import objectActions from './objectActions';

//TODO: Gives a flash of the old content when switching models (Should probably display a loading bar)
export default React.createClass({
    statics: {
        willTransitionTo: function (transition, params, query) {
            objectActions.getObjectOfTypeById({objectType: params.modelType, objectId: params.modelId});
        }
    },

    getInitialState() {
        return {
            modelToEdit: undefined,
            isLoading: true
        };
    },

    componentWillMount() {
        let modelType = this.props.params.modelType;

        //TODO: Figure out a way to hide this d2.then stuff
        d2.then(d2 => {
            //TODO: When the schema exposes the correct field configs (ENUMS) the overrides can be removed and the FormFieldManager can be instantiated by the FormForModel Component
            let formFieldsManager = new FormFieldsManager(new FormFieldsForModel(d2.models));
            formFieldsManager.setHeaderFields(headerFieldsNames.for(modelType));
            formFieldsManager.setFieldOrder(fieldOrderNames.for(modelType));

            for (let [fieldName, overrideConfig] of fieldOverrides.for(modelType)) {
                formFieldsManager.addFieldOverrideFor(fieldName, overrideConfig);
            }

            this.disposable = modelToEditStore
                .subscribe((modelToEdit) => {
                    this.setState({
                        modelToEdit: modelToEdit,
                        isLoading: false
                    });
                });

            this.setState({
                d2: d2,
                formFieldsManager: formFieldsManager
            });
        });

        console.log('load the ', modelType, ' object for', this.props.params.modelId);
    },

    componentWillUnmount() {
        this.disposable && this.disposable.dispose();
    },

    saveAction(event) {
        event.preventDefault();

        objectActions.saveObject(this.props.params.modelId)
            .subscribe(
            (message) => alert(message),
            (errorMessage) => alert(errorMessage)
        );
    },

    saveAndCloseAction() {
        event.preventDefault();

        objectActions.saveAndRedirectToList(this.props.params.modelId, this.props.params.modelType)
            .subscribe(message => {
                console.log(message);
                Router.HashLocation.push(['/list', this.props.params.modelType].join('/'));
            },
            (errorMessage) => alert(errorMessage));
    },

    render() {
        let renderForm = () => {
            if (!this.state.d2) {
                return undefined;
            }

            return (
                <FormForModel d2={this.state.d2} model={this.state.modelToEdit} name={'ObjectEditForm'} formFieldsManager={this.state.formFieldsManager}>

                    <AttributeFields model={this.state.modelToEdit} />

                    {this.extraFieldsForModelType()}

                    <Button onClick={this.saveAction}>Save!</Button>
                    <Button onClick={this.saveAndCloseAction}>Save and close!</Button>
                </FormForModel>
            );
        };

        return (
            <div>
                <h2>Edit for {this.props.params.modelType} with id {this.props.params.modelId}</h2>
                {this.state.isLoading ? 'Loading data...' : renderForm()}
            </div>
        );
    },

    extraFieldsForModelType() {
        if (this.props.params.modelType === 'dataElement') {
            return (
                <DataElementGroupsFields model={this.state.modelToEdit} />
            );
            return undefined;
        }
    }
});
