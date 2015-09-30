import objectActions from './objectActions';
import {EditModelBase} from './EditModelContainer.component';

export default class extends EditModelBase {
    static willTransitionTo(transition, params) {
        objectActions.getObjectOfTypeByIdAndClone({objectType: params.modelType, objectId: params.modelId});
    }
}
