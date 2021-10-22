/**
 * @module lib/utils
 */


export function throwError(message) {
    throw new Error(message);
}

// TODO: Throw an error when `toCurry` is not a function
export function curry(toCurry, parameter) {
    return function curried(...args) {
        return toCurry.apply(this, [parameter].concat(args));
    };
}

export function addLockedProperty(object, name, value) {
    const propertyDescriptor = {
        enumerable: true,
        configurable: false,
        writable: false,
        value,
    };
    Object.defineProperty(object, name, propertyDescriptor);
}

export function copyOwnProperties(to, from) {
    Object.keys(from)
        .filter(key => from.hasOwnProperty(key))
        .forEach((key) => {
            to[key] = from[key]; // eslint-disable-line no-param-reassign
        });

    return to;
}

/**
 * Curried get function to pick a property from an object
 * Will safely pick a property from an object and guards against the infamous "can not read property of undefined".
 *
 * @param {String} propertyPath
 * @param {Any} defaultValue A default value to be returned when no value was found at the path
 * @returns Function
 *
 * get :: String -> Object -> Any
 */
export function pick(propertyPath) {
    const propertiesToGet = propertyPath.split('.');

    return item => propertiesToGet
        .reduce((result, property) => {
            if (result) {
                return result[property];
            }
            return undefined;
        }, item);
}

export const pickOr = (pathProperty, defaultValue) => (item) => {
    const pathResult = pick(pathProperty)(item);

    return pathResult !== undefined ? pathResult : defaultValue;
};

export class Deferred {
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }

    static create() {
        return new Deferred();
    }
}

export function updateAPIUrlWithBaseUrlVersionNumber(apiUrl, baseUrl) {
    if (!baseUrl || !apiUrl) {
        return apiUrl;
    }

    const apiUrlWithVersionRexExp = /api\/([1-9][0-9])/;
    const apiVersionMatch = baseUrl.match(apiUrlWithVersionRexExp);

    const baseUrlHasVersion = apiVersionMatch && apiVersionMatch[1];
    const apiUrlHasVersion = apiUrl && !apiUrlWithVersionRexExp.test(apiUrl);

    if (baseUrlHasVersion && apiUrlHasVersion) {
        const version = apiVersionMatch[1];

        // Inject the current api version number into the endPoint urls
        return apiUrl.replace(/api/, `api/${version}`);
    }

    return apiUrl;
}

// Define our very own special list of characters that we don't want to encode in the URI
const whitelistURI = ',&$=/;:';
const whitelistURICodes = whitelistURI.split('').map(c => encodeURIComponent(c));
const whitelistRegExp = new RegExp(`(?:${whitelistURICodes.join('|')})`, 'g');

/**
 * Encode all invalid URI characters, except the ones we've decided we don't want to
 */
export function customEncodeURIComponent(uri) {
    // return uri;
    return encodeURIComponent(uri)
        .replace(whitelistRegExp, decodeURIComponent);
}

export function identity(value) {
    return value;
}
