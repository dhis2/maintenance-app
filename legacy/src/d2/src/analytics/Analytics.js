/**
 * @module analytics
 */
import AnalyticsAggregate from './AnalyticsAggregate';
import AnalyticsEvents from './AnalyticsEvents';
import AnalyticsRequest from './AnalyticsRequest';

/**
 * @description
 * Analytics class used to request analytics data from Web API.
 *
 * @requires analytics.AnalyticsAggregate
 * @requires analytics.AnalyticsEvents
 * @requires analytics.AnalyticsRequest
 *
 * @example
 * const d2Analytics = new Analytics(
 *  new AnalyticsAggregate(),
 *  new AnalyticsEvents(),
 *  AnalyticsRequest
 * )
 *
 * @memberof module:analytics
 * @see {@link https://docs.dhis2.org/master/en/developer/html/webapi_analytics.html} Analytics API documentation
 * @see {@link https://docs.dhis2.org/master/en/developer/html/webapi_event_analytics.html} Event analytics API documentation
 */
class Analytics {
    /**
     * @param {!module:analytics.AnalyticsAggregate} analyticsAggregate The AnalyticsAggregate instance
     * @param {!module:analytics.AnalyticsEvents} analyticsEvents The AnalyticsEvents instance
     * @param {!module:analytics.AnalyticsRequest} analyticsRequest The AnalyticsRequest class
     */
    constructor(analyticsAggregate, analyticsEvents, analyticsRequest) {
        this.aggregate = analyticsAggregate;
        this.events = analyticsEvents;
        this.request = analyticsRequest;
    }

    /**
     * @static
     *
     * @description
     * Get a new instance of the Analytics object. This will function as a singleton, once Analytics object
     * has been created when requesting getAnalytics again the original version will be returned.
     *
     * @returns {Analytics} Object with the analytics interaction properties
     *
     * @example
     * const d2Analytics = d2.getAnalytics();
     */
    static getAnalytics() {
        if (!Analytics.getAnalytics.analytics) {
            Analytics.getAnalytics.analytics = new Analytics(
                new AnalyticsAggregate(),
                new AnalyticsEvents(),
                AnalyticsRequest,
            );
        }

        return Analytics.getAnalytics.analytics;
    }
}

export default Analytics;
