import React from 'react/addons';
import EditModel from './EditModel.component';
import DataElementEditModel from './model-specific-components/DataElementEditModel.component';
import IndicatorEditModel from './model-specific-components/IndicatorEditModel.component';
import objectActions from './objectActions';
import {getInstance as getD2} from 'd2';
import modelToEditStore from './modelToEditStore';
import snackActions from '../Snackbar/snack.actions';

export class EditModelBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modelType: props.params.modelType,
            modelId: props.params.modelId,
        };
    }

    render() {
        // Special case for dataElement forms
        if (this.state.modelType === 'dataElement') {
            return (
                <DataElementEditModel modelType={this.state.modelType} modelId={this.state.modelId} />
            );
        }

        if (this.state.modelType === 'indicator') {
            return (
                <IndicatorEditModel modelType={this.state.modelType} modelId={this.state.modelId} />
            );
        }

        return <EditModel modelType={this.state.modelType} modelId={this.state.modelId} />;
    }
}

export default class extends EditModelBase {
    static willTransitionTo(transition, params, query, callback) {
        if (params.modelId === 'add') {
            getD2().then((d2) => {
                modelToEditStore.setState(d2.models[params.modelType].create());
                callback();
            });
        } else {
            objectActions.getObjectOfTypeById({objectType: params.modelType, objectId: params.modelId})
                .subscribe(
                    () => callback(),
                    (errorMessage) => {
                        transition.redirect('list', {modelType: params.modelType});
                        snackActions.show({message: errorMessage});
                        callback();
                    }
                );
        }
    }
}
