import Store from 'd2-ui/lib/store/Store';
import { getInstance as getD2 } from 'd2/lib/d2';
import { Observable } from 'rxjs';
import isString from 'd2-utilizr/lib/isString';

export const requestParams = new Map([
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
            'dataSetElements[id,dataSet[id],dataElement[id,displayName,categoryCombo[id,displayName]]',
            'categoryCombo[id,displayName]]',
            'indicators[id,displayName,categoryCombo[id,displayName]]',
            'organisationUnits[id,path]',
            'sections[:all,dataElements[id,displayName],categoryCombos[id,displayName],',
            'greyedFields[categoryOptionCombo[id,displayName],dataElement[id,displayName]]]',
        ].join(','),
    }],
    ['categoryOption', {
        fields: [
            ':all',
            'attributeValues[:all,attribute[id,name,displayName]]',
            'organisationUnits[id,path,displayName]',
        ].join(','),
    }],
    ['organisationUnitGroup', {
        fields: [
            ':all',
            'attributeValues[:all,attribute[id,name,displayName]]',
            'organisationUnits[id,path,displayName]',
        ].join(','),
    }],
    ['program', {
        fields: [
            ':all',
            'attributeValues[:all,attribute[id,name,displayName]]',
            'organisationUnits[id,path]',
            'dataEntryForm[:owner]',
            'programStages[:owner,notificationTemplates[displayName,:owner]]',
            'notificationTemplates[:owner]',
        ].join(','),
    }],
    ['programIndicator', {
        fields: [
            ':all',
            'attributeValues[:all,attribute[id,name,displayName]]',
            'program[id,displayName,programType',
            'programTrackedEntityAttributes[id,trackedEntityAttribute[id,displayName,valueType]]]',
        ].join(','),
    }],
    ['programRule', {
        fields: [
            ':all',
            'programRuleActions[:all',
            'dataElement[id,displayName]',
            'trackedEntityAttribute[id,displayName]',
            'programStage[id,displayName]',
            'programStageSection[id,displayName]]',
        ].join(','),
    }],
]);

function loadModelFromD2(objectType, objectId) {
    return getD2().then((d2) => {
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
            .then((model) => {
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
            .then(response => response)
            .catch((response) => {
                if (isString(response)) {
                    return Promise.reject(response);
                }

                if (response.messages && response.messages.length > 0) {
                    return Promise.reject(response.messages[0].message);
                }

                if (response && response.response && response.response.errorReports && response.response.errorReports.length > 0) {
                    return Promise.reject(response.response.errorReports[0].message);
                }

                if (response && response.message) {
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
