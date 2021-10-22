import Filter from '../Filter';

describe('Filter', () => {
    describe('getFilter', () => {
        it('should create an instance of filter', () => {
            expect(Filter.getFilter()).toBeInstanceOf(Filter);
        });
    });

    describe('instance', () => {
        let mockModelDefinition;
        let filter;
        let addFilterCallback;

        beforeEach(() => {
            mockModelDefinition = {};

            addFilterCallback = jest.fn()
                .mockReturnValue(mockModelDefinition);
            filter = new Filter(addFilterCallback);
        });

        it('should have a comparator', () => {
            expect(filter.comparator).toBeDefined();
        });

        it('the comparator should default to like', () => {
            expect(filter.comparator).toBe('like');
        });

        it('should set the default properyName to name', () => {
            expect(filter.propertyName).toBe('name');
        });

        describe('comparators', () => {
            it('should have an like  method', () => {
                expect(filter.like).toBeInstanceOf(Function);
            });

            it('should have an ilike method', () => {
                expect(filter.ilike).toBeInstanceOf(Function);
            });

            it('should have an equals method', () => {
                expect(filter.equals).toBeInstanceOf(Function);
            });

            it('should have a token method', () => {
                expect(filter.token).toBeInstanceOf(Function);
            });

            it('should have a nToken method', () => {
                expect(filter.nToken).toBeInstanceOf(Function);
            });

            it('should set the correct comparator', () => {
                filter.equals('ANC');

                expect(filter.comparator).toBe('eq');
            });

            it('should set the passed filterValue onto the filter', () => {
                filter.equals('ANC');

                expect(filter.filterValue).toBe('ANC');
            });

            it('should throw an error when no filterValue is provided', () => {
                expect(() => filter.equals()).toThrowError('filterValue should be provided');
            });

            it('should return the modelDefinition', () => {
                expect(filter.equals('ANC')).toBe(mockModelDefinition);
            });

            it('should call the filter callback with the new filter', () => {
                filter.on('year').equals('2013');

                expect(addFilterCallback).toHaveBeenCalled();
            });
        });

        describe('on', () => {
            it('should be a function', () => {
                expect(filter.on).toBeInstanceOf(Function);
            });

            it('should return itself for chaining', () => {
                expect(filter.on('name')).toBe(filter);
            });

            it('should throw an error when the propertyName is undefined', () => {
                expect(() => filter.on()).toThrowError('Property name to filter on should be provided');
            });

            it('should set the propertyName onto the filter', () => {
                filter.on('year');

                expect(filter.propertyName).toBe('year');
            });
        });

        describe('getQueryParamFormat', () => {
            beforeEach(() => {
                filter.on('code').equals('Partner_343');
            });

            it('should be a function', () => {
                expect(filter.getQueryParamFormat).toBeInstanceOf(Function);
            });

            it('should return the filter value in the expected query format', () => {
                expect(filter.getQueryParamFormat()).toBe('code:eq:Partner_343');
            });
        });
    });
});
