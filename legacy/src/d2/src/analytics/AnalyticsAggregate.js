import AnalyticsBase from './AnalyticsBase';

/**
 * @extends module:analytics.AnalyticsBase
 *
 * @description
 * Analytics aggregate class used to request aggregate analytics data from Web API.
 *
 * @memberof module:analytics
 *
 * @see https://docs.dhis2.org/master/en/developer/html/webapi_analytics.html
 */
class AnalyticsAggregate extends AnalyticsBase {
    /**
     * @param {!AnalyticsRequest} req Request object
     *
     * @returns {Promise} Promise that resolves with the analytics data value set data from the API.
     *
     * @example
     * const req = new d2.analytics.request()
     *  .addDataDimension(['Uvn6LCg7dVU','OdiHJayrsKo'])
     *  .addPeriodDimension('LAST_4_QUARTERS')
     *  .addOrgUnitDimension(['lc3eMKXaEfw','PMa2VCrupOd'])
     *  .addOrgUnitFilter('O6uvpzGd5pu')
     *  .withStartDate('2017-10-01')
     *  .withEndDate('2017-10-31');
     *
     * d2.analytics.aggregate.getDataValueSet(req)
     * .then(console.log);
     */
    getDataValueSet(req) {
        return this.get(req.withPath('dataValueSet'));
    }

    /**
     * @param {!AnalyticsRequest} req Request object
     *
     * @returns {Promise} Promise that resolves with the raw data from the API.
     *
     * @example
     * const req = new d2.analytics.request()
     *  .addDataDimension(['Uvn6LCg7dVU','OdiHJayrsKo'])
     *  .addPeriodDimension('LAST_4_QUARTERS')
     *  .addOrgUnitDimension(['lc3eMKXaEfw', 'PMa2VCrupOd'])
     *  .addOrgUnitFilter('O6uvpzGd5pu');
     *  .withStartDate('2017-10-01')
     *  .withEndDate('2017-10-31')
     *  .withFormat('xml');
     *
     *  d2.analytics.aggregate.getRawData(req)
     *  .then(console.log);
     */
    getRawData(req) {
        return this.get(req.withPath('rawData'));
    }

    /**
     * @param {!AnalyticsRequest} req Request object
     *
     * @returns {Promise} Promise that resolves with the SQL statement used to query the database.
     *
     * @example
     * const req = new d2.analytics.request()
     *  .addDataDimension(['Uvn6LCg7dVU','OdiHJayrsKo'])
     *  .addPeriodDimension('LAST_4_QUARTERS')
     *  .addOrgUnitDimension(['lc3eMKXaEfw', 'PMa2VCrupOd'])
     *  .addOrgUnitFilter('O6uvpzGd5pu');
     *  .withStartDate('2017-10-01')
     *  .withEndDate('2017-10-31');
     *
     *  d2.analytics.aggregate.getDebugSql(req);
     *  .then(console.log);
     */
    getDebugSql(req) {
        return this.get(req.withPath('debug/sql'));
    }
}

export default AnalyticsAggregate;
