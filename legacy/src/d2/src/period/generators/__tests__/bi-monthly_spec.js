import { generateBiMonthlyPeriodsForYear } from '../bi-monthly';

describe('Bi-monthly period', () => {
    describe('generateBiMonthlyPeriodsForYear()', () => {
        it('should not allow years before the year zero', () => {
            expect(() => generateBiMonthlyPeriodsForYear(-10)).toThrowError();
        });

        it('should throw an error when passing a Date object', () => {
            expect(() => generateBiMonthlyPeriodsForYear(new Date())).toThrowError();
        });

        it('should return 6 bi-monthly periods for 2017', () => {
            expect(generateBiMonthlyPeriodsForYear(2017)).toHaveLength(6);
        });

        it('should return the correct periods for a year', () => {
            expect(generateBiMonthlyPeriodsForYear(2017)).toEqual([{
                startDate: '2017-01-01',
                endDate: '2017-02-28',
                name: 'January - February 2017',
                id: '201701B',
            }, {
                startDate: '2017-03-01',
                endDate: '2017-04-30',
                name: 'March - April 2017',
                id: '201702B',
            }, {
                startDate: '2017-05-01',
                endDate: '2017-06-30',
                name: 'May - June 2017',
                id: '201703B',
            }, {
                startDate: '2017-07-01',
                endDate: '2017-08-31',
                name: 'July - August 2017',
                id: '201704B',
            }, {
                startDate: '2017-09-01',
                endDate: '2017-10-31',
                name: 'September - October 2017',
                id: '201705B',
            }, {
                startDate: '2017-11-01',
                endDate: '2017-12-31',
                name: 'November - December 2017',
                id: '201706B',
            }]);
        });

        it('should generate the same periods when called without as when called with the current year', () => {
            expect(generateBiMonthlyPeriodsForYear()).toEqual(generateBiMonthlyPeriodsForYear(new Date().getFullYear()));
        });
    });
});
