import { generateMonthlyPeriodsForYear } from '../monthly';

describe('Monthly period', () => {
    describe('generateMonthlyPeriodsForYear()', () => {
        it('should not allow years before the year zero', () => {
            expect(() => generateMonthlyPeriodsForYear(-10)).toThrowError();
        });

        it('should throw an error when passing a Date object', () => {
            expect(() => generateMonthlyPeriodsForYear(new Date())).toThrowError();
        });

        it('should return 12 monthly periods for 2017', () => {
            expect(generateMonthlyPeriodsForYear()).toHaveLength(12);
        });

        it('should return the correct content for each period', () => {
            const monthlyPeriods = generateMonthlyPeriodsForYear(2017);

            expect(monthlyPeriods[0]).toEqual({
                startDate: '2017-01-01',
                endDate: '2017-01-31',
                name: 'January 2017',
                id: '201701',
            });
        });

        it('should generate the same periods when called without as when called with the current year', () => {
            expect(generateMonthlyPeriodsForYear()).toEqual(generateMonthlyPeriodsForYear(new Date().getFullYear()));
        });
    });
});
