import React from 'react/addons';
import Router from 'react-router';
import FormForModel from 'd2-ui-basicfields/FormForModel.component';
import fieldOverrides from '../config/field-overrides/index';
import fieldOrderNames from '../config/field-config/field-order';
import headerFieldsNames from '../config/field-config/header-fields';
import FormFieldsForModel from 'd2-ui-basicfields/FormFieldsForModel';
import FormFieldsManager from 'd2-ui-basicfields/FormFieldsManager';
import AttributeFields from 'd2-ui-basicfields/AttributeFields.component';
import {getInstance as getD2} from 'd2';
import modelToEditStore from './modelToEditStore';
import objectActions from './objectActions';
import snackActions from '../Snackbar/snack.actions';
import SaveButton from './SaveButton.component';
import CancelButton from './CancelButton.component';
import Paper from 'material-ui/lib/paper';
import {isString} from 'd2-utils';

// TODO: Gives a flash of the old content when switching models (Should probably display a loading bar)
export default class EditModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modelToEdit: undefined,
            isLoading: true,
        };
    }

    componentWillMount() {
        const modelType = this.props.modelType;

        getD2().then(d2 => {
            // TODO: When the schema exposes the correct field configs (ENUMS) the overrides can be removed and the FormFieldManager can be instantiated by the FormForModel Component
            const formFieldsManager = new FormFieldsManager(new FormFieldsForModel(d2.models));
            formFieldsManager.setHeaderFields(headerFieldsNames.for(modelType));
            formFieldsManager.setFieldOrder(fieldOrderNames.for(modelType));

            for (const [fieldName, overrideConfig] of fieldOverrides.for(modelType)) {
                formFieldsManager.addFieldOverrideFor(fieldName, overrideConfig);
            }

            this.disposable = modelToEditStore
                .subscribe((modelToEdit) => {
                    this.setState({
                        modelToEdit: modelToEdit,
                        isLoading: false,
                    });
                }, (errorMessage) => {
                    console.log(errorMessage);
                    snackActions.show({message: errorMessage});
                });

            this.setState({
                d2: d2,
                formFieldsManager: formFieldsManager,
            });
        });
    }

    componentWillReceiveProps() {
        this.setState({
            isLoading: true,
        });
    }

    componentWillUnmount() {
        this.disposable && this.disposable.dispose();
    }

    render() {
        const renderForm = () => {
            if (!this.state.d2) {
                return undefined;
            }

            const saveButtonStyle = {
                marginRight: '1rem',
            };

            const formPaperStyle = {
                width: '80%',
                margin: '0 auto 2rem',
                padding: '2rem 5rem 4rem',
            };

            return (
                <Paper style={formPaperStyle}>
                    <FormForModel d2={this.state.d2} model={this.state.modelToEdit} name={'ObjectEditForm'} formFieldsManager={this.state.formFieldsManager}>

                        <AttributeFields model={this.state.modelToEdit} />

                        {this.extraFieldsForModelType()}

                        <SaveButton style={saveButtonStyle} onClick={this.saveAction.bind(this)} />
                        <CancelButton onClick={this.closeAction.bind(this)} />
                    </FormForModel>
                </Paper>
            );
        };

        return (
            <div>
                <h2>Edit for {this.props.modelType} with id {this.props.modelId}</h2>
                {this.state.isLoading ? 'Loading data...' : renderForm()}
            </div>
        );
    }

    saveAction(event) {
        event.preventDefault();

        objectActions.saveObject({id: this.props.modelId})
            .subscribe(
            (message) => snackActions.show({message, action: 'Ok!'}),
            (errorMessage) => {
                if (isString(errorMessage)) {
                    snackActions.show({message: errorMessage});
                }

                if (errorMessage.messages && errorMessage.messages.length > 0) {
                    console.log(errorMessage.messages);
                    snackActions.show({message: `${errorMessage.messages[0].property}: ${errorMessage.messages[0].message} `});
                }
            }
        );
    }

    closeAction() {
        event.preventDefault();

        Router.HashLocation.push(['/list', this.props.modelType].join('/'));
    }

    extraFieldsForModelType() {
        return undefined;
    }
}
EditModel.propTypes = {
    modelId: React.PropTypes.string.isRequired,
    modelType: React.PropTypes.string.isRequired,
};
