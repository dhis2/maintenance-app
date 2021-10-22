import { bg as commonjsGlobal, bX as isArray, bY as numberIsFinite, bZ as isObject$1, b_ as isString, b$ as isNumber, c0 as camelCaseToUnderscores, c1 as isArrayOfStrings, c2 as isIterable, P as PropTypes, r as react, at as _default } from './index-44839b1a.js';

var lib = {};

var isEmpty$1 = {};

var lodash_ismap = {exports: {}};

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

(function (module, exports) {
/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports = exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding('util');
  } catch (e) {}
}());

/* Node.js helper references. */
var nodeIsMap = nodeUtil && nodeUtil.isMap;

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * The base implementation of `getTag`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  return objectToString.call(value);
}

/**
 * The base implementation of `_.isMap` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 */
function baseIsMap(value) {
  return isObjectLike(value) && getTag(value) == mapTag;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge < 14, and promises in Node.js.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = objectToString.call(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Map` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 * @example
 *
 * _.isMap(new Map);
 * // => true
 *
 * _.isMap(new WeakMap);
 * // => false
 */
var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

module.exports = isMap;
}(lodash_ismap, lodash_ismap.exports));

var lodash_isset = {exports: {}};

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

(function (module, exports) {
/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports = exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding('util');
  } catch (e) {}
}());

/* Node.js helper references. */
var nodeIsSet = nodeUtil && nodeUtil.isSet;

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * The base implementation of `getTag`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  return objectToString.call(value);
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.isSet` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 */
function baseIsSet(value) {
  return isObjectLike(value) && getTag(value) == setTag;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge < 14, and promises in Node.js.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = objectToString.call(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Set` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 * @example
 *
 * _.isSet(new Set);
 * // => true
 *
 * _.isSet(new WeakSet);
 * // => false
 */
var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

module.exports = isSet;
}(lodash_isset, lodash_isset.exports));

Object.defineProperty(isEmpty$1, "__esModule", {
  value: true
});
isEmpty$1.default = isEmpty;

var _isArray$3 = isArray;

var _isArray2$3 = _interopRequireDefault$a(_isArray$3);

var _lodash$2 = lodash_ismap.exports;

var _lodash2$2 = _interopRequireDefault$a(_lodash$2);

var _lodash3 = lodash_isset.exports;

var _lodash4 = _interopRequireDefault$a(_lodash3);

function _interopRequireDefault$a(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Check if a value is concidered _empty_. An _empty_ value is an empty `Set`, `Map` or `Array`.
 * Depending on if the `allowEmptyString` flag, empty strings are also considered _empty_
 *
 * @param {*} param Value to check
 * @param {boolean} allowEmptyString When set to true an empty string will not be considered _empty_.
 * @returns {boolean} Returns `true` when the value is _empty_, otherwise false
 *
 * @example
 * isEmpty(''); // Returns: true
 * isEmpty('', true); // Returns: false
 * isEmpty(null); // Returns: true
 * isEmpty(new Map()); // Returns: true
 */
function isEmpty(param, allowEmptyString) {
  return param == null || (!allowEmptyString ? param === '' : false) || (0, _isArray2$3.default)(param) && param.length === 0 || ((0, _lodash2$2.default)(param) || (0, _lodash4.default)(param)) && param.size === 0;
}

var isDefined$1 = {};

Object.defineProperty(isDefined$1, "__esModule", {
  value: true
});
isDefined$1.default = isDefined;
/**
 * Check if `param` is defined.
 *
 * @param {*} param The value to check
 * @returns {boolean} Returns `false` when `param` is `undefined` otherwise true.
 */
function isDefined(param) {
  return typeof param !== 'undefined';
}

var isFunction$1 = {};

/**
 * Lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright JS Foundation and other contributors <https://js.foundation/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    nullTag = '[object Null]',
    proxyTag = '[object Proxy]',
    undefinedTag = '[object Undefined]';

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto$1.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto$1.toString;

/** Built-in value references. */
var Symbol$1 = root.Symbol,
    symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString$1(value);
}

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString$1(value) {
  return nativeObjectToString.call(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var lodash_isfunction = isFunction;

Object.defineProperty(isFunction$1, "__esModule", {
  value: true
});

var _lodash$1 = lodash_isfunction;

var _lodash2$1 = _interopRequireDefault$9(_lodash$1);

function _interopRequireDefault$9(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Check if the value is a Function
 *
 * @name isFunction
 * @param {*} param Value to be checked
 * @returns {boolean} Returns true when the `param` is a Function
 */
isFunction$1.default = _lodash2$1.default;

var isBoolean$1 = {};

/**
 * lodash 3.0.3 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var boolTag = '[object Boolean]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a boolean primitive or object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isBoolean(false);
 * // => true
 *
 * _.isBoolean(null);
 * // => false
 */
function isBoolean(value) {
  return value === true || value === false ||
    (isObjectLike(value) && objectToString.call(value) == boolTag);
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

var lodash_isboolean = isBoolean;

Object.defineProperty(isBoolean$1, "__esModule", {
  value: true
});

var _lodash = lodash_isboolean;

var _lodash2 = _interopRequireDefault$8(_lodash);

function _interopRequireDefault$8(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Check if a value is a boolean value `true` or `false`
 *
 * @name isBoolean
 * @param {*} param The value to check for boolean type
 * @returns {boolean} Returns `true` when the value is a boolean otherwise `false`
 */
isBoolean$1.default = _lodash2.default;

var isPrimitive$1 = {};

Object.defineProperty(isPrimitive$1, "__esModule", {
  value: true
});

var _typeof$2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

isPrimitive$1.default = isPrimitive;
/**
 * Check if a value is a _primitive_ (string, number, boolean)
 *
 * @param {*} param Value to be checked for a primitive type definition.
 * @returns {boolean} Returns `true` if the value is a primitive, otherwise `false`
 */
function isPrimitive(param) {
  var type = typeof param === 'undefined' ? 'undefined' : _typeof$2(param);
  return type === 'string' || type === 'number' || type === 'boolean';
}

var isNumeric$1 = {};

Object.defineProperty(isNumeric$1, "__esModule", {
    value: true
});

var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

isNumeric$1.default = isNumeric;
/**
 * Check if a value is numeric
 *
 * @param param Value to be checked
 * @returns {boolean} Returns true when the `param` is a numeric value
 */
function isNumeric(param) {
    if ((typeof param === 'undefined' ? 'undefined' : _typeof$1(param)) === 'symbol') {
        return false;
    }

    return !isNaN(parseFloat(param)) && commonjsGlobal.isFinite(param);
}

var isInteger$1 = {};

Object.defineProperty(isInteger$1, "__esModule", {
  value: true
});
isInteger$1.default = isInteger;
/**
 * Check if a value is an integer
 *
 * @param param Value that will be checked if it is an integer
 * @returns {boolean} Returns `true` when param is a integer otherwise false
 *
 * @example
 * isInteger(17); // Returns: true
 *
 * @example
 * isInteger(0xFF); // Returns: true
 *
 * @example
 * isInteger(-17); // Returns: true
 *
 * @example
 * isInteger(2e-3); // Returns: false
 */
function isInteger(param) {
  return typeof param === 'number' && parseFloat(param) == parseInt(param, 10) && !isNaN(param);
}

var numberConstrain$1 = {};

Object.defineProperty(numberConstrain$1, "__esModule", {
    value: true
});
numberConstrain$1.default = numberConstrain;
/**
 * Constrains the value between the passed min and max
 *
 * @param {Number} number The value to be constrained
 * @param {Number} min The minumum number that the value should be within
 * @param {Number} max The maximum number that the value should be within
 * @returns {Number|*} The resulting number
 */
function numberConstrain(number, min, max) {
    number = parseFloat(number);

    if (!isNaN(min)) {
        number = Math.max(number, min);
    }
    if (!isNaN(max)) {
        number = Math.min(number, max);
    }
    return number;
}

var numberToFixed$1 = {};

Object.defineProperty(numberToFixed$1, "__esModule", {
    value: true
});
/**
 * Fixes the number to a certain amount of decimals
 *
 * @param {Number} value The value to apply the function to
 * @param {Number} [precision=0] The amount of decimal digits to fix to
 * @returns {String} The "fixed" number with the specified amount of decimals
 */
var numberToFixed = function () {

    function standardToFixed(value, precision) {
        precision = precision || 0;

        return value.toFixed(precision);
    }

    // TODO: The "broken" toFixed is not easy to test? Should check if still relevant.
    // return ((0.9).toFixed() !== '1') ? fixedToFixed : standardToFixed;
    return standardToFixed;
}();

numberToFixed$1.default = numberToFixed;

var numberDecimals$1 = {};

Object.defineProperty(numberDecimals$1, "__esModule", {
    value: true
});
numberDecimals$1.default = numberDecimals;

var _numberIsFinite = numberIsFinite;

var _numberIsFinite2 = _interopRequireDefault$7(_numberIsFinite);

var _isInteger = isInteger$1;

var _isInteger2 = _interopRequireDefault$7(_isInteger);

function _interopRequireDefault$7(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns the number of decimal places in a number
 *
 * @param {Number} number The number to be checked
 * @returns {Number} The number of decimal places in the given number
 */
function numberDecimals(number) {
    var abs = Math.abs(number);
    var tmp = abs;
    var count = 1;

    while (!(0, _isInteger2.default)(tmp) && (0, _numberIsFinite2.default)(tmp)) {
        tmp = abs * Math.pow(10, count++);
    }

    return count - 1;
}

var stringReplaceAll$1 = {};

Object.defineProperty(stringReplaceAll$1, "__esModule", {
  value: true
});
stringReplaceAll$1.default = stringReplaceAll;
/**
 * Replace all occurrences of the `matchValue` within the `str` parameter.
 *
 * @param {string} str The string to operate on
 * @param {string} matchValue The value to match on
 * @param {string|function} replaceValue The value to replace the matches with
 * @param {boolean} ignore Case sensitivity ignore flag. Pass `true` to ignore case. (Defaults to `false`)
 * @returns {XML|void|string|*} The resulting string.
 */
function stringReplaceAll(str, matchValue, replaceValue, ignore) {
  return str.replace(new RegExp(matchValue.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), ignore ? "gi" : "g"), typeof replaceValue == "string" ? replaceValue.replace(/\$/g, "$$$$") : replaceValue);
}

var stringTrim$1 = {};

Object.defineProperty(stringTrim$1, "__esModule", {
  value: true
});
stringTrim$1.default = stringTrim;
/**
 * Removes all spaces before first after last text char.
 *
 * @param {string} str The string to operate on
 * @returns {string} The resulting string.
 */
function stringTrim(str) {
  return str.replace(/^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g, '');
}

var arrayPluck$1 = {};

Object.defineProperty(arrayPluck$1, "__esModule", {
    value: true
});
arrayPluck$1.default = arrayPluck;
/**
 *
 * @param {Array} array
 * @param {string|number} propertyName The property of the
 * @returns {Array}
 *
 * @throws {TypeError} When the `propertyName` can not be found on an item in the `array`. This generally happens when a value in the array is `null` or `undefined`
 *
 * @example
 * const values = [{name: 'John'}, {name: 'James'}];
 * arrayPluck(values, 'name') // returns: ['John', 'James']
 *
 * @example
 * const values = [{name: 'John'}, {}, {name: 'James'}];
 * arrayPluck(values, 'name') // returns: ['John', undefined, 'James']
 *
 * @example
 * const values = [undefined, {name: 'James'}];
 * arrayPluck(values, 'name') // throws: Cannot read property 'name' of undefined
 */
function arrayPluck(array, propertyName) {
    var newArray = [];
    var i;
    var len;
    var item;

    for (i = 0, len = array.length; i < len; i++) {
        item = array[i];

        newArray.push(item[propertyName]);
    }

    return newArray;
}

var arrayContains$1 = {};

Object.defineProperty(arrayContains$1, "__esModule", {
  value: true
});
arrayContains$1.default = arrayContains;
/**
 * Check if an array contains a specified item
 *
 * @param {Array} array The array to check for the item
 * @param {*} item The item to look for in the array
 * @returns {boolean} Returns true when the item is found, otherwise false
 */
function arrayContains(array, item) {
  return Array.prototype.indexOf.call(array, item) !== -1;
}

var arrayUnique$1 = {};

Object.defineProperty(arrayUnique$1, "__esModule", {
    value: true
});
arrayUnique$1.default = arrayUnique;
/**
 * Creates an array of unique values from the array passed. This function does not do a _deep_ compare.
 * Objects with the same values will therefore not be filtered.
 *
 * @param {Array} array The array to create the array of uniques from
 * @returns {Array} The array containing the unique values
 *
 * @throws {TypeError} Is thrown when the argument passed is not an `array`
 *
 * @example
 * const sourceArray = [1, 1, 2, 3, 2, 4, 4, 3];
 * arrayUnique(sourceArray); // returns: [1, 2, 3, 4]
 *
 * @example
 * const A = {name: 'A'};
 * const B = {name: 'B'};
 * arrayUnique([A, A, B, B]); // Returns: [{name: 'A'}, {name: 'B'}]
 *
 * @example
 * const sourceArray = [{name: 'A'}, {name: 'B'}, {name: 'B'}];
 * arrayUnique(sourceArray); // Returns: [{name: 'A'}, {name: 'B'}, {name: 'B'}]
 */
function arrayUnique(array) {
    // TODO: Could be written as `return [...(new Set(array))];`
    var newArray = [];
    var i = 0;
    var len = array.length;
    var item;

    for (; i < len; i++) {
        item = array[i];

        if (newArray.indexOf(item) === -1) {
            newArray.push(item);
        }
    }

    return newArray;
}

var arrayFrom$1 = {};

Object.defineProperty(arrayFrom$1, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

arrayFrom$1.default = arrayFrom;

var _isArray$2 = isArray;

var _isArray2$2 = _interopRequireDefault$6(_isArray$2);

function _interopRequireDefault$6(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create an array from a value
 *
 * @param {*} param Value to transform to an array
 * @param {boolean} [isNewRef] Should return a new reference than the one from the `param` value
 * @returns {Array} The resulting array
 *
 * @requires isArray
 */
function arrayFrom(param, isNewRef) {
    var toArray = function toArray(iterable, start, end) {
        if (!iterable || !iterable.length) {
            return [];
        }

        // FIXME: This will never be called as the if check excludes type string
        if (typeof iterable === 'string') {
            iterable = iterable.split('');
        }

        if (supportsSliceOnNodeList) {
            // FIXME: This does not exist
            return slice.call(iterable, start || 0, end || iterable.length);
        }

        var array = [],
            i;

        // FIXME: start and end are always 0 and iterable.length
        start = start || 0;
        end = end ? end < 0 ? iterable.length + end : end : iterable.length;

        for (i = start; i < end; i++) {
            array.push(iterable[i]);
        }

        return array;
    };

    if (param === undefined || param === null) {
        return [];
    }

    if ((0, _isArray2$2.default)(param)) {
        return isNewRef ? Array.prototype.slice.call(param) : param;
    }

    var type = typeof param === 'undefined' ? 'undefined' : _typeof(param);
    if (param && param.length !== undefined && type !== 'string' && (type !== 'function' || !param.apply)) {
        // TODO: This function call will always fail because of supportsSliceOnNodeList being undefined
        return toArray(param);
    }

    return [param];
}

var arrayTo$1 = {};

Object.defineProperty(arrayTo$1, "__esModule", {
    value: true
});
arrayTo$1.default = arrayTo;

var _isArray$1 = isArray;

var _isArray2$1 = _interopRequireDefault$5(_isArray$1);

var _isObject$1 = isObject$1;

var _isObject2$1 = _interopRequireDefault$5(_isObject$1);

var _isString$1 = isString;

var _isString2$1 = _interopRequireDefault$5(_isString$1);

function _interopRequireDefault$5(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create an array from the passed `param`. (When the value is an object only takes the iterable properties from the object (not its prototypes))
 *
 * @param {Object|String|Array} param The value to transform to an array
 * @returns {Array} Returns the `param` transformed into an array, or an empty array of the value can not be transformed.
 *
 * @example
 * arrayTo('myData') // Returns: ['myData']
 *
 * @example
 * const sourceObject = {
 *     name: 'ANC First Visit',
 *     shortName: 'ANC1',
 *     level: 1,
 * };
 * arrayTo(sourceObject); // Returns: ['ANC First Visit', 'ANC1', 1]
 *
 * @example
 * arrayTo(null); // Returns: []
 */
function arrayTo(param) {
    if ((0, _isArray2$1.default)(param)) {
        return param;
    }

    if ((0, _isObject2$1.default)(param)) {
        var a = [];
        for (var key in param) {
            if (param.hasOwnProperty(key)) {
                a.push(param[key]);
            }
        }
        return a;
    }

    if ((0, _isString2$1.default)(param)) {
        return param.split();
    }

    return [];
}

var arrayClean$1 = {};

Object.defineProperty(arrayClean$1, "__esModule", {
    value: true
});
arrayClean$1.default = arrayClean;

var _isEmpty$1 = isEmpty$1;

var _isEmpty2$1 = _interopRequireDefault$4(_isEmpty$1);

function _interopRequireDefault$4(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Cleans the given array of _empty_ values
 *
 * @see {isEmpty} for how the values are determined to be empty.
 *
 * @param {Array} array The array to be _cleaned_
 * @returns {Array} The clean array
 *
 * @throws {TypeError} When the passed array is not actually an array.
 *
 * @example
 * const sourceArray = [undefined, null, true, '', {}];
 * arrayClean(sourceArray); // Returns: [true, {}]
 *
 * @example
 * arrayClean() // throws: Cannot read property 'length' of undefined
 */
// TODO: Could be written as `array.filter(isEmpty);`
function arrayClean(array) {
    var results = [],
        i = 0,
        ln = array.length,
        // TODO: throws if the error is undefined
    item;

    for (; i < ln; i++) {
        item = array[i];

        if (!(0, _isEmpty2$1.default)(item)) {
            results.push(item);
        }
    }

    return results;
}

var arraySort$1 = {};

Object.defineProperty(arraySort$1, "__esModule", {
    value: true
});
arraySort$1.default = arraySort;

var _isString = isString;

var _isString2 = _interopRequireDefault$3(_isString);

var _isNumber = isNumber;

var _isNumber2 = _interopRequireDefault$3(_isNumber);

var _isArray = isArray;

var _isArray2 = _interopRequireDefault$3(_isArray);

var _isObject = isObject$1;

var _isObject2 = _interopRequireDefault$3(_isObject);

function _interopRequireDefault$3(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function arraySort(array, direction, key, emptyFirst) {
    // supports [number], [string], [{key: number}], [{key: string}], [[string]], [[number]]

    if (!(0, _isArray2.default)(array)) {
        return;
    }

    key = !!key || (0, _isNumber2.default)(key) ? key : 'name';

    array.sort(function (a, b) {
        // if object, get the property values
        if ((0, _isObject2.default)(a) && (0, _isObject2.default)(b)) {
            a = a[key];
            b = b[key];
        }

        // if array, get from the right index
        if ((0, _isArray2.default)(a) && (0, _isArray2.default)(b)) {
            a = a[key];
            b = b[key];
        }

        // string
        if ((0, _isString2.default)(a) && (0, _isString2.default)(b)) {
            a = a.toLowerCase();
            b = b.toLowerCase();

            if (direction === 'DESC') {
                // TODO: Case sensitive really required? Why not allow `desc`, `Desc` or `dEsC`?
                return a < b ? 1 : a > b ? -1 : 0;
            } else {
                return a < b ? -1 : a > b ? 1 : 0;
            }
        }

        // number
        else if ((0, _isNumber2.default)(a) && (0, _isNumber2.default)(b)) {
                return direction === 'DESC' ? b - a : a - b;
            } else if (a === undefined || a === null) {
                return emptyFirst ? -1 : 1;
            } else if (b === undefined || b === null) {
                return emptyFirst ? 1 : -1;
            }

        return -1;
    });

    return array;
}

var arrayReplace$1 = {};

Object.defineProperty(arrayReplace$1, "__esModule", {
    value: true
});
arrayReplace$1.default = arrayReplace;
/**
 * Replace values in an array with given values or remove values from an array.
 *
 * @param {Array} array The array where the values should be replaced
 * @param {number} index The index in the array where to start the replacement
 * @param {number} removeCount The number of items to remove
 * @param {*} insert The item(s) to be inserted
 * @returns {Array} The array with the replaced values
 *
 * @example
 * const sourceArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 * arrayReplace(sourceArray, 0, 5, ['a', 'b', 'c', 'd']); // Returns: ['a', 'b', 'c', 'd', 6, 7, 8, 9, 10]
 */
function arrayReplace(array, index, removeCount, insert) {
    if (insert && insert.length) {
        if (index < array.length) {
            array.splice.apply(array, [index, removeCount].concat(insert));
        } else {
            array.push.apply(array, insert);
        }
    } else {
        array.splice(index, removeCount);
    }
    return array;
}

var arrayRepeat$1 = {};

Object.defineProperty(arrayRepeat$1, "__esModule", {
    value: true
});
arrayRepeat$1.default = arrayRepeat;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * 
 * Repeats content of array by structure or by index, returns flattened array.
 * 
 * @param   {array}   array 
 * @param   {number}  n 
 * @param   {boolean} [byIndex=false] 
 * @returns {array}
 *
 * @example
 * const values = [1, 2, 3];
 * arrayRepeat(values, 3) // returns: [1, 2, 3, 1, 2, 3, 1, 2, 3]
 *
 * @example
 * const values = [1, 2, 3];
 * arrayRepeat(values, 3, true) // returns: [1, 1, 1, 2, 2, 2, 3, 3, 3]
 */
function arrayRepeat(array) {
    var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var byIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;


    if (typeof array === 'undefined') {
        throw 'Cannot repeat array of type undefined';
    }

    var newArray = [];

    if (byIndex) {

        for (var i = 0; i < array.length; i++) {
            for (var j = 0; j < n; j++) {
                newArray.push(array[i]);
            }
        }

        return newArray;
    }

    for (var _i = 0; _i < n; _i++) {
        newArray.push.apply(newArray, _toConsumableArray(array));
    }

    return newArray;
}

var arrayInsert$1 = {};

Object.defineProperty(arrayInsert$1, "__esModule", {
  value: true
});
arrayInsert$1.default = arrayInsert;

var _arrayReplace = arrayReplace$1;

var _arrayReplace2 = _interopRequireDefault$2(_arrayReplace);

function _interopRequireDefault$2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Insert a value into an array
 *
 * @param {Array} array The array to insert the items into
 * @param {number} index The index where to insert the values
 * @param {*} items The item(s) to insert
 * @returns {Array} The resulting array with the inserted `items`
 *
 * @example
 * const sourceArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 * sourceArray, undefined, ['a', 'b', 'c']); // Returns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 'a', 'b', 'c']
 */
function arrayInsert(array, index, items) {
  return (0, _arrayReplace2.default)(array, index, 0, items);
}

var arrayDifference$1 = {};

Object.defineProperty(arrayDifference$1, "__esModule", {
    value: true
});
arrayDifference$1.default = arrayDifference;

var _arrayUnique = arrayUnique$1;

var _arrayUnique2 = _interopRequireDefault$1(_arrayUnique);

var _arrayContains = arrayContains$1;

var _arrayContains2 = _interopRequireDefault$1(_arrayContains);

function _interopRequireDefault$1(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * @param {Array} array1
 * @param {Array} array2
 * @param {boolean} biDirectional False returns A-B while true returns A-B concat B-A
 * @returns {Array}
 *
 * @throws {TypeError} When `filter` can not be found on `array`. This generally happens when the array is `null` or `undefined`
 *
 * @example
 * const a = [1, 2];
 * const b = [1, 3];
 * difference(a, b) // returns: [2]
 * difference(a, b, true) // returns: [2, 3]
 */
function arrayDifference(array1, array2, biDirectional) {
    return (0, _arrayUnique2.default)(array1.filter(function (item) {
        return !(0, _arrayContains2.default)(array2, item);
    }).concat(biDirectional === true ? array2.filter(function (item) {
        return !(0, _arrayContains2.default)(array1, item);
    }) : []));
}

var arrayMin$1 = {};

Object.defineProperty(arrayMin$1, "__esModule", {
    value: true
});
arrayMin$1.default = arrayMin;
/**
 * Return the lowest value (number) in the given array
 *
 * @param {Array} array The array to be scanned
 * @returns {Array} The lowest value
 *
 * @throws {TypeError} When the passed array is not actually an array.
 *
 * @example
 * const sourceArray = [3,1,2];
 * arrayMax(sourceArray); // Returns: 1
 *
 * @example
 * arrayClean() // throws: Cannot read property 'length' of undefined
 */
function arrayMin(array, comparisonFn) {
    var i = 0,
        ln = array.length,
        item,
        min = array[0];

    for (; i < ln; i++) {
        item = array[i];

        if (comparisonFn) {
            if (comparisonFn(min, item) === 1) {
                min = item;
            }
        } else {
            if (item < min) {
                min = item;
            }
        }
    }

    return min;
}

var arrayMax$1 = {};

Object.defineProperty(arrayMax$1, "__esModule", {
    value: true
});
arrayMax$1.default = arrayMax;
/**
 * Return the highest value (number) in the given array
 *
 * @param {Array} array The array to be scanned
 * @returns {Array} The highest value
 *
 * @throws {TypeError} When the passed array is not actually an array.
 *
 * @example
 * const sourceArray = [1,3,2];
 * arrayMax(sourceArray); // Returns: 3
 *
 * @example
 * arrayClean() // throws: Cannot read property 'length' of undefined
 */
function arrayMax(array, comparisonFn) {
    var i = 0,
        ln = array.length,
        item,
        max = array[0];

    for (; i < ln; i++) {
        item = array[i];

        if (comparisonFn) {
            if (comparisonFn(max, item) === -1) {
                max = item;
            }
        } else {
            if (item > max) {
                max = item;
            }
        }
    }

    return max;
}

var objectClean = {};

Object.defineProperty(objectClean, "__esModule", {
    value: true
});
objectClean.default = cleanObject;

var _isEmpty = isEmpty$1;

var _isEmpty2 = _interopRequireDefault(_isEmpty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Applies properties from "config" if they are undefined in "object.
 *
 * @param {Object} object The object to be cleaned
 * @param {Function} isEmptyFn Optional isEmpty function
 * @returns {Object} A new cleaned object
 *
 * @example
 * let object = {id: 1, name: undefined}
 * objectClean(object); // returns: {id: 1}
 */

function cleanObject(object) {
    var isEmptyFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _isEmpty2.default;

    return Object.keys(object).reduce(function (acc, key) {
        if (!isEmptyFn(object[key])) {
            acc[key] = object[key];
        }
        return acc;
    }, {});
}

var isIE$1 = {};

Object.defineProperty(isIE$1, "__esModule", {
    value: true
});
isIE$1.default = isIE;
/**
 * Check if the users browser is a version of Internet Explorer
 *
 * @param [ua] The users user-agent string.
 * @returns {boolean|number} Returns the version number (10, 11, 12) when the browser is IE, otherwise `false`
 *
 * @example
 * // When using IE10
 * isIE(); // Returns: 10
 *
 * // When using FireFox
 * isIE(); // Returns: false
 *
 * TODO: It is not very good practice to return two different types of values from a function. Perhaps we can return `true` on IE and have a secondary function to get the version?
 */
function isIE() {
    var ua = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.navigator.userAgent;

    // test values
    // IE 10: ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';
    // IE 11: ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
    // IE 12 / Spartan: ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
        // IE 12 => return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
}

var clone$1 = {};

Object.defineProperty(clone$1, "__esModule", {
  value: true
});
clone$1.default = clone;
// TODO: Throw an error on empty `item` (Unexpected token u)
/**
 * Create a clone a value
 *
 * @param {*} item
 *
 * @example
 * const person1 = {name: 'John'};
 * const person2 = clone(person1); // Returns {name: 'John'}
 * // but
 * person1 !== person2 // Returns:  true
 */
function clone(item) {
  return commonjsGlobal.JSON.parse(commonjsGlobal.JSON.stringify(item));
}

var uuid$1 = {};

Object.defineProperty(uuid$1, "__esModule", {
    value: true
});
uuid$1.default = uuid;
/**
 * Generates a universally unique identifier
 *
 * @see https://en.wikipedia.org/wiki/Universally_unique_identifier
 *
 * @returns {string} The uuid
 */
function uuid() {
    var s4 = function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

(function (exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isIterable = exports.uuid = exports.clone = exports.isIE = exports.objectClean = exports.isArrayOfStrings = exports.arrayMax = exports.arrayMin = exports.arrayDifference = exports.arrayInsert = exports.arrayRepeat = exports.arrayReplace = exports.arraySort = exports.arrayClean = exports.arrayTo = exports.arrayFrom = exports.arrayUnique = exports.arrayContains = exports.arrayPluck = exports.camelCaseToUnderscores = exports.stringTrim = exports.stringReplaceAll = exports.numberDecimals = exports.numberIsFinite = exports.numberToFixed = exports.numberConstrain = exports.isInteger = exports.isNumeric = exports.isArray = exports.isString = exports.isNumber = exports.isPrimitive = exports.isBoolean = exports.isFunction = exports.isObject = exports.isDefined = exports.isEmpty = undefined;

var _isEmpty = isEmpty$1;

Object.defineProperty(exports, 'isEmpty', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_isEmpty).default;
  }
});

var _isDefined = isDefined$1;

Object.defineProperty(exports, 'isDefined', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_isDefined).default;
  }
});

var _isObject = isObject$1;

Object.defineProperty(exports, 'isObject', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_isObject).default;
  }
});

var _isFunction = isFunction$1;

Object.defineProperty(exports, 'isFunction', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_isFunction).default;
  }
});

var _isBoolean = isBoolean$1;

Object.defineProperty(exports, 'isBoolean', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_isBoolean).default;
  }
});

var _isPrimitive = isPrimitive$1;

Object.defineProperty(exports, 'isPrimitive', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_isPrimitive).default;
  }
});

var _isNumber = isNumber;

Object.defineProperty(exports, 'isNumber', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_isNumber).default;
  }
});

var _isString = isString;

Object.defineProperty(exports, 'isString', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_isString).default;
  }
});

var _isArray = isArray;

Object.defineProperty(exports, 'isArray', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_isArray).default;
  }
});

var _isNumeric = isNumeric$1;

Object.defineProperty(exports, 'isNumeric', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_isNumeric).default;
  }
});

var _isInteger = isInteger$1;

Object.defineProperty(exports, 'isInteger', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_isInteger).default;
  }
});

var _numberConstrain = numberConstrain$1;

Object.defineProperty(exports, 'numberConstrain', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_numberConstrain).default;
  }
});

var _numberToFixed = numberToFixed$1;

Object.defineProperty(exports, 'numberToFixed', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_numberToFixed).default;
  }
});

var _numberIsFinite = numberIsFinite;

Object.defineProperty(exports, 'numberIsFinite', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_numberIsFinite).default;
  }
});

var _numberDecimals = numberDecimals$1;

Object.defineProperty(exports, 'numberDecimals', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_numberDecimals).default;
  }
});

var _stringReplaceAll = stringReplaceAll$1;

Object.defineProperty(exports, 'stringReplaceAll', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_stringReplaceAll).default;
  }
});

var _stringTrim = stringTrim$1;

Object.defineProperty(exports, 'stringTrim', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_stringTrim).default;
  }
});

var _camelCaseToUnderscores = camelCaseToUnderscores;

Object.defineProperty(exports, 'camelCaseToUnderscores', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_camelCaseToUnderscores).default;
  }
});

var _arrayPluck = arrayPluck$1;

Object.defineProperty(exports, 'arrayPluck', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_arrayPluck).default;
  }
});

var _arrayContains = arrayContains$1;

Object.defineProperty(exports, 'arrayContains', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_arrayContains).default;
  }
});

var _arrayUnique = arrayUnique$1;

Object.defineProperty(exports, 'arrayUnique', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_arrayUnique).default;
  }
});

var _arrayFrom = arrayFrom$1;

Object.defineProperty(exports, 'arrayFrom', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_arrayFrom).default;
  }
});

var _arrayTo = arrayTo$1;

Object.defineProperty(exports, 'arrayTo', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_arrayTo).default;
  }
});

var _arrayClean = arrayClean$1;

Object.defineProperty(exports, 'arrayClean', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_arrayClean).default;
  }
});

var _arraySort = arraySort$1;

Object.defineProperty(exports, 'arraySort', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_arraySort).default;
  }
});

var _arrayReplace = arrayReplace$1;

Object.defineProperty(exports, 'arrayReplace', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_arrayReplace).default;
  }
});

var _arrayRepeat = arrayRepeat$1;

Object.defineProperty(exports, 'arrayRepeat', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_arrayRepeat).default;
  }
});

var _arrayInsert = arrayInsert$1;

Object.defineProperty(exports, 'arrayInsert', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_arrayInsert).default;
  }
});

var _arrayDifference = arrayDifference$1;

Object.defineProperty(exports, 'arrayDifference', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_arrayDifference).default;
  }
});

var _arrayMin = arrayMin$1;

Object.defineProperty(exports, 'arrayMin', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_arrayMin).default;
  }
});

var _arrayMax = arrayMax$1;

Object.defineProperty(exports, 'arrayMax', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_arrayMax).default;
  }
});

var _isArrayOfStrings = isArrayOfStrings;

Object.defineProperty(exports, 'isArrayOfStrings', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_isArrayOfStrings).default;
  }
});

var _objectClean = objectClean;

Object.defineProperty(exports, 'objectClean', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_objectClean).default;
  }
});

var _isIE = isIE$1;

Object.defineProperty(exports, 'isIE', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_isIE).default;
  }
});

var _clone = clone$1;

Object.defineProperty(exports, 'clone', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_clone).default;
  }
});

var _uuid = uuid$1;

Object.defineProperty(exports, 'uuid', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_uuid).default;
  }
});

var _isIterable = isIterable;

Object.defineProperty(exports, 'isIterable', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_isIterable).default;
  }
});

_interopRequireDefault(_isEmpty);

_interopRequireDefault(_isArray);

_interopRequireDefault(_isObject);

_interopRequireDefault(_isString);

_interopRequireDefault(_isNumber);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

}(lib));

var inlineHelpMapping = {
	"/edit/categorySection/categoryOptionGroupSet": "/en/user/html/manage_category.html#create_category_option_group_set",
	"/edit/categorySection/categoryOptionGroup": "/en/user/html/manage_category.html#create_category_option_group",
	"/edit/categorySection/categoryOptionCombo": "/en/user/html/manage_category.html#assign_code_category_option_combo",
	"/edit/categorySection/categoryOption": "/en/user/html/manage_category.html#create_category_option",
	"/edit/categorySection/categoryCombo": "/en/user/html/manage_category.html#create_category_combination",
	"/edit/categorySection/category": "/en/user/html/manage_category.html#create_category",
	"/list/categorySection": "/en/user/html/manage_category.html",
	"/edit/dataElementSection/dataElementGroupSet": "/en/user/html/manage_data_element.html#create_data_element_group_set",
	"/edit/dataElementSection/dataElementGroup": "/en/user/html/manage_data_element.html#create_data_element_group",
	"/edit/dataElementSection/dataElement": "/en/user/html/manage_data_element.html#create_data_element",
	"/list/dataElementSection": "/en/user/html/manage_data_element.html",
	"/edit/dataSetSection/dataSet/${objectId}/sections": "/en/user/html/manage_data_set.html#manage_section_form",
	"/edit/dataSetSection/dataSet": "/en/user/html/manage_data_set.html#create_data_set",
	"/list/dataSetSection/dataSet": "/en/user/html/manage_data_set.html",
	"/edit/indicatorSection/programIndicatorGroup": "/en/user/html/configure_program_indicator.html#create_program_indicator_group",
	"/list/indicatorSection/programIndicatorGroup": "/en/user/html/configure_program_indicator.html",
	"/edit/indicatorSection/programIndicator": "/en/user/html/configure_program_indicator.html#create_program_indicator",
	"/list/indicatorSection/programIndicator": "/en/user/html/configure_program_indicator.html",
	"/edit/indicatorSection/indicatorGroupSet": "/en/user/html/manage_indicator.html#create_indicator_group_set",
	"/edit/indicatorSection/indicatorGroup": "/en/user/html/manage_indicator.html#create_indicator_group",
	"/edit/indicatorSection/indicatorType": "/en/user/html/manage_indicator.html#create_indicator_type",
	"/edit/indicatorSection/indicator": "/en/user/html/manage_indicator.html#create_indicator",
	"/list/indicatorSection": "/en/user/html/manage_indicator.html",
	"/edit/organisationUnitSection/organisationUnitGroupSet": "/en/user/html/manage_organisation_unit.html#create_organisation_unit_group_set",
	"/edit/organisationUnitSection/organisationUnitGroup": "/en/user/html/manage_organisation_unit.html#create_organisation_unit_group",
	"/edit/organisationUnitSection/organisationUnitLevel": "/en/user/html/manage_organisation_unit.html#name_organisation_unit_level",
	"/edit/organisationUnitSection/organisationUnit": "/en/user/html/manage_organisation_unit.html#create_organisation_unit",
	"/list/organisationUnitSection": "/en/user/html/manage_organisation_unit.html",
	"/edit/programSection/trackedEntityAttribute": "/en/user/html/configure_tracked_entity.html#create_tracked_entity_attribute",
	"/edit/programSection/programRuleVariable": "/en/user/html/configure_program_rule.html#create_program_rule_variable",
	"/edit/programSection/relationshipType": "/en/user/html/configure_relationship_type.html#create_relationship_type",
	"/edit/programSection/trackedEntity": "/en/user/html/configure_tracked_entity.html#about_tracked_entity",
	"/edit/programSection/programRule": "/en/user/html/configure_program_rule.html#create_program_rule",
	"/edit/programSection/program": "/en/user/html/configure_event_program_in_maintenance_app.html#create_event_program",
	"/list/programSection": "/en/user/html/configure_programs_in_maintenance_app.html",
	"/edit/validationSection/validationNotificationTemplate": "/en/user/html/manage_validation_rule.html#create_validation_notification",
	"/edit/validationSection/validationRuleGroup": "/en/user/html/manage_validation_rule.html#create_validation_rule_group",
	"/edit/validationSection/validationRule": "/en/user/html/manage_validation_rule.html#create_validation_rule",
	"/list/validationSection": "/en/user/html/manage_validation_rule.html",
	"/edit/otherSection/legendSet": "/en/user/html/manage_legend.html#create_legend",
	"/list/otherSection/legendSet": "/en/user/html/manage_legend.html",
	"/edit/otherSection/pushAnalysis": "/en/user/html/manage_push_report.html#create_push_report",
	"/list/otherSection/pushAnalysis": "/en/user/html/manage_push_report.html",
	"/edit/otherSection/externalMapLayer": "/en/user/html/manage_external_maplayer.html#create_external_map_layer",
	"/list/otherSection/externalMapLayer": "/en/user/html/manage_external_maplayer.html",
	"/edit/otherSection/predictorGroup": "/en/user/html/manage_predictor.html#create_predictor_group",
	"/list/otherSection/predictorGroup": "/en/user/html/manage_predictor.html",
	"/edit/otherSection/optionGroupSet": "/en/user/html/manage_option_set.html#create_option_group_set",
	"/list/otherSection/optionGroupSet": "/en/user/html/manage_option_set.html#create_option_group_set",
	"/edit/otherSection/optionGroup": "/en/user/html/manage_option_set.html#create_option_group",
	"/list/otherSection/optionGroup": "/en/user/html/manage_option_set.html#create_option_group",
	"/edit/otherSection/${objectType}": "/en/user/html/manage_${objectType}.html#create_${objectType}",
	"/list/otherSection/${objectType}": "/en/user/html/manage_${objectType}.html"
};

function mappingPathExists(mappingKey) {
  return mappingKey && inlineHelpMapping[mappingKey];
}
/**
 * Returns the "version" of the documentation that corresponds with the current dhis2 version.
 *
 * @param {Object} version - The version definition as provided by d2.system.version.
 * @param {number} version.minor - The minor dhis2 version. e.g. The 25 in 2.25.
 * @param {boolean} version.snapshot - True when the current version is the snapshot(master/development) branch.
 *
 * @returns {string} `master` for a snapshot branch. `25` for 2.25 etc.
 */


function getDocsVersion(_ref) {
  var major = _ref.major,
      minor = _ref.minor,
      snapshot = _ref.snapshot;

  if (snapshot) {
    return 'master';
  }

  return "".concat(major, ".").concat(minor);
}
/** 
 * If ${placeholder} is found in mappingKey, it will be replaced with a matching name if 
 * present from variablesToReplace.  
 * 
 * Eg. for the mappingKey "/edit/otherSection/${objectType}" the placeholder objectType
 * will be found. If an entry in variablesToReplace exists objectType will be replaced 
 * with the value to this entry, say constant. This will result in the new path  "/edit/otherSection/constant".
 * If no match is found, the path will return.
 * 
 * @param {string} mappingKey The mapping that may have a placeholder to replace
 * @param {Map} variablesToReplace The variables that are to be replaced with the placeholder 
 *
 * @returns {string} The matched path with replaced placeholders if found
 */


function replacePlaceholder(mappingKey, variablesToReplace) {
  var placeholderRegex = /\$\{(.+?)\}/g;
  return mappingKey.replace(placeholderRegex, function (match, variable) {
    if (variablesToReplace.has(variable)) {
      return variablesToReplace.get(variable);
    }

    return '.+?';
  });
}
/** 
 * Checks if the mappingKeyPath with replaced placeholders matches the path were currently on.
 * 
 * @param {string} path The path to be matched with a mappingKey 
 * @param {Map} variablesToReplace The variables that are to be replaced with a placeholder 
 *
 * @returns {string} The matched mappingKey with replaced placeholders if found
 */


function replaceMappingPathPlaceholder(path, variablesToReplace) {
  return Object.keys(inlineHelpMapping).find(function (mappingKey) {
    var pathToMatch = replacePlaceholder(mappingKey, variablesToReplace);
    return new RegExp(pathToMatch).test(path);
  });
} // Replaces the placeholders of the matched mappingKey url to create the complete partial help content path.


function getPartialHelpContentPath(replacedMappingPath, variablesToReplaceCamel) {
  if (mappingPathExists(replacedMappingPath)) {
    return replacePlaceholder(inlineHelpMapping[replacedMappingPath], variablesToReplaceCamel);
  }

  return '';
}
/**
 * Attempts to find a help link as defined in the inlinehelp-mapping.js It will always pick the first match that it finds. Help links should therefore be
 * sorted with the longer links first.
 * The search is done using a regular expression that matches the path from the start. This means that paths that are longer/dynamic can still show help links.
 *
 * For example a help link key that is defined as  `/edit/dataElementSection/dataElement` would show up on both `/edit/dataElementSection/dataElement/add` and `/edit/dataElementSection/dataElement/wap68IYzTXr`.
 *
 * @param {string} path The current path/route that the browser is on. This is the path that the help link should be used for.
 * @param {string} schema The name of the schema to find help for.
 *
 * @returns {string} The partial path that the refers to the help content in the documentation.  e.g. `/en/user/html/manage_org_unit.html`
 */


function findHelpLinkForPath(path, schema) {
  var variablesToReplace = new Map([['objectType', schema]]);
  var variablesToReplaceCamel = new Map([['objectType', lib.camelCaseToUnderscores(schema)]]);
  var replacedMappingPath = replaceMappingPathPlaceholder(path, variablesToReplace);
  return getPartialHelpContentPath(replacedMappingPath, variablesToReplaceCamel);
}

function HelpLink(_ref2, _ref3) {
  var schema = _ref2.schema;
  var d2 = _ref3.d2;
  var path = window.location.hash.replace(/^#/, '') // Remove leading hash
  .replace(/\?.+?$/, ''); // Remove query param/cache breaker

  var docsLink = "https://docs.dhis2.org/".concat(getDocsVersion(d2.system.version));
  var helpLink = findHelpLinkForPath(path, schema);

  if (helpLink) {
    return /*#__PURE__*/react.createElement(_default, {
      href: "".concat(docsLink).concat(helpLink),
      target: "_blank",
      rel: "noopener noreferrer",
      tooltip: d2.i18n.getTranslation('open_user_guide'),
      tooltipPosition: "bottom-center",
      iconClassName: "material-icons",
      iconStyle: {
        top: -2
      }
    }, "help_outline");
  }

  return null;
}
HelpLink.propTypes = {
  schema: PropTypes.string.isRequired
};
HelpLink.contextTypes = {
  d2: PropTypes.object
};

export { HelpLink as H, lib as l };
