import AnalyticsRequestDimensionsMixin from './AnalyticsRequestDimensionsMixin';
import AnalyticsRequestFiltersMixin from './AnalyticsRequestFiltersMixin';
import AnalyticsRequestPropertiesMixin from './AnalyticsRequestPropertiesMixin';
import AnalyticsRequestBase from './AnalyticsRequestBase';

/**
 * @description
 * Class for constructing a request object to use for communicating with the analytics API endpoint.
 *
 * @param {!Object} options Object with analytics request options
 *
 * @memberof module:analytics
 *
 * @extends module:analytics.AnalyticsRequestDimensionsMixin
 * @extends module:analytics.AnalyticsRequestFiltersMixin
 * @extends module:analytics.AnalyticsRequestPropertiesMixin
 * @extends module:analytics.AnalyticsRequestBase
 */
class AnalyticsRequest extends
    AnalyticsRequestDimensionsMixin(
        AnalyticsRequestFiltersMixin(
            AnalyticsRequestPropertiesMixin(AnalyticsRequestBase))) { }

export default AnalyticsRequest;
