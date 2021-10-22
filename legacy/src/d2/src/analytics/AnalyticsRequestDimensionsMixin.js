import AnalyticsRequest from './AnalyticsRequest';

/**
 * @private
 * @description
 * AnalyticsRequest dimensions mixin function
 *
 * @param {*} base The base class to mix onto
 * @return {module:analytics.AnalyticsRequestDimensionsMixin} The mixin class
 */
const AnalyticsRequestDimensionsMixin = base =>
    /**
     * @private
     * @description
     * AnalyticsRequest dimensions mixin class
     *
     * @alias module:analytics.AnalyticsRequestDimensionsMixin
     */
    class extends base {
        /**
         * Adds/updates the dx dimension to use in the request.
         *
         * @param {!(String|Array)} values The dimension items to add to the dx dimension
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .addDataDimension(['fbfJHSPpUQD', 'cYeuwXTCPkU'])
         *    .addDataDimension('BfMAe6Itzgt.REPORTING_RATE');
         *
         * // dimension=dx:fbfJHSPpUQD;cYeuwXTCPkU;BfMAe6Itzgt.REPORTING_RATE
         *
         */
        addDataDimension(values) {
            return this.addDimension('dx', values);
        }

        /**
         * Adds/updates the pe dimension to use in the request.
         *
         * @param {!(String|Array)} values The dimension items to add to the pe dimension
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .addPeriodDimension(['201701', '201702'])
         *    .addPeriodDimension('LAST_4_QUARTERS');
         *
         * // dimension=pe:201701;201702;LAST_4_QUARTERS
         */
        addPeriodDimension(values) {
            return this.addDimension('pe', values);
        }

        /**
         * Adds/updates the ou dimension to use in the request.
         *
         * @param {!(String|Array)} values The dimension items to add to the ou dimension
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .addOrgUnitDimension(['O6uvpzGd5pu', 'lc3eMKXaEfw'])
         *    .addOrgUnitDimension('OU_GROUP-w0gFTTmsUcF');
         *
         * // dimension=ou:O6uvpzGd5pu;lc3eMKXaEfw;OU_GROUP-w0gFTTmsUcF
         */
        addOrgUnitDimension(values) {
            return this.addDimension('ou', values);
        }

        /**
         * Adds a new dimension or updates an existing one to use in the request.
         *
         * @param {!String} dimension The dimension to add to the request
         * @param {(String|Array)} values The dimension items to add to the dimension
         *
         * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
         *
         * @example
         * const req = new d2.analytics.request()
         *    .addDimension('Bpx0589u8y0', ['oRVt7g429ZO', 'MAs88nJc9nL'])
         *    .addDimension('qrur9Dvnyt5-Yf6UHoPkdS6');
         *
         * // dimension=Bpx0589u8y0:oRVt7g429ZO;MAs88nJc9nL&dimension=qrur9Dvnyt5-Yf6UHoPkdS6
         */
        addDimension(dimension, values) {
            const existingValues = this.dimensions[dimension] || [];

            if (typeof values === 'string') {
                this.dimensions[dimension] = [...new Set([...existingValues, values])];
            } else if (Array.isArray(values)) {
                this.dimensions[dimension] = [...new Set([...existingValues, ...values])];
            } else {
                this.dimensions[dimension] = existingValues;
            }

            return new AnalyticsRequest(this);
        }
    };

export default AnalyticsRequestDimensionsMixin;
