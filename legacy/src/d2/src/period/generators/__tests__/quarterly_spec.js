import { generateQuarterlyPeriodsForYear } from '../quarterly';

describe('Quarterly period', () => {
    describe('generateQuarterlyPeriodsForYear()', () => {
        it('should not allow years before the year zero', () => {
            expect(() => generateQuarterlyPeriodsForYear(-10)).toThrowError();
        });

        it('should throw an error when passing a Date object', () => {
            expect(() => generateQuarterlyPeriodsForYear(new Date())).toThrowError();
        });

        it('should generate 4 periods for a year', () => {
            expect(generateQuarterlyPeriodsForYear(2017)).toHaveLength(4);
        });

        it('should generate the correct quarter periods', () => {
            expect(generateQuarterlyPeriodsForYear(2017)).toEqual([
                {
                    startDate: '2017-01-01',
                    endDate: '2017-03-31',
                    name: 'January - March 2017',
                    id: '2017Q1',
                }, {
                    startDate: '2017-04-01',
                    endDate: '2017-06-30',
                    name: 'April - June 2017',
                    id: '2017Q2',
                }, {
                    startDate: '2017-07-01',
                    endDate: '2017-09-30',
                    name: 'July - September 2017',
                    id: '2017Q3',
                }, {
                    startDate: '2017-10-01',
                    endDate: '2017-12-31',
                    name: 'October - December 2017',
                    id: '2017Q4',
                },
            ]);
        });

        it('should generate the same periods when called without as when called with the current year', () => {
            expect(generateQuarterlyPeriodsForYear()).toEqual(generateQuarterlyPeriodsForYear(new Date().getFullYear()));
        });
    });
});
