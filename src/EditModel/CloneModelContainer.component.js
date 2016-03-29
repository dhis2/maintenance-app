import objectActions from './objectActions';
import { EditModelBase } from './EditModel.component';
import snackActions from '../Snackbar/snack.actions';

export default class extends EditModelBase {
    static willTransitionTo(transition, params, query, callback) {
        objectActions.getObjectOfTypeByIdAndClone({ objectType: params.modelType, objectId: params.modelId })
            .subscribe(
                () => callback(),
                (errorMessage) => {
                    transition.redirect('list', { modelType: params.modelType });
                    snackActions.show({ message: errorMessage });
                    callback();
                }
            );
    }
}
