import Store from 'd2-ui/lib/store/Store';
import { getInstance as getD2 } from 'd2/lib/d2';
import { Observable } from 'rx';
import isString from 'd2-utilizr/lib/isString';

const requestParams = new Map([
    ['dataElement', {
        fields: [
            ':all',
            'attributeValues[:all,attribute[id,name,displayName]]',
            'dataElementGroups[id,name,dataElementGroupSet[id]]',
        ].join(','),
    }],
    ['legendSet', {
        fields: [
            ':all',
            'attributeValues[:all,attribute[id,name,displayName]]',
            'legends[id,name,displayName,startValue,endValue,color]',
        ].join(','),
    }],
    ['optionSet', {
        fields: [
            ':all',
            'attributeValues[:all,attribute[id,name,displayName]]',
            'options[id,name,displayName,code]',
        ].join(','),
    }],
    ['dataSet', {
        fields: [
            ':all',
            'attributeValues[:all,attribute[id,name,displayName]]',
            'dataElements[id,displayName,categoryCombo[id,displayName]]',
            'indicators[id,displayName,categoryCombo[id,displayName]]',
            'organisationUnits[id]',
            'sections[:all,dataElements[id,displayName,categoryCombo[id,displayName]]',
            'greyedFields[categoryOptionCombo,dataElement]]',
        ].join(','),
    }],
]);

function loadModelFromD2(objectType, objectId) {
    return getD2().then(d2 => {
        if (d2.models[objectType]) {
            return d2.models[objectType]
                .get(objectId, requestParams.get(objectType));
        }
        return Promise.reject('Invalid model');
    });
}

const singleModelStoreConfig = {
    getObjectOfTypeById({ objectType, objectId }) {
        return Observable.fromPromise(loadModelFromD2(objectType, objectId))
            .do((model) => {
                this.setState(model);
            });
    },

    getObjectOfTypeByIdAndClone({ objectType, objectId }) {
        const result = loadModelFromD2(objectType, objectId)
            .then(model => {
                // Clear out the id to create a new model with the same data
                model.id = undefined;
                // Some objects also have a uuid property that should be cleared
                model.uuid = undefined;

                this.setState(model);
            });

        return Observable.fromPromise(result);
    },

    save() {
        const importResultPromise = this.state.save(true)
            .then(response => {
                return response;
            })
            .catch(response => {
                if (isString(response)) {
                    return Promise.reject(response);
                }

                if (response.messages && response.messages.length > 0) {
                    return Promise.reject(response.messages[0].message);
                }

                if (response && response.response && response.response.errorReports && response.response.errorReports.length > 0) {
                    return Promise.reject(response.response.errorReports[0].message);
                }

                if (response  && response.message) {
                    return Promise.reject(response.message);
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
