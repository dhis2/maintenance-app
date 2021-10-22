import fixtures from '../../__fixtures__/fixtures';
import MockApi from '../../api/Api';
import AnalyticsEvents from '../AnalyticsEvents';
import AnalyticsRequest from '../AnalyticsRequest';

jest.mock('../../api/Api'); // src/api/__mocks/Api.js

describe('analytics.events', () => {
    let events;
    let request;
    let mockApi;
    let fixture;

    beforeEach(() => {
        mockApi = MockApi.getApi();
        MockApi.mockClear();
        events = new AnalyticsEvents();
    });

    it('should not be allowed to be called without new', () => {
        expect(() => AnalyticsEvents()).toThrowError('Cannot call a class as a function'); // eslint-disable-line new-cap
    });

    it('should add the mockApi onto the Analyticsevents instance', () => {
        expect(events.api).toBe(mockApi);
    });

    it('should use the api object when it is passed', () => {
        const apiMockObject = {};

        events = new AnalyticsEvents(apiMockObject);

        expect(events.api).toBe(apiMockObject);
    });

    describe('.getAggregate()', () => {
        beforeEach(() => {
            events = new AnalyticsEvents(new MockApi());

            request = new AnalyticsRequest()
                .withLimit(10);

            fixture = fixtures.get('/api/analytics/aggregate');

            mockApi.get.mockReturnValue(Promise.resolve(fixture));
        });

        it('should be a function', () => {
            expect(events.getAggregate).toBeInstanceOf(Function);
        });

        it('should resolve a promise with data', () => events.getAggregate(request)
            .then((data) => {
                expect(data).toEqual(fixture);
            }));
    });

    describe('.getCount()', () => {
        beforeEach(() => {
            events = new AnalyticsEvents(new MockApi());

            request = new AnalyticsRequest()
                .withProgram('eBAyeGv0exc')
                .addPeriodDimension('LAST_YEAR')
                .addOrgUnitDimension('ImspTQPwCqd')
                .addDimension('qrur9Dvnyt5:LT:50');

            fixture = fixtures.get('/api/analytics/count');

            mockApi.get.mockReturnValue(Promise.resolve(fixture));
        });

        it('should be a function', () => {
            expect(events.getCount).toBeInstanceOf(Function);
        });

        it('should resolve a promise with data', () => events.getCount(request)
            .then((data) => {
                expect(data.count).toEqual(fixture.count);
                expect(data.extent).toEqual(fixture.extent);
            }));
    });

    describe('.getCluster()', () => {
        beforeEach(() => {
            events = new AnalyticsEvents(new MockApi());

            request = new AnalyticsRequest()
                .withProgram('VBqh0ynB2wv')
                .addOrgUnitDimension('ImspTQPwCqd')
                .withStage('pTo4uMt3xur')
                .withStartDate('2016-10-17')
                .withEndDate('2017-10-17')
                .withCoordinatesOnly(true)
                .withBbox('-14.062500000000002,5.61598581915534,-11.25,8.407168163601076')
                .withClusterSize(67265)
                .withIncludeClusterPoints(false);

            fixture = fixtures.get('/api/analytics/cluster');

            mockApi.get.mockReturnValue(Promise.resolve(fixture));
        });

        it('should be a function', () => {
            expect(events.getCluster).toBeInstanceOf(Function);
        });

        it('should resolve a promise with data', () => events.getCluster(request)
            .then((data) => {
                expect(data.width).toEqual(fixture.width);
                expect(data.height).toEqual(fixture.height);
            }));
    });

    describe('.getQuery()', () => {
        beforeEach(() => {
            events = new AnalyticsEvents(new MockApi());

            request = new AnalyticsRequest()
                .addOrgUnitDimension('ImspTQPwCqd')
                .addDimension('qrur9Dvnyt5:LT:50')
                .addPeriodFilter('LAST_MONTH')
                .withStage('Zj7UnCAulEk')
                .withPage(1)
                .withPageSize(5);

            fixture = fixtures.get('/api/analytics/query');

            mockApi.get.mockReturnValue(Promise.resolve(fixture));
        });

        it('should be a function', () => {
            expect(events.getQuery).toBeInstanceOf(Function);
        });

        it('should resolve a promise with data', () => events.getQuery(request)
            .then((data) => {
                expect(data.width).toEqual(fixture.width);
                expect(data.height).toEqual(fixture.height);
            }));
    });
});
