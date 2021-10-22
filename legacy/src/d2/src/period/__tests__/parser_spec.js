import { getPeriodFromPeriodId } from '../parser';

function makePeriodFixture(id, name, startDate, endDate) {
    return { id, name, startDate, endDate };
}

const periodFixtures = {
    // Daily
    19810331: makePeriodFixture('19810331', 'March 31, 1981', '1981-03-31', '1981-03-31'),
    20171231: makePeriodFixture('20171231', 'December 31, 2017', '2017-12-31', '2017-12-31'),
    20040229: makePeriodFixture('20040229', 'February 29, 2004', '2004-02-29', '2004-02-29'),
    20170229: makePeriodFixture('20170301', 'March 1, 2017', '2017-03-01', '2017-03-01'),
    // Weekly
    '2017W4': makePeriodFixture('2017W4', '2017 W4 January 23 - 29', '2017-01-23', '2017-01-29'),
    '1981W37': makePeriodFixture('1981W37', '1981 W37 September 7 - 13', '1981-09-07', '1981-09-13'),
    '2015W1': makePeriodFixture('2015W1', '2015 W1 December 29 - January 4', '2014-12-29', '2015-01-04'),
    '1981W1': makePeriodFixture('1981W1', '1981 W1 December 29 - January 4', '1980-12-29', '1981-01-04'),
    '2015W53': makePeriodFixture('2015W53', '2015 W53 December 28 - January 3', '2015-12-28', '2016-01-03'),
    '2016W53': makePeriodFixture('2017W1', '2017 W1 January 2 - 8', '2017-01-02', '2017-01-08'),
    '2016W52': makePeriodFixture('2016W52', '2016 W52 December 26 - January 1', '2016-12-26', '2017-01-01'),
    '2017W04': makePeriodFixture('2017W4', '2017 W4 January 23 - 29', '2017-01-23', '2017-01-29'),
    // Weekly Wednesday/Thursday/Saturday/Sunday
    '2017WedW4': makePeriodFixture('2017WedW4', '2017 W4 January 25 - 31', '2017-01-25', '2017-01-31'),
    '2017ThuW4': makePeriodFixture('2017ThuW4', '2017 W4 January 26 - February 1', '2017-01-26', '2017-02-01'),
    '2017SatW4': makePeriodFixture('2017SatW4', '2017 W4 January 21 - 27', '2017-01-21', '2017-01-27'),
    '2017SunW4': makePeriodFixture('2017SunW4', '2017 W4 January 22 - 28', '2017-01-22', '2017-01-28'),
    // Monthly
    198103: makePeriodFixture('198103', 'March 1981', '1981-03-01', '1981-03-31'),
    198002: makePeriodFixture('198002', 'February 1980', '1980-02-01', '1980-02-29'),
    198102: makePeriodFixture('198102', 'February 1981', '1981-02-01', '1981-02-28'),
    // BiMonthly
    '198101B': makePeriodFixture('198101B', 'January - February 1981', '1981-01-01', '1981-02-28'),
    '198102B': makePeriodFixture('198102B', 'March - April 1981', '1981-03-01', '1981-04-30'),
    '198103B': makePeriodFixture('198103B', 'May - June 1981', '1981-05-01', '1981-06-30'),
    '198104B': makePeriodFixture('198104B', 'July - August 1981', '1981-07-01', '1981-08-31'),
    '198105B': makePeriodFixture('198105B', 'September - October 1981', '1981-09-01', '1981-10-31'),
    '198106B': makePeriodFixture('198106B', 'November - December 1981', '1981-11-01', '1981-12-31'),
    // Quarterly
    '1981Q1': makePeriodFixture('1981Q1', 'January - March 1981', '1981-01-01', '1981-03-31'),
    '1981Q2': makePeriodFixture('1981Q2', 'April - June 1981', '1981-04-01', '1981-06-30'),
    '1981Q3': makePeriodFixture('1981Q3', 'July - September 1981', '1981-07-01', '1981-09-30'),
    '1981Q4': makePeriodFixture('1981Q4', 'October - December 1981', '1981-10-01', '1981-12-31'),
    // SixMonthly
    '1981S1': makePeriodFixture('1981S1', 'January - June 1981', '1981-01-01', '1981-06-30'),
    '1981S2': makePeriodFixture('1981S2', 'July - December 1981', '1981-07-01', '1981-12-31'),
    // SixMonthlyApril
    '1981AprilS1': makePeriodFixture('1981AprilS1', 'April - September 1981', '1981-04-01', '1981-09-30'),
    '1981AprilS2': makePeriodFixture('1981AprilS2', 'October 1981 - March 1982', '1981-10-01', '1982-03-31'),
    // Yearly
    1981: makePeriodFixture('1981', '1981', '1981-01-01', '1981-12-31'),
    2017: makePeriodFixture('2017', '2017', '2017-01-01', '2017-12-31'),
    // FinancialApril
    '1981April': makePeriodFixture('1981April', 'April 1981 - March 1982', '1981-04-01', '1982-03-31'),
    // FinancialJuly
    '1981July': makePeriodFixture('1981July', 'July 1981 - June 1982', '1981-07-01', '1982-06-30'),
    // FinancialOct
    '1981Oct': makePeriodFixture('1981Oct', 'October 1981 - September 1982', '1981-10-01', '1982-09-30'),
};

function doPeriodTest(id) {
    expect(getPeriodFromPeriodId(id)).toEqual(periodFixtures[id]);
}

describe('getPeriodFromPeriodId(periodId, locale) period parser', () => {
    describe('for Daily periods', () => {
        it('should handle valid Daily periods', () => {
            doPeriodTest('19810331');
            doPeriodTest('20171231');
            doPeriodTest('20040229');
        });
        // it('should handle Daily periods in French');
        it('should accept nearly valid Daily periods', () => {
            doPeriodTest('20170229');
        });
        it('should not accept invalid Daily periods', () => {
            expect(() => getPeriodFromPeriodId('19813103')).toThrowError();
            expect(() => getPeriodFromPeriodId('20170000')).toThrowError();
        });
    });
    describe('for Weekly periods', () => {
        it('should handle valid Weekly periods', () => {
            doPeriodTest('2017W4');
            doPeriodTest('1981W37');
        });
        // it('should handle Weekly periods in French');
        it('should handle Week 1 that starts the previous year', () => {
            doPeriodTest('2015W1');
            doPeriodTest('1981W1');
        });
        it('should handle Week 53 for 53-week years', () => {
            doPeriodTest('2015W53');
        });
        it('should handle Week 53 for 52-week years', () => {
            doPeriodTest('2016W53');
        });
        it('should handle weeks that end the following year', () => {
            doPeriodTest('2016W52');
        });
        it('should not accept week numbers higher than 53', () => {
            expect(() => getPeriodFromPeriodId('2017W54')).toThrowError();
        });
        it('should not accept week numbers below 1', () => {
            expect(() => getPeriodFromPeriodId('2017W0')).toThrowError();
        });
        it('should handle Week 1-9 with leading zero', () => {
            doPeriodTest('2017W04');
        });
        it('should handle Weekly Wednesday period types', () => {
            doPeriodTest('2017WedW4');
        });
        it('should handle Weekly Thursday period types', () => {
            doPeriodTest('2017ThuW4');
        });
        it('should handle Weekly Saturday period types', () => {
            doPeriodTest('2017SatW4');
        });
        it('should handle Weekly Sunday period types', () => {
            doPeriodTest('2017SunW4');
        });
    });
    describe('for Monthly periods', () => {
        it('should handle valid Monthly periods', () => {
            doPeriodTest('198103');
        });
        // it('should handle Monthly periods in French');
        it('should handle February properly in leap years', () => {
            doPeriodTest('198002');
        });
        it('should handle February properly in normal years', () => {
            doPeriodTest('198102');
        });
        it('should not accept invalid Monthly periods', () => {
            expect(() => getPeriodFromPeriodId('193414')).toThrowError();
        });
    });
    describe('for BiMonthly periods', () => {
        it('should handle valid BiMonthly periods', () => {
            doPeriodTest('198101B');
            doPeriodTest('198102B');
            doPeriodTest('198103B');
            doPeriodTest('198104B');
            doPeriodTest('198105B');
            doPeriodTest('198106B');
        });
        // it('should handle BiMonthly periods in French');
        it('should not accept invalid BiMonthly periods without leading zeros', () => {
            expect(() => getPeriodFromPeriodId('19812B')).toThrowError();
        });
        it('should not accept BiMonthly periods above 6', () => {
            expect(() => getPeriodFromPeriodId('198107B')).toThrowError();
        });
        it('should not accept BiMonthly periods below 1', () => {
            expect(() => getPeriodFromPeriodId('198100B')).toThrowError();
        });
    });
    describe('for Quarterly periods', () => {
        it('should handle Quarters 1-4', () => {
            doPeriodTest('1981Q1');
            doPeriodTest('1981Q2');
            doPeriodTest('1981Q3');
            doPeriodTest('1981Q4');
        });
        // it('should handle Quarters in French');
        it('should not accept Quarters below 1 or above 4', () => {
            expect(() => getPeriodFromPeriodId('1981Q0')).toThrowError();
            expect(() => getPeriodFromPeriodId('2017Q5')).toThrowError();
        });
    });
    describe('for SixMonthly periods', () => {
        it('should handle valid SixMonthly periods', () => {
            doPeriodTest('1981S1');
            doPeriodTest('1981S2');
        });
        // it('should handle SixMonthly periods in French');
        it('should not accept SixMonthly periods below 1 or above 2', () => {
            expect(() => getPeriodFromPeriodId('1981S0')).toThrowError();
            expect(() => getPeriodFromPeriodId('1981S3')).toThrowError();
        });
    });
    describe('for SixMonthlyApril periods', () => {
        it('should handle valid SixMonthlyApril periods', () => {
            doPeriodTest('1981AprilS1');
            doPeriodTest('1981AprilS2');
        });
        // it('should handle SixMonthlyApril periods in French');
        it('should not accept SixMonthlyApril periods below 1 or above 2', () => {
            expect(() => getPeriodFromPeriodId('1981AprilS0')).toThrowError();
            expect(() => getPeriodFromPeriodId('1981AprilS3')).toThrowError();
        });
    });
    describe('for Yearly periods', () => {
        it('should handle valid Yearly periods', () => {
            doPeriodTest('1981');
            doPeriodTest('2017');
        });
    });
    describe('for FinancialApril periods', () => {
        it('should handle FinancialApril periods', () => {
            doPeriodTest('1981April');
        });
        // xit('should handle FinancialApril periods in French', () => {
        //     expect(getPeriodFromPeriodId('1981April', 'fr')).to.deep.equal(
        //         makePeriodFixture('1981April', 'avril 1981 - march 1982', '1981-04-01', '1982-03-31')
        //     );
        // });
    });
    describe('for FinancialJuly periods', () => {
        it('should handle FinancialJuly periods', () => {
            doPeriodTest('1981July');
        });
        // xit('should handle FinancialJuly periods in French', () => {
        //     expect(getPeriodFromPeriodId('1981July', 'fr')).to.deep.equal(
        //         makePeriodFixture('1981July', 'juilet 1981 - juin 1982', '1981-07-01', '1982-06-30')
        //     );
        // });
    });
    describe('for FinancialOct periods', () => {
        it('should handle FinancialOct periods', () => {
            doPeriodTest('1981Oct');
        });
        // xit('should handle FinancialOct periods in French', () => {
        //     expect(getPeriodFromPeriodId('1981Oct', 'fr')).to.deep.equal(
        //         makePeriodFixture('1981Oct', 'octobre 1981 - septembre 1982', '1981-10-01', '1982-09-30')
        //     );
        // });
    });
    describe('for invalid periods', () => {
        it('should not accept invalid periods', () => {
            expect(() => getPeriodFromPeriodId('test')).toThrowError();
            expect(() => getPeriodFromPeriodId('1234567890')).toThrowError();
        });
    });
});
