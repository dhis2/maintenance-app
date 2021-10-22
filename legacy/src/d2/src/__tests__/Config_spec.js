import Config from '../../src/config';

describe('Config', () => {
    it('should not be allowed to call as function', () => {
        expect(() => Config()).toThrowError();  // eslint-disable-line
    });

    describe('processConfigForD2', () => {
        let mockD2;
        let mockApi;

        beforeEach(() => {
            mockApi = {
                setBaseUrl: jest.fn(),
            };
            mockD2 = {
                model: {
                    ModelDefinition: function ModelDefinition() {},
                    ModelDefinitions: {
                        getModelDefinitions: jest.fn(),
                    },
                },
                Api: {
                    getApi: jest.fn().mockReturnValue(mockApi),
                },
            };
        });

        it('should set the baseUrl on the api object', () => {
            Config.processConfigForD2({ baseUrl: '/api/dhis2' }, mockD2);

            expect(mockApi.setBaseUrl).toBeCalledWith('/api/dhis2');
        });

        it('should call setBaseUrl with the default api location', () => {
            Config.processConfigForD2({}, mockD2);

            expect(mockApi.setBaseUrl).toBeCalledWith('/api');
        });
    });
});
