import fixtures from '../../__fixtures__/fixtures';
import MockApi from '../../api/Api';
import AnalyticsRequest from '../AnalyticsRequest';
import AnalyticsAggregate from '../AnalyticsAggregate';

jest.mock('../../api/Api'); // src/api/__mocks/Api.js

const debugSqlFixture = `select de.name as de_name, de.uid as de_uid, de.dataelementid as de_id, pe.startdate as
start_date, pe.enddate as end_date, pt.name as pt_name, ou.name as ou_name, ou.uid as ou_uid, ou.organisationunitid as
ou_id, coc.name as coc_name, coc.uid as coc_uid, coc.categoryoptioncomboid as coc_id, aoc.name as aoc_name, aoc.uid as
aoc_uid, aoc.categoryoptioncomboid as aoc_id, dv.value as datavalue from datavalue dv inner join dataelement de on
dv.dataelementid = de.dataelementid inner join period pe on dv.periodid = pe.periodid inner join periodtype pt on
pe.periodtypeid = pt.periodtypeid inner join organisationunit ou on dv.sourceid = ou.organisationunitid inner join
categoryoptioncombo coc on dv.categoryoptioncomboid = coc.categoryoptioncomboid inner join categoryoptioncombo aoc on
dv.attributeoptioncomboid = aoc.categoryoptioncomboid where dv.dataelementid in (359596,359597) and ((pe.startdate >=
    '2016-01-01' and pe.enddate <= '2016-03-31') or (pe.startdate >= '2016-04-01' and pe.enddate <= '2016-06-30') ) and
((dv.sourceid in (select organisationunitid from _orgunitstructure where idlevel2 = 264)) ) and dv.deleted is false
limit 100000`;

describe('Analytics.aggregate', () => {
    let aggregate;
    let request;
    let mockApi;
    let fixture;

    beforeEach(() => {
        mockApi = MockApi.getApi();
        MockApi.mockClear();
        aggregate = new AnalyticsAggregate();
    });

    it('should not be allowed to be called without new', () => {
        expect(() => AnalyticsAggregate()).toThrowError('Cannot call a class as a function'); // eslint-disable-line new-cap
    });

    it('should add the mockApi onto the AnalyticsAggregate instance', () => {
        expect(aggregate.api).toBe(mockApi);
    });

    it('should use the api object when it is passed', () => {
        const apiMockObject = {};

        aggregate = new AnalyticsAggregate(apiMockObject);

        expect(aggregate.api).toBe(apiMockObject);
    });

    describe('.getDataValueSet()', () => {
        beforeEach(() => {
            aggregate = new AnalyticsAggregate(new MockApi());

            request = new AnalyticsRequest();

            request
                .addDataDimension(['fbfJHSPpUQD.pq2XI5kz2BY', 'fbfJHSPpUQD.PT59n8BQbqM'])
                .addPeriodDimension('LAST_MONTH')
                .addOrgUnitDimension('ImspTQPwCqd');

            fixture = fixtures.get('/api/analytics/dataValueSet');

            mockApi.get.mockReturnValue(Promise.resolve(fixture));
        });

        it('should be a function', () => {
            expect(aggregate.getDataValueSet).toBeInstanceOf(Function);
        });

        it('should resolve a promise with data', () => aggregate.getDataValueSet(request)
            .then((data) => {
                expect(data.dataValues.length).toEqual(fixture.dataValues.length);
            }));
    });

    describe('.getDebugSql()', () => {
        beforeEach(() => {
            aggregate = new AnalyticsAggregate(new MockApi());

            request = new AnalyticsRequest();

            request
                .addDataDimension(['fbfJHSPpUQD', 'cYeuwXTCPkU'])
                .addPeriodFilter(['2016Q1', '2016Q2'])
                .addOrgUnitFilter('O6uvpzGd5pu');

            mockApi.get.mockReturnValue(Promise.resolve(debugSqlFixture));
        });

        it('should be a function', () => {
            expect(aggregate.getDebugSql).toBeInstanceOf(Function);
        });

        it('should resolve a promise with data', () => aggregate.getDebugSql(request)
            .then((data) => {
                expect(data).toEqual(debugSqlFixture);
            }));
    });

    describe('.getRawData', () => {
        beforeEach(() => {
            aggregate = new AnalyticsAggregate(new MockApi());

            request = new AnalyticsRequest();

            request
                .addDataDimension(['fbfJHSPpUQD', 'cYeuwXTCPkU', 'Jtf34kNZhzP'])
                .addDimension('J5jldMd8OHv')
                .addDimension('Bpx0589u8y0')
                .addOrgUnitDimension(['O6uvpzGd5pu', 'fdc6uOvgoji'])
                .withStartDate('2016-01-01')
                .withEndDate('2016-01-31');

            fixture = fixtures.get('/api/analytics/rawData');

            mockApi.get.mockReturnValue(Promise.resolve(fixture));
        });

        it('should be a function', () => {
            expect(aggregate.getRawData).toBeInstanceOf(Function);
        });

        it('should resolve a promise with data', () => aggregate.getRawData(request)
            .then((data) => {
                expect(data.metaData.items).toEqual(fixture.metaData.items);
                expect(data.metaData.dimensions).toEqual(fixture.metaData.dimensions);
                expect(data.width).toEqual(0);
                expect(data.height).toEqual(0);
            }));
    });
});
