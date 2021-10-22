import { bg as commonjsGlobal, cw as require$$1, y as invariant_1, r as react, G as propTypes, z as hoistNonReactStatics_cjs, ae as Store, k as _inherits$4, l as _createSuper, m as _classCallCheck$i, n as _createClass$i, O as Observable, j as _slicedToArray, a4 as _objectSpread2, P as PropTypes, w as withStateFrom, aQ as reactDom, A as _defineProperty$3, cq as _toConsumableArray, B as _assertThisInitialized, c7 as modelToEditStore, ad as snackActions, ah as _default$1, H as Heading, ag as _default$2, a6 as _default$3, a0 as addD2Context, f as _asyncToGenerator, i as getInstance, bV as Action, p as log, al as fp, c5 as _default$4, c4 as FormBuilder, cx as createValidatorFromValidatorFunction, cp as typeToFieldMap, q as _objectWithoutProperties, cy as getFieldUIComponent, aI as Pagination, aJ as DataTable, F as _default$6, cz as _default$7, cA as _default$8, s as _extends$6, h as goToRoute } from './index-44839b1a.js';
import { l as lib$3 } from './HelpLink.component-39e74935.js';
import { g as getFirstInvalidFieldMessage, E as EditModelForm } from './EditModelForm.component-dffeaf33.js';
import { _ as _default$5 } from './warning-61e60ff8.js';
import { T as TranslationDialog } from './TranslationDialog.component-38658f53.js';
import { S as SharingDialog, c as calculatePageValue } from './pagination-df227617.js';
import require$$0 from 'domain';
import { F as FormButtons } from './FormButtons.component-b34f3009.js';
import { S as SaveButton } from './SaveButton.component-265ebd88.js';
import { C as CancelButton, c as createFieldConfigForModelTypes } from './stepper-8c66bd06.js';
import { F as FormHeading } from './FormHeading-92e31a13.js';
import './Auth-bde7a9a8.js';

var lib$2 = {};

var HTML5Backend$1 = {};

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */

function identity$5(value) {
  return value;
}

var identity_1$1 = identity$5;

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */

function apply$3(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

var _apply$1 = apply$3;

var apply$2 = _apply$1;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax$1 = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest$3(func, start, transform) {
  start = nativeMax$1(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax$1(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply$2(func, this, otherArgs);
  };
}

var _overRest$1 = overRest$3;

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */

function constant$3(value) {
  return function() {
    return value;
  };
}

var constant_1$1 = constant$3;

/** Detect free variable `global` from Node.js. */

var freeGlobal$7 = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal$3 = freeGlobal$7;

var freeGlobal$6 = _freeGlobal$3;

/** Detect free variable `self`. */
var freeSelf$3 = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root$d = freeGlobal$6 || freeSelf$3 || Function('return this')();

var _root$3 = root$d;

var root$c = _root$3;

/** Built-in value references. */
var Symbol$e = root$c.Symbol;

var _Symbol$3 = Symbol$e;

var Symbol$d = _Symbol$3;

/** Used for built-in method references. */
var objectProto$l = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$g = objectProto$l.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$7 = objectProto$l.toString;

/** Built-in value references. */
var symToStringTag$7 = Symbol$d ? Symbol$d.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag$7(value) {
  var isOwn = hasOwnProperty$g.call(value, symToStringTag$7),
      tag = value[symToStringTag$7];

  try {
    value[symToStringTag$7] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString$7.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$7] = tag;
    } else {
      delete value[symToStringTag$7];
    }
  }
  return result;
}

var _getRawTag$3 = getRawTag$7;

/** Used for built-in method references. */

var objectProto$k = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$6 = objectProto$k.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString$7(value) {
  return nativeObjectToString$6.call(value);
}

var _objectToString$3 = objectToString$7;

var Symbol$c = _Symbol$3,
    getRawTag$6 = _getRawTag$3,
    objectToString$6 = _objectToString$3;

/** `Object#toString` result references. */
var nullTag$3 = '[object Null]',
    undefinedTag$3 = '[object Undefined]';

/** Built-in value references. */
var symToStringTag$6 = Symbol$c ? Symbol$c.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag$a(value) {
  if (value == null) {
    return value === undefined ? undefinedTag$3 : nullTag$3;
  }
  return (symToStringTag$6 && symToStringTag$6 in Object(value))
    ? getRawTag$6(value)
    : objectToString$6(value);
}

var _baseGetTag$3 = baseGetTag$a;

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

function isObject$7(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var isObject_1$1 = isObject$7;

var baseGetTag$9 = _baseGetTag$3,
    isObject$6 = isObject_1$1;

/** `Object#toString` result references. */
var asyncTag$1 = '[object AsyncFunction]',
    funcTag$2 = '[object Function]',
    genTag$1 = '[object GeneratorFunction]',
    proxyTag$1 = '[object Proxy]';

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
function isFunction$5(value) {
  if (!isObject$6(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag$9(value);
  return tag == funcTag$2 || tag == genTag$1 || tag == asyncTag$1 || tag == proxyTag$1;
}

var isFunction_1$1 = isFunction$5;

var root$b = _root$3;

/** Used to detect overreaching core-js shims. */
var coreJsData$3 = root$b['__core-js_shared__'];

var _coreJsData$1 = coreJsData$3;

var coreJsData$2 = _coreJsData$1;

/** Used to detect methods masquerading as native. */
var maskSrcKey$1 = (function() {
  var uid = /[^.]+$/.exec(coreJsData$2 && coreJsData$2.keys && coreJsData$2.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked$3(func) {
  return !!maskSrcKey$1 && (maskSrcKey$1 in func);
}

var _isMasked$1 = isMasked$3;

/** Used for built-in method references. */

var funcProto$5 = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$5 = funcProto$5.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource$3(func) {
  if (func != null) {
    try {
      return funcToString$5.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

var _toSource$1 = toSource$3;

var isFunction$4 = isFunction_1$1,
    isMasked$2 = _isMasked$1,
    isObject$5 = isObject_1$1,
    toSource$2 = _toSource$1;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar$1 = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor$1 = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto$4 = Function.prototype,
    objectProto$j = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$4 = funcProto$4.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$f = objectProto$j.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative$1 = RegExp('^' +
  funcToString$4.call(hasOwnProperty$f).replace(reRegExpChar$1, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative$3(value) {
  if (!isObject$5(value) || isMasked$2(value)) {
    return false;
  }
  var pattern = isFunction$4(value) ? reIsNative$1 : reIsHostCtor$1;
  return pattern.test(toSource$2(value));
}

var _baseIsNative$1 = baseIsNative$3;

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */

function getValue$3(object, key) {
  return object == null ? undefined : object[key];
}

var _getValue$1 = getValue$3;

var baseIsNative$2 = _baseIsNative$1,
    getValue$2 = _getValue$1;

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative$9(object, key) {
  var value = getValue$2(object, key);
  return baseIsNative$2(value) ? value : undefined;
}

var _getNative$1 = getNative$9;

var getNative$8 = _getNative$1;

var defineProperty$3 = (function() {
  try {
    var func = getNative$8(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

var _defineProperty$2 = defineProperty$3;

var constant$2 = constant_1$1,
    defineProperty$2 = _defineProperty$2,
    identity$4 = identity_1$1;

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString$3 = !defineProperty$2 ? identity$4 : function(func, string) {
  return defineProperty$2(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant$2(string),
    'writable': true
  });
};

var _baseSetToString$1 = baseSetToString$3;

/** Used to detect hot functions by number of calls within a span of milliseconds. */

var HOT_COUNT$1 = 800,
    HOT_SPAN$1 = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow$1 = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut$3(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow$1(),
        remaining = HOT_SPAN$1 - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT$1) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

var _shortOut$1 = shortOut$3;

var baseSetToString$2 = _baseSetToString$1,
    shortOut$2 = _shortOut$1;

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString$3 = shortOut$2(baseSetToString$2);

var _setToString$1 = setToString$3;

var identity$3 = identity_1$1,
    overRest$2 = _overRest$1,
    setToString$2 = _setToString$1;

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest$7(func, start) {
  return setToString$2(overRest$2(func, start, identity$3), func + '');
}

var _baseRest$1 = baseRest$7;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */

function eq$5(value, other) {
  return value === other || (value !== value && other !== other);
}

var eq_1$1 = eq$5;

/** Used as references for various `Number` constants. */

var MAX_SAFE_INTEGER$2 = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength$4(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$2;
}

var isLength_1$1 = isLength$4;

var isFunction$3 = isFunction_1$1,
    isLength$3 = isLength_1$1;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike$5(value) {
  return value != null && isLength$3(value.length) && !isFunction$3(value);
}

var isArrayLike_1$1 = isArrayLike$5;

/** Used as references for various `Number` constants. */

var MAX_SAFE_INTEGER$1 = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex$2(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER$1 : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

var _isIndex = isIndex$2;

var eq$4 = eq_1$1,
    isArrayLike$4 = isArrayLike_1$1,
    isIndex$1 = _isIndex,
    isObject$4 = isObject_1$1;

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall$1(value, index, object) {
  if (!isObject$4(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike$4(object) && isIndex$1(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq$4(object[index], value);
  }
  return false;
}

var _isIterateeCall = isIterateeCall$1;

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */

function baseTimes$1(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

var _baseTimes = baseTimes$1;

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

function isObjectLike$c(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1$3 = isObjectLike$c;

var baseGetTag$8 = _baseGetTag$3,
    isObjectLike$b = isObjectLike_1$3;

/** `Object#toString` result references. */
var argsTag$2 = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments$3(value) {
  return isObjectLike$b(value) && baseGetTag$8(value) == argsTag$2;
}

var _baseIsArguments$1 = baseIsArguments$3;

var baseIsArguments$2 = _baseIsArguments$1,
    isObjectLike$a = isObjectLike_1$3;

/** Used for built-in method references. */
var objectProto$i = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$e = objectProto$i.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable$1 = objectProto$i.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments$4 = baseIsArguments$2(function() { return arguments; }()) ? baseIsArguments$2 : function(value) {
  return isObjectLike$a(value) && hasOwnProperty$e.call(value, 'callee') &&
    !propertyIsEnumerable$1.call(value, 'callee');
};

var isArguments_1$1 = isArguments$4;

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */

var isArray$5 = Array.isArray;

var isArray_1$2 = isArray$5;

var isBuffer$1 = {exports: {}};

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */

function stubFalse() {
  return false;
}

var stubFalse_1 = stubFalse;

(function (module, exports) {
var root = _root$3,
    stubFalse = stubFalse_1;

/** Detect free variable `exports`. */
var freeExports = exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;
}(isBuffer$1, isBuffer$1.exports));

var baseGetTag$7 = _baseGetTag$3,
    isLength$2 = isLength_1$1,
    isObjectLike$9 = isObjectLike_1$3;

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag$1 = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag$2 = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag$1] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag$2] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray$1(value) {
  return isObjectLike$9(value) &&
    isLength$2(value.length) && !!typedArrayTags[baseGetTag$7(value)];
}

var _baseIsTypedArray = baseIsTypedArray$1;

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */

function baseUnary$5(func) {
  return function(value) {
    return func(value);
  };
}

var _baseUnary$1 = baseUnary$5;

var _nodeUtil = {exports: {}};

(function (module, exports) {
var freeGlobal = _freeGlobal$3;

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
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;
}(_nodeUtil, _nodeUtil.exports));

var baseIsTypedArray = _baseIsTypedArray,
    baseUnary$4 = _baseUnary$1,
    nodeUtil = _nodeUtil.exports;

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray$1 = nodeIsTypedArray ? baseUnary$4(nodeIsTypedArray) : baseIsTypedArray;

var isTypedArray_1 = isTypedArray$1;

var baseTimes = _baseTimes,
    isArguments$3 = isArguments_1$1,
    isArray$4 = isArray_1$2,
    isBuffer = isBuffer$1.exports,
    isIndex = _isIndex,
    isTypedArray = isTypedArray_1;

/** Used for built-in method references. */
var objectProto$h = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$d = objectProto$h.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys$1(value, inherited) {
  var isArr = isArray$4(value),
      isArg = !isArr && isArguments$3(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$d.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

var _arrayLikeKeys = arrayLikeKeys$1;

/** Used for built-in method references. */

var objectProto$g = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype$1(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$g;

  return value === proto;
}

var _isPrototype = isPrototype$1;

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */

function nativeKeysIn$1(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

var _nativeKeysIn = nativeKeysIn$1;

var isObject$3 = isObject_1$1,
    isPrototype = _isPrototype,
    nativeKeysIn = _nativeKeysIn;

/** Used for built-in method references. */
var objectProto$f = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$c = objectProto$f.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn$1(object) {
  if (!isObject$3(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty$c.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

var _baseKeysIn = baseKeysIn$1;

var arrayLikeKeys = _arrayLikeKeys,
    baseKeysIn = _baseKeysIn,
    isArrayLike$3 = isArrayLike_1$1;

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn$1(object) {
  return isArrayLike$3(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

var keysIn_1 = keysIn$1;

var baseRest$6 = _baseRest$1,
    eq$3 = eq_1$1,
    isIterateeCall = _isIterateeCall,
    keysIn = keysIn_1;

/** Used for built-in method references. */
var objectProto$e = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$b = objectProto$e.hasOwnProperty;

/**
 * Assigns own and inherited enumerable string keyed properties of source
 * objects to the destination object for all destination properties that
 * resolve to `undefined`. Source objects are applied from left to right.
 * Once a property is set, additional values of the same property are ignored.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.defaultsDeep
 * @example
 *
 * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */
var defaults = baseRest$6(function(object, sources) {
  object = Object(object);

  var index = -1;
  var length = sources.length;
  var guard = length > 2 ? sources[2] : undefined;

  if (guard && isIterateeCall(sources[0], sources[1], guard)) {
    length = 1;
  }

  while (++index < length) {
    var source = sources[index];
    var props = keysIn(source);
    var propsIndex = -1;
    var propsLength = props.length;

    while (++propsIndex < propsLength) {
      var key = props[propsIndex];
      var value = object[key];

      if (value === undefined ||
          (eq$3(value, objectProto$e[key]) && !hasOwnProperty$b.call(object, key))) {
        object[key] = source[key];
      }
    }
  }

  return object;
});

var defaults_1 = defaults;

var shallowEqual$3 = {};

Object.defineProperty(shallowEqual$3, "__esModule", {
	value: true
});
shallowEqual$3.default = shallowEqual$2;
function shallowEqual$2(objA, objB) {
	if (objA === objB) {
		return true;
	}

	var keysA = Object.keys(objA);
	var keysB = Object.keys(objB);

	if (keysA.length !== keysB.length) {
		return false;
	}

	// Test for A's keys different from B.
	var hasOwn = Object.prototype.hasOwnProperty;
	for (var i = 0; i < keysA.length; i += 1) {
		if (!hasOwn.call(objB, keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
			return false;
		}

		var valA = objA[keysA[i]];
		var valB = objB[keysA[i]];

		if (valA !== valB) {
			return false;
		}
	}

	return true;
}

var EnterLeaveCounter$1 = {};

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */

function arrayPush$3(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

var _arrayPush$1 = arrayPush$3;

var Symbol$b = _Symbol$3,
    isArguments$2 = isArguments_1$1,
    isArray$3 = isArray_1$2;

/** Built-in value references. */
var spreadableSymbol$1 = Symbol$b ? Symbol$b.isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable$3(value) {
  return isArray$3(value) || isArguments$2(value) ||
    !!(spreadableSymbol$1 && value && value[spreadableSymbol$1]);
}

var _isFlattenable$1 = isFlattenable$3;

var arrayPush$2 = _arrayPush$1,
    isFlattenable$2 = _isFlattenable$1;

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten$3(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable$2);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten$3(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush$2(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

var _baseFlatten$1 = baseFlatten$3;

var getNative$7 = _getNative$1;

/* Built-in method references that are verified to be native. */
var nativeCreate$9 = getNative$7(Object, 'create');

var _nativeCreate$1 = nativeCreate$9;

var nativeCreate$8 = _nativeCreate$1;

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear$3() {
  this.__data__ = nativeCreate$8 ? nativeCreate$8(null) : {};
  this.size = 0;
}

var _hashClear$1 = hashClear$3;

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */

function hashDelete$3(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

var _hashDelete$1 = hashDelete$3;

var nativeCreate$7 = _nativeCreate$1;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$5 = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto$d = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$a = objectProto$d.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet$3(key) {
  var data = this.__data__;
  if (nativeCreate$7) {
    var result = data[key];
    return result === HASH_UNDEFINED$5 ? undefined : result;
  }
  return hasOwnProperty$a.call(data, key) ? data[key] : undefined;
}

var _hashGet$1 = hashGet$3;

var nativeCreate$6 = _nativeCreate$1;

/** Used for built-in method references. */
var objectProto$c = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$9 = objectProto$c.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas$3(key) {
  var data = this.__data__;
  return nativeCreate$6 ? (data[key] !== undefined) : hasOwnProperty$9.call(data, key);
}

var _hashHas$1 = hashHas$3;

var nativeCreate$5 = _nativeCreate$1;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$4 = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet$3(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate$5 && value === undefined) ? HASH_UNDEFINED$4 : value;
  return this;
}

var _hashSet$1 = hashSet$3;

var hashClear$2 = _hashClear$1,
    hashDelete$2 = _hashDelete$1,
    hashGet$2 = _hashGet$1,
    hashHas$2 = _hashHas$1,
    hashSet$2 = _hashSet$1;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash$3(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash$3.prototype.clear = hashClear$2;
Hash$3.prototype['delete'] = hashDelete$2;
Hash$3.prototype.get = hashGet$2;
Hash$3.prototype.has = hashHas$2;
Hash$3.prototype.set = hashSet$2;

var _Hash$1 = Hash$3;

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */

function listCacheClear$3() {
  this.__data__ = [];
  this.size = 0;
}

var _listCacheClear$1 = listCacheClear$3;

var eq$2 = eq_1$1;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf$9(array, key) {
  var length = array.length;
  while (length--) {
    if (eq$2(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

var _assocIndexOf$1 = assocIndexOf$9;

var assocIndexOf$8 = _assocIndexOf$1;

/** Used for built-in method references. */
var arrayProto$1 = Array.prototype;

/** Built-in value references. */
var splice$1 = arrayProto$1.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete$3(key) {
  var data = this.__data__,
      index = assocIndexOf$8(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice$1.call(data, index, 1);
  }
  --this.size;
  return true;
}

var _listCacheDelete$1 = listCacheDelete$3;

var assocIndexOf$7 = _assocIndexOf$1;

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet$3(key) {
  var data = this.__data__,
      index = assocIndexOf$7(data, key);

  return index < 0 ? undefined : data[index][1];
}

var _listCacheGet$1 = listCacheGet$3;

var assocIndexOf$6 = _assocIndexOf$1;

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas$3(key) {
  return assocIndexOf$6(this.__data__, key) > -1;
}

var _listCacheHas$1 = listCacheHas$3;

var assocIndexOf$5 = _assocIndexOf$1;

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet$3(key, value) {
  var data = this.__data__,
      index = assocIndexOf$5(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

var _listCacheSet$1 = listCacheSet$3;

var listCacheClear$2 = _listCacheClear$1,
    listCacheDelete$2 = _listCacheDelete$1,
    listCacheGet$2 = _listCacheGet$1,
    listCacheHas$2 = _listCacheHas$1,
    listCacheSet$2 = _listCacheSet$1;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache$3(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache$3.prototype.clear = listCacheClear$2;
ListCache$3.prototype['delete'] = listCacheDelete$2;
ListCache$3.prototype.get = listCacheGet$2;
ListCache$3.prototype.has = listCacheHas$2;
ListCache$3.prototype.set = listCacheSet$2;

var _ListCache$1 = ListCache$3;

var getNative$6 = _getNative$1,
    root$a = _root$3;

/* Built-in method references that are verified to be native. */
var Map$3 = getNative$6(root$a, 'Map');

var _Map$1 = Map$3;

var Hash$2 = _Hash$1,
    ListCache$2 = _ListCache$1,
    Map$2 = _Map$1;

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear$3() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash$2,
    'map': new (Map$2 || ListCache$2),
    'string': new Hash$2
  };
}

var _mapCacheClear$1 = mapCacheClear$3;

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */

function isKeyable$3(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

var _isKeyable$1 = isKeyable$3;

var isKeyable$2 = _isKeyable$1;

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData$9(map, key) {
  var data = map.__data__;
  return isKeyable$2(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

var _getMapData$1 = getMapData$9;

var getMapData$8 = _getMapData$1;

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete$3(key) {
  var result = getMapData$8(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

var _mapCacheDelete$1 = mapCacheDelete$3;

var getMapData$7 = _getMapData$1;

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet$3(key) {
  return getMapData$7(this, key).get(key);
}

var _mapCacheGet$1 = mapCacheGet$3;

var getMapData$6 = _getMapData$1;

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas$3(key) {
  return getMapData$6(this, key).has(key);
}

var _mapCacheHas$1 = mapCacheHas$3;

var getMapData$5 = _getMapData$1;

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet$3(key, value) {
  var data = getMapData$5(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

var _mapCacheSet$1 = mapCacheSet$3;

var mapCacheClear$2 = _mapCacheClear$1,
    mapCacheDelete$2 = _mapCacheDelete$1,
    mapCacheGet$2 = _mapCacheGet$1,
    mapCacheHas$2 = _mapCacheHas$1,
    mapCacheSet$2 = _mapCacheSet$1;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache$4(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache$4.prototype.clear = mapCacheClear$2;
MapCache$4.prototype['delete'] = mapCacheDelete$2;
MapCache$4.prototype.get = mapCacheGet$2;
MapCache$4.prototype.has = mapCacheHas$2;
MapCache$4.prototype.set = mapCacheSet$2;

var _MapCache$1 = MapCache$4;

/** Used to stand-in for `undefined` hash values. */

var HASH_UNDEFINED$3 = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd$3(value) {
  this.__data__.set(value, HASH_UNDEFINED$3);
  return this;
}

var _setCacheAdd$1 = setCacheAdd$3;

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */

function setCacheHas$3(value) {
  return this.__data__.has(value);
}

var _setCacheHas$1 = setCacheHas$3;

var MapCache$3 = _MapCache$1,
    setCacheAdd$2 = _setCacheAdd$1,
    setCacheHas$2 = _setCacheHas$1;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache$6(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache$3;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache$6.prototype.add = SetCache$6.prototype.push = setCacheAdd$2;
SetCache$6.prototype.has = setCacheHas$2;

var _SetCache$1 = SetCache$6;

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */

function baseFindIndex$3(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

var _baseFindIndex$1 = baseFindIndex$3;

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */

function baseIsNaN$3(value) {
  return value !== value;
}

var _baseIsNaN$1 = baseIsNaN$3;

/**
 * A specialized version of `_.indexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */

function strictIndexOf$3(array, value, fromIndex) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

var _strictIndexOf$1 = strictIndexOf$3;

var baseFindIndex$2 = _baseFindIndex$1,
    baseIsNaN$2 = _baseIsNaN$1,
    strictIndexOf$2 = _strictIndexOf$1;

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf$3(array, value, fromIndex) {
  return value === value
    ? strictIndexOf$2(array, value, fromIndex)
    : baseFindIndex$2(array, baseIsNaN$2, fromIndex);
}

var _baseIndexOf$1 = baseIndexOf$3;

var baseIndexOf$2 = _baseIndexOf$1;

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes$6(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && baseIndexOf$2(array, value, 0) > -1;
}

var _arrayIncludes$1 = arrayIncludes$6;

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */

function arrayIncludesWith$6(array, value, comparator) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

var _arrayIncludesWith$1 = arrayIncludesWith$6;

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */

function cacheHas$6(cache, key) {
  return cache.has(key);
}

var _cacheHas$1 = cacheHas$6;

var getNative$5 = _getNative$1,
    root$9 = _root$3;

/* Built-in method references that are verified to be native. */
var Set$4 = getNative$5(root$9, 'Set');

var _Set$1 = Set$4;

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */

function noop$3() {
  // No operation performed.
}

var noop_1$1 = noop$3;

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */

function setToArray$5(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

var _setToArray$1 = setToArray$5;

var Set$3 = _Set$1,
    noop$2 = noop_1$1,
    setToArray$4 = _setToArray$1;

/** Used as references for various `Number` constants. */
var INFINITY$1 = 1 / 0;

/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet$3 = !(Set$3 && (1 / setToArray$4(new Set$3([,-0]))[1]) == INFINITY$1) ? noop$2 : function(values) {
  return new Set$3(values);
};

var _createSet$1 = createSet$3;

var SetCache$5 = _SetCache$1,
    arrayIncludes$5 = _arrayIncludes$1,
    arrayIncludesWith$5 = _arrayIncludesWith$1,
    cacheHas$5 = _cacheHas$1,
    createSet$2 = _createSet$1,
    setToArray$3 = _setToArray$1;

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE$3 = 200;

/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq$3(array, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes$5,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith$5;
  }
  else if (length >= LARGE_ARRAY_SIZE$3) {
    var set = iteratee ? null : createSet$2(array);
    if (set) {
      return setToArray$3(set);
    }
    isCommon = false;
    includes = cacheHas$5;
    seen = new SetCache$5;
  }
  else {
    seen = iteratee ? [] : result;
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    }
    else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

var _baseUniq$1 = baseUniq$3;

var isArrayLike$2 = isArrayLike_1$1,
    isObjectLike$8 = isObjectLike_1$3;

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject$6(value) {
  return isObjectLike$8(value) && isArrayLike$2(value);
}

var isArrayLikeObject_1$1 = isArrayLikeObject$6;

var baseFlatten$2 = _baseFlatten$1,
    baseRest$5 = _baseRest$1,
    baseUniq$2 = _baseUniq$1,
    isArrayLikeObject$5 = isArrayLikeObject_1$1;

/**
 * Creates an array of unique values, in order, from all given arrays using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of combined values.
 * @example
 *
 * _.union([2], [1, 2]);
 * // => [2, 1]
 */
var union = baseRest$5(function(arrays) {
  return baseUniq$2(baseFlatten$2(arrays, 1, isArrayLikeObject$5, true));
});

var union_1 = union;

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */

function arrayMap$5(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

var _arrayMap$1 = arrayMap$5;

var SetCache$4 = _SetCache$1,
    arrayIncludes$4 = _arrayIncludes$1,
    arrayIncludesWith$4 = _arrayIncludesWith$1,
    arrayMap$4 = _arrayMap$1,
    baseUnary$3 = _baseUnary$1,
    cacheHas$4 = _cacheHas$1;

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE$2 = 200;

/**
 * The base implementation of methods like `_.difference` without support
 * for excluding multiple arrays or iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Array} values The values to exclude.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of filtered values.
 */
function baseDifference$4(array, values, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes$4,
      isCommon = true,
      length = array.length,
      result = [],
      valuesLength = values.length;

  if (!length) {
    return result;
  }
  if (iteratee) {
    values = arrayMap$4(values, baseUnary$3(iteratee));
  }
  if (comparator) {
    includes = arrayIncludesWith$4;
    isCommon = false;
  }
  else if (values.length >= LARGE_ARRAY_SIZE$2) {
    includes = cacheHas$4;
    isCommon = false;
    values = new SetCache$4(values);
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee == null ? value : iteratee(value);

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var valuesIndex = valuesLength;
      while (valuesIndex--) {
        if (values[valuesIndex] === computed) {
          continue outer;
        }
      }
      result.push(value);
    }
    else if (!includes(values, computed, comparator)) {
      result.push(value);
    }
  }
  return result;
}

var _baseDifference$1 = baseDifference$4;

var baseDifference$3 = _baseDifference$1,
    baseRest$4 = _baseRest$1,
    isArrayLikeObject$4 = isArrayLikeObject_1$1;

/**
 * Creates an array excluding all given values using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * **Note:** Unlike `_.pull`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {...*} [values] The values to exclude.
 * @returns {Array} Returns the new array of filtered values.
 * @see _.difference, _.xor
 * @example
 *
 * _.without([2, 1, 2, 3], 1, 2);
 * // => [3]
 */
var without$1 = baseRest$4(function(array, values) {
  return isArrayLikeObject$4(array)
    ? baseDifference$3(array, values)
    : [];
});

var without_1$1 = without$1;

Object.defineProperty(EnterLeaveCounter$1, "__esModule", {
	value: true
});

var _createClass$h = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _union = union_1;

var _union2 = _interopRequireDefault$u(_union);

var _without$1 = without_1$1;

var _without2$1 = _interopRequireDefault$u(_without$1);

function _interopRequireDefault$u(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck$h(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EnterLeaveCounter = function () {
	function EnterLeaveCounter() {
		_classCallCheck$h(this, EnterLeaveCounter);

		this.entered = [];
	}

	_createClass$h(EnterLeaveCounter, [{
		key: 'enter',
		value: function enter(enteringNode) {
			var previousLength = this.entered.length;

			var isNodeEntered = function isNodeEntered(node) {
				return document.documentElement.contains(node) && (!node.contains || node.contains(enteringNode));
			};

			this.entered = (0, _union2.default)(this.entered.filter(isNodeEntered), [enteringNode]);

			return previousLength === 0 && this.entered.length > 0;
		}
	}, {
		key: 'leave',
		value: function leave(leavingNode) {
			var previousLength = this.entered.length;

			this.entered = (0, _without2$1.default)(this.entered.filter(function (node) {
				return document.documentElement.contains(node);
			}), leavingNode);

			return previousLength > 0 && this.entered.length === 0;
		}
	}, {
		key: 'reset',
		value: function reset() {
			this.entered = [];
		}
	}]);

	return EnterLeaveCounter;
}();

EnterLeaveCounter$1.default = EnterLeaveCounter;

var BrowserDetector = {};

var MapCache$2 = _MapCache$1;

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache$2);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = MapCache$2;

var memoize_1 = memoize;

Object.defineProperty(BrowserDetector, "__esModule", {
  value: true
});
BrowserDetector.isSafari = BrowserDetector.isFirefox = undefined;

var _memoize = memoize_1;

var _memoize2 = _interopRequireDefault$t(_memoize);

function _interopRequireDefault$t(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

BrowserDetector.isFirefox = (0, _memoize2.default)(function () {
  return (/firefox/i.test(navigator.userAgent)
  );
});
BrowserDetector.isSafari = (0, _memoize2.default)(function () {
  return Boolean(window.safari);
});

var OffsetUtils = {};

var MonotonicInterpolant$1 = {};

Object.defineProperty(MonotonicInterpolant$1, "__esModule", {
	value: true
});

var _createClass$g = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$g(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint
   no-plusplus: off,
   no-mixed-operators: off
*/
var MonotonicInterpolant = function () {
	function MonotonicInterpolant(xs, ys) {
		_classCallCheck$g(this, MonotonicInterpolant);

		var length = xs.length;

		// Rearrange xs and ys so that xs is sorted
		var indexes = [];
		for (var i = 0; i < length; i++) {
			indexes.push(i);
		}
		indexes.sort(function (a, b) {
			return xs[a] < xs[b] ? -1 : 1;
		});
		var dxs = [];
		var ms = [];
		var dx = void 0;
		var dy = void 0;
		for (var _i = 0; _i < length - 1; _i++) {
			dx = xs[_i + 1] - xs[_i];
			dy = ys[_i + 1] - ys[_i];
			dxs.push(dx);
			ms.push(dy / dx);
		}

		// Get degree-1 coefficients
		var c1s = [ms[0]];
		for (var _i2 = 0; _i2 < dxs.length - 1; _i2++) {
			var _m = ms[_i2];
			var mNext = ms[_i2 + 1];
			if (_m * mNext <= 0) {
				c1s.push(0);
			} else {
				dx = dxs[_i2];
				var dxNext = dxs[_i2 + 1];
				var common = dx + dxNext;
				c1s.push(3 * common / ((common + dxNext) / _m + (common + dx) / mNext));
			}
		}
		c1s.push(ms[ms.length - 1]);

		// Get degree-2 and degree-3 coefficients
		var c2s = [];
		var c3s = [];
		var m = void 0;
		for (var _i3 = 0; _i3 < c1s.length - 1; _i3++) {
			m = ms[_i3];
			var c1 = c1s[_i3];
			var invDx = 1 / dxs[_i3];
			var _common = c1 + c1s[_i3 + 1] - m - m;
			c2s.push((m - c1 - _common) * invDx);
			c3s.push(_common * invDx * invDx);
		}

		this.xs = xs;
		this.ys = ys;
		this.c1s = c1s;
		this.c2s = c2s;
		this.c3s = c3s;
	}

	_createClass$g(MonotonicInterpolant, [{
		key: "interpolate",
		value: function interpolate(x) {
			var xs = this.xs,
			    ys = this.ys,
			    c1s = this.c1s,
			    c2s = this.c2s,
			    c3s = this.c3s;

			// The rightmost point in the dataset should give an exact result

			var i = xs.length - 1;
			if (x === xs[i]) {
				return ys[i];
			}

			// Search for the interval x is in, returning the corresponding y if x is one of the original xs
			var low = 0;
			var high = c3s.length - 1;
			var mid = void 0;
			while (low <= high) {
				mid = Math.floor(0.5 * (low + high));
				var xHere = xs[mid];
				if (xHere < x) {
					low = mid + 1;
				} else if (xHere > x) {
					high = mid - 1;
				} else {
					return ys[mid];
				}
			}
			i = Math.max(0, high);

			// Interpolate
			var diff = x - xs[i];
			var diffSq = diff * diff;
			return ys[i] + c1s[i] * diff + c2s[i] * diffSq + c3s[i] * diff * diffSq;
		}
	}]);

	return MonotonicInterpolant;
}();

MonotonicInterpolant$1.default = MonotonicInterpolant;

Object.defineProperty(OffsetUtils, "__esModule", {
	value: true
});
OffsetUtils.getNodeClientOffset = getNodeClientOffset;
OffsetUtils.getEventClientOffset = getEventClientOffset;
OffsetUtils.getDragPreviewOffset = getDragPreviewOffset;

var _BrowserDetector$1 = BrowserDetector;

var _MonotonicInterpolant = MonotonicInterpolant$1;

var _MonotonicInterpolant2 = _interopRequireDefault$s(_MonotonicInterpolant);

function _interopRequireDefault$s(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint
   no-mixed-operators: off
*/
var ELEMENT_NODE = 1;

function getNodeClientOffset(node) {
	var el = node.nodeType === ELEMENT_NODE ? node : node.parentElement;

	if (!el) {
		return null;
	}

	var _el$getBoundingClient = el.getBoundingClientRect(),
	    top = _el$getBoundingClient.top,
	    left = _el$getBoundingClient.left;

	return { x: left, y: top };
}

function getEventClientOffset(e) {
	return {
		x: e.clientX,
		y: e.clientY
	};
}

function isImageNode(node) {
	return node.nodeName === 'IMG' && ((0, _BrowserDetector$1.isFirefox)() || !document.documentElement.contains(node));
}

function getDragPreviewSize(isImage, dragPreview, sourceWidth, sourceHeight) {
	var dragPreviewWidth = isImage ? dragPreview.width : sourceWidth;
	var dragPreviewHeight = isImage ? dragPreview.height : sourceHeight;

	// Work around @2x coordinate discrepancies in browsers
	if ((0, _BrowserDetector$1.isSafari)() && isImage) {
		dragPreviewHeight /= window.devicePixelRatio;
		dragPreviewWidth /= window.devicePixelRatio;
	}
	return { dragPreviewWidth: dragPreviewWidth, dragPreviewHeight: dragPreviewHeight };
}

function getDragPreviewOffset(sourceNode, dragPreview, clientOffset, anchorPoint, offsetPoint) {
	// The browsers will use the image intrinsic size under different conditions.
	// Firefox only cares if it's an image, but WebKit also wants it to be detached.
	var isImage = isImageNode(dragPreview);
	var dragPreviewNode = isImage ? sourceNode : dragPreview;
	var dragPreviewNodeOffsetFromClient = getNodeClientOffset(dragPreviewNode);
	var offsetFromDragPreview = {
		x: clientOffset.x - dragPreviewNodeOffsetFromClient.x,
		y: clientOffset.y - dragPreviewNodeOffsetFromClient.y
	};
	var sourceWidth = sourceNode.offsetWidth,
	    sourceHeight = sourceNode.offsetHeight;
	var anchorX = anchorPoint.anchorX,
	    anchorY = anchorPoint.anchorY;

	var _getDragPreviewSize = getDragPreviewSize(isImage, dragPreview, sourceWidth, sourceHeight),
	    dragPreviewWidth = _getDragPreviewSize.dragPreviewWidth,
	    dragPreviewHeight = _getDragPreviewSize.dragPreviewHeight;

	var calculateYOffset = function calculateYOffset() {
		var interpolantY = new _MonotonicInterpolant2.default([0, 0.5, 1], [
		// Dock to the top
		offsetFromDragPreview.y,
		// Align at the center
		offsetFromDragPreview.y / sourceHeight * dragPreviewHeight,
		// Dock to the bottom
		offsetFromDragPreview.y + dragPreviewHeight - sourceHeight]);
		var y = interpolantY.interpolate(anchorY);
		// Work around Safari 8 positioning bug
		if ((0, _BrowserDetector$1.isSafari)() && isImage) {
			// We'll have to wait for @3x to see if this is entirely correct
			y += (window.devicePixelRatio - 1) * dragPreviewHeight;
		}
		return y;
	};

	var calculateXOffset = function calculateXOffset() {
		// Interpolate coordinates depending on anchor point
		// If you know a simpler way to do this, let me know
		var interpolantX = new _MonotonicInterpolant2.default([0, 0.5, 1], [
		// Dock to the left
		offsetFromDragPreview.x,
		// Align at the center
		offsetFromDragPreview.x / sourceWidth * dragPreviewWidth,
		// Dock to the right
		offsetFromDragPreview.x + dragPreviewWidth - sourceWidth]);
		return interpolantX.interpolate(anchorX);
	};

	// Force offsets if specified in the options.
	var offsetX = offsetPoint.offsetX,
	    offsetY = offsetPoint.offsetY;

	var isManualOffsetX = offsetX === 0 || offsetX;
	var isManualOffsetY = offsetY === 0 || offsetY;
	return {
		x: isManualOffsetX ? offsetX : calculateXOffset(),
		y: isManualOffsetY ? offsetY : calculateYOffset()
	};
}

var NativeDragSources = {};

var NativeTypes$3 = {};

Object.defineProperty(NativeTypes$3, "__esModule", {
  value: true
});
NativeTypes$3.FILE = '__NATIVE_FILE__';
NativeTypes$3.URL = '__NATIVE_URL__';
NativeTypes$3.TEXT = '__NATIVE_TEXT__';

Object.defineProperty(NativeDragSources, "__esModule", {
	value: true
});

var _createClass$f = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nativeTypesConfig;

NativeDragSources.createNativeDragSource = createNativeDragSource;
NativeDragSources.matchNativeItemType = matchNativeItemType;

var _NativeTypes$2 = NativeTypes$3;

var NativeTypes$2 = _interopRequireWildcard$3(_NativeTypes$2);

function _interopRequireWildcard$3(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineEnumerableProperties(obj, descs) { for (var key in descs) { var desc = descs[key]; desc.configurable = desc.enumerable = true; if ("value" in desc) desc.writable = true; Object.defineProperty(obj, key, desc); } return obj; }

function _classCallCheck$f(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty$1(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getDataFromDataTransfer(dataTransfer, typesToTry, defaultValue) {
	var result = typesToTry.reduce(function (resultSoFar, typeToTry) {
		return resultSoFar || dataTransfer.getData(typeToTry);
	}, null);

	return result != null // eslint-disable-line eqeqeq
	? result : defaultValue;
}

var nativeTypesConfig = (_nativeTypesConfig = {}, _defineProperty$1(_nativeTypesConfig, NativeTypes$2.FILE, {
	exposeProperty: 'files',
	matchesTypes: ['Files'],
	getData: function getData(dataTransfer) {
		return Array.prototype.slice.call(dataTransfer.files);
	}
}), _defineProperty$1(_nativeTypesConfig, NativeTypes$2.URL, {
	exposeProperty: 'urls',
	matchesTypes: ['Url', 'text/uri-list'],
	getData: function getData(dataTransfer, matchesTypes) {
		return getDataFromDataTransfer(dataTransfer, matchesTypes, '').split('\n');
	}
}), _defineProperty$1(_nativeTypesConfig, NativeTypes$2.TEXT, {
	exposeProperty: 'text',
	matchesTypes: ['Text', 'text/plain'],
	getData: function getData(dataTransfer, matchesTypes) {
		return getDataFromDataTransfer(dataTransfer, matchesTypes, '');
	}
}), _nativeTypesConfig);

function createNativeDragSource(type) {
	var _nativeTypesConfig$ty = nativeTypesConfig[type],
	    exposeProperty = _nativeTypesConfig$ty.exposeProperty,
	    matchesTypes = _nativeTypesConfig$ty.matchesTypes,
	    getData = _nativeTypesConfig$ty.getData;


	return function () {
		function NativeDragSource() {
			var _item, _mutatorMap;

			_classCallCheck$f(this, NativeDragSource);

			this.item = (_item = {}, _mutatorMap = {}, _mutatorMap[exposeProperty] = _mutatorMap[exposeProperty] || {}, _mutatorMap[exposeProperty].get = function () {
				// eslint-disable-next-line no-console
				console.warn('Browser doesn\'t allow reading "' + exposeProperty + '" until the drop event.');
				return null;
			}, _defineEnumerableProperties(_item, _mutatorMap), _item);
		}

		_createClass$f(NativeDragSource, [{
			key: 'mutateItemByReadingDataTransfer',
			value: function mutateItemByReadingDataTransfer(dataTransfer) {
				delete this.item[exposeProperty];
				this.item[exposeProperty] = getData(dataTransfer, matchesTypes);
			}
		}, {
			key: 'canDrag',
			value: function canDrag() {
				return true;
			}
		}, {
			key: 'beginDrag',
			value: function beginDrag() {
				return this.item;
			}
		}, {
			key: 'isDragging',
			value: function isDragging(monitor, handle) {
				return handle === monitor.getSourceId();
			}
		}, {
			key: 'endDrag',
			value: function endDrag() {}
		}]);

		return NativeDragSource;
	}();
}

function matchNativeItemType(dataTransfer) {
	var dataTransferTypes = Array.prototype.slice.call(dataTransfer.types || []);

	return Object.keys(nativeTypesConfig).filter(function (nativeItemType) {
		var matchesTypes = nativeTypesConfig[nativeItemType].matchesTypes;

		return matchesTypes.some(function (t) {
			return dataTransferTypes.indexOf(t) > -1;
		});
	})[0] || null;
}

Object.defineProperty(HTML5Backend$1, "__esModule", {
	value: true
});

var _createClass$e = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint-disable no-underscore-dangle */


var _defaults = defaults_1;

var _defaults2 = _interopRequireDefault$r(_defaults);

var _shallowEqual$3 = shallowEqual$3;

var _shallowEqual2$3 = _interopRequireDefault$r(_shallowEqual$3);

var _EnterLeaveCounter = EnterLeaveCounter$1;

var _EnterLeaveCounter2 = _interopRequireDefault$r(_EnterLeaveCounter);

var _BrowserDetector = BrowserDetector;

var _OffsetUtils = OffsetUtils;

var _NativeDragSources = NativeDragSources;

var _NativeTypes$1 = NativeTypes$3;

var NativeTypes$1 = _interopRequireWildcard$2(_NativeTypes$1);

function _interopRequireWildcard$2(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault$r(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck$e(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HTML5Backend = function () {
	function HTML5Backend(manager) {
		_classCallCheck$e(this, HTML5Backend);

		this.actions = manager.getActions();
		this.monitor = manager.getMonitor();
		this.registry = manager.getRegistry();
		this.context = manager.getContext();

		this.sourcePreviewNodes = {};
		this.sourcePreviewNodeOptions = {};
		this.sourceNodes = {};
		this.sourceNodeOptions = {};
		this.enterLeaveCounter = new _EnterLeaveCounter2.default();

		this.dragStartSourceIds = [];
		this.dropTargetIds = [];
		this.dragEnterTargetIds = [];
		this.currentNativeSource = null;
		this.currentNativeHandle = null;
		this.currentDragSourceNode = null;
		this.currentDragSourceNodeOffset = null;
		this.currentDragSourceNodeOffsetChanged = false;
		this.altKeyPressed = false;
		this.mouseMoveTimeoutTimer = null;

		this.getSourceClientOffset = this.getSourceClientOffset.bind(this);
		this.handleTopDragStart = this.handleTopDragStart.bind(this);
		this.handleTopDragStartCapture = this.handleTopDragStartCapture.bind(this);
		this.handleTopDragEndCapture = this.handleTopDragEndCapture.bind(this);
		this.handleTopDragEnter = this.handleTopDragEnter.bind(this);
		this.handleTopDragEnterCapture = this.handleTopDragEnterCapture.bind(this);
		this.handleTopDragLeaveCapture = this.handleTopDragLeaveCapture.bind(this);
		this.handleTopDragOver = this.handleTopDragOver.bind(this);
		this.handleTopDragOverCapture = this.handleTopDragOverCapture.bind(this);
		this.handleTopDrop = this.handleTopDrop.bind(this);
		this.handleTopDropCapture = this.handleTopDropCapture.bind(this);
		this.handleSelectStart = this.handleSelectStart.bind(this);
		this.endDragIfSourceWasRemovedFromDOM = this.endDragIfSourceWasRemovedFromDOM.bind(this);
		this.endDragNativeItem = this.endDragNativeItem.bind(this);
		this.asyncEndDragNativeItem = this.asyncEndDragNativeItem.bind(this);
		this.isNodeInDocument = this.isNodeInDocument.bind(this);
	}

	_createClass$e(HTML5Backend, [{
		key: 'setup',
		value: function setup() {
			if (this.window === undefined) {
				return;
			}

			if (this.window.__isReactDndBackendSetUp) {
				throw new Error('Cannot have two HTML5 backends at the same time.');
			}
			this.window.__isReactDndBackendSetUp = true;
			this.addEventListeners(this.window);
		}
	}, {
		key: 'teardown',
		value: function teardown() {
			if (this.window === undefined) {
				return;
			}

			this.window.__isReactDndBackendSetUp = false;
			this.removeEventListeners(this.window);
			this.clearCurrentDragSourceNode();
			if (this.asyncEndDragFrameId) {
				this.window.cancelAnimationFrame(this.asyncEndDragFrameId);
			}
		}
	}, {
		key: 'addEventListeners',
		value: function addEventListeners(target) {
			// SSR Fix (https://github.com/react-dnd/react-dnd/pull/813
			if (!target.addEventListener) {
				return;
			}
			target.addEventListener('dragstart', this.handleTopDragStart);
			target.addEventListener('dragstart', this.handleTopDragStartCapture, true);
			target.addEventListener('dragend', this.handleTopDragEndCapture, true);
			target.addEventListener('dragenter', this.handleTopDragEnter);
			target.addEventListener('dragenter', this.handleTopDragEnterCapture, true);
			target.addEventListener('dragleave', this.handleTopDragLeaveCapture, true);
			target.addEventListener('dragover', this.handleTopDragOver);
			target.addEventListener('dragover', this.handleTopDragOverCapture, true);
			target.addEventListener('drop', this.handleTopDrop);
			target.addEventListener('drop', this.handleTopDropCapture, true);
		}
	}, {
		key: 'removeEventListeners',
		value: function removeEventListeners(target) {
			// SSR Fix (https://github.com/react-dnd/react-dnd/pull/813
			if (!target.removeEventListener) {
				return;
			}
			target.removeEventListener('dragstart', this.handleTopDragStart);
			target.removeEventListener('dragstart', this.handleTopDragStartCapture, true);
			target.removeEventListener('dragend', this.handleTopDragEndCapture, true);
			target.removeEventListener('dragenter', this.handleTopDragEnter);
			target.removeEventListener('dragenter', this.handleTopDragEnterCapture, true);
			target.removeEventListener('dragleave', this.handleTopDragLeaveCapture, true);
			target.removeEventListener('dragover', this.handleTopDragOver);
			target.removeEventListener('dragover', this.handleTopDragOverCapture, true);
			target.removeEventListener('drop', this.handleTopDrop);
			target.removeEventListener('drop', this.handleTopDropCapture, true);
		}
	}, {
		key: 'connectDragPreview',
		value: function connectDragPreview(sourceId, node, options) {
			var _this = this;

			this.sourcePreviewNodeOptions[sourceId] = options;
			this.sourcePreviewNodes[sourceId] = node;

			return function () {
				delete _this.sourcePreviewNodes[sourceId];
				delete _this.sourcePreviewNodeOptions[sourceId];
			};
		}
	}, {
		key: 'connectDragSource',
		value: function connectDragSource(sourceId, node, options) {
			var _this2 = this;

			this.sourceNodes[sourceId] = node;
			this.sourceNodeOptions[sourceId] = options;

			var handleDragStart = function handleDragStart(e) {
				return _this2.handleDragStart(e, sourceId);
			};
			var handleSelectStart = function handleSelectStart(e) {
				return _this2.handleSelectStart(e, sourceId);
			};

			node.setAttribute('draggable', true);
			node.addEventListener('dragstart', handleDragStart);
			node.addEventListener('selectstart', handleSelectStart);

			return function () {
				delete _this2.sourceNodes[sourceId];
				delete _this2.sourceNodeOptions[sourceId];

				node.removeEventListener('dragstart', handleDragStart);
				node.removeEventListener('selectstart', handleSelectStart);
				node.setAttribute('draggable', false);
			};
		}
	}, {
		key: 'connectDropTarget',
		value: function connectDropTarget(targetId, node) {
			var _this3 = this;

			var handleDragEnter = function handleDragEnter(e) {
				return _this3.handleDragEnter(e, targetId);
			};
			var handleDragOver = function handleDragOver(e) {
				return _this3.handleDragOver(e, targetId);
			};
			var handleDrop = function handleDrop(e) {
				return _this3.handleDrop(e, targetId);
			};

			node.addEventListener('dragenter', handleDragEnter);
			node.addEventListener('dragover', handleDragOver);
			node.addEventListener('drop', handleDrop);

			return function () {
				node.removeEventListener('dragenter', handleDragEnter);
				node.removeEventListener('dragover', handleDragOver);
				node.removeEventListener('drop', handleDrop);
			};
		}
	}, {
		key: 'getCurrentSourceNodeOptions',
		value: function getCurrentSourceNodeOptions() {
			var sourceId = this.monitor.getSourceId();
			var sourceNodeOptions = this.sourceNodeOptions[sourceId];

			return (0, _defaults2.default)(sourceNodeOptions || {}, {
				dropEffect: this.altKeyPressed ? 'copy' : 'move'
			});
		}
	}, {
		key: 'getCurrentDropEffect',
		value: function getCurrentDropEffect() {
			if (this.isDraggingNativeItem()) {
				// It makes more sense to default to 'copy' for native resources
				return 'copy';
			}

			return this.getCurrentSourceNodeOptions().dropEffect;
		}
	}, {
		key: 'getCurrentSourcePreviewNodeOptions',
		value: function getCurrentSourcePreviewNodeOptions() {
			var sourceId = this.monitor.getSourceId();
			var sourcePreviewNodeOptions = this.sourcePreviewNodeOptions[sourceId];

			return (0, _defaults2.default)(sourcePreviewNodeOptions || {}, {
				anchorX: 0.5,
				anchorY: 0.5,
				captureDraggingState: false
			});
		}
	}, {
		key: 'getSourceClientOffset',
		value: function getSourceClientOffset(sourceId) {
			return (0, _OffsetUtils.getNodeClientOffset)(this.sourceNodes[sourceId]);
		}
	}, {
		key: 'isDraggingNativeItem',
		value: function isDraggingNativeItem() {
			var itemType = this.monitor.getItemType();
			return Object.keys(NativeTypes$1).some(function (key) {
				return NativeTypes$1[key] === itemType;
			});
		}
	}, {
		key: 'beginDragNativeItem',
		value: function beginDragNativeItem(type) {
			this.clearCurrentDragSourceNode();

			var SourceType = (0, _NativeDragSources.createNativeDragSource)(type);
			this.currentNativeSource = new SourceType();
			this.currentNativeHandle = this.registry.addSource(type, this.currentNativeSource);
			this.actions.beginDrag([this.currentNativeHandle]);
		}
	}, {
		key: 'asyncEndDragNativeItem',
		value: function asyncEndDragNativeItem() {
			this.asyncEndDragFrameId = this.window.requestAnimationFrame(this.endDragNativeItem);
		}
	}, {
		key: 'endDragNativeItem',
		value: function endDragNativeItem() {
			if (!this.isDraggingNativeItem()) {
				return;
			}

			this.actions.endDrag();
			this.registry.removeSource(this.currentNativeHandle);
			this.currentNativeHandle = null;
			this.currentNativeSource = null;
		}
	}, {
		key: 'isNodeInDocument',
		value: function isNodeInDocument(node) {
			// Check the node either in the main document or in the current context
			return document.body.contains(node) || this.window ? this.window.document.body.contains(node) : false;
		}
	}, {
		key: 'endDragIfSourceWasRemovedFromDOM',
		value: function endDragIfSourceWasRemovedFromDOM() {
			var node = this.currentDragSourceNode;
			if (this.isNodeInDocument(node)) {
				return;
			}

			if (this.clearCurrentDragSourceNode()) {
				this.actions.endDrag();
			}
		}
	}, {
		key: 'setCurrentDragSourceNode',
		value: function setCurrentDragSourceNode(node) {
			var _this4 = this;

			this.clearCurrentDragSourceNode();
			this.currentDragSourceNode = node;
			this.currentDragSourceNodeOffset = (0, _OffsetUtils.getNodeClientOffset)(node);
			this.currentDragSourceNodeOffsetChanged = false;

			// A timeout of > 0 is necessary to resolve Firefox issue referenced
			// See:
			//   * https://github.com/react-dnd/react-dnd/pull/928
			//   * https://github.com/react-dnd/react-dnd/issues/869
			var MOUSE_MOVE_TIMEOUT = 1000;

			// Receiving a mouse event in the middle of a dragging operation
			// means it has ended and the drag source node disappeared from DOM,
			// so the browser didn't dispatch the dragend event.
			//
			// We need to wait before we start listening for mousemove events.
			// This is needed because the drag preview needs to be drawn or else it fires an 'mousemove' event
			// immediately in some browsers.
			//
			// See:
			//   * https://github.com/react-dnd/react-dnd/pull/928
			//   * https://github.com/react-dnd/react-dnd/issues/869
			//
			this.mouseMoveTimeoutTimer = setTimeout(function () {
				_this4.mouseMoveTimeoutId = null;
				return _this4.window.addEventListener('mousemove', _this4.endDragIfSourceWasRemovedFromDOM, true);
			}, MOUSE_MOVE_TIMEOUT);
		}
	}, {
		key: 'clearCurrentDragSourceNode',
		value: function clearCurrentDragSourceNode() {
			if (this.currentDragSourceNode) {
				this.currentDragSourceNode = null;
				this.currentDragSourceNodeOffset = null;
				this.currentDragSourceNodeOffsetChanged = false;
				this.window.clearTimeout(this.mouseMoveTimeoutTimer);
				this.window.removeEventListener('mousemove', this.endDragIfSourceWasRemovedFromDOM, true);
				this.mouseMoveTimeoutTimer = null;
				return true;
			}

			return false;
		}
	}, {
		key: 'checkIfCurrentDragSourceRectChanged',
		value: function checkIfCurrentDragSourceRectChanged() {
			var node = this.currentDragSourceNode;
			if (!node) {
				return false;
			}

			if (this.currentDragSourceNodeOffsetChanged) {
				return true;
			}

			this.currentDragSourceNodeOffsetChanged = !(0, _shallowEqual2$3.default)((0, _OffsetUtils.getNodeClientOffset)(node), this.currentDragSourceNodeOffset);

			return this.currentDragSourceNodeOffsetChanged;
		}
	}, {
		key: 'handleTopDragStartCapture',
		value: function handleTopDragStartCapture() {
			this.clearCurrentDragSourceNode();
			this.dragStartSourceIds = [];
		}
	}, {
		key: 'handleDragStart',
		value: function handleDragStart(e, sourceId) {
			this.dragStartSourceIds.unshift(sourceId);
		}
	}, {
		key: 'handleTopDragStart',
		value: function handleTopDragStart(e) {
			var _this5 = this;

			var dragStartSourceIds = this.dragStartSourceIds;

			this.dragStartSourceIds = null;

			var clientOffset = (0, _OffsetUtils.getEventClientOffset)(e);

			// Avoid crashing if we missed a drop event or our previous drag died
			if (this.monitor.isDragging()) {
				this.actions.endDrag();
			}

			// Don't publish the source just yet (see why below)
			this.actions.beginDrag(dragStartSourceIds, {
				publishSource: false,
				getSourceClientOffset: this.getSourceClientOffset,
				clientOffset: clientOffset
			});

			var dataTransfer = e.dataTransfer;

			var nativeType = (0, _NativeDragSources.matchNativeItemType)(dataTransfer);

			if (this.monitor.isDragging()) {
				if (typeof dataTransfer.setDragImage === 'function') {
					// Use custom drag image if user specifies it.
					// If child drag source refuses drag but parent agrees,
					// use parent's node as drag image. Neither works in IE though.
					var sourceId = this.monitor.getSourceId();
					var sourceNode = this.sourceNodes[sourceId];
					var dragPreview = this.sourcePreviewNodes[sourceId] || sourceNode;

					var _getCurrentSourcePrev = this.getCurrentSourcePreviewNodeOptions(),
					    anchorX = _getCurrentSourcePrev.anchorX,
					    anchorY = _getCurrentSourcePrev.anchorY,
					    offsetX = _getCurrentSourcePrev.offsetX,
					    offsetY = _getCurrentSourcePrev.offsetY;

					var anchorPoint = { anchorX: anchorX, anchorY: anchorY };
					var offsetPoint = { offsetX: offsetX, offsetY: offsetY };
					var dragPreviewOffset = (0, _OffsetUtils.getDragPreviewOffset)(sourceNode, dragPreview, clientOffset, anchorPoint, offsetPoint);

					dataTransfer.setDragImage(dragPreview, dragPreviewOffset.x, dragPreviewOffset.y);
				}

				try {
					// Firefox won't drag without setting data
					dataTransfer.setData('application/json', {});
				} catch (err) {}
				// IE doesn't support MIME types in setData


				// Store drag source node so we can check whether
				// it is removed from DOM and trigger endDrag manually.
				this.setCurrentDragSourceNode(e.target);

				// Now we are ready to publish the drag source.. or are we not?

				var _getCurrentSourcePrev2 = this.getCurrentSourcePreviewNodeOptions(),
				    captureDraggingState = _getCurrentSourcePrev2.captureDraggingState;

				if (!captureDraggingState) {
					// Usually we want to publish it in the next tick so that browser
					// is able to screenshot the current (not yet dragging) state.
					//
					// It also neatly avoids a situation where render() returns null
					// in the same tick for the source element, and browser freaks out.
					setTimeout(function () {
						return _this5.actions.publishDragSource();
					});
				} else {
					// In some cases the user may want to override this behavior, e.g.
					// to work around IE not supporting custom drag previews.
					//
					// When using a custom drag layer, the only way to prevent
					// the default drag preview from drawing in IE is to screenshot
					// the dragging state in which the node itself has zero opacity
					// and height. In this case, though, returning null from render()
					// will abruptly end the dragging, which is not obvious.
					//
					// This is the reason such behavior is strictly opt-in.
					this.actions.publishDragSource();
				}
			} else if (nativeType) {
				// A native item (such as URL) dragged from inside the document
				this.beginDragNativeItem(nativeType);
			} else if (!dataTransfer.types && (!e.target.hasAttribute || !e.target.hasAttribute('draggable'))) {
				// Looks like a Safari bug: dataTransfer.types is null, but there was no draggable.
				// Just let it drag. It's a native type (URL or text) and will be picked up in
				// dragenter handler.
				return; // eslint-disable-line no-useless-return
			} else {
				// If by this time no drag source reacted, tell browser not to drag.
				e.preventDefault();
			}
		}
	}, {
		key: 'handleTopDragEndCapture',
		value: function handleTopDragEndCapture() {
			if (this.clearCurrentDragSourceNode()) {
				// Firefox can dispatch this event in an infinite loop
				// if dragend handler does something like showing an alert.
				// Only proceed if we have not handled it already.
				this.actions.endDrag();
			}
		}
	}, {
		key: 'handleTopDragEnterCapture',
		value: function handleTopDragEnterCapture(e) {
			this.dragEnterTargetIds = [];

			var isFirstEnter = this.enterLeaveCounter.enter(e.target);
			if (!isFirstEnter || this.monitor.isDragging()) {
				return;
			}

			var dataTransfer = e.dataTransfer;

			var nativeType = (0, _NativeDragSources.matchNativeItemType)(dataTransfer);

			if (nativeType) {
				// A native item (such as file or URL) dragged from outside the document
				this.beginDragNativeItem(nativeType);
			}
		}
	}, {
		key: 'handleDragEnter',
		value: function handleDragEnter(e, targetId) {
			this.dragEnterTargetIds.unshift(targetId);
		}
	}, {
		key: 'handleTopDragEnter',
		value: function handleTopDragEnter(e) {
			var _this6 = this;

			var dragEnterTargetIds = this.dragEnterTargetIds;

			this.dragEnterTargetIds = [];

			if (!this.monitor.isDragging()) {
				// This is probably a native item type we don't understand.
				return;
			}

			this.altKeyPressed = e.altKey;

			if (!(0, _BrowserDetector.isFirefox)()) {
				// Don't emit hover in `dragenter` on Firefox due to an edge case.
				// If the target changes position as the result of `dragenter`, Firefox
				// will still happily dispatch `dragover` despite target being no longer
				// there. The easy solution is to only fire `hover` in `dragover` on FF.
				this.actions.hover(dragEnterTargetIds, {
					clientOffset: (0, _OffsetUtils.getEventClientOffset)(e)
				});
			}

			var canDrop = dragEnterTargetIds.some(function (targetId) {
				return _this6.monitor.canDropOnTarget(targetId);
			});

			if (canDrop) {
				// IE requires this to fire dragover events
				e.preventDefault();
				e.dataTransfer.dropEffect = this.getCurrentDropEffect();
			}
		}
	}, {
		key: 'handleTopDragOverCapture',
		value: function handleTopDragOverCapture() {
			this.dragOverTargetIds = [];
		}
	}, {
		key: 'handleDragOver',
		value: function handleDragOver(e, targetId) {
			this.dragOverTargetIds.unshift(targetId);
		}
	}, {
		key: 'handleTopDragOver',
		value: function handleTopDragOver(e) {
			var _this7 = this;

			var dragOverTargetIds = this.dragOverTargetIds;

			this.dragOverTargetIds = [];

			if (!this.monitor.isDragging()) {
				// This is probably a native item type we don't understand.
				// Prevent default "drop and blow away the whole document" action.
				e.preventDefault();
				e.dataTransfer.dropEffect = 'none';
				return;
			}

			this.altKeyPressed = e.altKey;

			this.actions.hover(dragOverTargetIds, {
				clientOffset: (0, _OffsetUtils.getEventClientOffset)(e)
			});

			var canDrop = dragOverTargetIds.some(function (targetId) {
				return _this7.monitor.canDropOnTarget(targetId);
			});

			if (canDrop) {
				// Show user-specified drop effect.
				e.preventDefault();
				e.dataTransfer.dropEffect = this.getCurrentDropEffect();
			} else if (this.isDraggingNativeItem()) {
				// Don't show a nice cursor but still prevent default
				// "drop and blow away the whole document" action.
				e.preventDefault();
				e.dataTransfer.dropEffect = 'none';
			} else if (this.checkIfCurrentDragSourceRectChanged()) {
				// Prevent animating to incorrect position.
				// Drop effect must be other than 'none' to prevent animation.
				e.preventDefault();
				e.dataTransfer.dropEffect = 'move';
			}
		}
	}, {
		key: 'handleTopDragLeaveCapture',
		value: function handleTopDragLeaveCapture(e) {
			if (this.isDraggingNativeItem()) {
				e.preventDefault();
			}

			var isLastLeave = this.enterLeaveCounter.leave(e.target);
			if (!isLastLeave) {
				return;
			}

			if (this.isDraggingNativeItem()) {
				this.endDragNativeItem();
			}
		}
	}, {
		key: 'handleTopDropCapture',
		value: function handleTopDropCapture(e) {
			this.dropTargetIds = [];
			e.preventDefault();

			if (this.isDraggingNativeItem()) {
				this.currentNativeSource.mutateItemByReadingDataTransfer(e.dataTransfer);
			}

			this.enterLeaveCounter.reset();
		}
	}, {
		key: 'handleDrop',
		value: function handleDrop(e, targetId) {
			this.dropTargetIds.unshift(targetId);
		}
	}, {
		key: 'handleTopDrop',
		value: function handleTopDrop(e) {
			var dropTargetIds = this.dropTargetIds;

			this.dropTargetIds = [];

			this.actions.hover(dropTargetIds, {
				clientOffset: (0, _OffsetUtils.getEventClientOffset)(e)
			});
			this.actions.drop({ dropEffect: this.getCurrentDropEffect() });

			if (this.isDraggingNativeItem()) {
				this.endDragNativeItem();
			} else {
				this.endDragIfSourceWasRemovedFromDOM();
			}
		}
	}, {
		key: 'handleSelectStart',
		value: function handleSelectStart(e) {
			var target = e.target;

			// Only IE requires us to explicitly say
			// we want drag drop operation to start

			if (typeof target.dragDrop !== 'function') {
				return;
			}

			// Inputs and textareas should be selectable
			if (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
				return;
			}

			// For other targets, ask IE
			// to enable drag and drop
			e.preventDefault();
			target.dragDrop();
		}
	}, {
		key: 'window',
		get: function get() {
			if (this.context && this.context.window) {
				return this.context.window;
			} else if (typeof window !== 'undefined') {
				return window;
			}
			return undefined;
		}
	}]);

	return HTML5Backend;
}();

HTML5Backend$1.default = HTML5Backend;

var getEmptyImage$1 = {};

Object.defineProperty(getEmptyImage$1, "__esModule", {
	value: true
});
getEmptyImage$1.default = getEmptyImage;
var emptyImage = void 0;
function getEmptyImage() {
	if (!emptyImage) {
		emptyImage = new Image();
		emptyImage.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
	}

	return emptyImage;
}

Object.defineProperty(lib$2, "__esModule", {
	value: true
});
lib$2.getEmptyImage = lib$2.NativeTypes = undefined;
var _default = lib$2.default = createHTML5Backend;

var _HTML5Backend = HTML5Backend$1;

var _HTML5Backend2 = _interopRequireDefault$q(_HTML5Backend);

var _getEmptyImage = getEmptyImage$1;

var _getEmptyImage2 = _interopRequireDefault$q(_getEmptyImage);

var _NativeTypes = NativeTypes$3;

var NativeTypes = _interopRequireWildcard$1(_NativeTypes);

function _interopRequireWildcard$1(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault$q(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

lib$2.NativeTypes = NativeTypes;
lib$2.getEmptyImage = _getEmptyImage2.default;
function createHTML5Backend(manager) {
	return new _HTML5Backend2.default(manager);
}

var lib$1 = {};

var DragDropContext$1 = {};

var lib = {};

var DragDropManager$1 = {};

var createStore = {};

/** Detect free variable `global` from Node.js. */

var freeGlobal$5 = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal$2 = freeGlobal$5;

var freeGlobal$4 = _freeGlobal$2;

/** Detect free variable `self`. */
var freeSelf$2 = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root$8 = freeGlobal$4 || freeSelf$2 || Function('return this')();

var _root$2 = root$8;

var root$7 = _root$2;

/** Built-in value references. */
var Symbol$a = root$7.Symbol;

var _Symbol$2 = Symbol$a;

var Symbol$9 = _Symbol$2;

/** Used for built-in method references. */
var objectProto$b = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$8 = objectProto$b.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$5 = objectProto$b.toString;

/** Built-in value references. */
var symToStringTag$5 = Symbol$9 ? Symbol$9.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag$5(value) {
  var isOwn = hasOwnProperty$8.call(value, symToStringTag$5),
      tag = value[symToStringTag$5];

  try {
    value[symToStringTag$5] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString$5.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$5] = tag;
    } else {
      delete value[symToStringTag$5];
    }
  }
  return result;
}

var _getRawTag$2 = getRawTag$5;

/** Used for built-in method references. */

var objectProto$a = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$4 = objectProto$a.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString$5(value) {
  return nativeObjectToString$4.call(value);
}

var _objectToString$2 = objectToString$5;

var Symbol$8 = _Symbol$2,
    getRawTag$4 = _getRawTag$2,
    objectToString$4 = _objectToString$2;

/** `Object#toString` result references. */
var nullTag$2 = '[object Null]',
    undefinedTag$2 = '[object Undefined]';

/** Built-in value references. */
var symToStringTag$4 = Symbol$8 ? Symbol$8.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag$6(value) {
  if (value == null) {
    return value === undefined ? undefinedTag$2 : nullTag$2;
  }
  return (symToStringTag$4 && symToStringTag$4 in Object(value))
    ? getRawTag$4(value)
    : objectToString$4(value);
}

var _baseGetTag$2 = baseGetTag$6;

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */

function overArg$3(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

var _overArg$1 = overArg$3;

var overArg$2 = _overArg$1;

/** Built-in value references. */
var getPrototype$3 = overArg$2(Object.getPrototypeOf, Object);

var _getPrototype$1 = getPrototype$3;

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

function isObjectLike$7(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1$2 = isObjectLike$7;

var baseGetTag$5 = _baseGetTag$2,
    getPrototype$2 = _getPrototype$1,
    isObjectLike$6 = isObjectLike_1$2;

/** `Object#toString` result references. */
var objectTag$1 = '[object Object]';

/** Used for built-in method references. */
var funcProto$3 = Function.prototype,
    objectProto$9 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$3 = funcProto$3.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$7 = objectProto$9.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString$1 = funcToString$3.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject$1(value) {
  if (!isObjectLike$6(value) || baseGetTag$5(value) != objectTag$1) {
    return false;
  }
  var proto = getPrototype$2(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty$7.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString$3.call(Ctor) == objectCtorString$1;
}

var isPlainObject_1$1 = isPlainObject$1;

(function (exports) {

exports.__esModule = true;
exports.ActionTypes = undefined;
exports['default'] = createStore;

var _isPlainObject = isPlainObject_1$1;

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _symbolObservable = require$$1;

var _symbolObservable2 = _interopRequireDefault(_symbolObservable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var ActionTypes = exports.ActionTypes = {
  INIT: '@@redux/INIT'

  /**
   * Creates a Redux store that holds the state tree.
   * The only way to change the data in the store is to call `dispatch()` on it.
   *
   * There should only be a single store in your app. To specify how different
   * parts of the state tree respond to actions, you may combine several reducers
   * into a single reducer function by using `combineReducers`.
   *
   * @param {Function} reducer A function that returns the next state tree, given
   * the current state tree and the action to handle.
   *
   * @param {any} [preloadedState] The initial state. You may optionally specify it
   * to hydrate the state from the server in universal apps, or to restore a
   * previously serialized user session.
   * If you use `combineReducers` to produce the root reducer function, this must be
   * an object with the same shape as `combineReducers` keys.
   *
   * @param {Function} [enhancer] The store enhancer. You may optionally specify it
   * to enhance the store with third-party capabilities such as middleware,
   * time travel, persistence, etc. The only store enhancer that ships with Redux
   * is `applyMiddleware()`.
   *
   * @returns {Store} A Redux store that lets you read the state, dispatch actions
   * and subscribe to changes.
   */
};function createStore(reducer, preloadedState, enhancer) {
  var _ref2;

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */
  function getState() {
    return currentState;
  }

  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.');
    }

    var isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;

      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }

  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */
  function dispatch(action) {
    if (!(0, _isPlainObject2['default'])(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }

    return action;
  }

  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer;
    dispatch({ type: ActionTypes.INIT });
  }

  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/tc39/proposal-observable
   */
  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if (typeof observer !== 'object') {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return { unsubscribe: unsubscribe };
      }
    }, _ref[_symbolObservable2['default']] = function () {
      return this;
    }, _ref;
  }

  // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  dispatch({ type: ActionTypes.INIT });

  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[_symbolObservable2['default']] = observable, _ref2;
}
}(createStore));

var reducers = {};

var dragOffset$1 = {};

var dragDrop = {};

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */

var isArray$2 = Array.isArray;

var isArray_1$1 = isArray$2;

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

function isObject$2(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var isObject_1 = isObject$2;

var matchesType$1 = {};

Object.defineProperty(matchesType$1, "__esModule", {
	value: true
});
matchesType$1.default = matchesType;

var _isArray$4 = isArray_1$1;

var _isArray2$4 = _interopRequireDefault$p(_isArray$4);

function _interopRequireDefault$p(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function matchesType(targetType, draggedItemType) {
	if ((0, _isArray2$4.default)(targetType)) {
		return targetType.some(function (t) {
			return t === draggedItemType;
		});
	} else {
		return targetType === draggedItemType;
	}
}

Object.defineProperty(dragDrop, "__esModule", {
	value: true
});
dragDrop.END_DRAG = dragDrop.DROP = dragDrop.HOVER = dragDrop.PUBLISH_DRAG_SOURCE = dragDrop.BEGIN_DRAG = undefined;

var _extends$5 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

dragDrop.beginDrag = beginDrag;
dragDrop.publishDragSource = publishDragSource;
dragDrop.hover = hover;
dragDrop.drop = drop;
dragDrop.endDrag = endDrag;

var _invariant$c = invariant_1;

var _invariant2$c = _interopRequireDefault$o(_invariant$c);

var _isArray$3 = isArray_1$1;

var _isArray2$3 = _interopRequireDefault$o(_isArray$3);

var _isObject = isObject_1;

var _isObject2 = _interopRequireDefault$o(_isObject);

var _matchesType$1 = matchesType$1;

var _matchesType2$1 = _interopRequireDefault$o(_matchesType$1);

function _interopRequireDefault$o(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BEGIN_DRAG = dragDrop.BEGIN_DRAG = 'dnd-core/BEGIN_DRAG';
var PUBLISH_DRAG_SOURCE = dragDrop.PUBLISH_DRAG_SOURCE = 'dnd-core/PUBLISH_DRAG_SOURCE';
var HOVER = dragDrop.HOVER = 'dnd-core/HOVER';
var DROP = dragDrop.DROP = 'dnd-core/DROP';
var END_DRAG = dragDrop.END_DRAG = 'dnd-core/END_DRAG';

function beginDrag(sourceIds) {
	var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { publishSource: true, clientOffset: null };
	var publishSource = options.publishSource,
	    clientOffset = options.clientOffset,
	    getSourceClientOffset = options.getSourceClientOffset;

	(0, _invariant2$c.default)((0, _isArray2$3.default)(sourceIds), 'Expected sourceIds to be an array.');

	var monitor = this.getMonitor();
	var registry = this.getRegistry();
	(0, _invariant2$c.default)(!monitor.isDragging(), 'Cannot call beginDrag while dragging.');

	for (var i = 0; i < sourceIds.length; i++) {
		(0, _invariant2$c.default)(registry.getSource(sourceIds[i]), 'Expected sourceIds to be registered.');
	}

	var sourceId = null;
	for (var _i = sourceIds.length - 1; _i >= 0; _i--) {
		if (monitor.canDragSource(sourceIds[_i])) {
			sourceId = sourceIds[_i];
			break;
		}
	}
	if (sourceId === null) {
		return;
	}

	var sourceClientOffset = null;
	if (clientOffset) {
		(0, _invariant2$c.default)(typeof getSourceClientOffset === 'function', 'When clientOffset is provided, getSourceClientOffset must be a function.');
		sourceClientOffset = getSourceClientOffset(sourceId);
	}

	var source = registry.getSource(sourceId);
	var item = source.beginDrag(monitor, sourceId);
	(0, _invariant2$c.default)((0, _isObject2.default)(item), 'Item must be an object.');

	registry.pinSource(sourceId);

	var itemType = registry.getSourceType(sourceId);
	return {
		type: BEGIN_DRAG,
		itemType: itemType,
		item: item,
		sourceId: sourceId,
		clientOffset: clientOffset,
		sourceClientOffset: sourceClientOffset,
		isSourcePublic: publishSource
	};
}

function publishDragSource() {
	var monitor = this.getMonitor();
	if (!monitor.isDragging()) {
		return;
	}

	return { type: PUBLISH_DRAG_SOURCE };
}

function hover(targetIdsArg) {
	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$clientOffset = _ref.clientOffset,
	    clientOffset = _ref$clientOffset === undefined ? null : _ref$clientOffset;

	(0, _invariant2$c.default)((0, _isArray2$3.default)(targetIdsArg), 'Expected targetIds to be an array.');
	var targetIds = targetIdsArg.slice(0);

	var monitor = this.getMonitor();
	var registry = this.getRegistry();
	(0, _invariant2$c.default)(monitor.isDragging(), 'Cannot call hover while not dragging.');
	(0, _invariant2$c.default)(!monitor.didDrop(), 'Cannot call hover after drop.');

	// First check invariants.
	for (var i = 0; i < targetIds.length; i++) {
		var targetId = targetIds[i];
		(0, _invariant2$c.default)(targetIds.lastIndexOf(targetId) === i, 'Expected targetIds to be unique in the passed array.');

		var target = registry.getTarget(targetId);
		(0, _invariant2$c.default)(target, 'Expected targetIds to be registered.');
	}

	var draggedItemType = monitor.getItemType();

	// Remove those targetIds that don't match the targetType.  This
	// fixes shallow isOver which would only be non-shallow because of
	// non-matching targets.
	for (var _i2 = targetIds.length - 1; _i2 >= 0; _i2--) {
		var _targetId = targetIds[_i2];
		var targetType = registry.getTargetType(_targetId);
		if (!(0, _matchesType2$1.default)(targetType, draggedItemType)) {
			targetIds.splice(_i2, 1);
		}
	}

	// Finally call hover on all matching targets.
	for (var _i3 = 0; _i3 < targetIds.length; _i3++) {
		var _targetId2 = targetIds[_i3];
		var _target = registry.getTarget(_targetId2);
		_target.hover(monitor, _targetId2);
	}

	return {
		type: HOVER,
		targetIds: targetIds,
		clientOffset: clientOffset
	};
}

function drop() {
	var _this = this;

	var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	var monitor = this.getMonitor();
	var registry = this.getRegistry();
	(0, _invariant2$c.default)(monitor.isDragging(), 'Cannot call drop while not dragging.');
	(0, _invariant2$c.default)(!monitor.didDrop(), 'Cannot call drop twice during one drag operation.');

	var targetIds = monitor.getTargetIds().filter(monitor.canDropOnTarget, monitor);

	targetIds.reverse();
	targetIds.forEach(function (targetId, index) {
		var target = registry.getTarget(targetId);

		var dropResult = target.drop(monitor, targetId);
		(0, _invariant2$c.default)(typeof dropResult === 'undefined' || (0, _isObject2.default)(dropResult), 'Drop result must either be an object or undefined.');
		if (typeof dropResult === 'undefined') {
			dropResult = index === 0 ? {} : monitor.getDropResult();
		}

		_this.store.dispatch({
			type: DROP,
			dropResult: _extends$5({}, options, dropResult)
		});
	});
}

function endDrag() {
	var monitor = this.getMonitor();
	var registry = this.getRegistry();
	(0, _invariant2$c.default)(monitor.isDragging(), 'Cannot call endDrag while not dragging.');

	var sourceId = monitor.getSourceId();
	var source = registry.getSource(sourceId, true);
	source.endDrag(monitor, sourceId);

	registry.unpinSource();

	return { type: END_DRAG };
}

Object.defineProperty(dragOffset$1, "__esModule", {
	value: true
});

var _extends$4 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

dragOffset$1.default = dragOffset;
dragOffset$1.getSourceClientOffset = getSourceClientOffset;
dragOffset$1.getDifferenceFromInitialOffset = getDifferenceFromInitialOffset;

var _dragDrop$3 = dragDrop;

var initialState$1 = {
	initialSourceClientOffset: null,
	initialClientOffset: null,
	clientOffset: null
};

function areOffsetsEqual(offsetA, offsetB) {
	if (offsetA === offsetB) {
		return true;
	}
	return offsetA && offsetB && offsetA.x === offsetB.x && offsetA.y === offsetB.y;
}

function dragOffset() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState$1;
	var action = arguments[1];

	switch (action.type) {
		case _dragDrop$3.BEGIN_DRAG:
			return {
				initialSourceClientOffset: action.sourceClientOffset,
				initialClientOffset: action.clientOffset,
				clientOffset: action.clientOffset
			};
		case _dragDrop$3.HOVER:
			if (areOffsetsEqual(state.clientOffset, action.clientOffset)) {
				return state;
			}
			return _extends$4({}, state, {
				clientOffset: action.clientOffset
			});
		case _dragDrop$3.END_DRAG:
		case _dragDrop$3.DROP:
			return initialState$1;
		default:
			return state;
	}
}

function getSourceClientOffset(state) {
	var clientOffset = state.clientOffset,
	    initialClientOffset = state.initialClientOffset,
	    initialSourceClientOffset = state.initialSourceClientOffset;

	if (!clientOffset || !initialClientOffset || !initialSourceClientOffset) {
		return null;
	}
	return {
		x: clientOffset.x + initialSourceClientOffset.x - initialClientOffset.x,
		y: clientOffset.y + initialSourceClientOffset.y - initialClientOffset.y
	};
}

function getDifferenceFromInitialOffset(state) {
	var clientOffset = state.clientOffset,
	    initialClientOffset = state.initialClientOffset;

	if (!clientOffset || !initialClientOffset) {
		return null;
	}
	return {
		x: clientOffset.x - initialClientOffset.x,
		y: clientOffset.y - initialClientOffset.y
	};
}

var dragOperation$1 = {};

/** Detect free variable `global` from Node.js. */

var freeGlobal$3 = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal$1 = freeGlobal$3;

var freeGlobal$2 = _freeGlobal$1;

/** Detect free variable `self`. */
var freeSelf$1 = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root$6 = freeGlobal$2 || freeSelf$1 || Function('return this')();

var _root$1 = root$6;

var root$5 = _root$1;

/** Built-in value references. */
var Symbol$7 = root$5.Symbol;

var _Symbol$1 = Symbol$7;

var Symbol$6 = _Symbol$1;

/** Used for built-in method references. */
var objectProto$8 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$8.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$3 = objectProto$8.toString;

/** Built-in value references. */
var symToStringTag$3 = Symbol$6 ? Symbol$6.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag$3(value) {
  var isOwn = hasOwnProperty$6.call(value, symToStringTag$3),
      tag = value[symToStringTag$3];

  try {
    value[symToStringTag$3] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString$3.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$3] = tag;
    } else {
      delete value[symToStringTag$3];
    }
  }
  return result;
}

var _getRawTag$1 = getRawTag$3;

/** Used for built-in method references. */

var objectProto$7 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$2 = objectProto$7.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString$3(value) {
  return nativeObjectToString$2.call(value);
}

var _objectToString$1 = objectToString$3;

var Symbol$5 = _Symbol$1,
    getRawTag$2 = _getRawTag$1,
    objectToString$2 = _objectToString$1;

/** `Object#toString` result references. */
var nullTag$1 = '[object Null]',
    undefinedTag$1 = '[object Undefined]';

/** Built-in value references. */
var symToStringTag$2 = Symbol$5 ? Symbol$5.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag$4(value) {
  if (value == null) {
    return value === undefined ? undefinedTag$1 : nullTag$1;
  }
  return (symToStringTag$2 && symToStringTag$2 in Object(value))
    ? getRawTag$2(value)
    : objectToString$2(value);
}

var _baseGetTag$1 = baseGetTag$4;

var baseGetTag$3 = _baseGetTag$1,
    isObject$1 = isObject_1;

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

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
function isFunction$2(value) {
  if (!isObject$1(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag$3(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

var isFunction_1 = isFunction$2;

var root$4 = _root$1;

/** Used to detect overreaching core-js shims. */
var coreJsData$1 = root$4['__core-js_shared__'];

var _coreJsData = coreJsData$1;

var coreJsData = _coreJsData;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked$1(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

var _isMasked = isMasked$1;

/** Used for built-in method references. */

var funcProto$2 = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$2 = funcProto$2.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource$1(func) {
  if (func != null) {
    try {
      return funcToString$2.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

var _toSource = toSource$1;

var isFunction$1 = isFunction_1,
    isMasked = _isMasked,
    isObject = isObject_1,
    toSource = _toSource;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto$1 = Function.prototype,
    objectProto$6 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$6.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString$1.call(hasOwnProperty$5).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative$1(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction$1(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

var _baseIsNative = baseIsNative$1;

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */

function getValue$1(object, key) {
  return object == null ? undefined : object[key];
}

var _getValue = getValue$1;

var baseIsNative = _baseIsNative,
    getValue = _getValue;

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative$4(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

var _getNative = getNative$4;

var getNative$3 = _getNative;

/* Built-in method references that are verified to be native. */
var nativeCreate$4 = getNative$3(Object, 'create');

var _nativeCreate = nativeCreate$4;

var nativeCreate$3 = _nativeCreate;

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear$1() {
  this.__data__ = nativeCreate$3 ? nativeCreate$3(null) : {};
  this.size = 0;
}

var _hashClear = hashClear$1;

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */

function hashDelete$1(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

var _hashDelete = hashDelete$1;

var nativeCreate$2 = _nativeCreate;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$5.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet$1(key) {
  var data = this.__data__;
  if (nativeCreate$2) {
    var result = data[key];
    return result === HASH_UNDEFINED$2 ? undefined : result;
  }
  return hasOwnProperty$4.call(data, key) ? data[key] : undefined;
}

var _hashGet = hashGet$1;

var nativeCreate$1 = _nativeCreate;

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas$1(key) {
  var data = this.__data__;
  return nativeCreate$1 ? (data[key] !== undefined) : hasOwnProperty$3.call(data, key);
}

var _hashHas = hashHas$1;

var nativeCreate = _nativeCreate;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet$1(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
  return this;
}

var _hashSet = hashSet$1;

var hashClear = _hashClear,
    hashDelete = _hashDelete,
    hashGet = _hashGet,
    hashHas = _hashHas,
    hashSet = _hashSet;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash$1(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash$1.prototype.clear = hashClear;
Hash$1.prototype['delete'] = hashDelete;
Hash$1.prototype.get = hashGet;
Hash$1.prototype.has = hashHas;
Hash$1.prototype.set = hashSet;

var _Hash = Hash$1;

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */

function listCacheClear$1() {
  this.__data__ = [];
  this.size = 0;
}

var _listCacheClear = listCacheClear$1;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */

function eq$1(value, other) {
  return value === other || (value !== value && other !== other);
}

var eq_1 = eq$1;

var eq = eq_1;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf$4(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

var _assocIndexOf = assocIndexOf$4;

var assocIndexOf$3 = _assocIndexOf;

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete$1(key) {
  var data = this.__data__,
      index = assocIndexOf$3(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

var _listCacheDelete = listCacheDelete$1;

var assocIndexOf$2 = _assocIndexOf;

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet$1(key) {
  var data = this.__data__,
      index = assocIndexOf$2(data, key);

  return index < 0 ? undefined : data[index][1];
}

var _listCacheGet = listCacheGet$1;

var assocIndexOf$1 = _assocIndexOf;

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas$1(key) {
  return assocIndexOf$1(this.__data__, key) > -1;
}

var _listCacheHas = listCacheHas$1;

var assocIndexOf = _assocIndexOf;

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet$1(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

var _listCacheSet = listCacheSet$1;

var listCacheClear = _listCacheClear,
    listCacheDelete = _listCacheDelete,
    listCacheGet = _listCacheGet,
    listCacheHas = _listCacheHas,
    listCacheSet = _listCacheSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache$1(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache$1.prototype.clear = listCacheClear;
ListCache$1.prototype['delete'] = listCacheDelete;
ListCache$1.prototype.get = listCacheGet;
ListCache$1.prototype.has = listCacheHas;
ListCache$1.prototype.set = listCacheSet;

var _ListCache = ListCache$1;

var getNative$2 = _getNative,
    root$3 = _root$1;

/* Built-in method references that are verified to be native. */
var Map$1 = getNative$2(root$3, 'Map');

var _Map = Map$1;

var Hash = _Hash,
    ListCache = _ListCache,
    Map = _Map;

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear$1() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

var _mapCacheClear = mapCacheClear$1;

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */

function isKeyable$1(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

var _isKeyable = isKeyable$1;

var isKeyable = _isKeyable;

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData$4(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

var _getMapData = getMapData$4;

var getMapData$3 = _getMapData;

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete$1(key) {
  var result = getMapData$3(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

var _mapCacheDelete = mapCacheDelete$1;

var getMapData$2 = _getMapData;

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet$1(key) {
  return getMapData$2(this, key).get(key);
}

var _mapCacheGet = mapCacheGet$1;

var getMapData$1 = _getMapData;

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas$1(key) {
  return getMapData$1(this, key).has(key);
}

var _mapCacheHas = mapCacheHas$1;

var getMapData = _getMapData;

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet$1(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

var _mapCacheSet = mapCacheSet$1;

var mapCacheClear = _mapCacheClear,
    mapCacheDelete = _mapCacheDelete,
    mapCacheGet = _mapCacheGet,
    mapCacheHas = _mapCacheHas,
    mapCacheSet = _mapCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache$1(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache$1.prototype.clear = mapCacheClear;
MapCache$1.prototype['delete'] = mapCacheDelete;
MapCache$1.prototype.get = mapCacheGet;
MapCache$1.prototype.has = mapCacheHas;
MapCache$1.prototype.set = mapCacheSet;

var _MapCache = MapCache$1;

/** Used to stand-in for `undefined` hash values. */

var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd$1(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

var _setCacheAdd = setCacheAdd$1;

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */

function setCacheHas$1(value) {
  return this.__data__.has(value);
}

var _setCacheHas = setCacheHas$1;

var MapCache = _MapCache,
    setCacheAdd = _setCacheAdd,
    setCacheHas = _setCacheHas;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache$3(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache$3.prototype.add = SetCache$3.prototype.push = setCacheAdd;
SetCache$3.prototype.has = setCacheHas;

var _SetCache = SetCache$3;

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */

function baseFindIndex$1(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

var _baseFindIndex = baseFindIndex$1;

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */

function baseIsNaN$1(value) {
  return value !== value;
}

var _baseIsNaN = baseIsNaN$1;

/**
 * A specialized version of `_.indexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */

function strictIndexOf$1(array, value, fromIndex) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

var _strictIndexOf = strictIndexOf$1;

var baseFindIndex = _baseFindIndex,
    baseIsNaN = _baseIsNaN,
    strictIndexOf = _strictIndexOf;

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf$1(array, value, fromIndex) {
  return value === value
    ? strictIndexOf(array, value, fromIndex)
    : baseFindIndex(array, baseIsNaN, fromIndex);
}

var _baseIndexOf = baseIndexOf$1;

var baseIndexOf = _baseIndexOf;

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes$3(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

var _arrayIncludes = arrayIncludes$3;

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */

function arrayIncludesWith$3(array, value, comparator) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

var _arrayIncludesWith = arrayIncludesWith$3;

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */

function arrayMap$3(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

var _arrayMap = arrayMap$3;

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */

function baseUnary$2(func) {
  return function(value) {
    return func(value);
  };
}

var _baseUnary = baseUnary$2;

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */

function cacheHas$3(cache, key) {
  return cache.has(key);
}

var _cacheHas = cacheHas$3;

var SetCache$2 = _SetCache,
    arrayIncludes$2 = _arrayIncludes,
    arrayIncludesWith$2 = _arrayIncludesWith,
    arrayMap$2 = _arrayMap,
    baseUnary$1 = _baseUnary,
    cacheHas$2 = _cacheHas;

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE$1 = 200;

/**
 * The base implementation of methods like `_.difference` without support
 * for excluding multiple arrays or iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Array} values The values to exclude.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of filtered values.
 */
function baseDifference$2(array, values, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes$2,
      isCommon = true,
      length = array.length,
      result = [],
      valuesLength = values.length;

  if (!length) {
    return result;
  }
  if (iteratee) {
    values = arrayMap$2(values, baseUnary$1(iteratee));
  }
  if (comparator) {
    includes = arrayIncludesWith$2;
    isCommon = false;
  }
  else if (values.length >= LARGE_ARRAY_SIZE$1) {
    includes = cacheHas$2;
    isCommon = false;
    values = new SetCache$2(values);
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee == null ? value : iteratee(value);

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var valuesIndex = valuesLength;
      while (valuesIndex--) {
        if (values[valuesIndex] === computed) {
          continue outer;
        }
      }
      result.push(value);
    }
    else if (!includes(values, computed, comparator)) {
      result.push(value);
    }
  }
  return result;
}

var _baseDifference = baseDifference$2;

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */

function identity$2(value) {
  return value;
}

var identity_1 = identity$2;

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */

function apply$1(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

var _apply = apply$1;

var apply = _apply;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest$1(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

var _overRest = overRest$1;

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */

function constant$1(value) {
  return function() {
    return value;
  };
}

var constant_1 = constant$1;

var getNative$1 = _getNative;

var defineProperty$1 = (function() {
  try {
    var func = getNative$1(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

var _defineProperty = defineProperty$1;

var constant = constant_1,
    defineProperty = _defineProperty,
    identity$1 = identity_1;

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString$1 = !defineProperty ? identity$1 : function(func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

var _baseSetToString = baseSetToString$1;

/** Used to detect hot functions by number of calls within a span of milliseconds. */

var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut$1(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

var _shortOut = shortOut$1;

var baseSetToString = _baseSetToString,
    shortOut = _shortOut;

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString$1 = shortOut(baseSetToString);

var _setToString = setToString$1;

var identity = identity_1,
    overRest = _overRest,
    setToString = _setToString;

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest$3(func, start) {
  return setToString(overRest(func, start, identity), func + '');
}

var _baseRest = baseRest$3;

/** Used as references for various `Number` constants. */

var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength$1(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

var isLength_1 = isLength$1;

var isFunction = isFunction_1,
    isLength = isLength_1;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike$1(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

var isArrayLike_1 = isArrayLike$1;

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

function isObjectLike$5(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1$1 = isObjectLike$5;

var isArrayLike = isArrayLike_1,
    isObjectLike$4 = isObjectLike_1$1;

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject$3(value) {
  return isObjectLike$4(value) && isArrayLike(value);
}

var isArrayLikeObject_1 = isArrayLikeObject$3;

var baseDifference$1 = _baseDifference,
    baseRest$2 = _baseRest,
    isArrayLikeObject$2 = isArrayLikeObject_1;

/**
 * Creates an array excluding all given values using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * **Note:** Unlike `_.pull`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {...*} [values] The values to exclude.
 * @returns {Array} Returns the new array of filtered values.
 * @see _.difference, _.xor
 * @example
 *
 * _.without([2, 1, 2, 3], 1, 2);
 * // => [3]
 */
var without = baseRest$2(function(array, values) {
  return isArrayLikeObject$2(array)
    ? baseDifference$1(array, values)
    : [];
});

var without_1 = without;

var registry = {};

Object.defineProperty(registry, "__esModule", {
	value: true
});
registry.addSource = addSource;
registry.addTarget = addTarget;
registry.removeSource = removeSource;
registry.removeTarget = removeTarget;
var ADD_SOURCE = registry.ADD_SOURCE = 'dnd-core/ADD_SOURCE';
var ADD_TARGET = registry.ADD_TARGET = 'dnd-core/ADD_TARGET';
var REMOVE_SOURCE = registry.REMOVE_SOURCE = 'dnd-core/REMOVE_SOURCE';
var REMOVE_TARGET = registry.REMOVE_TARGET = 'dnd-core/REMOVE_TARGET';

function addSource(sourceId) {
	return {
		type: ADD_SOURCE,
		sourceId: sourceId
	};
}

function addTarget(targetId) {
	return {
		type: ADD_TARGET,
		targetId: targetId
	};
}

function removeSource(sourceId) {
	return {
		type: REMOVE_SOURCE,
		sourceId: sourceId
	};
}

function removeTarget(targetId) {
	return {
		type: REMOVE_TARGET,
		targetId: targetId
	};
}

Object.defineProperty(dragOperation$1, "__esModule", {
	value: true
});

var _extends$3 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

dragOperation$1.default = dragOperation;

var _without = without_1;

var _without2 = _interopRequireDefault$n(_without);

var _dragDrop$2 = dragDrop;

var _registry$3 = registry;

function _interopRequireDefault$n(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = {
	itemType: null,
	item: null,
	sourceId: null,
	targetIds: [],
	dropResult: null,
	didDrop: false,
	isSourcePublic: null
};

function dragOperation() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
	var action = arguments[1];

	switch (action.type) {
		case _dragDrop$2.BEGIN_DRAG:
			return _extends$3({}, state, {
				itemType: action.itemType,
				item: action.item,
				sourceId: action.sourceId,
				isSourcePublic: action.isSourcePublic,
				dropResult: null,
				didDrop: false
			});
		case _dragDrop$2.PUBLISH_DRAG_SOURCE:
			return _extends$3({}, state, {
				isSourcePublic: true
			});
		case _dragDrop$2.HOVER:
			return _extends$3({}, state, {
				targetIds: action.targetIds
			});
		case _registry$3.REMOVE_TARGET:
			if (state.targetIds.indexOf(action.targetId) === -1) {
				return state;
			}
			return _extends$3({}, state, {
				targetIds: (0, _without2.default)(state.targetIds, action.targetId)
			});
		case _dragDrop$2.DROP:
			return _extends$3({}, state, {
				dropResult: action.dropResult,
				didDrop: true,
				targetIds: []
			});
		case _dragDrop$2.END_DRAG:
			return _extends$3({}, state, {
				itemType: null,
				item: null,
				sourceId: null,
				dropResult: null,
				didDrop: false,
				isSourcePublic: null,
				targetIds: []
			});
		default:
			return state;
	}
}

var refCount$1 = {};

Object.defineProperty(refCount$1, "__esModule", {
	value: true
});
refCount$1.default = refCount;

var _registry$2 = registry;

function refCount() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	var action = arguments[1];

	switch (action.type) {
		case _registry$2.ADD_SOURCE:
		case _registry$2.ADD_TARGET:
			return state + 1;
		case _registry$2.REMOVE_SOURCE:
		case _registry$2.REMOVE_TARGET:
			return state - 1;
		default:
			return state;
	}
}

var dirtyHandlerIds$1 = {};

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */

function arrayFilter$1(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

var _arrayFilter = arrayFilter$1;

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */

function arrayPush$1(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

var _arrayPush = arrayPush$1;

var baseGetTag$2 = _baseGetTag$1,
    isObjectLike$3 = isObjectLike_1$1;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments$1(value) {
  return isObjectLike$3(value) && baseGetTag$2(value) == argsTag;
}

var _baseIsArguments = baseIsArguments$1;

var baseIsArguments = _baseIsArguments,
    isObjectLike$2 = isObjectLike_1$1;

/** Used for built-in method references. */
var objectProto$3 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$3.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments$1 = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike$2(value) && hasOwnProperty$2.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

var isArguments_1 = isArguments$1;

var Symbol$4 = _Symbol$1,
    isArguments = isArguments_1,
    isArray$1 = isArray_1$1;

/** Built-in value references. */
var spreadableSymbol = Symbol$4 ? Symbol$4.isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable$1(value) {
  return isArray$1(value) || isArguments(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

var _isFlattenable = isFlattenable$1;

var arrayPush = _arrayPush,
    isFlattenable = _isFlattenable;

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten$1(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten$1(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

var _baseFlatten = baseFlatten$1;

var getNative = _getNative,
    root$2 = _root$1;

/* Built-in method references that are verified to be native. */
var Set$2 = getNative(root$2, 'Set');

var _Set = Set$2;

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */

function noop$1() {
  // No operation performed.
}

var noop_1 = noop$1;

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */

function setToArray$2(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

var _setToArray = setToArray$2;

var Set$1 = _Set,
    noop = noop_1,
    setToArray$1 = _setToArray;

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet$1 = !(Set$1 && (1 / setToArray$1(new Set$1([,-0]))[1]) == INFINITY) ? noop : function(values) {
  return new Set$1(values);
};

var _createSet = createSet$1;

var SetCache$1 = _SetCache,
    arrayIncludes$1 = _arrayIncludes,
    arrayIncludesWith$1 = _arrayIncludesWith,
    cacheHas$1 = _cacheHas,
    createSet = _createSet,
    setToArray = _setToArray;

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq$1(array, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes$1,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith$1;
  }
  else if (length >= LARGE_ARRAY_SIZE) {
    var set = iteratee ? null : createSet(array);
    if (set) {
      return setToArray(set);
    }
    isCommon = false;
    includes = cacheHas$1;
    seen = new SetCache$1;
  }
  else {
    seen = iteratee ? [] : result;
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    }
    else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

var _baseUniq = baseUniq$1;

var baseDifference = _baseDifference,
    baseFlatten = _baseFlatten,
    baseUniq = _baseUniq;

/**
 * The base implementation of methods like `_.xor`, without support for
 * iteratee shorthands, that accepts an array of arrays to inspect.
 *
 * @private
 * @param {Array} arrays The arrays to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of values.
 */
function baseXor$1(arrays, iteratee, comparator) {
  var length = arrays.length;
  if (length < 2) {
    return length ? baseUniq(arrays[0]) : [];
  }
  var index = -1,
      result = Array(length);

  while (++index < length) {
    var array = arrays[index],
        othIndex = -1;

    while (++othIndex < length) {
      if (othIndex != index) {
        result[index] = baseDifference(result[index] || array, arrays[othIndex], iteratee, comparator);
      }
    }
  }
  return baseUniq(baseFlatten(result, 1), iteratee, comparator);
}

var _baseXor = baseXor$1;

var arrayFilter = _arrayFilter,
    baseRest$1 = _baseRest,
    baseXor = _baseXor,
    isArrayLikeObject$1 = isArrayLikeObject_1;

/**
 * Creates an array of unique values that is the
 * [symmetric difference](https://en.wikipedia.org/wiki/Symmetric_difference)
 * of the given arrays. The order of result values is determined by the order
 * they occur in the arrays.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of filtered values.
 * @see _.difference, _.without
 * @example
 *
 * _.xor([2, 1], [2, 3]);
 * // => [1, 3]
 */
var xor = baseRest$1(function(arrays) {
  return baseXor(arrayFilter(arrays, isArrayLikeObject$1));
});

var xor_1 = xor;

var SetCache = _SetCache,
    arrayIncludes = _arrayIncludes,
    arrayIncludesWith = _arrayIncludesWith,
    arrayMap$1 = _arrayMap,
    baseUnary = _baseUnary,
    cacheHas = _cacheHas;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min;

/**
 * The base implementation of methods like `_.intersection`, without support
 * for iteratee shorthands, that accepts an array of arrays to inspect.
 *
 * @private
 * @param {Array} arrays The arrays to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of shared values.
 */
function baseIntersection$1(arrays, iteratee, comparator) {
  var includes = comparator ? arrayIncludesWith : arrayIncludes,
      length = arrays[0].length,
      othLength = arrays.length,
      othIndex = othLength,
      caches = Array(othLength),
      maxLength = Infinity,
      result = [];

  while (othIndex--) {
    var array = arrays[othIndex];
    if (othIndex && iteratee) {
      array = arrayMap$1(array, baseUnary(iteratee));
    }
    maxLength = nativeMin(array.length, maxLength);
    caches[othIndex] = !comparator && (iteratee || (length >= 120 && array.length >= 120))
      ? new SetCache(othIndex && array)
      : undefined;
  }
  array = arrays[0];

  var index = -1,
      seen = caches[0];

  outer:
  while (++index < length && result.length < maxLength) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (!(seen
          ? cacheHas(seen, computed)
          : includes(result, computed, comparator)
        )) {
      othIndex = othLength;
      while (--othIndex) {
        var cache = caches[othIndex];
        if (!(cache
              ? cacheHas(cache, computed)
              : includes(arrays[othIndex], computed, comparator))
            ) {
          continue outer;
        }
      }
      if (seen) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

var _baseIntersection = baseIntersection$1;

var isArrayLikeObject = isArrayLikeObject_1;

/**
 * Casts `value` to an empty array if it's not an array like object.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array|Object} Returns the cast array-like object.
 */
function castArrayLikeObject$1(value) {
  return isArrayLikeObject(value) ? value : [];
}

var _castArrayLikeObject = castArrayLikeObject$1;

var arrayMap = _arrayMap,
    baseIntersection = _baseIntersection,
    baseRest = _baseRest,
    castArrayLikeObject = _castArrayLikeObject;

/**
 * Creates an array of unique values that are included in all given arrays
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons. The order and references of result values are
 * determined by the first array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of intersecting values.
 * @example
 *
 * _.intersection([2, 1], [2, 3]);
 * // => [2]
 */
var intersection = baseRest(function(arrays) {
  var mapped = arrayMap(arrays, castArrayLikeObject);
  return (mapped.length && mapped[0] === arrays[0])
    ? baseIntersection(mapped)
    : [];
});

var intersection_1 = intersection;

Object.defineProperty(dirtyHandlerIds$1, "__esModule", {
	value: true
});
dirtyHandlerIds$1.default = dirtyHandlerIds;
dirtyHandlerIds$1.areDirty = areDirty;

var _xor = xor_1;

var _xor2 = _interopRequireDefault$m(_xor);

var _intersection = intersection_1;

var _intersection2 = _interopRequireDefault$m(_intersection);

var _dragDrop$1 = dragDrop;

var _registry$1 = registry;

function _interopRequireDefault$m(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NONE = [];
var ALL = [];

function dirtyHandlerIds() {
	var action = arguments[1];
	var dragOperation = arguments[2];

	switch (action.type) {
		case _dragDrop$1.HOVER:
			break;
		case _registry$1.ADD_SOURCE:
		case _registry$1.ADD_TARGET:
		case _registry$1.REMOVE_TARGET:
		case _registry$1.REMOVE_SOURCE:
			return NONE;
		case _dragDrop$1.BEGIN_DRAG:
		case _dragDrop$1.PUBLISH_DRAG_SOURCE:
		case _dragDrop$1.END_DRAG:
		case _dragDrop$1.DROP:
		default:
			return ALL;
	}

	var targetIds = action.targetIds;
	var prevTargetIds = dragOperation.targetIds;

	var result = (0, _xor2.default)(targetIds, prevTargetIds);

	var didChange = false;
	if (result.length === 0) {
		for (var i = 0; i < targetIds.length; i++) {
			if (targetIds[i] !== prevTargetIds[i]) {
				didChange = true;
				break;
			}
		}
	} else {
		didChange = true;
	}

	if (!didChange) {
		return NONE;
	}

	var prevInnermostTargetId = prevTargetIds[prevTargetIds.length - 1];
	var innermostTargetId = targetIds[targetIds.length - 1];

	if (prevInnermostTargetId !== innermostTargetId) {
		if (prevInnermostTargetId) {
			result.push(prevInnermostTargetId);
		}
		if (innermostTargetId) {
			result.push(innermostTargetId);
		}
	}

	return result;
}

function areDirty(state, handlerIds) {
	if (state === NONE) {
		return false;
	}

	if (state === ALL || typeof handlerIds === 'undefined') {
		return true;
	}

	return (0, _intersection2.default)(handlerIds, state).length > 0;
}

var stateId$1 = {};

Object.defineProperty(stateId$1, "__esModule", {
	value: true
});
stateId$1.default = stateId;
function stateId() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

	return state + 1;
}

Object.defineProperty(reducers, "__esModule", {
	value: true
});
reducers.default = reduce;

var _dragOffset$1 = dragOffset$1;

var _dragOffset2 = _interopRequireDefault$l(_dragOffset$1);

var _dragOperation = dragOperation$1;

var _dragOperation2 = _interopRequireDefault$l(_dragOperation);

var _refCount = refCount$1;

var _refCount2 = _interopRequireDefault$l(_refCount);

var _dirtyHandlerIds$1 = dirtyHandlerIds$1;

var _dirtyHandlerIds2 = _interopRequireDefault$l(_dirtyHandlerIds$1);

var _stateId = stateId$1;

var _stateId2 = _interopRequireDefault$l(_stateId);

function _interopRequireDefault$l(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function reduce() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var action = arguments[1];

	return {
		dirtyHandlerIds: (0, _dirtyHandlerIds2.default)(state.dirtyHandlerIds, action, state.dragOperation),
		dragOffset: (0, _dragOffset2.default)(state.dragOffset, action),
		refCount: (0, _refCount2.default)(state.refCount, action),
		dragOperation: (0, _dragOperation2.default)(state.dragOperation, action),
		stateId: (0, _stateId2.default)(state.stateId)
	};
}

var DragDropMonitor$1 = {};

var HandlerRegistry$1 = {};

var domain; // The domain module is executed on demand
var hasSetImmediate = typeof setImmediate === "function";

// Use the fastest means possible to execute a task in its own turn, with
// priority over other events including network IO events in Node.js.
//
// An exception thrown by a task will permanently interrupt the processing of
// subsequent tasks. The higher level `asap` function ensures that if an
// exception is thrown by a task, that the task queue will continue flushing as
// soon as possible, but if you use `rawAsap` directly, you are responsible to
// either ensure that no exceptions are thrown from your task, or to manually
// call `rawAsap.requestFlush` if an exception is thrown.
var raw = rawAsap$1;
function rawAsap$1(task) {
    if (!queue.length) {
        requestFlush();
        flushing = true;
    }
    // Avoids a function call
    queue[queue.length] = task;
}

var queue = [];
// Once a flush has been requested, no further calls to `requestFlush` are
// necessary until the next `flush` completes.
var flushing = false;
// The position of the next task to execute in the task queue. This is
// preserved between calls to `flush` so that it can be resumed if
// a task throws an exception.
var index = 0;
// If a task schedules additional tasks recursively, the task queue can grow
// unbounded. To prevent memory excaustion, the task queue will periodically
// truncate already-completed tasks.
var capacity = 1024;

// The flush function processes all tasks that have been scheduled with
// `rawAsap` unless and until one of those tasks throws an exception.
// If a task throws an exception, `flush` ensures that its state will remain
// consistent and will resume where it left off when called again.
// However, `flush` does not make any arrangements to be called again if an
// exception is thrown.
function flush() {
    while (index < queue.length) {
        var currentIndex = index;
        // Advance the index before calling the task. This ensures that we will
        // begin flushing on the next task the task throws an error.
        index = index + 1;
        queue[currentIndex].call();
        // Prevent leaking memory for long chains of recursive calls to `asap`.
        // If we call `asap` within tasks scheduled by `asap`, the queue will
        // grow, but to avoid an O(n) walk for every task we execute, we don't
        // shift tasks off the queue after they have been executed.
        // Instead, we periodically shift 1024 tasks off the queue.
        if (index > capacity) {
            // Manually shift all values starting at the index back to the
            // beginning of the queue.
            for (var scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
                queue[scan] = queue[scan + index];
            }
            queue.length -= index;
            index = 0;
        }
    }
    queue.length = 0;
    index = 0;
    flushing = false;
}

rawAsap$1.requestFlush = requestFlush;
function requestFlush() {
    // Ensure flushing is not bound to any domain.
    // It is not sufficient to exit the domain, because domains exist on a stack.
    // To execute code outside of any domain, the following dance is necessary.
    var parentDomain = process.domain;
    if (parentDomain) {
        if (!domain) {
            // Lazy execute the domain module.
            // Only employed if the user elects to use domains.
            domain = require$$0;
        }
        domain.active = process.domain = null;
    }

    // `setImmediate` is slower that `process.nextTick`, but `process.nextTick`
    // cannot handle recursion.
    // `requestFlush` will only be called recursively from `asap.js`, to resume
    // flushing after an error is thrown into a domain.
    // Conveniently, `setImmediate` was introduced in the same version
    // `process.nextTick` started throwing recursion errors.
    if (flushing && hasSetImmediate) {
        setImmediate(flush);
    } else {
        process.nextTick(flush);
    }

    if (parentDomain) {
        domain.active = process.domain = parentDomain;
    }
}

var rawAsap = raw;
var freeTasks = [];

/**
 * Calls a task as soon as possible after returning, in its own event, with
 * priority over IO events. An exception thrown in a task can be handled by
 * `process.on("uncaughtException") or `domain.on("error")`, but will otherwise
 * crash the process. If the error is handled, all subsequent tasks will
 * resume.
 *
 * @param {{call}} task A callable object, typically a function that takes no
 * arguments.
 */
var asap_1 = asap;
function asap(task) {
    var rawTask;
    if (freeTasks.length) {
        rawTask = freeTasks.pop();
    } else {
        rawTask = new RawTask();
    }
    rawTask.task = task;
    rawTask.domain = process.domain;
    rawAsap(rawTask);
}

function RawTask() {
    this.task = null;
    this.domain = null;
}

RawTask.prototype.call = function () {
    if (this.domain) {
        this.domain.enter();
    }
    var threw = true;
    try {
        this.task.call();
        threw = false;
        // If the task throws an exception (presumably) Node.js restores the
        // domain stack for the next event.
        if (this.domain) {
            this.domain.exit();
        }
    } finally {
        // We use try/finally and a threw flag to avoid messing up stack traces
        // when we catch and release errors.
        if (threw) {
            // In Node.js, uncaught exceptions are considered fatal errors.
            // Re-throw them to interrupt flushing!
            // Ensure that flushing continues if an uncaught exception is
            // suppressed listening process.on("uncaughtException") or
            // domain.on("error").
            rawAsap.requestFlush();
        }
        // If the task threw an error, we do not want to exit the domain here.
        // Exiting the domain would prevent the domain from catching the error.
        this.task = null;
        this.domain = null;
        freeTasks.push(this);
    }
};

var getNextUniqueId$1 = {};

Object.defineProperty(getNextUniqueId$1, "__esModule", {
	value: true
});
getNextUniqueId$1.default = getNextUniqueId;
var nextUniqueId = 0;

function getNextUniqueId() {
	return nextUniqueId++;
}

Object.defineProperty(HandlerRegistry$1, "__esModule", {
	value: true
});

var _createClass$d = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof$5 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _invariant$b = invariant_1;

var _invariant2$b = _interopRequireDefault$k(_invariant$b);

var _isArray$2 = isArray_1$1;

var _isArray2$2 = _interopRequireDefault$k(_isArray$2);

var _asap = asap_1;

var _asap2 = _interopRequireDefault$k(_asap);

var _registry = registry;

var _getNextUniqueId = getNextUniqueId$1;

var _getNextUniqueId2 = _interopRequireDefault$k(_getNextUniqueId);

function _interopRequireDefault$k(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck$d(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HandlerRoles = {
	SOURCE: 'SOURCE',
	TARGET: 'TARGET'
};

function validateSourceContract(source) {
	(0, _invariant2$b.default)(typeof source.canDrag === 'function', 'Expected canDrag to be a function.');
	(0, _invariant2$b.default)(typeof source.beginDrag === 'function', 'Expected beginDrag to be a function.');
	(0, _invariant2$b.default)(typeof source.endDrag === 'function', 'Expected endDrag to be a function.');
}

function validateTargetContract(target) {
	(0, _invariant2$b.default)(typeof target.canDrop === 'function', 'Expected canDrop to be a function.');
	(0, _invariant2$b.default)(typeof target.hover === 'function', 'Expected hover to be a function.');
	(0, _invariant2$b.default)(typeof target.drop === 'function', 'Expected beginDrag to be a function.');
}

function validateType(type, allowArray) {
	if (allowArray && (0, _isArray2$2.default)(type)) {
		type.forEach(function (t) {
			return validateType(t, false);
		});
		return;
	}

	(0, _invariant2$b.default)(typeof type === 'string' || (typeof type === 'undefined' ? 'undefined' : _typeof$5(type)) === 'symbol', allowArray ? 'Type can only be a string, a symbol, or an array of either.' : 'Type can only be a string or a symbol.');
}

function getNextHandlerId(role) {
	var id = (0, _getNextUniqueId2.default)().toString();
	switch (role) {
		case HandlerRoles.SOURCE:
			return 'S' + id;
		case HandlerRoles.TARGET:
			return 'T' + id;
		default:
			(0, _invariant2$b.default)(false, 'Unknown role: ' + role);
	}
}

function parseRoleFromHandlerId(handlerId) {
	switch (handlerId[0]) {
		case 'S':
			return HandlerRoles.SOURCE;
		case 'T':
			return HandlerRoles.TARGET;
		default:
			(0, _invariant2$b.default)(false, 'Cannot parse handler ID: ' + handlerId);
	}
}

var HandlerRegistry = function () {
	function HandlerRegistry(store) {
		_classCallCheck$d(this, HandlerRegistry);

		this.store = store;

		this.types = {};
		this.handlers = {};

		this.pinnedSourceId = null;
		this.pinnedSource = null;
	}

	_createClass$d(HandlerRegistry, [{
		key: 'addSource',
		value: function addSource(type, source) {
			validateType(type);
			validateSourceContract(source);

			var sourceId = this.addHandler(HandlerRoles.SOURCE, type, source);
			this.store.dispatch((0, _registry.addSource)(sourceId));
			return sourceId;
		}
	}, {
		key: 'addTarget',
		value: function addTarget(type, target) {
			validateType(type, true);
			validateTargetContract(target);

			var targetId = this.addHandler(HandlerRoles.TARGET, type, target);
			this.store.dispatch((0, _registry.addTarget)(targetId));
			return targetId;
		}
	}, {
		key: 'addHandler',
		value: function addHandler(role, type, handler) {
			var id = getNextHandlerId(role);
			this.types[id] = type;
			this.handlers[id] = handler;

			return id;
		}
	}, {
		key: 'containsHandler',
		value: function containsHandler(handler) {
			var _this = this;

			return Object.keys(this.handlers).some(function (key) {
				return _this.handlers[key] === handler;
			});
		}
	}, {
		key: 'getSource',
		value: function getSource(sourceId, includePinned) {
			(0, _invariant2$b.default)(this.isSourceId(sourceId), 'Expected a valid source ID.');

			var isPinned = includePinned && sourceId === this.pinnedSourceId;
			var source = isPinned ? this.pinnedSource : this.handlers[sourceId];

			return source;
		}
	}, {
		key: 'getTarget',
		value: function getTarget(targetId) {
			(0, _invariant2$b.default)(this.isTargetId(targetId), 'Expected a valid target ID.');
			return this.handlers[targetId];
		}
	}, {
		key: 'getSourceType',
		value: function getSourceType(sourceId) {
			(0, _invariant2$b.default)(this.isSourceId(sourceId), 'Expected a valid source ID.');
			return this.types[sourceId];
		}
	}, {
		key: 'getTargetType',
		value: function getTargetType(targetId) {
			(0, _invariant2$b.default)(this.isTargetId(targetId), 'Expected a valid target ID.');
			return this.types[targetId];
		}
	}, {
		key: 'isSourceId',
		value: function isSourceId(handlerId) {
			var role = parseRoleFromHandlerId(handlerId);
			return role === HandlerRoles.SOURCE;
		}
	}, {
		key: 'isTargetId',
		value: function isTargetId(handlerId) {
			var role = parseRoleFromHandlerId(handlerId);
			return role === HandlerRoles.TARGET;
		}
	}, {
		key: 'removeSource',
		value: function removeSource(sourceId) {
			var _this2 = this;

			(0, _invariant2$b.default)(this.getSource(sourceId), 'Expected an existing source.');
			this.store.dispatch((0, _registry.removeSource)(sourceId));

			(0, _asap2.default)(function () {
				delete _this2.handlers[sourceId];
				delete _this2.types[sourceId];
			});
		}
	}, {
		key: 'removeTarget',
		value: function removeTarget(targetId) {
			var _this3 = this;

			(0, _invariant2$b.default)(this.getTarget(targetId), 'Expected an existing target.');
			this.store.dispatch((0, _registry.removeTarget)(targetId));

			(0, _asap2.default)(function () {
				delete _this3.handlers[targetId];
				delete _this3.types[targetId];
			});
		}
	}, {
		key: 'pinSource',
		value: function pinSource(sourceId) {
			var source = this.getSource(sourceId);
			(0, _invariant2$b.default)(source, 'Expected an existing source.');

			this.pinnedSourceId = sourceId;
			this.pinnedSource = source;
		}
	}, {
		key: 'unpinSource',
		value: function unpinSource() {
			(0, _invariant2$b.default)(this.pinnedSource, 'No source is pinned at the time.');

			this.pinnedSourceId = null;
			this.pinnedSource = null;
		}
	}]);

	return HandlerRegistry;
}();

HandlerRegistry$1.default = HandlerRegistry;

Object.defineProperty(DragDropMonitor$1, "__esModule", {
	value: true
});

var _createClass$c = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _invariant$a = invariant_1;

var _invariant2$a = _interopRequireDefault$j(_invariant$a);

var _isArray$1 = isArray_1$1;

var _isArray2$1 = _interopRequireDefault$j(_isArray$1);

var _matchesType = matchesType$1;

var _matchesType2 = _interopRequireDefault$j(_matchesType);

var _HandlerRegistry = HandlerRegistry$1;

var _HandlerRegistry2 = _interopRequireDefault$j(_HandlerRegistry);

var _dragOffset = dragOffset$1;

var _dirtyHandlerIds = dirtyHandlerIds$1;

function _interopRequireDefault$j(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck$c(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DragDropMonitor = function () {
	function DragDropMonitor(store) {
		_classCallCheck$c(this, DragDropMonitor);

		this.store = store;
		this.registry = new _HandlerRegistry2.default(store);
	}

	_createClass$c(DragDropMonitor, [{
		key: 'subscribeToStateChange',
		value: function subscribeToStateChange(listener) {
			var _this = this;

			var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			var handlerIds = options.handlerIds;

			(0, _invariant2$a.default)(typeof listener === 'function', 'listener must be a function.');
			(0, _invariant2$a.default)(typeof handlerIds === 'undefined' || (0, _isArray2$1.default)(handlerIds), 'handlerIds, when specified, must be an array of strings.');

			var prevStateId = this.store.getState().stateId;
			var handleChange = function handleChange() {
				var state = _this.store.getState();
				var currentStateId = state.stateId;
				try {
					var canSkipListener = currentStateId === prevStateId || currentStateId === prevStateId + 1 && !(0, _dirtyHandlerIds.areDirty)(state.dirtyHandlerIds, handlerIds);

					if (!canSkipListener) {
						listener();
					}
				} finally {
					prevStateId = currentStateId;
				}
			};

			return this.store.subscribe(handleChange);
		}
	}, {
		key: 'subscribeToOffsetChange',
		value: function subscribeToOffsetChange(listener) {
			var _this2 = this;

			(0, _invariant2$a.default)(typeof listener === 'function', 'listener must be a function.');

			var previousState = this.store.getState().dragOffset;
			var handleChange = function handleChange() {
				var nextState = _this2.store.getState().dragOffset;
				if (nextState === previousState) {
					return;
				}

				previousState = nextState;
				listener();
			};

			return this.store.subscribe(handleChange);
		}
	}, {
		key: 'canDragSource',
		value: function canDragSource(sourceId) {
			var source = this.registry.getSource(sourceId);
			(0, _invariant2$a.default)(source, 'Expected to find a valid source.');

			if (this.isDragging()) {
				return false;
			}

			return source.canDrag(this, sourceId);
		}
	}, {
		key: 'canDropOnTarget',
		value: function canDropOnTarget(targetId) {
			var target = this.registry.getTarget(targetId);
			(0, _invariant2$a.default)(target, 'Expected to find a valid target.');

			if (!this.isDragging() || this.didDrop()) {
				return false;
			}

			var targetType = this.registry.getTargetType(targetId);
			var draggedItemType = this.getItemType();
			return (0, _matchesType2.default)(targetType, draggedItemType) && target.canDrop(this, targetId);
		}
	}, {
		key: 'isDragging',
		value: function isDragging() {
			return Boolean(this.getItemType());
		}
	}, {
		key: 'isDraggingSource',
		value: function isDraggingSource(sourceId) {
			var source = this.registry.getSource(sourceId, true);
			(0, _invariant2$a.default)(source, 'Expected to find a valid source.');

			if (!this.isDragging() || !this.isSourcePublic()) {
				return false;
			}

			var sourceType = this.registry.getSourceType(sourceId);
			var draggedItemType = this.getItemType();
			if (sourceType !== draggedItemType) {
				return false;
			}

			return source.isDragging(this, sourceId);
		}
	}, {
		key: 'isOverTarget',
		value: function isOverTarget(targetId) {
			var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { shallow: false };
			var shallow = options.shallow;

			if (!this.isDragging()) {
				return false;
			}

			var targetType = this.registry.getTargetType(targetId);
			var draggedItemType = this.getItemType();
			if (!(0, _matchesType2.default)(targetType, draggedItemType)) {
				return false;
			}

			var targetIds = this.getTargetIds();
			if (!targetIds.length) {
				return false;
			}

			var index = targetIds.indexOf(targetId);
			if (shallow) {
				return index === targetIds.length - 1;
			} else {
				return index > -1;
			}
		}
	}, {
		key: 'getItemType',
		value: function getItemType() {
			return this.store.getState().dragOperation.itemType;
		}
	}, {
		key: 'getItem',
		value: function getItem() {
			return this.store.getState().dragOperation.item;
		}
	}, {
		key: 'getSourceId',
		value: function getSourceId() {
			return this.store.getState().dragOperation.sourceId;
		}
	}, {
		key: 'getTargetIds',
		value: function getTargetIds() {
			return this.store.getState().dragOperation.targetIds;
		}
	}, {
		key: 'getDropResult',
		value: function getDropResult() {
			return this.store.getState().dragOperation.dropResult;
		}
	}, {
		key: 'didDrop',
		value: function didDrop() {
			return this.store.getState().dragOperation.didDrop;
		}
	}, {
		key: 'isSourcePublic',
		value: function isSourcePublic() {
			return this.store.getState().dragOperation.isSourcePublic;
		}
	}, {
		key: 'getInitialClientOffset',
		value: function getInitialClientOffset() {
			return this.store.getState().dragOffset.initialClientOffset;
		}
	}, {
		key: 'getInitialSourceClientOffset',
		value: function getInitialSourceClientOffset() {
			return this.store.getState().dragOffset.initialSourceClientOffset;
		}
	}, {
		key: 'getClientOffset',
		value: function getClientOffset() {
			return this.store.getState().dragOffset.clientOffset;
		}
	}, {
		key: 'getSourceClientOffset',
		value: function getSourceClientOffset() {
			return (0, _dragOffset.getSourceClientOffset)(this.store.getState().dragOffset);
		}
	}, {
		key: 'getDifferenceFromInitialOffset',
		value: function getDifferenceFromInitialOffset() {
			return (0, _dragOffset.getDifferenceFromInitialOffset)(this.store.getState().dragOffset);
		}
	}]);

	return DragDropMonitor;
}();

DragDropMonitor$1.default = DragDropMonitor;

Object.defineProperty(DragDropManager$1, "__esModule", {
	value: true
});

var _createClass$b = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _createStore = createStore;

var _createStore2 = _interopRequireDefault$i(_createStore);

var _reducers = reducers;

var _reducers2 = _interopRequireDefault$i(_reducers);

var _dragDrop = dragDrop;

var dragDropActions = _interopRequireWildcard(_dragDrop);

var _DragDropMonitor = DragDropMonitor$1;

var _DragDropMonitor2 = _interopRequireDefault$i(_DragDropMonitor);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault$i(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck$b(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DragDropManager = function () {
	function DragDropManager(createBackend) {
		var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		_classCallCheck$b(this, DragDropManager);

		var store = (0, _createStore2.default)(_reducers2.default);
		this.context = context;
		this.store = store;
		this.monitor = new _DragDropMonitor2.default(store);
		this.registry = this.monitor.registry;
		this.backend = createBackend(this);

		store.subscribe(this.handleRefCountChange.bind(this));
	}

	_createClass$b(DragDropManager, [{
		key: 'handleRefCountChange',
		value: function handleRefCountChange() {
			var shouldSetUp = this.store.getState().refCount > 0;
			if (shouldSetUp && !this.isSetUp) {
				this.backend.setup();
				this.isSetUp = true;
			} else if (!shouldSetUp && this.isSetUp) {
				this.backend.teardown();
				this.isSetUp = false;
			}
		}
	}, {
		key: 'getContext',
		value: function getContext() {
			return this.context;
		}
	}, {
		key: 'getMonitor',
		value: function getMonitor() {
			return this.monitor;
		}
	}, {
		key: 'getBackend',
		value: function getBackend() {
			return this.backend;
		}
	}, {
		key: 'getRegistry',
		value: function getRegistry() {
			return this.registry;
		}
	}, {
		key: 'getActions',
		value: function getActions() {
			var manager = this;
			var dispatch = this.store.dispatch;


			function bindActionCreator(actionCreator) {
				return function () {
					for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
						args[_key] = arguments[_key];
					}

					var action = actionCreator.apply(manager, args);
					if (typeof action !== 'undefined') {
						dispatch(action);
					}
				};
			}

			return Object.keys(dragDropActions).filter(function (key) {
				return typeof dragDropActions[key] === 'function';
			}).reduce(function (boundActions, key) {
				var action = dragDropActions[key];
				boundActions[key] = bindActionCreator(action); // eslint-disable-line no-param-reassign
				return boundActions;
			}, {});
		}
	}]);

	return DragDropManager;
}();

DragDropManager$1.default = DragDropManager;

var DragSource$3 = {};

Object.defineProperty(DragSource$3, "__esModule", {
	value: true
});

var _createClass$a = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$a(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DragSource$2 = function () {
	function DragSource() {
		_classCallCheck$a(this, DragSource);
	}

	_createClass$a(DragSource, [{
		key: "canDrag",
		value: function canDrag() {
			return true;
		}
	}, {
		key: "isDragging",
		value: function isDragging(monitor, handle) {
			return handle === monitor.getSourceId();
		}
	}, {
		key: "endDrag",
		value: function endDrag() {}
	}]);

	return DragSource;
}();

DragSource$3.default = DragSource$2;

var DropTarget$3 = {};

Object.defineProperty(DropTarget$3, "__esModule", {
	value: true
});

var _createClass$9 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$9(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DropTarget$2 = function () {
	function DropTarget() {
		_classCallCheck$9(this, DropTarget);
	}

	_createClass$9(DropTarget, [{
		key: "canDrop",
		value: function canDrop() {
			return true;
		}
	}, {
		key: "hover",
		value: function hover() {}
	}, {
		key: "drop",
		value: function drop() {}
	}]);

	return DropTarget;
}();

DropTarget$3.default = DropTarget$2;

var createTestBackend = {};

Object.defineProperty(createTestBackend, "__esModule", {
	value: true
});

var _createClass$8 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

createTestBackend.default = createBackend;

var _noop = noop_1;

var _noop2 = _interopRequireDefault$h(_noop);

function _interopRequireDefault$h(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck$8(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TestBackend = function () {
	function TestBackend(manager) {
		_classCallCheck$8(this, TestBackend);

		this.actions = manager.getActions();
	}

	_createClass$8(TestBackend, [{
		key: 'setup',
		value: function setup() {
			this.didCallSetup = true;
		}
	}, {
		key: 'teardown',
		value: function teardown() {
			this.didCallTeardown = true;
		}
	}, {
		key: 'connectDragSource',
		value: function connectDragSource() {
			return _noop2.default;
		}
	}, {
		key: 'connectDragPreview',
		value: function connectDragPreview() {
			return _noop2.default;
		}
	}, {
		key: 'connectDropTarget',
		value: function connectDropTarget() {
			return _noop2.default;
		}
	}, {
		key: 'simulateBeginDrag',
		value: function simulateBeginDrag(sourceIds, options) {
			this.actions.beginDrag(sourceIds, options);
		}
	}, {
		key: 'simulatePublishDragSource',
		value: function simulatePublishDragSource() {
			this.actions.publishDragSource();
		}
	}, {
		key: 'simulateHover',
		value: function simulateHover(targetIds, options) {
			this.actions.hover(targetIds, options);
		}
	}, {
		key: 'simulateDrop',
		value: function simulateDrop() {
			this.actions.drop();
		}
	}, {
		key: 'simulateEndDrag',
		value: function simulateEndDrag() {
			this.actions.endDrag();
		}
	}]);

	return TestBackend;
}();

function createBackend(manager) {
	return new TestBackend(manager);
}

(function (exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _DragDropManager = DragDropManager$1;

Object.defineProperty(exports, 'DragDropManager', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_DragDropManager).default;
  }
});

var _DragSource = DragSource$3;

Object.defineProperty(exports, 'DragSource', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_DragSource).default;
  }
});

var _DropTarget = DropTarget$3;

Object.defineProperty(exports, 'DropTarget', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_DropTarget).default;
  }
});

var _createTestBackend = createTestBackend;

Object.defineProperty(exports, 'createTestBackend', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_createTestBackend).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
}(lib));

var checkDecoratorArguments$1 = {};

Object.defineProperty(checkDecoratorArguments$1, "__esModule", {
	value: true
});
checkDecoratorArguments$1.default = checkDecoratorArguments;
function checkDecoratorArguments(functionName, signature) {
	{
		for (var i = 0; i < (arguments.length <= 2 ? 0 : arguments.length - 2); i += 1) {
			var arg = arguments.length <= i + 2 ? undefined : arguments[i + 2];
			if (arg && arg.prototype && arg.prototype.render) {
				// eslint-disable-next-line no-console
				console.error('You seem to be applying the arguments in the wrong order. ' + ('It should be ' + functionName + '(' + signature + ')(Component), not the other way around. ') + 'Read more: http://react-dnd.github.io/react-dnd/docs-troubleshooting.html#you-seem-to-be-applying-the-arguments-in-the-wrong-order');
				return;
			}
		}
	}
}

Object.defineProperty(DragDropContext$1, "__esModule", {
	value: true
});
DragDropContext$1.unpackBackendForEs5Users = DragDropContext$1.createChildContext = DragDropContext$1.CHILD_CONTEXT_TYPES = undefined;

var _extends$2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$7 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof$4 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

DragDropContext$1.default = DragDropContext;

var _react$5 = react;

var _react2$2 = _interopRequireDefault$g(_react$5);

var _propTypes$3 = propTypes.exports;

var _propTypes2$3 = _interopRequireDefault$g(_propTypes$3);

var _dndCore = lib;

var _invariant$9 = invariant_1;

var _invariant2$9 = _interopRequireDefault$g(_invariant$9);

var _hoistNonReactStatics$2 = hoistNonReactStatics_cjs;

var _hoistNonReactStatics2$2 = _interopRequireDefault$g(_hoistNonReactStatics$2);

var _checkDecoratorArguments$3 = checkDecoratorArguments$1;

var _checkDecoratorArguments2$3 = _interopRequireDefault$g(_checkDecoratorArguments$3);

function _interopRequireDefault$g(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck$7(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$3(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$3(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CHILD_CONTEXT_TYPES = DragDropContext$1.CHILD_CONTEXT_TYPES = {
	dragDropManager: _propTypes2$3.default.object.isRequired
};

var createChildContext = DragDropContext$1.createChildContext = function createChildContext(backend, context) {
	return {
		dragDropManager: new _dndCore.DragDropManager(backend, context)
	};
};

var unpackBackendForEs5Users = DragDropContext$1.unpackBackendForEs5Users = function unpackBackendForEs5Users(backendOrModule) {
	// Auto-detect ES6 default export for people still using ES5
	var backend = backendOrModule;
	if ((typeof backend === 'undefined' ? 'undefined' : _typeof$4(backend)) === 'object' && typeof backend.default === 'function') {
		backend = backend.default;
	}
	(0, _invariant2$9.default)(typeof backend === 'function', 'Expected the backend to be a function or an ES6 module exporting a default function. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-drag-drop-context.html');
	return backend;
};

function DragDropContext(backendOrModule) {
	_checkDecoratorArguments2$3.default.apply(undefined, ['DragDropContext', 'backend'].concat(Array.prototype.slice.call(arguments))); // eslint-disable-line prefer-rest-params

	var backend = unpackBackendForEs5Users(backendOrModule);
	var childContext = createChildContext(backend);

	return function decorateContext(DecoratedComponent) {
		var _class, _temp;

		var displayName = DecoratedComponent.displayName || DecoratedComponent.name || 'Component';

		var DragDropContextContainer = (_temp = _class = function (_Component) {
			_inherits$3(DragDropContextContainer, _Component);

			function DragDropContextContainer() {
				_classCallCheck$7(this, DragDropContextContainer);

				return _possibleConstructorReturn$3(this, (DragDropContextContainer.__proto__ || Object.getPrototypeOf(DragDropContextContainer)).apply(this, arguments));
			}

			_createClass$7(DragDropContextContainer, [{
				key: 'getDecoratedComponentInstance',
				value: function getDecoratedComponentInstance() {
					(0, _invariant2$9.default)(this.child, 'In order to access an instance of the decorated component it can not be a stateless component.');
					return this.child;
				}
			}, {
				key: 'getManager',
				value: function getManager() {
					return childContext.dragDropManager;
				}
			}, {
				key: 'getChildContext',
				value: function getChildContext() {
					return childContext;
				}
			}, {
				key: 'render',
				value: function render() {
					var _this2 = this;

					return _react2$2.default.createElement(DecoratedComponent, _extends$2({}, this.props, {
						ref: function ref(child) {
							_this2.child = child;
						}
					}));
				}
			}]);

			return DragDropContextContainer;
		}(_react$5.Component), _class.DecoratedComponent = DecoratedComponent, _class.displayName = 'DragDropContext(' + displayName + ')', _class.childContextTypes = CHILD_CONTEXT_TYPES, _temp);


		return (0, _hoistNonReactStatics2$2.default)(DragDropContextContainer, DecoratedComponent);
	};
}

var DragDropContextProvider$1 = {};

Object.defineProperty(DragDropContextProvider$1, "__esModule", {
	value: true
});
DragDropContextProvider$1.default = undefined;

var _createClass$6 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react$4 = react;

var _propTypes$2 = propTypes.exports;

var _propTypes2$2 = _interopRequireDefault$f(_propTypes$2);

var _DragDropContext = DragDropContext$1;

function _interopRequireDefault$f(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck$6(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$2(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$2(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * This class is a React-Component based version of the DragDropContext.
 * This is an alternative to decorating an application component with an ES7 decorator.
 */
var DragDropContextProvider = (_temp = _class = function (_Component) {
	_inherits$2(DragDropContextProvider, _Component);

	function DragDropContextProvider(props, context) {
		_classCallCheck$6(this, DragDropContextProvider);

		/**
   * This property determines which window global to use for creating the DragDropManager.
   * If a window has been injected explicitly via props, that is used first. If it is available
   * as a context value, then use that, otherwise use the browser global.
   */
		var _this = _possibleConstructorReturn$2(this, (DragDropContextProvider.__proto__ || Object.getPrototypeOf(DragDropContextProvider)).call(this, props, context));

		var getWindow = function getWindow() {
			if (props && props.window) {
				return props.window;
			} else if (context && context.window) {
				return context.window;
			} else if (typeof window !== 'undefined') {
				return window;
			}
			return undefined;
		};

		_this.backend = (0, _DragDropContext.unpackBackendForEs5Users)(props.backend);
		_this.childContext = (0, _DragDropContext.createChildContext)(_this.backend, {
			window: getWindow()
		});
		return _this;
	}

	_createClass$6(DragDropContextProvider, [{
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			if (nextProps.backend !== this.props.backend || nextProps.window !== this.props.window) {
				throw new Error('DragDropContextProvider backend and window props must not change.');
			}
		}
	}, {
		key: 'getChildContext',
		value: function getChildContext() {
			return this.childContext;
		}
	}, {
		key: 'render',
		value: function render() {
			return _react$4.Children.only(this.props.children);
		}
	}]);

	return DragDropContextProvider;
}(_react$4.Component), _class.propTypes = {
	backend: _propTypes2$2.default.oneOfType([_propTypes2$2.default.func, _propTypes2$2.default.object]).isRequired,
	children: _propTypes2$2.default.element.isRequired,
	window: _propTypes2$2.default.object // eslint-disable-line react/forbid-prop-types
}, _class.defaultProps = {
	window: undefined
}, _class.childContextTypes = _DragDropContext.CHILD_CONTEXT_TYPES, _class.displayName = 'DragDropContextProvider', _class.contextTypes = {
	window: _propTypes2$2.default.object
}, _temp);
DragDropContextProvider$1.default = DragDropContextProvider;

var DragLayer$1 = {};

/** Detect free variable `global` from Node.js. */

var freeGlobal$1 = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal = freeGlobal$1;

var freeGlobal = _freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root$1 = freeGlobal || freeSelf || Function('return this')();

var _root = root$1;

var root = _root;

/** Built-in value references. */
var Symbol$3 = root.Symbol;

var _Symbol = Symbol$3;

var Symbol$2 = _Symbol;

/** Used for built-in method references. */
var objectProto$2 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$2.toString;

/** Built-in value references. */
var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag$1(value) {
  var isOwn = hasOwnProperty$1.call(value, symToStringTag$1),
      tag = value[symToStringTag$1];

  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}

var _getRawTag = getRawTag$1;

/** Used for built-in method references. */

var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto$1.toString;

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

var _objectToString = objectToString$1;

var Symbol$1 = _Symbol,
    getRawTag = _getRawTag,
    objectToString = _objectToString;

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag$1(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

var _baseGetTag = baseGetTag$1;

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */

function overArg$1(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

var _overArg = overArg$1;

var overArg = _overArg;

/** Built-in value references. */
var getPrototype$1 = overArg(Object.getPrototypeOf, Object);

var _getPrototype = getPrototype$1;

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

function isObjectLike$1(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1 = isObjectLike$1;

var baseGetTag = _baseGetTag,
    getPrototype = _getPrototype,
    isObjectLike = isObjectLike_1;

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

var isPlainObject_1 = isPlainObject;

var shallowEqual$1 = {};

Object.defineProperty(shallowEqual$1, "__esModule", {
	value: true
});
shallowEqual$1.default = shallowEqual;
function shallowEqual(objA, objB) {
	if (objA === objB) {
		return true;
	}

	var keysA = Object.keys(objA);
	var keysB = Object.keys(objB);

	if (keysA.length !== keysB.length) {
		return false;
	}

	// Test for A's keys different from B.
	var hasOwn = Object.prototype.hasOwnProperty;
	for (var i = 0; i < keysA.length; i += 1) {
		if (!hasOwn.call(objB, keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
			return false;
		}

		var valA = objA[keysA[i]];
		var valB = objB[keysA[i]];

		if (valA !== valB) {
			return false;
		}
	}

	return true;
}

var shallowEqualScalar$1 = {};

Object.defineProperty(shallowEqualScalar$1, "__esModule", {
	value: true
});

var _typeof$3 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

shallowEqualScalar$1.default = shallowEqualScalar;
function shallowEqualScalar(objA, objB) {
	if (objA === objB) {
		return true;
	}

	if ((typeof objA === 'undefined' ? 'undefined' : _typeof$3(objA)) !== 'object' || objA === null || (typeof objB === 'undefined' ? 'undefined' : _typeof$3(objB)) !== 'object' || objB === null) {
		return false;
	}

	var keysA = Object.keys(objA);
	var keysB = Object.keys(objB);

	if (keysA.length !== keysB.length) {
		return false;
	}

	// Test for A's keys different from B.
	var hasOwn = Object.prototype.hasOwnProperty;
	for (var i = 0; i < keysA.length; i += 1) {
		if (!hasOwn.call(objB, keysA[i])) {
			return false;
		}

		var valA = objA[keysA[i]];
		var valB = objB[keysA[i]];

		if (valA !== valB || (typeof valA === 'undefined' ? 'undefined' : _typeof$3(valA)) === 'object' || (typeof valB === 'undefined' ? 'undefined' : _typeof$3(valB)) === 'object') {
			return false;
		}
	}

	return true;
}

Object.defineProperty(DragLayer$1, "__esModule", {
	value: true
});

var _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof$2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass$5 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

DragLayer$1.default = DragLayer;

var _react$3 = react;

var _react2$1 = _interopRequireDefault$e(_react$3);

var _propTypes$1 = propTypes.exports;

var _propTypes2$1 = _interopRequireDefault$e(_propTypes$1);

var _hoistNonReactStatics$1 = hoistNonReactStatics_cjs;

var _hoistNonReactStatics2$1 = _interopRequireDefault$e(_hoistNonReactStatics$1);

var _isPlainObject$5 = isPlainObject_1;

var _isPlainObject2$5 = _interopRequireDefault$e(_isPlainObject$5);

var _invariant$8 = invariant_1;

var _invariant2$8 = _interopRequireDefault$e(_invariant$8);

var _shallowEqual$2 = shallowEqual$1;

var _shallowEqual2$2 = _interopRequireDefault$e(_shallowEqual$2);

var _shallowEqualScalar$1 = shallowEqualScalar$1;

var _shallowEqualScalar2$1 = _interopRequireDefault$e(_shallowEqualScalar$1);

var _checkDecoratorArguments$2 = checkDecoratorArguments$1;

var _checkDecoratorArguments2$2 = _interopRequireDefault$e(_checkDecoratorArguments$2);

function _interopRequireDefault$e(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck$5(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$1(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$1(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function DragLayer(collect) {
	var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	_checkDecoratorArguments2$2.default.apply(undefined, ['DragLayer', 'collect[, options]'].concat(Array.prototype.slice.call(arguments))); // eslint-disable-line prefer-rest-params
	(0, _invariant2$8.default)(typeof collect === 'function', 'Expected "collect" provided as the first argument to DragLayer to be a function that collects props to inject into the component. ', 'Instead, received %s. Read more: http://react-dnd.github.io/react-dnd/docs-drag-layer.html', collect);
	(0, _invariant2$8.default)((0, _isPlainObject2$5.default)(options), 'Expected "options" provided as the second argument to DragLayer to be a plain object when specified. ' + 'Instead, received %s. Read more: http://react-dnd.github.io/react-dnd/docs-drag-layer.html', options);

	return function decorateLayer(DecoratedComponent) {
		var _class, _temp;

		var _options$arePropsEqua = options.arePropsEqual,
		    arePropsEqual = _options$arePropsEqua === undefined ? _shallowEqualScalar2$1.default : _options$arePropsEqua;

		var displayName = DecoratedComponent.displayName || DecoratedComponent.name || 'Component';

		var DragLayerContainer = (_temp = _class = function (_Component) {
			_inherits$1(DragLayerContainer, _Component);

			_createClass$5(DragLayerContainer, [{
				key: 'getDecoratedComponentInstance',
				value: function getDecoratedComponentInstance() {
					(0, _invariant2$8.default)(this.child, 'In order to access an instance of the decorated component it can not be a stateless component.');
					return this.child;
				}
			}, {
				key: 'shouldComponentUpdate',
				value: function shouldComponentUpdate(nextProps, nextState) {
					return !arePropsEqual(nextProps, this.props) || !(0, _shallowEqual2$2.default)(nextState, this.state);
				}
			}]);

			function DragLayerContainer(props, context) {
				_classCallCheck$5(this, DragLayerContainer);

				var _this = _possibleConstructorReturn$1(this, (DragLayerContainer.__proto__ || Object.getPrototypeOf(DragLayerContainer)).call(this, props));

				_this.handleChange = _this.handleChange.bind(_this);

				_this.manager = context.dragDropManager;
				(0, _invariant2$8.default)(_typeof$2(_this.manager) === 'object', 'Could not find the drag and drop manager in the context of %s. ' + 'Make sure to wrap the top-level component of your app with DragDropContext. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-troubleshooting.html#could-not-find-the-drag-and-drop-manager-in-the-context', displayName, displayName);

				_this.state = _this.getCurrentState();
				return _this;
			}

			_createClass$5(DragLayerContainer, [{
				key: 'componentDidMount',
				value: function componentDidMount() {
					this.isCurrentlyMounted = true;

					var monitor = this.manager.getMonitor();
					this.unsubscribeFromOffsetChange = monitor.subscribeToOffsetChange(this.handleChange);
					this.unsubscribeFromStateChange = monitor.subscribeToStateChange(this.handleChange);

					this.handleChange();
				}
			}, {
				key: 'componentWillUnmount',
				value: function componentWillUnmount() {
					this.isCurrentlyMounted = false;

					this.unsubscribeFromOffsetChange();
					this.unsubscribeFromStateChange();
				}
			}, {
				key: 'handleChange',
				value: function handleChange() {
					if (!this.isCurrentlyMounted) {
						return;
					}

					var nextState = this.getCurrentState();
					if (!(0, _shallowEqual2$2.default)(nextState, this.state)) {
						this.setState(nextState);
					}
				}
			}, {
				key: 'getCurrentState',
				value: function getCurrentState() {
					var monitor = this.manager.getMonitor();
					return collect(monitor, this.props);
				}
			}, {
				key: 'render',
				value: function render() {
					var _this2 = this;

					return _react2$1.default.createElement(DecoratedComponent, _extends$1({}, this.props, this.state, {
						ref: function ref(child) {
							_this2.child = child;
						}
					}));
				}
			}]);

			return DragLayerContainer;
		}(_react$3.Component), _class.DecoratedComponent = DecoratedComponent, _class.displayName = 'DragLayer(' + displayName + ')', _class.contextTypes = {
			dragDropManager: _propTypes2$1.default.object.isRequired
		}, _temp);


		return (0, _hoistNonReactStatics2$1.default)(DragLayerContainer, DecoratedComponent);
	};
}

var DragSource$1 = {};

var decorateHandler$1 = {};

var modules = {};

var isDisposable = {exports: {}};

(function (module, exports) {

exports.__esModule = true;
exports['default'] = isDisposable;

function isDisposable(obj) {
  return Boolean(obj && typeof obj.dispose === 'function');
}

module.exports = exports['default'];
}(isDisposable, isDisposable.exports));

var Disposable = {exports: {}};

(function (module, exports) {

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var noop = function noop() {};

/**
 * The basic disposable.
 */

var Disposable = (function () {
  _createClass(Disposable, null, [{
    key: "empty",
    value: { dispose: noop },
    enumerable: true
  }]);

  function Disposable(action) {
    _classCallCheck(this, Disposable);

    this.isDisposed = false;
    this.action = action || noop;
  }

  Disposable.prototype.dispose = function dispose() {
    if (!this.isDisposed) {
      this.action.call(null);
      this.isDisposed = true;
    }
  };

  return Disposable;
})();

exports["default"] = Disposable;
module.exports = exports["default"];
}(Disposable, Disposable.exports));

var CompositeDisposable = {exports: {}};

(function (module, exports) {

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _isDisposable = isDisposable.exports;

var _isDisposable2 = _interopRequireDefault(_isDisposable);

/**
 * Represents a group of disposable resources that are disposed together.
 */

var CompositeDisposable = (function () {
  function CompositeDisposable() {
    for (var _len = arguments.length, disposables = Array(_len), _key = 0; _key < _len; _key++) {
      disposables[_key] = arguments[_key];
    }

    _classCallCheck(this, CompositeDisposable);

    if (Array.isArray(disposables[0]) && disposables.length === 1) {
      disposables = disposables[0];
    }

    for (var i = 0; i < disposables.length; i++) {
      if (!_isDisposable2['default'](disposables[i])) {
        throw new Error('Expected a disposable');
      }
    }

    this.disposables = disposables;
    this.isDisposed = false;
  }

  /**
   * Adds a disposable to the CompositeDisposable or disposes the disposable if the CompositeDisposable is disposed.
   * @param {Disposable} item Disposable to add.
   */

  CompositeDisposable.prototype.add = function add(item) {
    if (this.isDisposed) {
      item.dispose();
    } else {
      this.disposables.push(item);
    }
  };

  /**
   * Removes and disposes the first occurrence of a disposable from the CompositeDisposable.
   * @param {Disposable} item Disposable to remove.
   * @returns {Boolean} true if found; false otherwise.
   */

  CompositeDisposable.prototype.remove = function remove(item) {
    if (this.isDisposed) {
      return false;
    }

    var index = this.disposables.indexOf(item);
    if (index === -1) {
      return false;
    }

    this.disposables.splice(index, 1);
    item.dispose();
    return true;
  };

  /**
   * Disposes all disposables in the group and removes them from the group.
   */

  CompositeDisposable.prototype.dispose = function dispose() {
    if (this.isDisposed) {
      return;
    }

    var len = this.disposables.length;
    var currentDisposables = new Array(len);
    for (var i = 0; i < len; i++) {
      currentDisposables[i] = this.disposables[i];
    }

    this.isDisposed = true;
    this.disposables = [];
    this.length = 0;

    for (var i = 0; i < len; i++) {
      currentDisposables[i].dispose();
    }
  };

  return CompositeDisposable;
})();

exports['default'] = CompositeDisposable;
module.exports = exports['default'];
}(CompositeDisposable, CompositeDisposable.exports));

var SerialDisposable = {exports: {}};

(function (module, exports) {

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _isDisposable = isDisposable.exports;

var _isDisposable2 = _interopRequireDefault(_isDisposable);

var SerialDisposable = (function () {
  function SerialDisposable() {
    _classCallCheck(this, SerialDisposable);

    this.isDisposed = false;
    this.current = null;
  }

  /**
   * Gets the underlying disposable.
   * @return The underlying disposable.
   */

  SerialDisposable.prototype.getDisposable = function getDisposable() {
    return this.current;
  };

  /**
   * Sets the underlying disposable.
   * @param {Disposable} value The new underlying disposable.
   */

  SerialDisposable.prototype.setDisposable = function setDisposable() {
    var value = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

    if (value != null && !_isDisposable2['default'](value)) {
      throw new Error('Expected either an empty value or a valid disposable');
    }

    var isDisposed = this.isDisposed;
    var previous = undefined;

    if (!isDisposed) {
      previous = this.current;
      this.current = value;
    }

    if (previous) {
      previous.dispose();
    }

    if (isDisposed && value) {
      value.dispose();
    }
  };

  /**
   * Disposes the underlying disposable as well as all future replacements.
   */

  SerialDisposable.prototype.dispose = function dispose() {
    if (this.isDisposed) {
      return;
    }

    this.isDisposed = true;
    var previous = this.current;
    this.current = null;

    if (previous) {
      previous.dispose();
    }
  };

  return SerialDisposable;
})();

exports['default'] = SerialDisposable;
module.exports = exports['default'];
}(SerialDisposable, SerialDisposable.exports));

modules.__esModule = true;

function _interopRequireDefault$d(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _isDisposable2 = isDisposable.exports;

var _isDisposable3 = _interopRequireDefault$d(_isDisposable2);

modules.isDisposable = _isDisposable3['default'];

var _Disposable2 = Disposable.exports;

var _Disposable3 = _interopRequireDefault$d(_Disposable2);

modules.Disposable = _Disposable3['default'];

var _CompositeDisposable2 = CompositeDisposable.exports;

var _CompositeDisposable3 = _interopRequireDefault$d(_CompositeDisposable2);

modules.CompositeDisposable = _CompositeDisposable3['default'];

var _SerialDisposable2 = SerialDisposable.exports;

var _SerialDisposable3 = _interopRequireDefault$d(_SerialDisposable2);

modules.SerialDisposable = _SerialDisposable3['default'];

Object.defineProperty(decorateHandler$1, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass$4 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

decorateHandler$1.default = decorateHandler;

var _react$2 = react;

var _react2 = _interopRequireDefault$c(_react$2);

var _propTypes = propTypes.exports;

var _propTypes2 = _interopRequireDefault$c(_propTypes);

var _disposables = modules;

var _isPlainObject$4 = isPlainObject_1;

var _isPlainObject2$4 = _interopRequireDefault$c(_isPlainObject$4);

var _invariant$7 = invariant_1;

var _invariant2$7 = _interopRequireDefault$c(_invariant$7);

var _hoistNonReactStatics = hoistNonReactStatics_cjs;

var _hoistNonReactStatics2 = _interopRequireDefault$c(_hoistNonReactStatics);

var _shallowEqual$1 = shallowEqual$1;

var _shallowEqual2$1 = _interopRequireDefault$c(_shallowEqual$1);

var _shallowEqualScalar = shallowEqualScalar$1;

var _shallowEqualScalar2 = _interopRequireDefault$c(_shallowEqualScalar);

function _interopRequireDefault$c(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck$4(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var isClassComponent = function isClassComponent(Comp) {
	return Boolean(Comp && Comp.prototype && typeof Comp.prototype.render === 'function');
};

function decorateHandler(_ref) {
	var _class, _temp;

	var DecoratedComponent = _ref.DecoratedComponent,
	    createHandler = _ref.createHandler,
	    createMonitor = _ref.createMonitor,
	    createConnector = _ref.createConnector,
	    registerHandler = _ref.registerHandler,
	    containerDisplayName = _ref.containerDisplayName,
	    getType = _ref.getType,
	    collect = _ref.collect,
	    options = _ref.options;
	var _options$arePropsEqua = options.arePropsEqual,
	    arePropsEqual = _options$arePropsEqua === undefined ? _shallowEqualScalar2.default : _options$arePropsEqua;

	var displayName = DecoratedComponent.displayName || DecoratedComponent.name || 'Component';

	var DragDropContainer = (_temp = _class = function (_Component) {
		_inherits(DragDropContainer, _Component);

		_createClass$4(DragDropContainer, [{
			key: 'getHandlerId',
			value: function getHandlerId() {
				return this.handlerId;
			}
		}, {
			key: 'getDecoratedComponentInstance',
			value: function getDecoratedComponentInstance() {
				return this.decoratedComponentInstance;
			}
		}, {
			key: 'shouldComponentUpdate',
			value: function shouldComponentUpdate(nextProps, nextState) {
				return !arePropsEqual(nextProps, this.props) || !(0, _shallowEqual2$1.default)(nextState, this.state);
			}
		}]);

		function DragDropContainer(props, context) {
			_classCallCheck$4(this, DragDropContainer);

			var _this = _possibleConstructorReturn(this, (DragDropContainer.__proto__ || Object.getPrototypeOf(DragDropContainer)).call(this, props, context));

			_this.handleChange = _this.handleChange.bind(_this);
			_this.handleChildRef = _this.handleChildRef.bind(_this);

			(0, _invariant2$7.default)(_typeof$1(_this.context.dragDropManager) === 'object', 'Could not find the drag and drop manager in the context of %s. ' + 'Make sure to wrap the top-level component of your app with DragDropContext. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-troubleshooting.html#could-not-find-the-drag-and-drop-manager-in-the-context', displayName, displayName);

			_this.manager = _this.context.dragDropManager;
			_this.handlerMonitor = createMonitor(_this.manager);
			_this.handlerConnector = createConnector(_this.manager.getBackend());
			_this.handler = createHandler(_this.handlerMonitor);

			_this.disposable = new _disposables.SerialDisposable();
			_this.receiveProps(props);
			_this.state = _this.getCurrentState();
			_this.dispose();
			return _this;
		}

		_createClass$4(DragDropContainer, [{
			key: 'componentDidMount',
			value: function componentDidMount() {
				this.isCurrentlyMounted = true;
				this.disposable = new _disposables.SerialDisposable();
				this.currentType = null;
				this.receiveProps(this.props);
				this.handleChange();
			}
		}, {
			key: 'componentWillReceiveProps',
			value: function componentWillReceiveProps(nextProps) {
				if (!arePropsEqual(nextProps, this.props)) {
					this.receiveProps(nextProps);
					this.handleChange();
				}
			}
		}, {
			key: 'componentWillUnmount',
			value: function componentWillUnmount() {
				this.dispose();
				this.isCurrentlyMounted = false;
			}
		}, {
			key: 'receiveProps',
			value: function receiveProps(props) {
				this.handler.receiveProps(props);
				this.receiveType(getType(props));
			}
		}, {
			key: 'receiveType',
			value: function receiveType(type) {
				if (type === this.currentType) {
					return;
				}

				this.currentType = type;

				var _registerHandler = registerHandler(type, this.handler, this.manager),
				    handlerId = _registerHandler.handlerId,
				    unregister = _registerHandler.unregister;

				this.handlerId = handlerId;
				this.handlerMonitor.receiveHandlerId(handlerId);
				this.handlerConnector.receiveHandlerId(handlerId);

				var globalMonitor = this.manager.getMonitor();
				var unsubscribe = globalMonitor.subscribeToStateChange(this.handleChange, { handlerIds: [handlerId] });

				this.disposable.setDisposable(new _disposables.CompositeDisposable(new _disposables.Disposable(unsubscribe), new _disposables.Disposable(unregister)));
			}
		}, {
			key: 'handleChange',
			value: function handleChange() {
				if (!this.isCurrentlyMounted) {
					return;
				}

				var nextState = this.getCurrentState();
				if (!(0, _shallowEqual2$1.default)(nextState, this.state)) {
					this.setState(nextState);
				}
			}
		}, {
			key: 'dispose',
			value: function dispose() {
				this.disposable.dispose();
				this.handlerConnector.receiveHandlerId(null);
			}
		}, {
			key: 'handleChildRef',
			value: function handleChildRef(component) {
				this.decoratedComponentInstance = component;
				this.handler.receiveComponent(component);
			}
		}, {
			key: 'getCurrentState',
			value: function getCurrentState() {
				var nextState = collect(this.handlerConnector.hooks, this.handlerMonitor);

				{
					(0, _invariant2$7.default)((0, _isPlainObject2$4.default)(nextState), 'Expected `collect` specified as the second argument to ' + '%s for %s to return a plain object of props to inject. ' + 'Instead, received %s.', containerDisplayName, displayName, nextState);
				}

				return nextState;
			}
		}, {
			key: 'render',
			value: function render() {
				return _react2.default.createElement(DecoratedComponent, _extends({}, this.props, this.state, {
					ref: isClassComponent(DecoratedComponent) ? this.handleChildRef : null
				}));
			}
		}]);

		return DragDropContainer;
	}(_react$2.Component), _class.DecoratedComponent = DecoratedComponent, _class.displayName = containerDisplayName + '(' + displayName + ')', _class.contextTypes = {
		dragDropManager: _propTypes2.default.object.isRequired
	}, _temp);


	return (0, _hoistNonReactStatics2.default)(DragDropContainer, DecoratedComponent);
}

var registerSource$1 = {};

Object.defineProperty(registerSource$1, "__esModule", {
	value: true
});
registerSource$1.default = registerSource;
function registerSource(type, source, manager) {
	var registry = manager.getRegistry();
	var sourceId = registry.addSource(type, source);

	function unregisterSource() {
		registry.removeSource(sourceId);
	}

	return {
		handlerId: sourceId,
		unregister: unregisterSource
	};
}

var createSourceFactory$1 = {};

Object.defineProperty(createSourceFactory$1, "__esModule", {
	value: true
});

var _createClass$3 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

createSourceFactory$1.default = createSourceFactory;

var _invariant$6 = invariant_1;

var _invariant2$6 = _interopRequireDefault$b(_invariant$6);

var _isPlainObject$3 = isPlainObject_1;

var _isPlainObject2$3 = _interopRequireDefault$b(_isPlainObject$3);

function _interopRequireDefault$b(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck$3(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ALLOWED_SPEC_METHODS$1 = ['canDrag', 'beginDrag', 'isDragging', 'endDrag'];
var REQUIRED_SPEC_METHODS = ['beginDrag'];

function createSourceFactory(spec) {
	Object.keys(spec).forEach(function (key) {
		(0, _invariant2$6.default)(ALLOWED_SPEC_METHODS$1.indexOf(key) > -1, 'Expected the drag source specification to only have ' + 'some of the following keys: %s. ' + 'Instead received a specification with an unexpected "%s" key. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source.html', ALLOWED_SPEC_METHODS$1.join(', '), key);
		(0, _invariant2$6.default)(typeof spec[key] === 'function', 'Expected %s in the drag source specification to be a function. ' + 'Instead received a specification with %s: %s. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source.html', key, key, spec[key]);
	});
	REQUIRED_SPEC_METHODS.forEach(function (key) {
		(0, _invariant2$6.default)(typeof spec[key] === 'function', 'Expected %s in the drag source specification to be a function. ' + 'Instead received a specification with %s: %s. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source.html', key, key, spec[key]);
	});

	var Source = function () {
		function Source(monitor) {
			_classCallCheck$3(this, Source);

			this.monitor = monitor;
			this.props = null;
			this.component = null;
		}

		_createClass$3(Source, [{
			key: 'receiveProps',
			value: function receiveProps(props) {
				this.props = props;
			}
		}, {
			key: 'receiveComponent',
			value: function receiveComponent(component) {
				this.component = component;
			}
		}, {
			key: 'canDrag',
			value: function canDrag() {
				if (!spec.canDrag) {
					return true;
				}

				return spec.canDrag(this.props, this.monitor);
			}
		}, {
			key: 'isDragging',
			value: function isDragging(globalMonitor, sourceId) {
				if (!spec.isDragging) {
					return sourceId === globalMonitor.getSourceId();
				}

				return spec.isDragging(this.props, this.monitor);
			}
		}, {
			key: 'beginDrag',
			value: function beginDrag() {
				var item = spec.beginDrag(this.props, this.monitor, this.component);
				{
					(0, _invariant2$6.default)((0, _isPlainObject2$3.default)(item), 'beginDrag() must return a plain object that represents the dragged item. ' + 'Instead received %s. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source.html', item);
				}
				return item;
			}
		}, {
			key: 'endDrag',
			value: function endDrag() {
				if (!spec.endDrag) {
					return;
				}

				spec.endDrag(this.props, this.monitor, this.component);
			}
		}]);

		return Source;
	}();

	return function createSource(monitor) {
		return new Source(monitor);
	};
}

var createSourceMonitor$1 = {};

Object.defineProperty(createSourceMonitor$1, "__esModule", {
	value: true
});

var _createClass$2 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

createSourceMonitor$1.default = createSourceMonitor;

var _invariant$5 = invariant_1;

var _invariant2$5 = _interopRequireDefault$a(_invariant$5);

function _interopRequireDefault$a(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var isCallingCanDrag = false;
var isCallingIsDragging = false;

var SourceMonitor = function () {
	function SourceMonitor(manager) {
		_classCallCheck$2(this, SourceMonitor);

		this.internalMonitor = manager.getMonitor();
	}

	_createClass$2(SourceMonitor, [{
		key: 'receiveHandlerId',
		value: function receiveHandlerId(sourceId) {
			this.sourceId = sourceId;
		}
	}, {
		key: 'canDrag',
		value: function canDrag() {
			(0, _invariant2$5.default)(!isCallingCanDrag, 'You may not call monitor.canDrag() inside your canDrag() implementation. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source-monitor.html');

			try {
				isCallingCanDrag = true;
				return this.internalMonitor.canDragSource(this.sourceId);
			} finally {
				isCallingCanDrag = false;
			}
		}
	}, {
		key: 'isDragging',
		value: function isDragging() {
			(0, _invariant2$5.default)(!isCallingIsDragging, 'You may not call monitor.isDragging() inside your isDragging() implementation. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source-monitor.html');

			try {
				isCallingIsDragging = true;
				return this.internalMonitor.isDraggingSource(this.sourceId);
			} finally {
				isCallingIsDragging = false;
			}
		}
	}, {
		key: 'getItemType',
		value: function getItemType() {
			return this.internalMonitor.getItemType();
		}
	}, {
		key: 'getItem',
		value: function getItem() {
			return this.internalMonitor.getItem();
		}
	}, {
		key: 'getDropResult',
		value: function getDropResult() {
			return this.internalMonitor.getDropResult();
		}
	}, {
		key: 'didDrop',
		value: function didDrop() {
			return this.internalMonitor.didDrop();
		}
	}, {
		key: 'getInitialClientOffset',
		value: function getInitialClientOffset() {
			return this.internalMonitor.getInitialClientOffset();
		}
	}, {
		key: 'getInitialSourceClientOffset',
		value: function getInitialSourceClientOffset() {
			return this.internalMonitor.getInitialSourceClientOffset();
		}
	}, {
		key: 'getSourceClientOffset',
		value: function getSourceClientOffset() {
			return this.internalMonitor.getSourceClientOffset();
		}
	}, {
		key: 'getClientOffset',
		value: function getClientOffset() {
			return this.internalMonitor.getClientOffset();
		}
	}, {
		key: 'getDifferenceFromInitialOffset',
		value: function getDifferenceFromInitialOffset() {
			return this.internalMonitor.getDifferenceFromInitialOffset();
		}
	}]);

	return SourceMonitor;
}();

function createSourceMonitor(manager) {
	return new SourceMonitor(manager);
}

var createSourceConnector$1 = {};

var wrapConnectorHooks$1 = {};

var cloneWithRef$1 = {};

Object.defineProperty(cloneWithRef$1, "__esModule", {
	value: true
});
cloneWithRef$1.default = cloneWithRef;

var _invariant$4 = invariant_1;

var _invariant2$4 = _interopRequireDefault$9(_invariant$4);

var _react$1 = react;

function _interopRequireDefault$9(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function cloneWithRef(element, newRef) {
	var previousRef = element.ref;
	(0, _invariant2$4.default)(typeof previousRef !== 'string', 'Cannot connect React DnD to an element with an existing string ref. ' + 'Please convert it to use a callback ref instead, or wrap it into a <span> or <div>. ' + 'Read more: https://facebook.github.io/react/docs/more-about-refs.html#the-ref-callback-attribute');

	if (!previousRef) {
		// When there is no ref on the element, use the new ref directly
		return (0, _react$1.cloneElement)(element, {
			ref: newRef
		});
	}

	return (0, _react$1.cloneElement)(element, {
		ref: function ref(node) {
			newRef(node);

			if (previousRef) {
				previousRef(node);
			}
		}
	});
}

Object.defineProperty(wrapConnectorHooks$1, "__esModule", {
	value: true
});
wrapConnectorHooks$1.default = wrapConnectorHooks;

var _react = react;

var _cloneWithRef = cloneWithRef$1;

var _cloneWithRef2 = _interopRequireDefault$8(_cloneWithRef);

function _interopRequireDefault$8(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function throwIfCompositeComponentElement(element) {
	// Custom components can no longer be wrapped directly in React DnD 2.0
	// so that we don't need to depend on findDOMNode() from react-dom.
	if (typeof element.type === 'string') {
		return;
	}

	var displayName = element.type.displayName || element.type.name || 'the component';

	throw new Error('Only native element nodes can now be passed to React DnD connectors.' + ('You can either wrap ' + displayName + ' into a <div>, or turn it into a ') + 'drag source or a drop target itself.');
}

function wrapHookToRecognizeElement(hook) {
	return function () {
		var elementOrNode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

		// When passed a node, call the hook straight away.
		if (!(0, _react.isValidElement)(elementOrNode)) {
			var node = elementOrNode;
			hook(node, options);
			return undefined;
		}

		// If passed a ReactElement, clone it and attach this function as a ref.
		// This helps us achieve a neat API where user doesn't even know that refs
		// are being used under the hood.
		var element = elementOrNode;
		throwIfCompositeComponentElement(element);

		// When no options are passed, use the hook directly
		var ref = options ? function (node) {
			return hook(node, options);
		} : hook;

		return (0, _cloneWithRef2.default)(element, ref);
	};
}

function wrapConnectorHooks(hooks) {
	var wrappedHooks = {};

	Object.keys(hooks).forEach(function (key) {
		var hook = hooks[key];
		var wrappedHook = wrapHookToRecognizeElement(hook);
		wrappedHooks[key] = function () {
			return wrappedHook;
		};
	});

	return wrappedHooks;
}

var areOptionsEqual$1 = {};

Object.defineProperty(areOptionsEqual$1, "__esModule", {
	value: true
});
areOptionsEqual$1.default = areOptionsEqual;

var _shallowEqual = shallowEqual$1;

var _shallowEqual2 = _interopRequireDefault$7(_shallowEqual);

function _interopRequireDefault$7(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function areOptionsEqual(nextOptions, currentOptions) {
	if (currentOptions === nextOptions) {
		return true;
	}

	return currentOptions !== null && nextOptions !== null && (0, _shallowEqual2.default)(currentOptions, nextOptions);
}

Object.defineProperty(createSourceConnector$1, "__esModule", {
	value: true
});
createSourceConnector$1.default = createSourceConnector;

var _wrapConnectorHooks$1 = wrapConnectorHooks$1;

var _wrapConnectorHooks2$1 = _interopRequireDefault$6(_wrapConnectorHooks$1);

var _areOptionsEqual$1 = areOptionsEqual$1;

var _areOptionsEqual2$1 = _interopRequireDefault$6(_areOptionsEqual$1);

function _interopRequireDefault$6(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createSourceConnector(backend) {
	var currentHandlerId = void 0;

	var currentDragSourceNode = void 0;
	var currentDragSourceOptions = void 0;
	var disconnectCurrentDragSource = void 0;

	var currentDragPreviewNode = void 0;
	var currentDragPreviewOptions = void 0;
	var disconnectCurrentDragPreview = void 0;

	function reconnectDragSource() {
		if (disconnectCurrentDragSource) {
			disconnectCurrentDragSource();
			disconnectCurrentDragSource = null;
		}

		if (currentHandlerId && currentDragSourceNode) {
			disconnectCurrentDragSource = backend.connectDragSource(currentHandlerId, currentDragSourceNode, currentDragSourceOptions);
		}
	}

	function reconnectDragPreview() {
		if (disconnectCurrentDragPreview) {
			disconnectCurrentDragPreview();
			disconnectCurrentDragPreview = null;
		}

		if (currentHandlerId && currentDragPreviewNode) {
			disconnectCurrentDragPreview = backend.connectDragPreview(currentHandlerId, currentDragPreviewNode, currentDragPreviewOptions);
		}
	}

	function receiveHandlerId(handlerId) {
		if (handlerId === currentHandlerId) {
			return;
		}

		currentHandlerId = handlerId;
		reconnectDragSource();
		reconnectDragPreview();
	}

	var hooks = (0, _wrapConnectorHooks2$1.default)({
		dragSource: function connectDragSource(node, options) {
			if (node === currentDragSourceNode && (0, _areOptionsEqual2$1.default)(options, currentDragSourceOptions)) {
				return;
			}

			currentDragSourceNode = node;
			currentDragSourceOptions = options;

			reconnectDragSource();
		},

		dragPreview: function connectDragPreview(node, options) {
			if (node === currentDragPreviewNode && (0, _areOptionsEqual2$1.default)(options, currentDragPreviewOptions)) {
				return;
			}

			currentDragPreviewNode = node;
			currentDragPreviewOptions = options;

			reconnectDragPreview();
		}
	});

	return {
		receiveHandlerId: receiveHandlerId,
		hooks: hooks
	};
}

var isValidType$1 = {};

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */

var isArray = Array.isArray;

var isArray_1 = isArray;

Object.defineProperty(isValidType$1, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

isValidType$1.default = isValidType;

var _isArray = isArray_1;

var _isArray2 = _interopRequireDefault$5(_isArray);

function _interopRequireDefault$5(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isValidType(type, allowArray) {
	return typeof type === 'string' || (typeof type === 'undefined' ? 'undefined' : _typeof(type)) === 'symbol' || allowArray && (0, _isArray2.default)(type) && type.every(function (t) {
		return isValidType(t, false);
	});
}

Object.defineProperty(DragSource$1, "__esModule", {
	value: true
});
DragSource$1.default = DragSource;

var _invariant$3 = invariant_1;

var _invariant2$3 = _interopRequireDefault$4(_invariant$3);

var _isPlainObject$2 = isPlainObject_1;

var _isPlainObject2$2 = _interopRequireDefault$4(_isPlainObject$2);

var _checkDecoratorArguments$1 = checkDecoratorArguments$1;

var _checkDecoratorArguments2$1 = _interopRequireDefault$4(_checkDecoratorArguments$1);

var _decorateHandler$1 = decorateHandler$1;

var _decorateHandler2$1 = _interopRequireDefault$4(_decorateHandler$1);

var _registerSource = registerSource$1;

var _registerSource2 = _interopRequireDefault$4(_registerSource);

var _createSourceFactory = createSourceFactory$1;

var _createSourceFactory2 = _interopRequireDefault$4(_createSourceFactory);

var _createSourceMonitor = createSourceMonitor$1;

var _createSourceMonitor2 = _interopRequireDefault$4(_createSourceMonitor);

var _createSourceConnector = createSourceConnector$1;

var _createSourceConnector2 = _interopRequireDefault$4(_createSourceConnector);

var _isValidType$1 = isValidType$1;

var _isValidType2$1 = _interopRequireDefault$4(_isValidType$1);

function _interopRequireDefault$4(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function DragSource(type, spec, collect) {
	var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

	_checkDecoratorArguments2$1.default.apply(undefined, ['DragSource', 'type, spec, collect[, options]'].concat(Array.prototype.slice.call(arguments)));
	var getType = type;
	if (typeof type !== 'function') {
		(0, _invariant2$3.default)((0, _isValidType2$1.default)(type), 'Expected "type" provided as the first argument to DragSource to be ' + 'a string, or a function that returns a string given the current props. ' + 'Instead, received %s. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source.html', type);
		getType = function getType() {
			return type;
		};
	}
	(0, _invariant2$3.default)((0, _isPlainObject2$2.default)(spec), 'Expected "spec" provided as the second argument to DragSource to be ' + 'a plain object. Instead, received %s. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source.html', spec);
	var createSource = (0, _createSourceFactory2.default)(spec);
	(0, _invariant2$3.default)(typeof collect === 'function', 'Expected "collect" provided as the third argument to DragSource to be ' + 'a function that returns a plain object of props to inject. ' + 'Instead, received %s. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source.html', collect);
	(0, _invariant2$3.default)((0, _isPlainObject2$2.default)(options), 'Expected "options" provided as the fourth argument to DragSource to be ' + 'a plain object when specified. ' + 'Instead, received %s. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source.html', collect);

	return function decorateSource(DecoratedComponent) {
		return (0, _decorateHandler2$1.default)({
			connectBackend: function connectBackend(backend, sourceId) {
				return backend.connectDragSource(sourceId);
			},
			containerDisplayName: 'DragSource',
			createHandler: createSource,
			registerHandler: _registerSource2.default,
			createMonitor: _createSourceMonitor2.default,
			createConnector: _createSourceConnector2.default,
			DecoratedComponent: DecoratedComponent,
			getType: getType,
			collect: collect,
			options: options
		});
	};
}

var DropTarget$1 = {};

var registerTarget$1 = {};

Object.defineProperty(registerTarget$1, "__esModule", {
	value: true
});
registerTarget$1.default = registerTarget;
function registerTarget(type, target, manager) {
	var registry = manager.getRegistry();
	var targetId = registry.addTarget(type, target);

	function unregisterTarget() {
		registry.removeTarget(targetId);
	}

	return {
		handlerId: targetId,
		unregister: unregisterTarget
	};
}

var createTargetFactory$1 = {};

Object.defineProperty(createTargetFactory$1, "__esModule", {
	value: true
});

var _createClass$1 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

createTargetFactory$1.default = createTargetFactory;

var _invariant$2 = invariant_1;

var _invariant2$2 = _interopRequireDefault$3(_invariant$2);

var _isPlainObject$1 = isPlainObject_1;

var _isPlainObject2$1 = _interopRequireDefault$3(_isPlainObject$1);

function _interopRequireDefault$3(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ALLOWED_SPEC_METHODS = ['canDrop', 'hover', 'drop'];

function createTargetFactory(spec) {
	Object.keys(spec).forEach(function (key) {
		(0, _invariant2$2.default)(ALLOWED_SPEC_METHODS.indexOf(key) > -1, 'Expected the drop target specification to only have ' + 'some of the following keys: %s. ' + 'Instead received a specification with an unexpected "%s" key. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-drop-target.html', ALLOWED_SPEC_METHODS.join(', '), key);
		(0, _invariant2$2.default)(typeof spec[key] === 'function', 'Expected %s in the drop target specification to be a function. ' + 'Instead received a specification with %s: %s. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-drop-target.html', key, key, spec[key]);
	});

	var Target = function () {
		function Target(monitor) {
			_classCallCheck$1(this, Target);

			this.monitor = monitor;
			this.props = null;
			this.component = null;
		}

		_createClass$1(Target, [{
			key: 'receiveProps',
			value: function receiveProps(props) {
				this.props = props;
			}
		}, {
			key: 'receiveMonitor',
			value: function receiveMonitor(monitor) {
				this.monitor = monitor;
			}
		}, {
			key: 'receiveComponent',
			value: function receiveComponent(component) {
				this.component = component;
			}
		}, {
			key: 'canDrop',
			value: function canDrop() {
				if (!spec.canDrop) {
					return true;
				}

				return spec.canDrop(this.props, this.monitor);
			}
		}, {
			key: 'hover',
			value: function hover() {
				if (!spec.hover) {
					return;
				}

				spec.hover(this.props, this.monitor, this.component);
			}
		}, {
			key: 'drop',
			value: function drop() {
				if (!spec.drop) {
					return undefined;
				}

				var dropResult = spec.drop(this.props, this.monitor, this.component);
				{
					(0, _invariant2$2.default)(typeof dropResult === 'undefined' || (0, _isPlainObject2$1.default)(dropResult), 'drop() must either return undefined, or an object that represents the drop result. ' + 'Instead received %s. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-drop-target.html', dropResult);
				}
				return dropResult;
			}
		}]);

		return Target;
	}();

	return function createTarget(monitor) {
		return new Target(monitor);
	};
}

var createTargetMonitor$1 = {};

Object.defineProperty(createTargetMonitor$1, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

createTargetMonitor$1.default = createTargetMonitor;

var _invariant$1 = invariant_1;

var _invariant2$1 = _interopRequireDefault$2(_invariant$1);

function _interopRequireDefault$2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var isCallingCanDrop = false;

var TargetMonitor = function () {
	function TargetMonitor(manager) {
		_classCallCheck(this, TargetMonitor);

		this.internalMonitor = manager.getMonitor();
	}

	_createClass(TargetMonitor, [{
		key: 'receiveHandlerId',
		value: function receiveHandlerId(targetId) {
			this.targetId = targetId;
		}
	}, {
		key: 'canDrop',
		value: function canDrop() {
			(0, _invariant2$1.default)(!isCallingCanDrop, 'You may not call monitor.canDrop() inside your canDrop() implementation. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-drop-target-monitor.html');

			try {
				isCallingCanDrop = true;
				return this.internalMonitor.canDropOnTarget(this.targetId);
			} finally {
				isCallingCanDrop = false;
			}
		}
	}, {
		key: 'isOver',
		value: function isOver(options) {
			return this.internalMonitor.isOverTarget(this.targetId, options);
		}
	}, {
		key: 'getItemType',
		value: function getItemType() {
			return this.internalMonitor.getItemType();
		}
	}, {
		key: 'getItem',
		value: function getItem() {
			return this.internalMonitor.getItem();
		}
	}, {
		key: 'getDropResult',
		value: function getDropResult() {
			return this.internalMonitor.getDropResult();
		}
	}, {
		key: 'didDrop',
		value: function didDrop() {
			return this.internalMonitor.didDrop();
		}
	}, {
		key: 'getInitialClientOffset',
		value: function getInitialClientOffset() {
			return this.internalMonitor.getInitialClientOffset();
		}
	}, {
		key: 'getInitialSourceClientOffset',
		value: function getInitialSourceClientOffset() {
			return this.internalMonitor.getInitialSourceClientOffset();
		}
	}, {
		key: 'getSourceClientOffset',
		value: function getSourceClientOffset() {
			return this.internalMonitor.getSourceClientOffset();
		}
	}, {
		key: 'getClientOffset',
		value: function getClientOffset() {
			return this.internalMonitor.getClientOffset();
		}
	}, {
		key: 'getDifferenceFromInitialOffset',
		value: function getDifferenceFromInitialOffset() {
			return this.internalMonitor.getDifferenceFromInitialOffset();
		}
	}]);

	return TargetMonitor;
}();

function createTargetMonitor(manager) {
	return new TargetMonitor(manager);
}

var createTargetConnector$1 = {};

Object.defineProperty(createTargetConnector$1, "__esModule", {
	value: true
});
createTargetConnector$1.default = createTargetConnector;

var _wrapConnectorHooks = wrapConnectorHooks$1;

var _wrapConnectorHooks2 = _interopRequireDefault$1(_wrapConnectorHooks);

var _areOptionsEqual = areOptionsEqual$1;

var _areOptionsEqual2 = _interopRequireDefault$1(_areOptionsEqual);

function _interopRequireDefault$1(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createTargetConnector(backend) {
	var currentHandlerId = void 0;

	var currentDropTargetNode = void 0;
	var currentDropTargetOptions = void 0;
	var disconnectCurrentDropTarget = void 0;

	function reconnectDropTarget() {
		if (disconnectCurrentDropTarget) {
			disconnectCurrentDropTarget();
			disconnectCurrentDropTarget = null;
		}

		if (currentHandlerId && currentDropTargetNode) {
			disconnectCurrentDropTarget = backend.connectDropTarget(currentHandlerId, currentDropTargetNode, currentDropTargetOptions);
		}
	}

	function receiveHandlerId(handlerId) {
		if (handlerId === currentHandlerId) {
			return;
		}

		currentHandlerId = handlerId;
		reconnectDropTarget();
	}

	var hooks = (0, _wrapConnectorHooks2.default)({
		dropTarget: function connectDropTarget(node, options) {
			if (node === currentDropTargetNode && (0, _areOptionsEqual2.default)(options, currentDropTargetOptions)) {
				return;
			}

			currentDropTargetNode = node;
			currentDropTargetOptions = options;

			reconnectDropTarget();
		}
	});

	return {
		receiveHandlerId: receiveHandlerId,
		hooks: hooks
	};
}

Object.defineProperty(DropTarget$1, "__esModule", {
	value: true
});
DropTarget$1.default = DropTarget;

var _invariant = invariant_1;

var _invariant2 = _interopRequireDefault(_invariant);

var _isPlainObject = isPlainObject_1;

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _checkDecoratorArguments = checkDecoratorArguments$1;

var _checkDecoratorArguments2 = _interopRequireDefault(_checkDecoratorArguments);

var _decorateHandler = decorateHandler$1;

var _decorateHandler2 = _interopRequireDefault(_decorateHandler);

var _registerTarget = registerTarget$1;

var _registerTarget2 = _interopRequireDefault(_registerTarget);

var _createTargetFactory = createTargetFactory$1;

var _createTargetFactory2 = _interopRequireDefault(_createTargetFactory);

var _createTargetMonitor = createTargetMonitor$1;

var _createTargetMonitor2 = _interopRequireDefault(_createTargetMonitor);

var _createTargetConnector = createTargetConnector$1;

var _createTargetConnector2 = _interopRequireDefault(_createTargetConnector);

var _isValidType = isValidType$1;

var _isValidType2 = _interopRequireDefault(_isValidType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function DropTarget(type, spec, collect) {
	var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

	_checkDecoratorArguments2.default.apply(undefined, ['DropTarget', 'type, spec, collect[, options]'].concat(Array.prototype.slice.call(arguments)));
	var getType = type;
	if (typeof type !== 'function') {
		(0, _invariant2.default)((0, _isValidType2.default)(type, true), 'Expected "type" provided as the first argument to DropTarget to be ' + 'a string, an array of strings, or a function that returns either given ' + 'the current props. Instead, received %s. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-drop-target.html', type);
		getType = function getType() {
			return type;
		};
	}
	(0, _invariant2.default)((0, _isPlainObject2.default)(spec), 'Expected "spec" provided as the second argument to DropTarget to be ' + 'a plain object. Instead, received %s. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-drop-target.html', spec);
	var createTarget = (0, _createTargetFactory2.default)(spec);
	(0, _invariant2.default)(typeof collect === 'function', 'Expected "collect" provided as the third argument to DropTarget to be ' + 'a function that returns a plain object of props to inject. ' + 'Instead, received %s. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-drop-target.html', collect);
	(0, _invariant2.default)((0, _isPlainObject2.default)(options), 'Expected "options" provided as the fourth argument to DropTarget to be ' + 'a plain object when specified. ' + 'Instead, received %s. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-drop-target.html', collect);

	return function decorateTarget(DecoratedComponent) {
		return (0, _decorateHandler2.default)({
			connectBackend: function connectBackend(backend, targetId) {
				return backend.connectDropTarget(targetId);
			},
			containerDisplayName: 'DropTarget',
			createHandler: createTarget,
			registerHandler: _registerTarget2.default,
			createMonitor: _createTargetMonitor2.default,
			createConnector: _createTargetConnector2.default,
			DecoratedComponent: DecoratedComponent,
			getType: getType,
			collect: collect,
			options: options
		});
	};
}

(function (exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _DragDropContext = DragDropContext$1;

Object.defineProperty(exports, 'DragDropContext', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_DragDropContext).default;
  }
});

var _DragDropContextProvider = DragDropContextProvider$1;

Object.defineProperty(exports, 'DragDropContextProvider', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_DragDropContextProvider).default;
  }
});

var _DragLayer = DragLayer$1;

Object.defineProperty(exports, 'DragLayer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_DragLayer).default;
  }
});

var _DragSource = DragSource$1;

Object.defineProperty(exports, 'DragSource', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_DragSource).default;
  }
});

var _DropTarget = DropTarget$1;

Object.defineProperty(exports, 'DropTarget', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_DropTarget).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
}(lib$1));

function OptionValue(props) {
  var connectDragSource = props.connectDragSource,
      connectDropTarget = props.connectDropTarget,
      isDragging = props.isDragging,
      displayName = props.displayName,
      code = props.code;
  return connectDropTarget(connectDragSource( /*#__PURE__*/react.createElement("div", {
    style: {
      opacity: isDragging ? 0.2 : 1,
      padding: '.5rem',
      margin: '.5rem',
      border: '1px dotted #333'
    }
  }, displayName, " (", code, ")")));
}

var optionDialogStore = Store.create();
var sortDialogStore = Store.create({
  getInitialState: function getInitialState() {
    return {};
  }
});
var optionsForOptionSetStore = Store.create({
  getInitialState: function getInitialState() {
    return {
      isLoading: true,
      options: []
    };
  }
});

function setSortDialogOpenTo(status) {
  sortDialogStore.setState(_objectSpread2(_objectSpread2({}, sortDialogStore.getState()), {}, {
    open: status
  }));
}
var ItemTypes = {
  OPTION: 'option'
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

var cardSource = {
  beginDrag: function beginDrag(props) {
    return {
      id: props.id,
      index: props.index
    };
  }
};
var cardTarget = {
  hover: function hover(props, monitor, component) {
    var dragId = monitor.getItem().id;
    var hoverId = props.id; // Don't replace items with themselves

    if (dragId === hoverId) {
      return;
    } // Determine rectangle on screen


    var hoverBoundingRect = reactDom.findDOMNode(component).getBoundingClientRect(); // Get vertical middle

    var hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2; // Determine mouse position

    var clientOffset = monitor.getClientOffset(); // Get pixels to the top

    var hoverClientY = clientOffset.y - hoverBoundingRect.top; // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%
    // Dragging downwards

    if (dragId < hoverId && hoverClientY < hoverMiddleY) {
      return;
    } // Dragging upwards


    if (dragId > hoverId && hoverClientY > hoverMiddleY) {
      return;
    } // Time to actually perform the action


    props.moveOption(dragId, hoverId);
    return true;
  }
};
var OptionValueWithDrag = lib$1.DragSource(ItemTypes.OPTION, cardSource, collect)(OptionValue);
var OptionValueWithDragAndDrop = lib$1.DropTarget(ItemTypes.OPTION, cardTarget, function (connect) {
  return {
    connectDropTarget: connect.dropTarget()
  };
})(OptionValueWithDrag);
var SortableList = lib$1.DragDropContext(_default)( /*#__PURE__*/function (_Component) {
  _inherits$4(_class, _Component);

  var _super = _createSuper(_class);

  function _class() {
    _classCallCheck$i(this, _class);

    return _super.apply(this, arguments);
  }

  _createClass$i(_class, [{
    key: "render",
    value: function render() {
      var _this = this;

      return /*#__PURE__*/react.createElement("div", null, this.props.options.map(function (option, index) {
        return /*#__PURE__*/react.createElement(OptionValueWithDragAndDrop, {
          key: option.id,
          index: index,
          moveOption: _this.props.moveOption,
          displayName: option.displayName,
          code: option.code,
          id: option.id
        });
      }));
    }
  }]);

  return _class;
}(react.Component));
var sortDialogState$ = Observable.combineLatest(sortDialogStore, optionsForOptionSetStore).map(function (_ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      state = _ref2[0],
      optionState = _ref2[1];

  return _objectSpread2(_objectSpread2({}, state), optionState);
});
var styles$1 = {
  actionButtonWrap: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  actionButton: {
    marginLeft: '1rem'
  }
};

var SortDialog = /*#__PURE__*/function (_Component2) {
  _inherits$4(SortDialog, _Component2);

  var _super2 = _createSuper(SortDialog);

  function SortDialog(props, context) {
    var _this2;

    _classCallCheck$i(this, SortDialog);

    _this2 = _super2.call(this, props, context);

    _defineProperty$3(_assertThisInitialized(_this2), "moveOption", function (dragId, targetId) {
      var dragIndex = _this2.state.options.findIndex(function (option) {
        return option.id === dragId;
      });

      var targetIndex = _this2.state.options.findIndex(function (option) {
        return option.id === targetId;
      });

      var dragOption = _this2.state.options[dragIndex];

      var newList = _toConsumableArray(_this2.state.options);

      newList.splice(dragIndex, 1);
      newList.splice(targetIndex, 0, dragOption);

      _this2.setState({
        options: newList
      });
    });

    _defineProperty$3(_assertThisInitialized(_this2), "_saveOptionOrder", function () {
      var modelToEdit = modelToEditStore.getState();
      modelToEdit.options.clear();

      _this2.state.options.forEach(function (option) {
        modelToEdit.options.add(option);
      });

      sortDialogStore.setState(_objectSpread2(_objectSpread2({}, sortDialogStore.getState()), {}, {
        isSaving: true
      }));
      modelToEditStore.setState(modelToEdit);
      optionsForOptionSetStore.setState(_objectSpread2(_objectSpread2({}, optionsForOptionSetStore.getState()), {}, {
        options: modelToEdit.options.toArray()
      }));
      modelToEdit.save().then(function () {
        sortDialogStore.setState(_objectSpread2(_objectSpread2({}, sortDialogStore.getState()), {}, {
          isSaving: false
        }));
        snackActions.show({
          message: 'options_sorted_and_saved',
          translate: true
        });
        setSortDialogOpenTo(false);
      })["catch"](function () {
        sortDialogStore.setState(_objectSpread2(_objectSpread2({}, sortDialogStore.getState()), {}, {
          isSaving: false
        }));
        snackActions.show({
          message: 'failed_to_save_order',
          action: 'ok',
          translate: true
        });
      });
    });

    _this2.state = {
      isLoading: true,
      options: []
    };
    _this2.i18n = context.d2.i18n;
    return _this2;
  }

  _createClass$i(SortDialog, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(newProps) {
      this.setState({
        options: newProps.options || this.state.options
      });
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/react.createElement(_default$1, {
        open: this.props.open,
        onRequestClose: function onRequestClose() {
          return setSortDialogOpenTo(false);
        },
        autoScrollBodyContent: true,
        style: {
          height: '90%'
        },
        modal: true
      }, /*#__PURE__*/react.createElement(Heading, null, this.i18n.getTranslation('sorting')), this.renderDialogContent(), /*#__PURE__*/react.createElement("div", {
        style: styles$1.actionButtonWrap
      }, this.isShowSaveButton() ? /*#__PURE__*/react.createElement(_default$2, {
        style: styles$1.actionButton,
        disabled: this.props.isSaving,
        onClick: this._saveOptionOrder,
        primary: true,
        label: this.i18n.getTranslation(this.props.isSaving ? 'saving' : 'save')
      }) : undefined, /*#__PURE__*/react.createElement(_default$2, {
        style: styles$1.actionButton,
        disabled: this.props.isSaving,
        label: this.i18n.getTranslation('close'),
        onClick: this._closeDialog
      })));
    }
  }, {
    key: "renderDialogContent",
    value: function renderDialogContent() {
      if (this.props.isLoading) {
        return /*#__PURE__*/react.createElement("div", null, this.props.isLoading ? /*#__PURE__*/react.createElement(_default$3, null) : undefined);
      }

      if (!this.props.onePage) {
        return /*#__PURE__*/react.createElement("div", {
          style: {
            padding: '1rem 0'
          }
        }, this.i18n.getTranslation('manual_sorting_is_not_available_for_option_sets_with_more_than_50_options'));
      }

      return /*#__PURE__*/react.createElement(SortableList, {
        options: this.state.options,
        moveOption: this.moveOption
      });
    }
  }, {
    key: "isShowSaveButton",
    value: function isShowSaveButton() {
      return !this.props.isLoading && this.props.onePage;
    }
  }, {
    key: "_closeDialog",
    value: function _closeDialog() {
      setSortDialogOpenTo(false);
    }
  }]);

  return SortDialog;
}(react.Component);

SortDialog.contextTypes = {
  d2: PropTypes.object
};
SortDialog.defaultProps = {
  open: false,
  options: []
};
var SortDialog$1 = withStateFrom(sortDialogState$, SortDialog);

function optionSorter(options, sortProperty) {
  var sortOrder = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'ASC';
  var sortedOptions = options.sort(function (left, right) {
    return (left[sortProperty] || '').localeCompare(right[sortProperty]);
  });
  return Observable.of(sortOrder === 'ASC' ? sortedOptions : sortedOptions.reverse());
}

var OptionSorter = /*#__PURE__*/function (_Component) {
  _inherits$4(OptionSorter, _Component);

  var _super = _createSuper(OptionSorter);

  function OptionSorter(props, context) {
    var _this;

    _classCallCheck$i(this, OptionSorter);

    _this = _super.call(this, props, context);

    _defineProperty$3(_assertThisInitialized(_this), "onSortBy", function (propertyName) {
      _this.setState({
        isSorting: true
      }, function () {
        optionSorter(modelToEditStore.getState().options.toArray(), propertyName, _this.state.sortedASC[propertyName] ? 'DESC' : 'ASC').flatMap( /*#__PURE__*/function () {
          var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(options) {
            var d2;
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return getInstance();

                  case 2:
                    d2 = _context.sent;
                    return _context.abrupt("return", modelToEditStore.take(1).map(function (modelToEdit) {
                      return {
                        options: options.map(function (optionData) {
                          return d2.models.option.create(optionData);
                        }),
                        modelToEdit: modelToEdit
                      };
                    }));

                  case 4:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }));

          return function (_x) {
            return _ref.apply(this, arguments);
          };
        }()).concatAll().map(function (_ref2) {
          var options = _ref2.options,
              modelToEdit = _ref2.modelToEdit;
          modelToEdit.options.clear();
          options.forEach(function (option) {
            modelToEdit.options.add(option);
          });
          modelToEditStore.setState(modelToEdit);
          optionsForOptionSetStore.setState(_objectSpread2(_objectSpread2({}, optionsForOptionSetStore.getState()), {}, {
            options: options
          }));
          options.map(function (v) {
            return v.displayName;
          });
          snackActions.show({
            message: 'options_sorted_locally_saving_to_server',
            translate: true
          });
          return Observable.fromPromise(modelToEdit.save());
        }).concatAll().subscribe(function () {
          _this.setState({
            sortedASC: _objectSpread2(_objectSpread2({}, _this.state.sortedASC), {}, _defineProperty$3({}, propertyName, !_this.state.sortedASC[propertyName])),
            isSorting: false
          });

          snackActions.show({
            message: 'options_sorted_and_saved',
            translate: true
          });
        }, function () {
          return snackActions.show({
            message: 'options_not_sorted',
            action: 'ok',
            translate: true
          });
        });
      });
    });

    _this.state = {
      sortedASC: {
        displayName: false,
        code: false
      }
    };
    _this.getTranslation = _this.context.d2.i18n.getTranslation.bind(_this.context.d2.i18n);
    return _this;
  }

  _createClass$i(OptionSorter, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      return /*#__PURE__*/react.createElement("div", {
        style: this.props.style
      }, /*#__PURE__*/react.createElement(_default$2, {
        style: this.props.buttonStyle,
        onClick: function onClick() {
          return _this2.onSortBy('displayName');
        },
        disabled: this.state.isSorting,
        label: this.getTranslation(this.state.isSorting ? 'sorting' : 'sort_by_name')
      }), /*#__PURE__*/react.createElement(_default$2, {
        style: this.props.buttonStyle,
        onClick: function onClick() {
          return _this2.onSortBy('code');
        },
        disabled: this.state.isSorting,
        label: this.getTranslation(this.state.isSorting ? 'sorting' : 'sort_by_code')
      }), /*#__PURE__*/react.createElement(_default$2, {
        style: this.props.buttonStyle,
        onClick: function onClick() {
          return setSortDialogOpenTo(true);
        },
        disabled: this.state.isSorting,
        label: this.getTranslation(this.state.isSorting ? 'sorting' : 'sort_manually')
      }), /*#__PURE__*/react.createElement(SortDialog$1, null));
    }
  }]);

  return OptionSorter;
}(react.Component);

OptionSorter.propTypes = {
  buttonStyle: PropTypes.object,
  style: PropTypes.object
};
OptionSorter.defaultProps = {
  buttonStyle: {},
  style: {}
};
var OptionSorter$1 = addD2Context(OptionSorter);

function isAttribute(model, fieldConfig) {
  return model.attributes && new Set(Object.keys(model.attributes)).has(fieldConfig.name);
}
var isFieldName = function isFieldName(fieldConfig) {
  return fieldConfig.name === 'name';
};
var isFieldCode = function isFieldCode(fieldConfig) {
  return fieldConfig.name === 'code';
};

var actions = Action.createActionsFromNames(['saveOption', 'setActiveModel', 'closeOptionDialog', 'getOptionsFor', 'deleteOption', 'updateModel'], 'optionSet');
function loadOptionsForOptionSet(_x, _x2) {
  return _loadOptionsForOptionSet.apply(this, arguments);
}

function _loadOptionsForOptionSet() {
  _loadOptionsForOptionSet = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(optionSetId, paging) {
    var d2;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return getInstance();

          case 2:
            d2 = _context4.sent;
            return _context4.abrupt("return", d2.models.option.filter().on('optionSet.id').equals(optionSetId).list({
              fields: ':all,attributeValues[:owner,attribute[id,name]',
              paging: paging
            }));

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _loadOptionsForOptionSet.apply(this, arguments);
}

function processResponse(options) {
  if (!options.pager.hasNextPage() && !options.pager.hasPreviousPage()) {
    return modelToEditStore.take(1).subscribe(function (model) {
      var optionsInOrder = model.options.toArray().map(function (_ref) {
        var id = _ref.id;
        return options.get(id);
      }).filter(function (option) {
        return option;
      });
      optionsForOptionSetStore.setState({
        onePage: true,
        isLoading: false,
        options: optionsInOrder
      });
    });
  }

  var state = {
    options: options.toArray(),
    getNextPage: function getNextPage() {
      options.pager.getNextPage().then(processResponse);
    },
    getPreviousPage: function getPreviousPage() {
      options.pager.getPreviousPage().then(processResponse);
    },
    pager: options.pager,
    onePage: false,
    isLoading: false
  };
  optionsForOptionSetStore.setState(state);
  return state;
}

actions.updateModel.subscribe(function (_ref2) {
  var _ref2$data = _slicedToArray(_ref2.data, 3),
      modelToEdit = _ref2$data[0],
      field = _ref2$data[1],
      value = _ref2$data[2];

  var model = modelToEdit;

  if (isAttribute(model, {
    name: field
  })) {
    modelToEdit.attributes[field] = value;
    log.debug("Value for custom attribute '".concat(field, "' is now: ").concat(modelToEdit.attributes[field]));
  } else {
    model[field] = value;
    log.debug("Value for '".concat(field, "' is now: ").concat(modelToEdit[field]));
  }

  optionDialogStore.setState(_objectSpread2(_objectSpread2({}, optionDialogStore.state), {}, {
    model: model
  }));
});
actions.setActiveModel.subscribe( /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref3) {
    var model, d2, modelToSave;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            model = _ref3.data;
            _context.next = 3;
            return getInstance();

          case 3:
            d2 = _context.sent;
            modelToSave = model; // When no model is passed we create a new model

            if (_default$4(model) && !model.length) {
              modelToSave = d2.models.option.create();
            }

            optionDialogStore.setState(_objectSpread2(_objectSpread2({}, optionDialogStore.state), {}, {
              isDialogOpen: true,
              model: modelToSave
            }));

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x3) {
    return _ref4.apply(this, arguments);
  };
}());
actions.saveOption.subscribe(function (_ref5) {
  var _ref5$data = _slicedToArray(_ref5.data, 2),
      model = _ref5$data[0],
      parentModel = _ref5$data[1],
      complete = _ref5.complete,
      error = _ref5.error;

  var isAdd = !model.id; // Options must have a sortOrder and an optionSet, otherwise saving might not happen correctly
  // For example, prior to adding this, the `optionSet` would be not be saved correctly if a `style` was also in the payload.

  if (isAdd) {
    model.sortOrder = parentModel && parentModel.options.size + 1 || 1;
    model.optionSet = {
      id: parentModel.id
    };
  }

  model.save().then(function () {
    if (isAdd) {
      // TODO: Use collection patching to solve this.
      parentModel.options.add(model);
      return parentModel.save();
    }

    return true;
  }).then(complete)["catch"](function (response) {
    if (fp.has('response.errrorReports[0].message', response)) {
      return error({
        message: response.response.errorReports[0].message,
        translate: false
      });
    }

    return error({
      message: 'option_failed_to_save',
      translate: true
    });
  });
});
actions.getOptionsFor.subscribe( /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref6) {
    var model, complete;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            model = _ref6.data, complete = _ref6.complete;
            optionsForOptionSetStore.setState({
              isLoading: true,
              options: []
            });

            if (model && model.id) {
              loadOptionsForOptionSet(model.id, true).then(processResponse).then(function () {
                return complete();
              });
            }

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x4) {
    return _ref7.apply(this, arguments);
  };
}());
actions.closeOptionDialog.subscribe(function () {
  optionDialogStore.setState(_objectSpread2(_objectSpread2({}, optionDialogStore.state), {}, {
    isDialogOpen: false
  }));
});
actions.deleteOption.subscribe( /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_ref8) {
    var _ref8$data, modelToDelete, modelParent, complete, error, d2, api, deleteMessage;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _ref8$data = _slicedToArray(_ref8.data, 2), modelToDelete = _ref8$data[0], modelParent = _ref8$data[1], complete = _ref8.complete, error = _ref8.error;
            _context3.next = 3;
            return getInstance();

          case 3:
            d2 = _context3.sent;
            api = d2.Api.getApi();

            if (!(!modelParent.id && modelToDelete.id)) {
              _context3.next = 7;
              break;
            }

            return _context3.abrupt("return", error('unable_to_delete_due_to_missing_id'));

          case 7:
            deleteMessage = d2.i18n.getTranslation('option_$$name$$_deleted', {
              name: modelToDelete.name
            });
            return _context3.abrupt("return", api["delete"]("".concat(modelParent.modelDefinition.apiEndpoint, "/").concat(modelParent.id, "/options/").concat(modelToDelete.id)).then(function () {
              return modelToDelete["delete"]();
            }).then(function () {
              return snackActions.show({
                message: deleteMessage
              });
            }).then(function () {
              return actions.getOptionsFor(modelParent);
            }).then(function () {
              return modelParent.options["delete"](modelToDelete.id);
            }).then(complete)["catch"](error));

          case 9:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x5) {
    return _ref9.apply(this, arguments);
  };
}());

var AddOptionDialog = /*#__PURE__*/function (_Component) {
  _inherits$4(AddOptionDialog, _Component);

  var _super = _createSuper(AddOptionDialog);

  function AddOptionDialog(props) {
    var _this;

    _classCallCheck$i(this, AddOptionDialog);

    _this = _super.call(this, props);

    _defineProperty$3(_assertThisInitialized(_this), "onUpdateField", function (field, value) {
      if (!_this.state.changedOriginalFieldValues.hasOwnProperty(field)) {
        //store the original value so we can change it back if user cancels.
        _this.setState({
          changedOriginalFieldValues: _objectSpread2(_objectSpread2({}, _this.state.changedOriginalFieldValues), {}, _defineProperty$3({}, field, _this.props.model[field]))
        });
      }

      actions.updateModel(_this.props.model, field, value);
    });

    _defineProperty$3(_assertThisInitialized(_this), "onSaveSuccess", function () {
      _this.showSuccessMessage();

      _this.setState({
        isSaving: false
      });

      _this.props.onRequestClose(); // After the save was successful we request the options from the server to get the updated list


      actions.getOptionsFor(_this.props.parentModel);
    });

    _defineProperty$3(_assertThisInitialized(_this), "onSaveError", function (_ref) {
      var message = _ref.message,
          translate = _ref.translate;

      _this.showErrorMessage(message, translate);

      _this.setState({
        isSaving: false
      });
    });

    _defineProperty$3(_assertThisInitialized(_this), "onSaveOption", function () {
      var invalidFieldMessage = getFirstInvalidFieldMessage(_this.props.fieldConfigs, _this.formRef);

      if (invalidFieldMessage) {
        _this.showFirstValidationErrorMessage(invalidFieldMessage);
      } else {
        _this.setState({
          isSaving: true
        });

        actions.saveOption(_this.props.model, _this.props.parentModel).subscribe(_this.onSaveSuccess, _this.onSaveError);
      }
    });

    _defineProperty$3(_assertThisInitialized(_this), "handleCancel", function () {
      var changedOriginalFieldValues = _this.state.changedOriginalFieldValues; //revert changed values before closing

      Object.keys(changedOriginalFieldValues).forEach(function (key) {
        actions.updateModel(_this.props.model, key, changedOriginalFieldValues[key]);
      });

      _this.props.onRequestClose();
    });

    _defineProperty$3(_assertThisInitialized(_this), "setFormRef", function (form) {
      _this.formRef = form;
    });

    _defineProperty$3(_assertThisInitialized(_this), "showFirstValidationErrorMessage", function (invalidFieldMessage) {
      snackActions.show({
        message: invalidFieldMessage,
        action: 'ok'
      });
    });

    _defineProperty$3(_assertThisInitialized(_this), "showSuccessMessage", function () {
      snackActions.show({
        message: 'option_saved',
        translate: true
      });
    });

    _defineProperty$3(_assertThisInitialized(_this), "showErrorMessage", function (message, translate) {
      snackActions.show({
        message: message,
        action: 'ok',
        translate: translate
      });
    });

    _defineProperty$3(_assertThisInitialized(_this), "translate", function (message) {
      return _this.context.d2.i18n.getTranslation(message);
    });

    _this.state = {
      isFormValid: true,
      isSaving: false,
      changedOriginalFieldValues: {}
    };
    return _this;
  }

  _createClass$i(AddOptionDialog, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(newProps) {
      //reset field values when model changes
      //this is needed due to the dialog not being unmounted between option changes,
      //and to keep the orignal-values in sync with the model
      if (newProps.model.id !== this.props.model.id) {
        this.setState({
          changedOriginalFieldValues: {}
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/react.createElement(_default$1, {
        open: this.props.isDialogOpen,
        modal: true,
        onRequestClose: this.props.onRequestClose,
        autoScrollBodyContent: true
      }, /*#__PURE__*/react.createElement(Heading, null, this.props.title), /*#__PURE__*/react.createElement(FormBuilder, {
        fields: this.props.fieldConfigs,
        onUpdateField: this.onUpdateField,
        ref: this.setFormRef
      }), /*#__PURE__*/react.createElement(FormButtons, null, /*#__PURE__*/react.createElement(SaveButton, {
        isValid: this.state.isFormValid,
        onClick: this.onSaveOption,
        isSaving: this.state.isSaving
      }), /*#__PURE__*/react.createElement(CancelButton, {
        onClick: this.handleCancel
      })));
    }
  }]);

  return AddOptionDialog;
}(react.Component);

AddOptionDialog.propTypes = {
  fieldConfigs: PropTypes.array,
  title: PropTypes.string,
  isDialogOpen: PropTypes.bool,
  model: PropTypes.object,
  onRequestClose: PropTypes.func.isRequired,
  parentModel: PropTypes.object
};
AddOptionDialog.defaultProps = {
  parentModel: {},
  model: {},
  fieldConfigs: [],
  isDialogOpen: false,
  title: ''
};
AddOptionDialog.contextTypes = {
  d2: react.PropTypes.object
};

var createUniqueValueValidator = function createUniqueValueValidator(fieldName, modelId, allOptions) {
  return function (fieldValue) {
    return !allOptions.find(function (option) {
      return (// Only allow value to be identical to the value of the model that is being edited
        option[fieldName] === fieldValue && option.id !== modelId
      );
    });
  };
};
/*
 * Since this is custom for option sets and requires stuff from the option store
 * the validator for unique fields is created here rather than in
 * forms/fields.
 */


var getValidatorForField = function getValidatorForField(state, fieldName, modelId, d2) {
  var uniqueValueValidator = createUniqueValueValidator(fieldName, modelId, state.options);
  uniqueValueValidator.message = d2.i18n.getTranslation("option_".concat(fieldName, "_must_be_unique"));
  return uniqueValueValidator;
};

function addUniqueValidator(_x, _x2, _x3, _x4) {
  return _addUniqueValidator.apply(this, arguments);
}
/* Add fields that should be unique within an option here */


function _addUniqueValidator() {
  _addUniqueValidator = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(fieldConfig, modelId, d2, fieldName) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            optionsForOptionSetStore.subscribe(function (state) {
              if (!state.isLoading) {
                var uniqueValueValidator = getValidatorForField(state, fieldName, modelId, d2);
                fieldConfig.validators.push(createValidatorFromValidatorFunction(uniqueValueValidator));
              }
            });

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _addUniqueValidator.apply(this, arguments);
}

function addValidatorForUniqueField(fieldConfig, modelId, d2) {
  if (isFieldCode(fieldConfig) || isFieldName(fieldConfig)) {
    addUniqueValidator(fieldConfig, modelId, d2, fieldConfig.name);
  }
}

var _excluded$1 = ["fieldConfigs", "model", "isAdd"];

var valueTypeExist = function valueTypeExist(modelToEdit) {
  return typeToFieldMap.has(modelToEdit.valueType);
};

var addUiComponentToCodeFieldConfig = function addUiComponentToCodeFieldConfig(codeFieldConfig, modelToEdit) {
  codeFieldConfig.component = getFieldUIComponent(typeToFieldMap.get(modelToEdit.valueType));
};

var addValueTypeToCodeFieldConfig = function addValueTypeToCodeFieldConfig(codeFieldConfig, modelToEdit) {
  codeFieldConfig.type = typeToFieldMap.get(modelToEdit.valueType);
};

var addDisabledStatusToCodeFieldConfig = function addDisabledStatusToCodeFieldConfig(codeFieldConfig, isAdd) {
  if (isAdd) {
    codeFieldConfig.props.disabled = false;
  } else {
    codeFieldConfig.props.disabled = true;
  }
};

var handleFieldConfigForCode = function handleFieldConfigForCode(codeFieldConfig, modelToEdit, d2, isAdd) {
  addUiComponentToCodeFieldConfig(codeFieldConfig, modelToEdit);
  addValueTypeToCodeFieldConfig(codeFieldConfig, modelToEdit);
  addDisabledStatusToCodeFieldConfig(codeFieldConfig, isAdd);
};

var addAttributeStatusToFieldConfig = function addAttributeStatusToFieldConfig(fieldConfig, model) {
  if (isAttribute(model, fieldConfig)) {
    fieldConfig.value = model.attributes[fieldConfig.name];
  } else {
    fieldConfig.value = model[fieldConfig.name];
  }
};

function setupFieldConfigs(_x) {
  return _setupFieldConfigs.apply(this, arguments);
}

function _setupFieldConfigs() {
  _setupFieldConfigs = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref) {
    var _ref7, modelToEdit, optionDialogState, d2, fieldConfigs, isAdd, model;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _ref7 = _slicedToArray(_ref, 2), modelToEdit = _ref7[0], optionDialogState = _ref7[1];
            _context2.next = 3;
            return getInstance();

          case 3:
            d2 = _context2.sent;
            _context2.next = 6;
            return createFieldConfigForModelTypes('option');

          case 6:
            fieldConfigs = _context2.sent;
            isAdd = !optionDialogState.model.id;
            model = optionDialogState.model;
            return _context2.abrupt("return", fieldConfigs.map(function (fieldConfig) {
              if (isFieldCode(fieldConfig) && valueTypeExist(modelToEdit)) {
                handleFieldConfigForCode(fieldConfig, modelToEdit, d2, isAdd);
              }

              addValidatorForUniqueField(fieldConfig, model.id, d2);
              addAttributeStatusToFieldConfig(fieldConfig, model);
              return fieldConfig;
            }));

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _setupFieldConfigs.apply(this, arguments);
}

var optionForm$ = Observable.combineLatest(modelToEditStore, //This is the optionSet model. optionDialogStore.model contains option model
optionDialogStore).flatMap(setupFieldConfigs, function (_ref2, fieldConfigs) {
  var _ref3 = _slicedToArray(_ref2, 2);
      _ref3[0];
      var optionDialogState = _ref3[1];

  return {
    fieldConfigs: fieldConfigs,
    model: optionDialogState.model,
    isAdd: !optionDialogState.model.id,
    isDialogOpen: optionDialogState.isDialogOpen
  };
});
var optionFormData$ = optionForm$.flatMap( /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref4) {
    var fieldConfigs, model, isAdd, other, d2;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            fieldConfigs = _ref4.fieldConfigs, model = _ref4.model, isAdd = _ref4.isAdd, other = _objectWithoutProperties(_ref4, _excluded$1);
            _context.next = 3;
            return getInstance();

          case 3:
            d2 = _context.sent;
            return _context.abrupt("return", _objectSpread2({
              fieldConfigs: fieldConfigs,
              model: model,
              isAdd: isAdd,
              title: d2.i18n.getTranslation(isAdd ? 'option_add' : 'option_edit')
            }, other));

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x2) {
    return _ref5.apply(this, arguments);
  };
}()).filter(function (_ref6) {
  var fieldConfigs = _ref6.fieldConfigs;
  return fieldConfigs.length;
});
var OptionDialogForOptions = withStateFrom(optionFormData$, AddOptionDialog);

var _excluded = ["options", "pager"];
var styles = {
  optionManagementWrap: {
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem 1rem 1rem 1rem'
  },
  dataTableWrap: {
    position: 'relative'
  },
  sortBarStyle: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingBottom: '1rem',
    paddingLeft: '1rem'
  },
  sortButtonStyle: {
    flex: '0 0 15rem',
    marginLeft: '1rem'
  },
  alertWrapper: {
    color: 'orange',
    display: 'flex',
    padding: '0.5rem',
    border: '1px dotted orange',
    borderRadius: '0.5rem',
    marginTop: '2rem'
  },
  alertText: {
    lineHeight: '2rem',
    paddingLeft: '1rem'
  },
  addButton: {
    "float": 'right'
  }
};

var OptionManagement = /*#__PURE__*/function (_Component) {
  _inherits$4(OptionManagement, _Component);

  var _super = _createSuper(OptionManagement);

  function OptionManagement(props, context) {
    var _this;

    _classCallCheck$i(this, OptionManagement);

    _this = _super.call(this, props, context);

    _defineProperty$3(_assertThisInitialized(_this), "onAddOption", function () {
      return actions.setActiveModel();
    });

    _defineProperty$3(_assertThisInitialized(_this), "onAddDialogClose", function () {
      return actions.closeOptionDialog();
    });

    _defineProperty$3(_assertThisInitialized(_this), "onEditOption", function (model) {
      return actions.setActiveModel(model);
    });

    _defineProperty$3(_assertThisInitialized(_this), "translationSaved", function () {
      return snackActions.show({
        message: 'translation_saved',
        translate: true
      });
    });

    _defineProperty$3(_assertThisInitialized(_this), "translationErrored", function () {
      return snackActions.show({
        message: 'translation_save_error',
        action: 'ok',
        translate: true
      });
    });

    _defineProperty$3(_assertThisInitialized(_this), "isContextActionAllowed", function (model, action) {
      if (!model || !model.access) {
        return false;
      }

      if (model.access.hasOwnProperty(action)) {
        return model.access[action];
      }

      switch (action) {
        case 'edit':
          return model.access.write;

        case 'share':
          return model.modelDefinition.isShareable === true && model.access.write;

        default:
          return true;
      }
    });

    _defineProperty$3(_assertThisInitialized(_this), "renderSharingDialog", function () {
      return /*#__PURE__*/react.createElement(SharingDialog, {
        d2: _this.context.d2,
        id: _this.state.modelToShare.id,
        type: 'option',
        open: !!_this.state.modelToShare,
        onRequestClose: function onRequestClose() {
          return _this.setState({
            modelToShare: null
          });
        },
        bodyStyle: {
          minHeight: '400px'
        }
      });
    });

    _this.state = {
      nameSortedASC: false,
      isSorting: false,
      modelToTranslate: null,
      modelToShare: null
    };
    _this.i18n = context.d2.i18n;
    return _this;
  }

  _createClass$i(OptionManagement, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this.subscription = actions.getOptionsFor(this.props.model).subscribe(function () {
        return _this2.forceUpdate();
      });
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(newProps) {
      if (this.props.model !== newProps.model) {
        actions.getOptionsFor(newProps.model);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.subscription && this.subscription.unsubscribe) {
        this.subscription.unsubscribe();
      }
    }
  }, {
    key: "displayInCorrectOrderWarning",
    value: function displayInCorrectOrderWarning() {
      if (!(this.props.pager && this.props.pager.total > 50)) {
        return null;
      }

      return /*#__PURE__*/react.createElement("div", {
        style: styles.alertWrapper
      }, /*#__PURE__*/react.createElement(_default$5, {
        color: "orange"
      }), /*#__PURE__*/react.createElement("div", {
        style: styles.alertText
      }, this.i18n.getTranslation('list_might_not_represent_the_accurate_order_of_options_due_the_availability_of_pagination')));
    }
  }, {
    key: "renderPagination",
    value: function renderPagination() {
      var _this3 = this;

      if (!this.props.pager) {
        return null;
      }

      var paginationProps = {
        hasNextPage: function hasNextPage() {
          return Boolean(_this3.props.pager.hasNextPage) && _this3.props.pager.hasNextPage();
        },
        hasPreviousPage: function hasPreviousPage() {
          return Boolean(_this3.props.pager.hasPreviousPage) && _this3.props.pager.hasPreviousPage();
        },
        onNextPageClick: function onNextPageClick() {
          _this3.setState({
            isLoading: true
          });

          _this3.props.getNextPage();
        },
        onPreviousPageClick: function onPreviousPageClick() {
          _this3.setState({
            isLoading: true
          });

          _this3.props.getPreviousPage();
        },
        total: this.props.pager.total,
        currentlyShown: calculatePageValue(this.props.pager)
      };
      return /*#__PURE__*/react.createElement(Pagination, paginationProps);
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var contextActions = {
        edit: this.onEditOption,
        share: function share(modelToShare) {
          _this4.setState({
            modelToShare: modelToShare
          });
        },
        "delete": function _delete(modelToDelete) {
          return actions.deleteOption(modelToDelete, _this4.props.model);
        },
        translate: function translate(modelToTranslate) {
          _this4.setState({
            modelToTranslate: modelToTranslate
          });
        }
      };
      return /*#__PURE__*/react.createElement("div", {
        style: styles.optionManagementWrap
      }, this.displayInCorrectOrderWarning(), this.renderPagination(), /*#__PURE__*/react.createElement(OptionSorter$1, {
        style: styles.sortBarStyle,
        buttonStyle: styles.sortButtonStyle,
        rows: this.props.rows
      }), /*#__PURE__*/react.createElement("div", {
        style: styles.dataTableWrap
      }, this.props.isLoading && /*#__PURE__*/react.createElement(_default$3, null), /*#__PURE__*/react.createElement(DataTable, {
        rows: this.props.rows,
        columns: this.props.columns,
        primaryAction: this.onEditOption,
        contextMenuActions: contextActions,
        isContextActionAllowed: this.isContextActionAllowed
      })), /*#__PURE__*/react.createElement(OptionDialogForOptions, {
        onRequestClose: this.onAddDialogClose,
        parentModel: this.props.model
      }), this.state.modelToTranslate && /*#__PURE__*/react.createElement(TranslationDialog, {
        objectToTranslate: this.state.modelToTranslate,
        objectTypeToTranslate: this.state.modelToTranslate && this.state.modelToTranslate.modelDefinition,
        open: Boolean(this.state.modelToTranslate),
        onTranslationSaved: this.translationSaved,
        onTranslationError: this.translationErrored,
        onRequestClose: function onRequestClose() {
          return _this4.setState({
            modelToTranslate: null
          });
        },
        fieldsToTranslate: ['name']
      }), this.state.modelToShare && this.renderSharingDialog(), /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement(_default$2, {
        label: this.i18n.getTranslation('add_option'),
        primary: true,
        onClick: this.onAddOption,
        style: styles.addButton
      })));
    }
  }]);

  return OptionManagement;
}(react.Component);

OptionManagement.propTypes = {
  model: PropTypes.object,
  rows: PropTypes.array,
  columns: PropTypes.array,
  optionDialogOpen: PropTypes.bool,
  isLoading: PropTypes.bool,
  getNextPage: PropTypes.func,
  getPreviousPage: PropTypes.func,
  pager: PropTypes.object
};
OptionManagement.defaultProps = {
  getNextPage: function getNextPage() {},
  getPreviousPage: function getPreviousPage() {},
  model: {},
  pager: {},
  rows: [],
  columns: ['name', 'code'],
  optionDialogOpen: false,
  isLoading: false
};
OptionManagement.contextTypes = {
  d2: PropTypes.object
};
var optionList$ = Observable.combineLatest(optionsForOptionSetStore, Observable.of(['name', 'code']), function (_ref, columns) {
  var options = _ref.options,
      pager = _ref.pager,
      other = _objectWithoutProperties(_ref, _excluded);

  return _objectSpread2(_objectSpread2({}, other), {}, {
    rows: options,
    pager: pager,
    columns: columns
  });
});
var stateForOptionManagement$ = Observable.combineLatest(modelToEditStore, optionList$, function (modelToEdit, optionList) {
  return _objectSpread2(_objectSpread2({}, optionList), {}, {
    model: modelToEdit
  });
});
var OptionManagement$1 = withStateFrom(stateForOptionManagement$, OptionManagement);

function _onSaveError(errorMessage, props) {
  if (errorMessage === 'No changes to be saved') {
    goToRoute("/list/".concat(props.groupName, "/").concat(props.modelType));
  }
}

var EditOptionSet = /*#__PURE__*/function (_Component) {
  _inherits$4(EditOptionSet, _Component);

  var _super = _createSuper(EditOptionSet);

  function EditOptionSet(props, context) {
    var _this;

    _classCallCheck$i(this, EditOptionSet);

    _this = _super.call(this, props, context);
    _this.state = {
      tabsValue: props.params.activeView || ''
    };
    return _this;
  }

  _createClass$i(EditOptionSet, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var context = this.context;
      var props = this.props;
      var params = Object.assign({}, props.params, {
        modelType: 'optionSet'
      });
      var styles = {
        tabItemContainerStyle: {
          background: 'transparent'
        },
        tabStyle: {
          color: '#666'
        },
        disabledTabStyle: {
          color: '#999',
          background: 'rgba(0,0,0, 0.1)'
        }
      };
      var activeTab = props.params.activeView ? props.params.activeView : '';
      var isAddOperation = params.modelId === 'add';

      var onTabChanged = function onTabChanged(tabsValue) {
        // The following check prevents propagated change events to change the tabs. (https://jira.dhis2.org/browse/DHIS2-1059)
        // TODO: This has been fixed in material-ui 0.16. So this can be removed when upgraded. (https://github.com/callemall/material-ui/issues/2189)
        if (typeof tabsValue !== 'string') {
          return;
        }

        _this2.setState({
          tabsValue: tabsValue
        });

        goToRoute("/edit/".concat(params.groupName, "/").concat(params.modelType, "/").concat(params.modelId, "/").concat(tabsValue));
      };

      var successHandler = function successHandler(model) {
        if (isAddOperation) {
          goToRoute("/edit/".concat(params.groupName, "/").concat(params.modelType, "/").concat(model.id, "/options"));
        } else {
          goToRoute("/list/".concat(params.groupName, "/").concat(params.modelType));
        }
      };

      return /*#__PURE__*/react.createElement("div", null, /*#__PURE__*/react.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'row',
          marginBottom: '1rem'
        }
      }, /*#__PURE__*/react.createElement(FormHeading, {
        schema: "optionSet",
        groupName: "otherSection"
      }, lib$3.camelCaseToUnderscores(params.modelType))), /*#__PURE__*/react.createElement(_default$6, null, /*#__PURE__*/react.createElement(_default$7, {
        tabItemContainerStyle: styles.tabItemContainerStyle,
        value: activeTab,
        onChange: onTabChanged
      }, /*#__PURE__*/react.createElement(_default$8, {
        value: "",
        label: context.d2.i18n.getTranslation('primary_details'),
        style: styles.tabStyle
      }, /*#__PURE__*/react.createElement(EditModelForm, _extends$6({}, props, params, {
        onCancel: function onCancel() {
          return goToRoute("/list/".concat(params.groupName, "/").concat(params.modelType));
        },
        onSaveSuccess: successHandler,
        onSaveError: function onSaveError(errorMessage) {
          return _onSaveError(errorMessage, params);
        }
      }))), /*#__PURE__*/react.createElement(_default$8, {
        value: "options",
        label: context.d2.i18n.getTranslation('options'),
        disabled: isAddOperation,
        style: isAddOperation ? styles.disabledTabStyle : styles.tabStyle
      }, /*#__PURE__*/react.createElement(OptionManagement$1, null)))));
    }
  }]);

  return EditOptionSet;
}(react.Component);

EditOptionSet.propTypes = {
  params: PropTypes.any.isRequired
};
var EditOptionSet_component = addD2Context(EditOptionSet);

export { EditOptionSet_component as default };
