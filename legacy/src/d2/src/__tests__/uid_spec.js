import { range } from 'lodash';
import { isValidUid, generateUid } from '../uid';

describe('Uid generation', () => {
    describe('isValidUid()', () => {
        it('should be a function', () => {
            expect(typeof isValidUid).toBe('function');
        });

        it('should return false for undefined', () => {
            expect(isValidUid()).toBe(false);
        });

        it('should return false for null', () => {
            expect(isValidUid(null)).toBe(false);
        });

        it('should return false for 0', () => {
            expect(isValidUid(0)).toBe(false);
        });

        it('should return false for empty string', () => {
            expect(isValidUid('')).toBe(false);
        });

        it('should return false for a uid that is shorter than 11 characters', () => {
            expect(isValidUid('a1234')).toBe(false);
        });

        it('should return true for a valid uid', () => {
            expect(isValidUid('JkWynlWMjJR')).toBe(true);
        });

        it('should return false for a uid that starts with a number', () => {
            expect(isValidUid('0kWynlWMjJR')).toBe(false);
        });

        it('should return false for a uid that has a special character', () => {
            expect(isValidUid('AkWy$lWMjJR')).toBe(false);
        });
    });

    describe('generateUid', () => {
        it('should generate a uid that is 11 characters long', () => {
            expect(generateUid()).toHaveLength(11);
        });

        it('should generate a uid that starts with a letter', () => {
            expect(generateUid()).toMatch(/^[A-z]{1}/);
        });

        it('should not generate the same uids', () => {
            expect(generateUid()).not.toBe(generateUid());
        });

        it('should generate a lot of unique codes', () => {
            const generate500UniqueCodes = () => range(0, 500)
                .map(() => generateUid())
                .reduce((codes, code) => codes.add(code), new Set());

            expect(generate500UniqueCodes).not.toThrowError();
        });
    });
});
