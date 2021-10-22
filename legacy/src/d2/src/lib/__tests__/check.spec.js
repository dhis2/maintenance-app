import * as check from '../check';

describe('Check', () => {
    describe('isDefined', () => {
        it('should return when the parameter is defined', () => {
            expect(check.isDefined({})).toBe(true);
        });

        it('should return false when the parameter is not defined', () => {
            expect(check.isDefined(undefined)).toBe(false);
        });
    });

    describe('isType', () => {
        it('should return true if the value is of the correct type', () => {
            expect(check.isType('Mark', 'string')).toBe(true);
        });

        it('should return false when the value is not of the right type', () => {
            expect(check.isType({}, 'string')).toBe(false);
        });

        it('should return true when the value is an instance of', () => {
            expect(check.isType([], Object)).toBe(true);
        });

        it('should return false when the object is not an instance', () => {
            expect(check.isType('', Object)).toBe(false);
        });
    });

    describe('isString', () => {
        it('should return true for a string', () => {
            expect(check.isString('Mark')).toBe(true);
        });

        it('should return false for an array', () => {
            expect(check.isString([])).toBe(false);
        });
    });

    describe('isEmpty', () => {
        it('should return true if array is empty', () => {
            expect(check.isEmpty([])).toBe(true);
        });

        it('should return false if array has element', () => {
            expect(check.isEmpty([1, 2, 3])).toBe(false);
        });
    });

    describe('isInteger', () => {
        it('should return for 1', () => {
            expect(check.isInteger(1)).toBe(true);
        });

        it('should return false for 0.1', () => {
            expect(check.isInteger(0.1)).toBe(false);
        });

        it('should return false for NaN', () => {
            expect(check.isInteger(NaN)).toBe(false);
        });

        it('should return false for an array', () => {
            expect(check.isInteger([])).toBe(false);
        });

        it('should return false for an object', () => {
            expect(check.isInteger({})).toBe(false);
        });

        it('should return false for Infinity', () => {
            expect(check.isInteger(Infinity)).toBe(false);
        });

        it('should return false for empty string', () => {
            expect(check.isInteger('')).toBe(false);
        });

        it('should return false for white space strings', () => {
            expect(check.isInteger(' ')).toBe(false);
            expect(check.isInteger('\t')).toBe(false);
            expect(check.isInteger('\n')).toBe(false);
            expect(check.isInteger('\n\r')).toBe(false);
        });
    });

    describe('isNumeric', () => {
        it('should return true for 1', () => {
            expect(check.isNumeric(1)).toBe(true);
        });

        it('should return true for 1.1', () => {
            expect(check.isNumeric(1.1)).toBe(true);
        });

        it('should return true for negative 1', () => {
            expect(check.isNumeric(-1)).toBe(true);
        });

        it('should return true for negative 1.1', () => {
            expect(check.isNumeric(-1.1)).toBe(true);
        });

        it('should return true for 0', () => {
            expect(check.isNumeric(0)).toBe(true);
        });

        it('should return false for NaN', () => {
            expect(check.isNumeric(NaN)).toBe(false);
        });

        it('should return false for an array', () => {
            expect(check.isNumeric([])).toBe(false);
        });

        it('should return false for an object', () => {
            expect(check.isNumeric({})).toBe(false);
        });

        it('should return false for Infinity', () => {
            expect(check.isNumeric(Infinity)).toBe(false);
        });

        it('should return false for empty string', () => {
            expect(check.isNumeric('')).toBe(false);
        });

        it('should return false for white space strings', () => {
            expect(check.isNumeric(' ')).toBe(false);
            expect(check.isNumeric('\t')).toBe(false);
            expect(check.isNumeric('\n')).toBe(false);
            expect(check.isNumeric('\n\r')).toBe(false);
        });

        it('should concider Infinity not to be numeric', () => {
            expect(check.isNumeric(Infinity)).toBe(false);
        });
    });

    describe('isArray', () => {
        beforeEach(() => {
            jest.spyOn(Array, 'isArray');
        });

        afterEach(() => {
            Array.isArray.mockRestore();
        });

        it('should call Array.isArray', () => {
            check.isArray([]);

            expect(Array.isArray).toHaveBeenCalledTimes(1);
        });
    });

    describe('contains', () => {
        it('should be a function', () => {
            expect(check.contains).toBeInstanceOf(Function);
        });

        it('should return true when an item is contained in the array', () => {
            const list = [3, 4, 2, 6, 7];

            expect(check.contains(2, list)).toBe(true);
        });

        it('should return false when an item is not in the list', () => {
            const list = [3, 4, 2, 6, 7];

            expect(check.contains(9, list)).toBe(false);
        });

        it('should return false if the list is not an array', () => {
            expect(check.contains(1, 'two')).toBe(false);
        });

        it('should return false when the item is undefined', () => {
            expect(check.contains(undefined, [])).toBe(false);
        });

        it('should return true when undefined is in the list', () => {
            expect(check.contains(undefined, [undefined])).toBe(true);
        });
    });

    describe('isValidUid', () => {
        it('should return true when the value is a valid uid', () => {
            expect(check.isValidUid('q2egwkkrfco')).toBe(true);
        });
    });

    describe('toBe', () => {
        it('should do strict equals', () => {
            expect(check.toBe(undefined, undefined)).toBe(true);
            expect(check.toBe(null, null)).toBe(true);
            expect(check.toBe(null, undefined)).toBe(false);
            expect(check.toBe({}, {})).toBe(false);
            expect(check.toBe(expect, expect)).toBe(true);
            expect(check.toBe('q2egwkkrfco', 'q2egwkkrfco')).toBe(true);
        });
    });

    describe('toBeAny', () => {
        it('should return true when the value exists in the values', () => {
            expect(check.toBeAny([undefined, null, ''])(null)).toBe(true);
            expect(check.toBeAny(['A', 'B', 'C'])('C')).toBe(true);
        });

        it('should return false when the value does not exist in the values', () => {
            expect(check.toBeAny([undefined, null, ''])(0)).toBe(false);
            expect(check.toBeAny(['A', 'B', 'C'])('D')).toBe(false);
            expect(check.toBeAny(['A', 'B', 'C'])()).toBe(false);
        });
    });

    describe('isNullUndefinedOrEmptyString', () => {
        it('should return true when the passed value is either undefined, null, or empty string', () => {
            expect(check.isNullUndefinedOrEmptyString(null)).toBe(true);
            expect(check.isNullUndefinedOrEmptyString(undefined)).toBe(true);
            expect(check.isNullUndefinedOrEmptyString('')).toBe(true);
        });

        it('should return false when the passed value that is not undefined, null, or empty string', () => {
            expect(check.isNullUndefinedOrEmptyString('A')).toBe(false);
            expect(check.isNullUndefinedOrEmptyString({ name: 'Stuff' })).toBe(false);
            expect(check.isNullUndefinedOrEmptyString(' ')).toBe(false);
            expect(check.isNullUndefinedOrEmptyString([])).toBe(false);
        });
    });
});
