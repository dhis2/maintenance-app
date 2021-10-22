import { generateSixMonthlyPeriodsForYear } from '../six-monthly';

describe('Six-monthly period', () => {
    describe('generateSixMonthlyPeriodsForYear()', () => {
        it('should not allow years before the year zero', () => {
            expect(() => generateSixMonthlyPeriodsForYear(-10)).toThrowError();
        });

        it('should throw an error when passing a Date object', () => {
            expect(() => generateSixMonthlyPeriodsForYear(new Date())).toThrowError();
        });

        it('should generate two quarterly periods', () => {
            expect(generateSixMonthlyPeriodsForYear(2017)).toHaveLength(2);
        });

        it('should generate the correct two six-monthly periods', () => {
            expect(generateSixMonthlyPeriodsForYear(2017)).toEqual([
                {
                    startDate: '2017-01-01',
                    endDate: '2017-06-30',
                    name: 'January - June 2017',
                    id: '2017S1',
                }, {
                    startDate: '2017-07-01',
                    endDate: '2017-12-31',
                    name: 'July - December 2017',
                    id: '2017S2',
                },
            ]);
        });

        it('should generate the same periods when called without as when called with the current year', () => {
            expect(generateSixMonthlyPeriodsForYear()).toEqual(generateSixMonthlyPeriodsForYear(new Date().getFullYear()));
        });
    });
});
