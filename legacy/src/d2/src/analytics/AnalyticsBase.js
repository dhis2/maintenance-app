import Api from '../api/Api';

/**
 * @private
 * @description
 * Base class for communicating with the analytics API endpoint.
 * Its subclasses can be used to get analytics data.
 *
 * @param {Instance} [api=<Api>] Api instance to use for the requests
 *
 * @requires module:api/Api
 *
 * @memberof module:analytics
 * @abstract
 */
class AnalyticsBase {
    constructor(api = Api.getApi()) {
        this.api = api;
    }

    /**
     * Loads the analytics data and returns them as an object from the promise.
     *
     * @param {!AnalyticsRequest} req Analytics request object with the request details
     *
     * @returns {Promise} Promise that resolves with the analytics data from the api.
     *
     * @example
     * const req = new d2.analytics.request()
     *  .addDataDimension(['Uvn6LCg7dVU','OdiHJayrsKo'])
     *  .addPeriodDimension('LAST_4_QUARTERS')
     *  .addOrgUnitDimension(['lc3eMKXaEfw','PMa2VCrupOd']);
     *
     * d2.analytics.aggregate
     *  .get(req)
     *  .then(analyticsData => console.log('Analytics data', analyticsData))
     */
    get(req) {
        return this.api.get(
            req.buildUrl(),
            req.buildQuery())
            .then(data => Promise.resolve(data));
    }
}

export default AnalyticsBase;
