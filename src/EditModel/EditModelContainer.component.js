import React from 'react/addons';
import EditModel from './EditModel.component';
import DataElementEditModel from './model-specific-components/DataElementEditModel.component';
import IndicatorEditModel from './model-specific-components/IndicatorEditModel.component';
import objectActions from './objectActions';
import {getInstance as getD2} from 'd2';
import modelToEditStore from './modelToEditStore';

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
    static willTransitionTo(transition, params) {
        if (params.modelId === 'add') {
            getD2().then((d2) => modelToEditStore.setState(d2.models[params.modelType].create()));
        } else {
            objectActions.getObjectOfTypeById({objectType: params.modelType, objectId: params.modelId});
        }
    }
}
