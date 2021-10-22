/**
 * @module api
 */
/* global window fetch Headers */
import 'whatwg-fetch';
import { checkType } from '../lib/check';
import { customEncodeURIComponent } from '../lib/utils';
import System from '../system/System';

function getMergeStrategyParam(mergeType = 'REPLACE') {
    const system = System.getSystem();

    if (system.version && (Number(system.version.minor) <= 22)) {
        return `mergeStrategy=${mergeType}`;
    }

    return `mergeMode=${mergeType}`;
}

function getUrl(baseUrl, url) {
    // If we are dealing with an absolute url use that instead
    if (new RegExp('^(:?https?:)?//').test(url)) {
        return url;
    }

    const urlParts = [];

    if (baseUrl) {
        urlParts.push(baseUrl);
    }
    urlParts.push(url);

    return urlParts.join('/')
        .replace(new RegExp('(.(?:[^:]))//+', 'g'), '$1/')
        .replace(new RegExp('/$'), '');
}

/**
 * @description
 * Used for interaction with the dhis2 api.
 *
 * This class is used as the backbone for d2 and handles all the interaction with the server. There is a singleton
 * available to be reused across your applications. The singleton can be grabbed from the d2 instance. The api methods all handle URL-encoding for you, so you can just pass them unencoded strings
 *
 * ```js
 * import { getInstance } from 'd2/lib/d2';
 *
 * getInstance()
 *  .then(d2 => {
 *      const api = d2.Api.getApi() // Returns the Api singleton.
 *
 *      api.get('resources');
 *  });
 * ```
 *
 * Uses {@link https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API|Fetch} to do network requests.
 *
 * @memberof module:api
 */
class Api {
    /**
     * @constructor
     *
     * @param {Fetch} [fetchImpl] The fetch implementation to use. Can be used to pass a different implementation
     * similar to the fetch Api. Will default to `window.fetch` in a browser context.
     */
    constructor(fetchImpl) {
        // Optionally provide fetch to the constructor so it can be mocked during testing
        if (typeof fetchImpl === 'function') {
            this.fetch = fetchImpl.bind(typeof window !== 'undefined' ? window : global);
        } else if (typeof fetch !== 'undefined') {
            this.fetch = fetch.bind(typeof window !== 'undefined' ? window : global);
        } else {
            throw new Error('Failed to initialise D2 Api: No fetch implementation is available');
        }

        this.baseUrl = '/api';
        this.defaultFetchOptions = {
            mode: 'cors', // requests to different origins fail
            credentials: 'include', // include cookies with same-origin requests
            cache: 'default',  // See https://fetch.spec.whatwg.org/#concept-request-cache-mode
        };
        this.defaultHeaders = {};
    }

    /**
     * Used for setting default headers that should be send with every request.
     *
     * @example
     * const api = Api.getApi();
     *
     * api.setDefaultHeaders({
     *  'x-requested-with': 'XMLHttpRequest', // Make sure the Api does not redirect when authorization is expired.
     * });
     *
     * @param {Object.<string, string>} headers Default headers that should be set on every request.
     */
    setDefaultHeaders(headers) {
        this.defaultHeaders = headers;
    }

    /**
     * Performs a GET request.
     *
     * @param {string} url The url for the request, should be unencoded. Will return a rejected promise for malformed urls and urls that contain encoded query strings.
     * @param {*} data Any data that should be sent with the request. For a GET request these are encoded and turned into
     * query parameters. For POST and PUT requests it becomes the body.
     * @param {Object.<string, any>} options The request options are passed as options to the fetch request.
     * These options are passed as the {@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters|init}
     * parameter to the fetch request.
     *
     * @returns {Promise.<*>} The response body.
     */
    get(url, data, options) {
        return this.request('GET', getUrl(this.baseUrl, url), data, options);
    }

    /* eslint-disable complexity */
    /**
     * Performs a POST request.
     *
     * @param {string} url The url for the request
     * @param {*} data Any data that should be send with the request this becomes the body for the POST request
     * @param {Object.<string, any>} options The request options are passed as options to the fetch request.
     * These options are passed as the {@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters|init}
     * parameter to the fetch request.
     *
     * @returns {Promise.<*>} The response body.
     */
    post(url, data, options = {}) {
        const requestUrl = getUrl(this.baseUrl, url);
        let payload = data;

        // Ensure that headers are defined and are treated without case sensitivity
        options.headers = new Headers(options.headers || {}); // eslint-disable-line

        if (data !== undefined) {
            if (data.constructor.name === 'FormData') {
                // Ensure that the browser will set the correct Content-Type header for FormData, including boundary
                options.headers.delete('Content-Type');
                payload = data;
            } else if (
                options.headers.has('Content-Type') &&
                options.headers.get('Content-Type').toLocaleLowerCase().startsWith('text/')
            ) {
                payload = String(data);
            } else {
                // Send JSON data by default
                options.headers.set('Content-Type', 'application/json');
                payload = JSON.stringify(data);
            }
        }

        return this.request('POST', requestUrl, payload, options);
    }
    /**
     * Performs a DELETE request.
     *
     * @param {string} url The url for the request
     * @param {Object.<string, any>} options The request options are passed as options to the fetch request.
     * These options are passed as the {@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters|init}
     * parameter to the fetch request.
     *
     * @returns {Promise.<*>} The response body.
     */
    /* eslint-enable complexity */
    delete(url, options) {
        return this.request('DELETE', getUrl(this.baseUrl, url), undefined, options);
    }

    /**
     * Perform a PUT request.
     *
     * @param {string} url The url for the request
     * @param {*} data Any data that should be send with the request. This becomes the body of the PUT request.
     * @param {boolean} [useMergeStrategy=false]
     *
     * @returns {Promise.<*>} The response body.
     */
    update(url, data, useMergeStrategy = false) {
        // Since we are currently using PUT to save the full state back, we have to use mergeMode=REPLACE
        // to clear out existing values
        const urlForUpdate = useMergeStrategy === true ? `${url}?${getMergeStrategyParam()}` : url;
        if (typeof data === 'string') {
            return this.request('PUT', getUrl(this.baseUrl, urlForUpdate), String(data),
                { headers: new Headers({ 'Content-Type': 'text/plain' }) });
        }

        return this.request('PUT', getUrl(this.baseUrl, urlForUpdate), JSON.stringify(data));
    }

    /**
     * Perform a PATCH request.
     *
     * @param {string} url The url for the request
     * @param {*} data Any data that should be send with the request. This becomes the body of the PATCH request.
     *
     * @returns {Promise.<*>} The response body.
     */
    patch(url, data) {
        return this.request('PATCH', getUrl(this.baseUrl, url), JSON.stringify(data));
    }

    /**
     * General purpose request function for making http requests.
     *
     * The more specific functions like `delete`, `post` and `get`, utilize this function to make the requests.
     *
     * @param {string} method The HTTP request method (e.g. POST/GET/PATCH)
     * @param {string} url The url for the request
     * @param {*} data Any data that should be send with the request. For a GET request these are turned into
     * query parameters. For POST and PUT requests it becomes the body.
     * @param {Object.<string, any>} options The request options are passed as options to the fetch request.
     * These options are passed as the {@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters|init}
     * parameter to the fetch request.
     *
     * @returns {Promise.<*>} The response body.
     */
    /* eslint-disable complexity */
    request(method, url, data, options = {}) {
        checkType(method, 'string', 'Request type');
        checkType(url, 'string', 'Url');
        const api = this;
        let requestUrl = url;
        let query = '';

        if (requestUrl.indexOf('?') !== -1) {
            query = requestUrl.substr(requestUrl.indexOf('?') + 1);
            requestUrl = requestUrl.substr(0, requestUrl.indexOf('?'));
        }

        // Encode existing query parameters, since tomcat does not accept unencoded brackets. Throw
        // an error if they're already encoded to prevent double encoding.
        if (query) {
            let decodedURL;

            try {
                decodedURL = decodeURIComponent(query);
            } catch (err) {
                return Promise.reject(new Error('Query parameters in URL are invalid'));
            }

            const isEncoded = query !== decodedURL;

            if (isEncoded) {
                return Promise.reject(
                    new Error('Cannot process URL-encoded URLs, pass an unencoded URL'),
                );
            }

            query = customEncodeURIComponent(query);
        }

        // Transfer filter properties from the data object to the query string
        if (data && Array.isArray(data.filter)) {
            const encodedFilters = data.filter
                .map(filter => filter.split(':').map(encodeURIComponent).join(':'));

            query = (
                `${query}${query.length ? '&' : ''}filter=${encodedFilters.join('&filter=')}`
            );
            delete data.filter; // eslint-disable-line no-param-reassign
        }

        // When using the GET method, transform the data object to query parameters
        if (data && method === 'GET') {
            Object.keys(data)
                .forEach((key) => {
                    query = (
                        `${query}${(query.length > 0 ? '&' : '')}` +
                        `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
                    );
                });
        }

        function getOptions(defaultHeaders, mergeOptions, requestData) {
            const resultOptions = Object.assign({}, api.defaultFetchOptions, mergeOptions);
            const headers = new Headers(mergeOptions.headers || {});

            Object
                .keys(defaultHeaders)
                .filter(header => !headers.get(header))
                .forEach(header => headers.set(header, defaultHeaders[header]));

            resultOptions.method = method;

            // Only set content type when there is data to send
            // GET requests and requests without data do not need a Content-Type header
            // 0 and false are valid requestData values and therefore should have a content type
            if (resultOptions.method === 'GET' || (!requestData && requestData !== 0 && requestData !== false)) {
                headers.delete('Content-Type');
            } else if (requestData) {
                if (data.constructor.name === 'FormData') {
                    headers.delete('Content-Type');
                } else if (!headers.get('Content-Type')) {
                    headers.set('Content-Type', 'application/json');
                }
                resultOptions.body = requestData;
            }

            resultOptions.headers = headers;
            return resultOptions;
        }

        if (query.length) {
            requestUrl = `${requestUrl}?${query}`;
        }
        const requestOptions = getOptions(this.defaultHeaders, options, data);

        // If the provided value is valid JSON, return the parsed JSON object. If not, return the raw value as is.
        function parseResponseData(value) {
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        }

        return new Promise((resolve, reject) => {
            // fetch returns a promise that will resolve with any response received from the server
            // It will be rejected ONLY if no response is received from the server, i.e. because there's no internet
            this.fetch(requestUrl, requestOptions)
                .then((response) => {
                    // If the request failed, response.ok will be false and response.status will be the status code
                    if (response.ok) {
                        response.text().then(text => resolve(parseResponseData(text)));
                    } else {
                        response.text().then((text) => {
                            if (!process.env || process.env.npm_lifecycle_event !== 'test') {
                                console.warn( // eslint-disable-line
                                    `API request failed with status ${response.status} ${response.statusText}\n`,
                                    `Request: ${requestOptions.method} ${requestUrl}`,
                                );
                            }
                            reject(parseResponseData(text));
                        });
                    }
                })
                .catch((err) => {
                    // It's not usually possible to get much info about the cause of the error programmatically, but
                    // the user can check the browser console for more info
                    if (!process.env || process.env.npm_lifecycle_event !== 'test') {
                        console.error('Server connection error:', err); // eslint-disable-line
                    }
                    reject(`Server connection failed for API request: ${requestOptions.method} ${requestUrl}`);
                });
        });
    }
    /* eslint-enable complexity */

    /**
     * Sets the baseUrl that should be used for the api.
     *
     * When working against the dhis2 demo instance at {@link https://play.dhis2.org/demo} the
     * baseUrl would be set as `https://play.dhis2.org/demo/api`.
     *
     * This method is used when calling the `d2.init` method with the `baseUrl` config property
     * to configure the Api singleton.
     *
     * @param {string} baseUrl The base url to be used for the API.
     *
     * @returns {this} Itself for chaining purposes
     */
    setBaseUrl(baseUrl) {
        checkType(baseUrl, 'string', 'Base url');

        this.baseUrl = baseUrl;

        return this;
    }
}

/**
 * Retrieve the Api singleton or create one.
 *
 * When called for the first time it creates and Api singleton object.
 * Any subsequent calls will return the previously created singleton.
 *
 * @returns {Api} The Api singleton.
 * @memberof module:api~Api
 */
function getApi() {
    if (getApi.api) {
        return getApi.api;
    }
    return (getApi.api = new Api());
}

Api.getApi = getApi;

export default Api;
