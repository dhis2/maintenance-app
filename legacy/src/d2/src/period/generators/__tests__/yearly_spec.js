import { generateYearlyPeriodsUpToYear } from '../yearly';

describe('Yearly period', () => {
    describe('generateYearlyPeriodsUpToYear()', () => {
        it('should not allow years before the year zero', () => {
            expect(() => generateYearlyPeriodsUpToYear(-10)).toThrowError();
        });

        it('should throw an error when passing a Date object', () => {
            expect(() => generateYearlyPeriodsUpToYear(new Date())).toThrowError();
        });

        it('should generate 10 yearly periods when no numberOfYears was passed', () => {
            expect(generateYearlyPeriodsUpToYear(2017)).toHaveLength(10);
        });

        it('should generate periods for 10 years with the last one being the current year', () => {
            const tenYearlyPeriods = generateYearlyPeriodsUpToYear(2017);

            expect(tenYearlyPeriods).toEqual([
                {
                    endDate: '2008-12-31',
                    startDate: '2008-01-01',
                    name: '2008',
                    id: '2008',
                }, {
                    endDate: '2009-12-31',
                    startDate: '2009-01-01',
                    name: '2009',
                    id: '2009',
                }, {
                    endDate: '2010-12-31',
                    startDate: '2010-01-01',
                    name: '2010',
                    id: '2010',
                }, {
                    endDate: '2011-12-31',
                    startDate: '2011-01-01',
                    name: '2011',
                    id: '2011',
                }, {
                    endDate: '2012-12-31',
                    startDate: '2012-01-01',
                    name: '2012',
                    id: '2012',
                }, {
                    endDate: '2013-12-31',
                    startDate: '2013-01-01',
                    name: '2013',
                    id: '2013',
                }, {
                    endDate: '2014-12-31',
                    startDate: '2014-01-01',
                    name: '2014',
                    id: '2014',
                }, {
                    endDate: '2015-12-31',
                    startDate: '2015-01-01',
                    name: '2015',
                    id: '2015',
                }, {
                    endDate: '2016-12-31',
                    startDate: '2016-01-01',
                    name: '2016',
                    id: '2016',
                }, {
                    endDate: '2017-12-31',
                    startDate: '2017-01-01',
                    name: '2017',
                    id: '2017',
                },
            ]);
        });

        it('should respect the number of years parameter and generate the correct number of years', () => {
            const fiveYearlyPeriods = generateYearlyPeriodsUpToYear(2017, 5);

            expect(fiveYearlyPeriods).toEqual([
                {
                    endDate: '2013-12-31',
                    startDate: '2013-01-01',
                    name: '2013',
                    id: '2013',
                }, {
                    endDate: '2014-12-31',
                    startDate: '2014-01-01',
                    name: '2014',
                    id: '2014',
                }, {
                    endDate: '2015-12-31',
                    startDate: '2015-01-01',
                    name: '2015',
                    id: '2015',
                }, {
                    endDate: '2016-12-31',
                    startDate: '2016-01-01',
                    name: '2016',
                    id: '2016',
                }, {
                    endDate: '2017-12-31',
                    startDate: '2017-01-01',
                    name: '2017',
                    id: '2017',
                },
            ]);
        });

        it('should throw an error when the numberOfYears is not a positive integer', () => {
            expect(() => generateYearlyPeriodsUpToYear(2017, 'a')).toThrowError();
            expect(() => generateYearlyPeriodsUpToYear(2017, 1.2)).toThrowError();
            expect(() => generateYearlyPeriodsUpToYear(2017, true)).toThrowError();
            expect(() => generateYearlyPeriodsUpToYear(2017, -1)).toThrowError();
            expect(() => generateYearlyPeriodsUpToYear(2017, 0)).toThrowError();
            expect(() => generateYearlyPeriodsUpToYear(2017, Infinity)).toThrowError();
        });

        it('should generate the yearly periods for 2021 and 2022', () => {
            const fiveYearlyPeriods = generateYearlyPeriodsUpToYear(2022, 2);

            expect(fiveYearlyPeriods).toEqual([
                {
                    endDate: '2021-12-31',
                    startDate: '2021-01-01',
                    name: '2021',
                    id: '2021',
                }, {
                    endDate: '2022-12-31',
                    startDate: '2022-01-01',
                    name: '2022',
                    id: '2022',
                },
            ]);
        });

        it('should use the current year when no year has been given', () => {
            expect(generateYearlyPeriodsUpToYear()).toEqual(generateYearlyPeriodsUpToYear(new Date().getFullYear()));
        });
    });
});
