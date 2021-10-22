/**
 * @module lib/check
 */

/**
 *
 * @param value
 * @param name
 * @returns {boolean}
 */
export function checkDefined(value, name) {
    if (value !== undefined) {
        return true;
    }
    throw new Error([name || 'Value', 'should be provided'].join(' '));
}

// TODO: Decide if checkType([], 'object') is a 'false' positive
export function checkType(value, type, name) {
    checkDefined(value, name);
    checkDefined(type, 'Type');

    if ((typeof type === 'function' && value instanceof type) ||
        (typeof type === 'string' && typeof value === type)) { // eslint-disable-line valid-typeof
        return true;
    }
    throw new Error(['Expected', name || value, 'to have type', type].join(' '));
}

// TODO: Log type error?
export function isType(value, type) {
    function noop() {}

    try {
        checkType(value, type);
        return true;
    } catch (e) {
        noop();
    }

    return false;
}

export function isString(value) {
    return isType(value, 'string');
}

export function isArray(value) {
    return Array.isArray(value);
}

export function isObject(value) {
    return isType(value, Object);
}

export function isDefined(value) {
    return value != null;
}

export function isInteger(nVal) {
    return typeof nVal === 'number' &&
        isFinite(nVal) &&
        nVal > -9007199254740992 &&
        nVal < 9007199254740992 &&
        Math.floor(nVal) === nVal;
}

// Polyfill for the isInteger function that will be added in ES6
// http://wiki.ecmascript.org/doku.php?id=harmony:number.isinteger
/* istanbul ignore if  */
if (!Number.isInteger) {
    Number.isInteger = isInteger;
}

export function isNumeric(nVal) {
    return typeof nVal === 'number' &&
        isFinite(nVal) &&
        ((nVal - parseFloat(nVal)) + 1) >= 0;
}

export function contains(item, list) {
    const listToCheck = (isArray(list) && list) || [];

    return listToCheck.indexOf(item) >= 0;
}

export const isEmpty = list => list.length === 0;

/**
 * @deprecated Use isValidUid from the `uid.js` file.
 */
export function isValidUid(value) {
    return value && value.length === 11;
}

export const hasKeys = object => object && Object.keys(object).length > 0;

export function areDefinedAndEqual(left, right) {
    return isDefined(left) && isDefined(right) && right === left;
}

export const toBe = (left, right) => left === right;
export const toBeAny = values => left => values.some(right => toBe(left, right));
export const isNullUndefinedOrEmptyString = toBeAny([undefined, null, '']);

export const isFunction = fun => typeof fun === 'function';

export const hasOwnProperty = (object, propertyName) => Object.prototype.hasOwnProperty.call(object, propertyName);

// The logical mode to use when having multiple filters.
// Default is AND.
// See https://docs.dhis2.org/master/en/developer/html/webapi_metadata_object_filter.html

export const rootJunctions = ['OR', 'AND'];
export const isValidRootJunction = toBeAny(rootJunctions);
export function checkValidRootJunction(rootJunction) {
    checkType(rootJunction, 'string', 'rootJunction');

    if (isValidRootJunction(rootJunction)) {
        return true;
    }
    throw new Error(`Expected ${rootJunction} to be one of [${rootJunctions}]`);
}

