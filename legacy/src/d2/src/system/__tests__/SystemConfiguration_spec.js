import MockApi from '../../api/Api';
import SystemConfiguration from '../SystemConfiguration';

jest.mock('../../api/Api');

describe('System.configuration', () => {
    let configuration;
    let mockApi;

    const mockConfiguration = {
        systemId: 'eed3d451-4ff5-4193-b951-ffcc68954299',
        feedbackRecipients: {
            name: 'Feedback Message Recipients',
            created: '2011-12-25T16:52:04.409+0000',
            lastUpdated: '2015-10-19T10:27:27.636+0000',
            externalAccess: false,
            user: {
                name: 'John Traore',
                created: '2013-04-18T17:15:08.407+0000',
                lastUpdated: '2015-09-14T20:18:28.355+0000',
                externalAccess: false,
                id: 'xE7jOejl9FI',
            },
            id: 'QYrzIjSfI8z',
        },
        offlineOrganisationUnitLevel: {
            name: 'Chiefdom',
            created: '2011-12-24T12:24:22.935+0000',
            lastUpdated: '2015-08-09T12:58:05.001+0000',
            externalAccess: false,
            id: 'tTUf91fCytl',
        },
        infrastructuralIndicators: {
            name: 'Staffing',
            created: '2013-04-18T14:36:27.000+0000',
            lastUpdated: '2013-04-18T14:36:27.000+0000',
            externalAccess: false,
            publicAccess: 'rw------',
            id: 'EdDc97EJUdd',
        },
        infrastructuralDataElements: {
            name: 'Population Estimates',
            created: '2011-12-24T12:24:24.298+0000',
            lastUpdated: '2013-03-15T16:08:56.135+0000',
            externalAccess: false,
            publicAccess: 'rw------',
            id: 'sP7jTt3YGBb',
        },
        infrastructuralPeriodType: 'Yearly',
        selfRegistrationRole: {
            name: 'Guest',
            created: '2012-11-13T15:56:23.510+0000',
            lastUpdated: '2015-01-20T11:32:40.188+0000',
            externalAccess: false,
            id: 'XS0dNzuZmfH',
        },
        selfRegistrationOrgUnit: {
            code: 'OU_525',
            name: 'Sierra Leone',
            created: '2012-11-13T12:20:53.028+0000',
            lastUpdated: '2015-04-24T11:21:00.090+0000',
            externalAccess: false,
            user: {
                name: 'Tom Wakiki',
                created: '2012-11-21T12:02:04.303+0000',
                lastUpdated: '2015-10-19T10:27:27.567+0000',
                externalAccess: false,
                id: 'GOLswS44mh8',
            },
            id: 'ImspTQPwCqd',
        },
        corsWhitelist: [
            'http://cors1.example.com',
            'https://cors2.example.com',
        ],
        remoteServerUrl: 'https://apps.dhis2.org/demo',
        remoteServerUsername: 'admin',
    };

    const mockCorsWhitelistText = 'http://cors1.example.com\nhttps://cors2.example.com';

    beforeEach(() => {
        mockApi = MockApi.getApi();
        MockApi.mockClear();
        configuration = new SystemConfiguration();
    });

    it('should not be allowed to be called without new', () => {
        expect(() => SystemConfiguration()).toThrowError('Cannot call a class as a function'); // eslint-disable-line new-cap
    });

    it('should add the mockApi onto the SystemConfiguration instance', () => {
        expect(configuration.api).toBe(mockApi);
    });

    it('all() should be a function', () => {
        expect(configuration.all).toBeInstanceOf(Function);
    });

    it('get() should be a function', () => {
        expect(configuration.get).toBeInstanceOf(Function);
    });

    it('should use the api object when it is passed', () => {
        const apiMockObject = {};

        configuration = new SystemConfiguration(apiMockObject);

        expect(configuration.api).toBe(apiMockObject);
    });

    describe('API call', () => {
        beforeEach(() => {
            mockApi.get.mockImplementation((url) => {
                if (url === 'configuration') {
                    return Promise.resolve(mockConfiguration);
                }
                return Promise.reject();
            });
            mockApi.post.mockReturnValue(Promise.resolve());
            mockApi.delete.mockReturnValue(Promise.resolve());
        });

        afterEach(() => {
            configuration = new SystemConfiguration();
        });

        describe('.all()', () => {
            it('should return the entire config', (done) => {
                configuration.all().then((res) => {
                    expect(res).toEqual(mockConfiguration);
                    done();
                }, (err) => {
                    done(err);
                });
            });

            it('should query the API for all configuration endpoints', () => {
                configuration.all();

                expect(mockApi.get).toHaveBeenCalledTimes(1);
                expect(mockApi.get.mock.calls[0][0]).toBe('configuration');
            });

            it('should only call the API once', (done) => {
                configuration.all().then(() => {
                    configuration.all().then(() => {
                        expect(mockApi.get).toHaveBeenCalledTimes(1);
                        expect(mockApi.get.mock.calls[0][0]).toBe('configuration');
                        done();
                    });
                    expect(mockApi.get).toHaveBeenCalledTimes(1);
                    expect(mockApi.get.mock.calls[0][0]).toBe('configuration');
                });
            });

            it('should call the API again if ignoreCache is true', (done) => {
                configuration.all(true).then(() => {
                    expect(mockApi.get).toHaveBeenCalledTimes(1);
                    expect(mockApi.get.mock.calls[0][0]).toBe('configuration');

                    return configuration.all(true).then(() => {
                        expect(mockApi.get).toHaveBeenCalledTimes(2);
                        expect(mockApi.get.mock.calls[0][0]).toBe('configuration');
                        expect(mockApi.get.mock.calls[1][0]).toBe('configuration');
                        done();
                    }).catch(e => done(e));
                }).catch(e => done(e));
            });
        });

        describe('.get()', () => {
            it('should return the correct systemId', (done) => {
                configuration.get('systemId').then((res) => {
                    expect(res).toBe(mockConfiguration.systemId);
                    done();
                }, (err) => {
                    done(err);
                });
            });

            it('should return the correct feedback recipient user group', () => {
                return configuration.get('feedbackRecipients').then((res) => {
                    expect(res).toBe(mockConfiguration.feedbackRecipients);
                });
            });

            it('should only query the API once', (done) => {
                configuration.get('systemId').then((res1) => {
                    expect(res1).toBe(mockConfiguration.systemId);
                    expect(mockApi.get.mock.calls[0][0]).toBe('configuration');

                    configuration.get('systemId').then((res2) => {
                        expect(res2).toBe(mockConfiguration.systemId);
                        expect(mockApi.get.mock.calls[0][0]).toBe('configuration');
                        done();
                    }, (err) => {
                        done(err);
                    });
                }, (err) => {
                    done(err);
                });
            });

            it('should query the API twice if ignoreCache is true', (done) => {
                configuration.get('systemId', true).then((res1) => {
                    expect(res1).toBe(mockConfiguration.systemId);
                    expect(mockApi.get.mock.calls[0][0]).toBe('configuration');

                    configuration.get('systemId', true).then((res2) => {
                        expect(res2).toBe(mockConfiguration.systemId);
                        expect(mockApi.get.mock.calls[1][0]).toBe('configuration');
                        done();
                    }, (err) => {
                        done(err);
                    });
                }, (err) => {
                    done(err);
                });
            });

            it('should throw an error when asked for an unknown config option', (done) => {
                try {
                    configuration.get('someRandomOptionThatDoesntExist').then(() => {
                        done(new Error('No error thrown'));
                    }, () => {
                        done();
                    });
                } catch (e) {
                    done();
                }
            });
        });

        describe('.set()', () => {
            it('should not be able to change the systemId', (done) => {
                configuration.set('systemId', 'my-random-system-id')
                    .then(() => {
                        done('Attempting to change systemId didn\'t result in an error');
                    })
                    .catch(() => {
                        done();
                    });
            });

            it('should not attempt to change unknown settings', (done) => {
                configuration.set('completelyCrazyConfigurationOption', 'totally rediculous value')
                    .then(() => {
                        done();
                    }).catch(() => {
                        done('Invalid error failure');
                    });
            });

            it('should call DELETE to remove feedback recipients', (done) => {
                configuration.set('feedbackRecipients', 'null')
                    .then(() => {
                        expect(mockApi.post).toHaveBeenCalledTimes(0);
                        expect(mockApi.delete).toHaveBeenCalledTimes(1);
                        expect(mockApi.delete.mock.calls[0][0]).toBe('configuration/feedbackRecipients');
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });

            it('should call DELETE to remove self registration role', (done) => {
                configuration.set('selfRegistrationRole', null)
                    .then(() => {
                        expect(mockApi.post).toHaveBeenCalledTimes(0);
                        expect(mockApi.delete.mock.calls[0][0]).toBe('configuration/selfRegistrationRole');
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });

            it('should call DELETE to remove self registration organisation unit', (done) => {
                configuration.set('selfRegistrationOrgUnit', 'null')
                    .then(() => {
                        expect(mockApi.post).toHaveBeenCalledTimes(0);
                        expect(mockApi.delete.mock.calls[0][0]).toBe('configuration/selfRegistrationOrgUnit');
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });

            it('should convert CORS string to an array', () => configuration.set('corsWhitelist', mockCorsWhitelistText)
                .then(() => {
                    expect(mockApi.post.mock.calls[0][0]).toBe('configuration/corsWhitelist');
                    expect(mockApi.post.mock.calls[0][1]).toEqual(mockConfiguration.corsWhitelist);
                }));

            it('should post new settings to the API', () => {
                mockApi.post.mockClear();

                return configuration.set('infrastructuralPeriodType', 'Monthly')
                    .then(() => {
                        expect(mockApi.post.mock.calls[0][0]).toBe('configuration/infrastructuralPeriodType');
                        expect(mockApi.post.mock.calls[0][1]).toBe('Monthly');
                    });
            });

            it('should reject a promise when no configuration can be found for the key', () => {
                mockApi.post.mockReset();
                mockApi.post.mockReturnValue(Promise.reject('StackTrace!'));

                return configuration.set('thisKeyDoesNotExist', 'Some value')
                    .catch(message => message)
                    .then((message) => {
                        expect(message).toBe('No configuration found for thisKeyDoesNotExist');
                    });
            });
        });
    });
});
