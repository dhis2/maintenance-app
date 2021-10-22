import MockApi from '../../api/Api';
import AnalyticsBase from '../AnalyticsBase';

jest.mock('../../api/Api'); // src/api/__mocks/Api.js

let base;

describe('constructor', () => {
    beforeEach(() => {
        base = new AnalyticsBase(new MockApi());
    });

    it('should not be allowed to be called without new', () => {
        expect(() => AnalyticsBase()).toThrowError('Cannot call a class as a function'); // eslint-disable-line new-cap
    });

    it('should add the mockApi onto the AnalyticsBase instance', () => {
        const mockApi = MockApi.getApi();
        MockApi.mockClear();

        expect(base.api).toBe(mockApi);
    });

    it('should use the api object when it is passed', () => {
        const apiMockObject = {};

        base = new AnalyticsBase(apiMockObject);

        expect(base.api).toBe(apiMockObject);
    });
});
