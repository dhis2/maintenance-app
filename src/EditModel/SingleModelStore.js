import Store from 'd2-flux/store/Store';
import {getInstance as getD2}  from 'd2/lib/d2';
import {Observable} from 'rx';

function loadModelFromD2(objectType, objectId) {
    return getD2().then(d2 => {
        if (d2.models[objectType]) {
            return d2.models[objectType]
                .get(objectId, objectType === 'dataElement' ? {fields: ':all,dataElementGroups[id,name,dataElementGroupSet[id]]'} : undefined);
        }
        return Promise.reject('Invalid model');
    });
}

const singleModelStoreConfig = {
    getObjectOfTypeById({objectType, objectId}) {
        return Observable.fromPromise(loadModelFromD2(objectType, objectId))
            .do((model) => {
                this.setState(model);
            });
    },

    getObjectOfTypeByIdAndClone({objectType, objectId}) {
        const result = loadModelFromD2(objectType, objectId)
            .then(model => {
                model.id = undefined;
                this.setState(model);
            });

        return Observable.fromPromise(result);
    },

    save() {
        const importResultPromise = this.state.save(true)
            .then(response => {
                if (response.response.importCount.imported === 1 || response.response.importCount.updated === 1) {
                    return response;
                }

                if (response.response.importConflicts && response.response.importConflicts.length > 0) {
                    return Promise.reject(response.response.importConflicts[0].value);
                }
                return Promise.reject('Failed to save');
            });

        return Observable.fromPromise(importResultPromise);
    },
};

export default {
    create(config) {
        const storeConfig = Object.assign({}, singleModelStoreConfig, config || {});

        return Store.create(storeConfig);
    },
};
