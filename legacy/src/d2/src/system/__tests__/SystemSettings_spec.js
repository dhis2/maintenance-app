import MockApi from '../../api/Api';
import SystemSettings from '../SystemSettings';

jest.mock('../../api/Api');

const settingsFixture = {
    keyLastSuccessfulResourceTablesUpdate: 'Tue Mar 10 12:24:00 CET 2015',
};

describe('settings.System', () => {
    let systemSettings;
    let mockApi;

    beforeEach(() => {
        MockApi.mockReset();
        mockApi = MockApi.getApi();
        systemSettings = new SystemSettings(new MockApi());
    });

    it('should not be allowed to be called without new', () => {
        expect(() => SystemSettings()).toThrowError('Cannot call a class as a function'); // eslint-disable-line
    });

    it('should set an instance of Api onto the SystemSettings instance', () => {
        expect(systemSettings.api).toBe(mockApi);
    });

    describe('all', () => {
        beforeEach(() => {
            systemSettings.api.get
                .mockReturnValueOnce(Promise.resolve(settingsFixture));
        });

        it('should be a function', () => {
            expect(systemSettings.all).toBeInstanceOf(Function);
        });

        it('should call the api to get all the systemSettings', () => systemSettings.all().then(() => {
            expect(mockApi.get).toHaveBeenCalledTimes(1);
            expect(mockApi.get.mock.calls[0][0]).toEqual('systemSettings');
        }));

        it('should resolve the promise with the settings', () => systemSettings.all()
            .then((settings) => {
                expect(settings.keyLastSuccessfulResourceTablesUpdate).toBe('Tue Mar 10 12:24:00 CET 2015');
            }));

        it('should only call the API once', () => systemSettings.all().then(() => systemSettings.all())
            .then(() => {
                expect(systemSettings.settings).toEqual(settingsFixture);
                expect(mockApi.get).toHaveBeenCalledTimes(1);
            }));
    });

    describe('get', () => {
        beforeEach(() => {
            systemSettings = new SystemSettings(MockApi.getApi());
        });

        it('should be a function', () => {
            expect(systemSettings.get).toBeInstanceOf(Function);
        });

        it('should return a Promise', () => {
            systemSettings.api.get
                .mockReturnValueOnce(Promise.resolve(settingsFixture.keyLastSuccessfulResourceTablesUpdate));

            const result = systemSettings.get('keyLastSuccessfulResourceTablesUpdate');

            expect(result).toBeInstanceOf(Promise);
        });

        it('should reject the promise with an error if no key has been specified', (done) => {
            systemSettings.get()
                .catch((error) => {
                    expect(error).toBeInstanceOf(TypeError);
                    expect(error.message).toBe(
                        'A "key" parameter should be specified when calling get() on systemSettings',
                    );
                })
                .then(done);
        });

        it('should call the api to get the value', () => {
            systemSettings.api.get
                .mockReturnValueOnce(Promise.resolve(settingsFixture.keyLastSuccessfulResourceTablesUpdate));

            systemSettings.get('keyLastSuccessfulResourceTablesUpdate');

            expect(systemSettings.api.get.mock.calls[0][0])
                .toBe('systemSettings/keyLastSuccessfulResourceTablesUpdate');
        });

        it('should return the value from the promise', () => {
            systemSettings.api.get
                .mockReturnValueOnce(Promise.resolve(settingsFixture.keyLastSuccessfulResourceTablesUpdate));

            return systemSettings.get('keyLastSuccessfulResourceTablesUpdate')
                .then((value) => {
                    expect(value).toBe('Tue Mar 10 12:24:00 CET 2015');
                });
        });

        it('should try to transform the response to json if possible', () => {
            systemSettings.api.get
                .mockReturnValueOnce(Promise.resolve('{"mydataKey": "myDataValue"}'));

            return systemSettings.get('keyLastSuccessfulResourceTablesUpdate')
                .then((value) => {
                    expect(value).toEqual({ mydataKey: 'myDataValue' });
                });
        });

        it('should reject the promise if the value is empty', () => {
            systemSettings.api.get.mockReturnValueOnce(Promise.resolve());

            return systemSettings.get('keyThatDefinitelyDoesNotExist')
                .then(
                    () => Promise.reject('Promise resolved'),
                    (error) => {
                        expect(error.message).toBe('The requested systemSetting has no value or does not exist.');
                    });
        });

        it('should call the API for every operation when there\'s no cache', () => {
            systemSettings.api.get
                .mockReturnValueOnce(Promise.resolve(settingsFixture.keyLastSuccessfulResourceTablesUpdate))
                .mockReturnValueOnce(Promise.resolve(settingsFixture.keyLastSuccessfulResourceTablesUpdate));

            return systemSettings.get('keyLastSuccessfulResourceTablesUpdate')
                .then(() => systemSettings.get('keyLastSuccessfulResourceTablesUpdate'))
                .then(() => {
                    expect(systemSettings.api.get).toHaveBeenCalledTimes(2);
                });
        });

        it('should only call the API once when there is a cache', () => {
            systemSettings.api.get
                .mockReturnValueOnce(Promise.resolve(settingsFixture));

            return systemSettings.all()
                .then(() => systemSettings.get('keyLastSuccessfulResourceTablesUpdate'))
                .then(() => systemSettings.get('keyLastSuccessfulResourceTablesUpdate'))
                .then((value) => {
                    expect(value).toBe(settingsFixture.keyLastSuccessfulResourceTablesUpdate);
                    expect(systemSettings.api.get).toHaveBeenCalledTimes(1);
                });
        });

        it('should also return a promise when serving cached values', () => {
            systemSettings.api.get.mockReturnValueOnce(Promise.resolve(settingsFixture));

            return systemSettings.all()
                .then(() => {
                    expect(systemSettings.get('keyLastSuccessfulResourceTablesUpdate')).toBeInstanceOf(Promise);
                });
        });
    });

    describe('.set', () => {
        beforeEach(() => {
            systemSettings = new SystemSettings(new MockApi());

            mockApi.get.mockReturnValue(Promise.resolve(settingsFixture));
            mockApi.post.mockReturnValue(Promise.resolve());
            mockApi.delete.mockReturnValue(Promise.resolve());
        });

        it('should POST to the API', () => systemSettings.set('mySetting', 'my value')
            .then(() => {
                expect(mockApi.get).toHaveBeenCalledTimes(0);
                expect(mockApi.post).toHaveBeenCalledTimes(1);
                expect(mockApi.delete).toHaveBeenCalledTimes(0);
            }));

        it('should DELETE if the value is null or an empty string', () => systemSettings.set('mySetting', '')
            .then(() => {
                expect(mockApi.get).toHaveBeenCalledTimes(0);
                expect(mockApi.post).toHaveBeenCalledTimes(0);
                expect(mockApi.delete).toHaveBeenCalledTimes(1);
            }));

        it('should not alter the value', () => {
            const value = { type: 'object', value: 'some value' };

            return systemSettings.set('mySetting', value)
                .then(() => {
                    expect(mockApi.get).toHaveBeenCalledTimes(0);
                    expect(mockApi.post).toHaveBeenCalledTimes(1);
                    expect(mockApi.delete).toHaveBeenCalledTimes(0);

                    expect(mockApi.post.mock.calls[0][0]).toBe('systemSettings/mySetting');
                    expect(mockApi.post.mock.calls[0][1]).toBe(value);
                });
        });

        it('should add a "Content-Type: text/plain" header to the request', () => {
            const value = 'test';

            return systemSettings.set('mySetting', value)
                .then(() => {
                    expect(mockApi.get).toHaveBeenCalledTimes(0);
                    expect(mockApi.post).toHaveBeenCalledTimes(1);
                    expect(mockApi.delete).toHaveBeenCalledTimes(0);

                    const requestOptions = { headers: { 'Content-Type': 'text/plain' } };
                    expect(mockApi.post).toBeCalledWith('systemSettings/mySetting', value, requestOptions);
                });
        });

        it('should clear the settings cache', () => systemSettings.all()
            .then(() => systemSettings.set('test', 'value'))
            .then(() => systemSettings.all())
            .then(() => {
                expect(mockApi.get).toHaveBeenCalledTimes(2);
                expect(mockApi.post).toHaveBeenCalledTimes(1);
            }));
    });

    describe('.set API request', () => {
        beforeEach(() => {
            systemSettings.api.post
                .mockReturnValueOnce(Promise.resolve());
        });

        afterEach(() => {
            systemSettings = new SystemSettings(new MockApi());
        });

        it('should not encode the value as JSON', () => {
            const value = 'test';

            return systemSettings.set('mySetting', value)
                .then(() => {
                    expect(mockApi.post).toHaveBeenCalledTimes(1);
                    expect(mockApi.post.mock.calls[0][0]).toBe('systemSettings/mySetting');
                    expect(mockApi.post.mock.calls[0][1]).toBe(value);
                });
        });
    });
});
