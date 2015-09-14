import Store from 'd2-flux/store/Store';
import d2 from '../utils/d2';

const singleModelStoreConfig = {
    getObjectOfTypeById({objectType, objectId}) {
        d2.then(d2 => {
            if (d2.models[objectType]) {
                d2.models[objectType]
                    .get(objectId, objectType === 'dataElement' ? {fields: ':all,dataElementGroups[id,name,dataElementGroupSet[id]]'} : undefined)
                    .then(model => {
                        this.setState(model)
                    });
            }
        });
    },

    save({data, complete, error}) {
        let objectId = data;
        if (this.state.id === objectId) {
            this.state.save()
                .then(() => {
                    console.log('trigger saved action');
                    complete('Saved');
                })
                .catch((e) => {
                    console.warn(e);
                    console.log('trigger save failed action');
                    error(e);
                });
        }
    }
};

export default {
    create(storeConfig) {
        if (storeConfig) {
            storeConfig = Object.assign(singleModelStoreConfig, storeConfig);
        }

        return Store.create(singleModelStoreConfig);
    }
}
