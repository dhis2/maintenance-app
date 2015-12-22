import React from 'react/addons';
import EditModel from './EditModel.component';
import objectActions from './objectActions';
import {config, getInstance as getD2} from 'd2/lib/d2';
import modelToEditStore from './modelToEditStore';
import snackActions from '../Snackbar/snack.actions';

config.i18n.strings.add('name');
config.i18n.strings.add('code');
config.i18n.strings.add('short_name');

export class EditModelBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modelType: props.params.modelType,
            modelId: props.params.modelId,
        };
    }

    render() {
        return <EditModel modelType={this.state.modelType} modelId={this.state.modelId} />;
    }
}

export default class extends EditModelBase {
    static willTransitionTo(transition, params, query, callback) {
        if (params.modelId === 'add') {
            getD2().then((d2) => {
                const modelToEdit = d2.models[params.modelType].create();

                // TODO: Remove this hack and solve properly
                if (params.modelType === 'dataElement') {
                    modelToEdit.zeroIsSignificant = false;
                }

                modelToEditStore.setState(modelToEdit);

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
