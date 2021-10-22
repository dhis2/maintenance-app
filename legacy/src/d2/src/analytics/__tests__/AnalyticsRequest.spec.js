import AnalyticsRequest from '../AnalyticsRequest';

let request;
let expectedParameters;

const getFuncName = parameter => `with${parameter.charAt(0).toUpperCase()}${parameter.slice(1)}`;

describe('AnalyticsRequest', () => {
    beforeEach(() => {
        request = new AnalyticsRequest();
        expectedParameters = {};
    });

    describe('constructor', () => {
        it('should not be allowed to be called without new', () => {
            expect(() => AnalyticsRequest()).toThrowError('Cannot call a class as a function'); // eslint-disable-line new-cap
        });

        it('should initialize properties', () => {
            expect(request.parameters).toEqual({});
            expect(request.dimensions).toEqual({});
            expect(request.filters).toEqual({});
        });

        it('should have a default endpoint value', () => {
            expect(request.endPoint).toEqual('analytics');
        });

        it('should set the endpoint when passed as argument', () => {
            request = new AnalyticsRequest({ endPoint: 'analytics2' });

            expect(request.endPoint).toEqual('analytics2');
        });
    });

    describe('properties', () => {
        describe('.addDataDimension()', () => {
            it('should add the dx dimension', () => {
                request.addDataDimension('Jtf34kNZhzP');

                expect(request.dimensions).toEqual({
                    dx: ['Jtf34kNZhzP'],
                });
            });

            it('should append unique values to the dx dimension on subsequent calls', () => {
                request = request
                    .addDataDimension('Jtf34kNZhzP')
                    .addDataDimension([
                        'Jtf34kNZhzP', 'SA7WeFZnUci', 'V37YqbqpEhV',
                        'bqK6eSIwo3h', 'cYeuwXTCPkU', 'fbfJHSPpUQD',
                    ]);

                expect(request.dimensions).toEqual({
                    dx: ['Jtf34kNZhzP', 'SA7WeFZnUci', 'V37YqbqpEhV', 'bqK6eSIwo3h', 'cYeuwXTCPkU', 'fbfJHSPpUQD'],
                });
            });
        });

        describe('.addOrgUnitDimension()', () => {
            it('should add the ou dimension', () => {
                request.addOrgUnitDimension(['ImspTQPwCqd']);

                expect(request.dimensions).toEqual({
                    ou: ['ImspTQPwCqd'],
                });
            });

            it('should append unique values to the ou dimension on subsequent calls', () => {
                request = request
                    .addOrgUnitDimension(['ImspTQPwCqd'])
                    .addOrgUnitDimension(['ImspTQPwCqd', 'O6uvpzGd5pu']);

                expect(request.dimensions).toEqual({
                    ou: ['ImspTQPwCqd', 'O6uvpzGd5pu'],
                });
            });
        });

        describe('.addPeriodDimension()', () => {
            it('should add the pe dimension', () => {
                request.addPeriodDimension('2017-01');

                expect(request.dimensions).toEqual({
                    pe: ['2017-01'],
                });
            });

            it('should append unique values to the pe dimension on subsequent calls', () => {
                request = request
                    .addPeriodDimension('2017-01')
                    .addPeriodDimension(['2017-01', '2017-02', '2017-03']);

                expect(request.dimensions).toEqual({
                    pe: ['2017-01', '2017-02', '2017-03'],
                });
            });
        });

        describe('.addDimension()', () => {
            it('should add the given dimension without any associated value', () => {
                request.addDimension('Jtf34kNZhzP');

                expect(request.dimensions).toEqual({
                    Jtf34kNZhzP: [],
                });
            });

            it('should add the given dimension with the associated value (passed as string)', () => {
                request.addDimension('J5jldMd8OHv', 'CXw2yu5fodb');

                expect(request.dimensions).toEqual({
                    J5jldMd8OHv: ['CXw2yu5fodb'],
                });
            });

            it('should append values (passed as array) to the given dimension', () => {
                request = request
                    .addDimension('J5jldMd8OHv', 'CXw2yu5fodb')
                    .addDimension('J5jldMd8OHv', ['EYbopBOJWsW', 'test']);

                expect(request.dimensions).toEqual({
                    J5jldMd8OHv: ['CXw2yu5fodb', 'EYbopBOJWsW', 'test'],
                });
            });

            it('should not append a value already present in the dimension', () => {
                request = request
                    .addDimension('J5jldMd8OHv', ['EYbopBOJWsW', 'test'])
                    .addDimension('J5jldMd8OHv', 'test');

                expect(request.dimensions).toEqual({
                    J5jldMd8OHv: ['EYbopBOJWsW', 'test'],
                });
            });
        });

        describe('.addDataFilter()', () => {
            it('should add the dx dimension filter', () => {
                request = request.addDataFilter('Jtf34kNZhzP');

                expect(request.filters).toEqual({
                    dx: ['Jtf34kNZhzP'],
                });
            });
        });

        describe('.addOrgUnitFilter()', () => {
            it('should add the ou dimension filter', () => {
                request.addOrgUnitFilter(['ImspTQPwCqd']);

                expect(request.filters).toEqual({
                    ou: ['ImspTQPwCqd'],
                });
            });

            it('should append unique values to the ou dimension filter on subsequent calls', () => {
                request = request
                    .addOrgUnitFilter('ImspTQPwCqd')
                    .addOrgUnitFilter(['ImspTQPwCqd', 'O6uvpzGd5pu']);

                expect(request.filters).toEqual({
                    ou: ['ImspTQPwCqd', 'O6uvpzGd5pu'],
                });
            });
        });

        describe('.addPeriodFilter()', () => {
            it('should add the pe dimension filter', () => {
                request.addPeriodFilter('2017-01');

                expect(request.filters).toEqual({
                    pe: ['2017-01'],
                });
            });

            it('should append unique values to the pe dimension filter on subsequent calls', () => {
                request = request
                    .addPeriodFilter('2017-01')
                    .addPeriodFilter(['2017-01', '2017-02', '2017-03']);

                expect(request.filters).toEqual({
                    pe: ['2017-01', '2017-02', '2017-03'],
                });
            });
        });

        describe('.addFilter()', () => {
            it('should add the given dimensions as filter without any associated value', () => {
                request.addFilter('Jtf34kNZhzP');

                expect(request.filters).toEqual({
                    Jtf34kNZhzP: [],
                });
            });

            it('should add the given dimensions as filter with the associated value (passed as string)', () => {
                request.addFilter('J5jldMd8OHv', 'CXw2yu5fodb');

                expect(request.filters).toEqual({
                    J5jldMd8OHv: ['CXw2yu5fodb'],
                });
            });

            it('should append values (passed as array) to the given dimension filter', () => {
                request = request
                    .addFilter('J5jldMd8OHv', 'CXw2yu5fodb')
                    .addFilter('J5jldMd8OHv', ['EYbopBOJWsW', 'test']);

                expect(request.filters).toEqual({
                    J5jldMd8OHv: ['CXw2yu5fodb', 'EYbopBOJWsW', 'test'],
                });
            });

            it('should not append a value already present in the dimension filter', () => {
                request = request
                    .addFilter('J5jldMd8OHv', ['EYbopBOJWsW', 'test'])
                    .addFilter('J5jldMd8OHv', 'test');

                expect(request.filters).toEqual({
                    J5jldMd8OHv: ['EYbopBOJWsW', 'test'],
                });
            });
        });

        describe('with boolean parameter', () => {
            [
                'aggregateData',
                'coordinatesOnly', 'collapseDataDimensions',
                'hideEmptyRows', 'hideEmptyColumns', 'hierarchyMeta',
                'ignoreLimit', 'includeClusterPoints', 'includeNumDen',
                'showHierarchy', 'skipData', 'skipMeta', 'skipRounding',
                'tableLayout',
            ].forEach((parameter) => {
                const funcName = getFuncName(parameter);

                it(`should add the ${parameter} parameter with default value`, () => {
                    request[funcName]();
                    expectedParameters[parameter] = true;

                    expect(request.parameters).toEqual(expectedParameters);
                });

                it(`should replace the ${parameter} parameter on subsequent calls with the specified value`, () => {
                    request[funcName](false);
                    expectedParameters[parameter] = false;

                    expect(request.parameters).toEqual(expectedParameters);
                });
            });
        });

        describe('with value parameter', () => {
            [
                'approvalLevel',
                'asc', // XXX
                'bbox',
                'clusterSize',
                'columns', // XXX
                'desc', // XXX
                'endDate',
                'inputIdScheme',
                'measureCriteria',
                'outputIdScheme',
                'preAggregationMeasureCriteria',
                'relativePeriodDate',
                'rows', // XXX
                'stage',
                'startDate',
                'userOrgUnit',
                'value', // XXX
            ].forEach((parameter) => {
                const funcName = getFuncName(parameter);

                it(`should add the ${parameter} parameter with the specified value`, () => {
                    request[funcName]('test');
                    expectedParameters[parameter] = 'test';

                    expect(request.parameters).toEqual(expectedParameters);
                });

                it(`should replace the ${parameter} parameter on subsequent calls with the specified value`, () => {
                    request = request[funcName]('test');
                    request[funcName]('test2');
                    expectedParameters[parameter] = 'test2';

                    expect(request.parameters).toEqual(expectedParameters);
                });

                it(`should not replace the ${parameter} parameter when called without passing a value`, () => {
                    request = request[funcName]('test');
                    request[funcName]();
                    expectedParameters[parameter] = 'test';

                    expect(request.parameters).toEqual(expectedParameters);
                });
            });
        });

        describe('with numeric value parameter', () => {
            const params = {
                page: 1,
                pageSize: 50,
            };

            Object.entries(params).forEach(([key, value]) => {
                const parameter = key;
                const funcName = getFuncName(parameter);

                it(`should add the ${parameter} parameter with the default value`, () => {
                    request[funcName]();
                    expectedParameters[parameter] = value;

                    expect(request.parameters).toEqual(expectedParameters);
                });

                it(`should add the ${parameter} parameter with the specified value`, () => {
                    request[funcName](10);
                    expectedParameters[parameter] = 10;

                    expect(request.parameters).toEqual(expectedParameters);
                });

                it(`should replace the ${parameter} parameter on subsequent calls with the specified value`, () => {
                    request = request[funcName](10);
                    request[funcName](20);
                    expectedParameters[parameter] = 20;

                    expect(request.parameters).toEqual(expectedParameters);
                });
            });
        });

        describe('.withCoordinateField()', () => {
            it('should set the coordinateField to the specified value', () => {
                request.withCoordinateField('abc');

                expect(request.parameters).toEqual({ coordinateField: 'abc' });
            });

            it('should set the coordinateField to default value when called with no value', () => {
                request.withCoordinateField();

                expect(request.parameters).toEqual({ coordinateField: 'EVENT' });
            });
        });

        describe('.withFormat()', () => {
            it('should set the format to the specified value', () => {
                request.withFormat('xml');

                expect(request.format).toEqual('xml');
            });

            it('should set the format to default value when called with no value', () => {
                request.withFormat();

                expect(request.format).toEqual('json');
            });
        });

        describe('.withPath()', () => {
            it('should set the request path to the specified value', () => {
                request.withPath('test');

                expect(request.path).toEqual('test');
            });

            it('should replace the path on subsequent requests', () => {
                request = request
                    .withPath('test')
                    .withPath('another/path');

                expect(request.path).toEqual('another/path');
            });

            it('should not replace the path when called with no value', () => {
                request = request
                    .withPath('some/path')
                    .withPath();

                expect(request.path).toEqual('some/path');
            });
        });

        describe('.withProgram()', () => {
            it('should set the program to the specified value', () => {
                request.withProgram('eBAyeGv0exc');

                expect(request.program).toEqual('eBAyeGv0exc');
            });

            it('should not replace the program when called with no value', () => {
                request = request
                    .withProgram('eBAyeGv0exc')
                    .withProgram();

                expect(request.program).toEqual('eBAyeGv0exc');
            });
        });

        describe('.withAggregationType()', () => {
            it('should add the aggregationType parameter with the specified value', () => {
                request.withAggregationType('SUM');

                expect(request.parameters).toEqual({ aggregationType: 'SUM' });
            });

            it('should add the aggregationType parameter and uppercase the value', () => {
                request.withAggregationType('stddev');

                expect(request.parameters).toEqual({ aggregationType: 'STDDEV' });
            });

            it('should allow a aggregationType that is not in present in the list', () => {
                request.withAggregationType('new-constant');

                expect(request.parameters).toEqual({ aggregationType: 'new-constant' });
            });
        });

        describe('.withDisplayProperty()', () => {
            it('should add the displayProperty parameter with the specified value', () => {
                request.withDisplayProperty('NAME');

                expect(request.parameters).toEqual({ displayProperty: 'NAME' });
            });

            it('should add the displayProperty parameter and uppercase the value', () => {
                request.withDisplayProperty('shortname');

                expect(request.parameters).toEqual({ displayProperty: 'SHORTNAME' });
            });

            it('should allow a displayProperty that is not present in the list', () => {
                request.withDisplayProperty('new-constant');

                expect(request.parameters).toEqual({ displayProperty: 'new-constant' });
            });
        });

        describe('.withOuMode()', () => {
            it('should add the ouMode parameter with the specified value', () => {
                request.withOuMode('DESCENDANTS');

                expect(request.parameters).toEqual({ ouMode: 'DESCENDANTS' });
            });

            it('should add the ouMode parameter and uppercase the value', () => {
                request.withOuMode('children');

                expect(request.parameters).toEqual({ ouMode: 'CHILDREN' });
            });

            it('should allow a ouMode that is not present in the list', () => {
                request.withOuMode('new-constant');

                expect(request.parameters).toEqual({ ouMode: 'new-constant' });
            });
        });

        describe('.withOutputType()', () => {
            it('should add the outputType parameter with the specified value', () => {
                request.withOutputType('EVENT');

                expect(request.parameters).toEqual({ outputType: 'EVENT' });
            });

            it('should add the outputType parameter and uppercase the value', () => {
                request.withOutputType('enrollment');

                expect(request.parameters).toEqual({ outputType: 'ENROLLMENT' });
            });

            it('should allow a outputType that is not present in the list', () => {
                request.withOutputType('new-constant');

                expect(request.parameters).toEqual({ outputType: 'new-constant' });
            });
        });

        describe('.withEventStatus()', () => {
            it('should add the eventStatus parameter with the specified value', () => {
                request.withEventStatus('ACTIVE');

                expect(request.parameters).toEqual({ eventStatus: 'ACTIVE' });
            });

            it('should add the eventStatus parameter and uppercase the value', () => {
                request.withEventStatus('skipped');

                expect(request.parameters).toEqual({ eventStatus: 'SKIPPED' });
            });

            it('should allow a eventStatus that is not present in the list', () => {
                request.withEventStatus('new-constant');

                expect(request.parameters).toEqual({ eventStatus: 'new-constant' });
            });
        });

        describe('.withLimit()', () => {
            it('should add the limit parameter with the specified value', () => {
                request.withLimit(1000);

                expect(request.parameters).toEqual({ limit: 1000 });
            });

            it('should not allow a limit greater than 10000', () => {
                request.withLimit('20000');

                expect(request.parameters).toEqual({ limit: 10000 });
            });

            it('should not replace the value when called with no value', () => {
                request = request
                    .withLimit('20000')
                    .withLimit();

                expect(request.parameters).toEqual({ limit: 10000 });
            });
        });

        describe('.withProgramStatus()', () => {
            it('should add the programStatus parameter with the specified value', () => {
                request.withProgramStatus('ACTIVE');

                expect(request.parameters).toEqual({ programStatus: 'ACTIVE' });
            });

            it('should add the programStatus parameter and uppercase the value', () => {
                request.withProgramStatus('completed');

                expect(request.parameters).toEqual({ programStatus: 'COMPLETED' });
            });

            it('should allow a programStatus that is not present in the list', () => {
                request.withProgramStatus('new-constant');

                expect(request.parameters).toEqual({ programStatus: 'new-constant' });
            });
        });

        describe('.withSortOrder()', () => {
            it('should add the sortOrder parameter with the specified value', () => {
                request.withSortOrder('ASC');

                expect(request.parameters).toEqual({ sortOrder: 'ASC' });
            });

            it('should add the sortOrder parameter and uppercase the value', () => {
                request.withSortOrder('desc');

                expect(request.parameters).toEqual({ sortOrder: 'DESC' });
            });

            it('should allow a sortOrder that is not present in the list', () => {
                request.withSortOrder('new-constant');

                expect(request.parameters).toEqual({ sortOrder: 'new-constant' });
            });
        });
    });

    describe('.buildUrl()', () => {
        it('should append the path to the endpoint', () => {
            request = request
                .addOrgUnitDimension(['ImspTQPwCqd'])
                .withPath('test');

            expect(request.buildUrl()).toEqual('analytics/test.json?dimension=ou:ImspTQPwCqd');
        });

        it('shold build the URL with path, program and format', () => {
            request = request
                .withPath('events/aggregate')
                .withProgram('program-id')
                .withFormat('xml')
                .addOrgUnitDimension(['ImspTQPwCqd'])
                .addPeriodDimension('201711')
                .addDataDimension('test-dx-dim');

            const expectedSearchParams = {
                'ou:ImspTQPwCqd': 'dimension',
                'pe:201711': 'dimension',
                'dx:test-dx-dim': 'dimension',
            };

            const url = new URL(`http://localhost/${request.buildUrl()}`);
            const searchParams = {};
            let key;
            let value;

            url.search.slice(1)
                .split('&')
                .forEach((p) => {
                    [key, value] = p.split('=');
                    searchParams[value] = key;
                });

            expect(url.pathname).toEqual('/analytics/events/aggregate/program-id.xml');
            expect(searchParams).toEqual(expectedSearchParams);
        });

        it('should build the URL with a dimension without items', () => {
            request = request.addDimension('test-dim');

            expect(request.buildUrl()).toEqual('analytics.json?dimension=test-dim');
        });
    });

    describe('.buildQuery()', () => {
        it('should return an empty object when there are no filters nor parameters', () => {
            expect(request.buildQuery()).toEqual({});
        });

        it('should return an object when a filter is added', () => {
            request.addOrgUnitFilter(['ImspTQPwCqd']);

            expect(request.buildQuery()).toEqual({ filter: ['ou:ImspTQPwCqd'] });
        });

        it('should return an object when a filter is added with multiple values', () => {
            request.addOrgUnitFilter(['ImspTQPwCqd', 'O6uvpzGd5pu']);

            expect(request.buildQuery()).toEqual({ filter: ['ou:ImspTQPwCqd;O6uvpzGd5pu'] });
        });

        it('should return an object when a parameter is added', () => {
            request.withHierarchyMeta();

            expect(request.buildQuery()).toEqual({ hierarchyMeta: true });
        });

        it('should return an object when parameters and filters are added', () => {
            request = request
                .addOrgUnitFilter(['ImspTQPwCqd', 'O6uvpzGd5pu'])
                .withHierarchyMeta(false);

            expect(request.buildQuery()).toEqual({ hierarchyMeta: false, filter: ['ou:ImspTQPwCqd;O6uvpzGd5pu'] });
        });
    });
});
