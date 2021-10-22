import { generateDailyPeriodsForYear } from '../daily';
import { getCurrentYear } from '../../../../src/period/helpers';

describe('Daily period', () => {
    describe('generateDailyPeriods()', () => {
        it('should return 365 day items for 2017', () => {
            expect(generateDailyPeriodsForYear(2017)).toHaveLength(365);
        });

        it('should return 366 day items for a leap year (2016)', () => {
            expect(generateDailyPeriodsForYear(2016)).toHaveLength(366);
        });

        it('should have the expected format for each period', () => {
            const periods = generateDailyPeriodsForYear(2017);

            expect(periods[0]).toEqual({
                startDate: '2017-01-01',
                endDate: '2017-01-01',
                name: 'January 1, 2017',
                id: '20170101',
            });
        });

        it('should not allow years before the year zero', () => {
            expect(() => generateDailyPeriodsForYear(-10)).toThrowError();
        });

        it('should throw an error when passing a Date object', () => {
            expect(() => generateDailyPeriodsForYear(new Date())).toThrowError();
        });

        it('should generate the same periods when called without as when called with the current year', () => {
            expect(generateDailyPeriodsForYear()).toEqual(generateDailyPeriodsForYear(getCurrentYear()));
        });
    });
});
