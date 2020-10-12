import { checkType, isObject, checkDefined, isDefined } from 'd2/lib/lib/check';
import ModelDefinition from 'd2/lib/model/ModelDefinition';
import ModelCollection from 'd2/lib/model/ModelCollection';

let cachedLocales = null;
const resetCache = () => {
    cachedLocales = null;
};

export default class DataSetByOrgUnitModelDefinition extends ModelDefinition {

    /**
    * Loads a list of models.
    *
    * @param {Object} [listParams={fields: ':all'}] Query parameters that should be passed to the GET query.
    * @returns {Promise} ModelCollection collection of models objects of the `ModelDefinition` type.
    *
    * @example
    * // Loads a list of models and prints their name.
    * dataElement.list()
    *   .then(modelCollection => {
    *     modelCollection.forEach(model => console.log(model.name));
    *   });
    */
    // list(listParams = {}) {
    //     const { apiEndpoint, ...extraParams } = listParams;
    //     const definedRootJunction = this.filters.rootJunction ? { rootJunction: this.filters.rootJunction } : {};
    //     const params = Object.assign({ fields: ':all' }, definedRootJunction, extraParams);
    //     const definedFilters = this.filters.getQueryFilterValues();

    //     if (!isDefined(params.filter)) {
    //         delete params.filter;
    //         if (definedFilters.length) {
    //             params.filter = definedFilters;
    //         }
    //     }

    //     // If listParams.apiEndpoint exists, send the request there in stead of this.apiEndpoint
    //     return this.api.get(apiEndpoint || this.apiEndpoint, params)
    //         .then(responseData => ModelCollection.create(
    //             this,
    //             responseData['dataSets'].map(data => this.create(data)),
    //             Object.assign(responseData.pager || {}, { query: params }),
    //         ));
    // }
}
