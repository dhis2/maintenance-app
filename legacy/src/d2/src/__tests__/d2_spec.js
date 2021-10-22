import Api from '../api/Api';
import fixtures from '../__fixtures__/fixtures';
import I18n from '../i18n/I18n';
import DataStore from '../datastore/DataStore';
import Logger from '../logger/Logger';

jest.mock('../logger/Logger');
jest.mock('../api/Api');
jest.mock('../i18n/I18n');


describe('D2', () => {
    // jscs:disable
    const ModelDefinition = function ModelDefinition() {
        this.name = 'dataElement';
    };
    ModelDefinition.prototype = {
    };
    // jscs:enable
    const ModelDefinitionMock = {
        createFromSchema: jest.fn().mockReturnValue(new ModelDefinition()),
        prototype: {},
    };
    let d2;
    let apiMock;
    let loggerMock;
    let i18nMock;

    beforeEach(() => {
        ModelDefinitionMock.createFromSchema.callCount = 0;
        const schemasResponse = {
            schemas: [
                fixtures.get('/api/schemas/dataElement'),
                fixtures.get('/api/schemas/dataElement'),
                fixtures.get('/api/schemas/dataElement'),
            ],
        };

        apiMock = {
            get: jest.fn()
                // First init round
                .mockReturnValueOnce(Promise.resolve(schemasResponse))
                .mockReturnValueOnce(new Promise(resolve => resolve(fixtures.get('/api/attributes'))))
                .mockReturnValueOnce(Promise.resolve({}))
                .mockReturnValueOnce(Promise.resolve([]))
                .mockReturnValueOnce(new Promise(resolve => resolve(fixtures.get('/api/userSettings'))))
                .mockReturnValueOnce(Promise.resolve({ version: '2.21' }))
                .mockReturnValueOnce(Promise.resolve({ apps: [] }))

                // Second init round
                .mockReturnValueOnce(new Promise(resolve => resolve(schemasResponse)))
                .mockReturnValueOnce(new Promise(resolve => resolve(fixtures.get('/api/attributes'))))
                .mockReturnValueOnce(Promise.resolve({}))
                .mockReturnValueOnce(Promise.resolve([]))
                .mockReturnValueOnce(new Promise(resolve => resolve(fixtures.get('/api/userSettings'))))
                .mockReturnValueOnce(Promise.resolve({ version: '2.21' }))
                .mockReturnValueOnce(Promise.resolve({ apps: [] })),
            setBaseUrl: jest.fn(),
            getApi() {
                return this;
            },
            setDefaultHeaders: jest.fn(),
        };

        loggerMock = {
            error: jest.fn(),
        };

        i18nMock = {
            addSource: jest.fn(),
            addStrings: jest.fn(),
            load: jest.fn()
                .mockReturnValue(Promise.resolve()),
        };

        Logger.getLogger = Logger.getLogger.mockReturnValue(loggerMock);
        Api.getApi = Api.getApi.mockReturnValue(apiMock);
        I18n.getI18n = I18n.getI18n.mockReturnValue(i18nMock);

        // jscs:disable
        const ModelDefinitionsMock = function ModelDefinitions() {
            this.modelsMockList = true;
            this.add = function add(schema) {
                this[schema.name] = schema;
            };
        };
        // jscs:enable
        ModelDefinitionsMock.prototype = {
            add(schema) {
                this[schema.name] = schema;
            },
        };
        ModelDefinitionsMock.getModelDefinitions = jest.fn().mockReturnValue(new ModelDefinitionsMock());

        // Import after we have set all the mock values
        // TODO: should probably use jest.mock and use a regular ES6 import
        d2 = require('../d2').default; // eslint-disable-line global-require
    });

    afterEach(() => {

    });

    it('should have an init function', () => {
        expect(typeof d2.init).toBe('function');
    });

    it('should have a getInstance function', () => {
        expect(typeof d2.getInstance).toBe('function');
    });

    describe('init', () => {
        it('should call load on i18n instance', (done) => {
            d2.init(undefined, apiMock);
            d2.getInstance()
                .then(() => {
                    expect(i18nMock.load).toHaveBeenCalledTimes(1);
                    done();
                })
                .catch(done);
        });
    });

    describe('config', () => {
        it('should have a default baseUrl in the config', () => {
            expect(d2.config.baseUrl).toBe('/api');
        });

        it('should use the baseUrl from the pre-init config', (done) => {
            d2.config.baseUrl = '/dhis/api';

            d2.init(undefined, apiMock);
            d2.getInstance()
                .then(() => {
                    expect(apiMock.setBaseUrl).toHaveBeenCalledWith('/dhis/api');
                    done();
                })
                .catch(done);
        });

        it('should let the init() config override the pre-init config', (done) => {
            d2.config.baseUrl = '/dhis/api';

            d2.init({ baseUrl: '/demo/api' }, apiMock);
            d2.getInstance()
                .then(() => {
                    expect(apiMock.setBaseUrl).toHaveBeenCalledWith('/demo/api');
                    done();
                })
                .catch(done);
        });

        it('should use default headers for requests', (done) => {
            d2.config.baseUrl = '/dhis/api';
            d2.config.headers = {
                Authorization: new Buffer('admin:district').toString('base64'),
            };

            d2.init({ baseUrl: '/demo/api' }, apiMock);
            d2.getInstance()
                .then(() => {
                    expect(apiMock.setDefaultHeaders).toHaveBeenCalledWith({ Authorization: 'YWRtaW46ZGlzdHJpY3Q=' });
                    done();
                })
                .catch(done);
        });

        it('should pass the sources Set as an sources array to the i18n class', (done) => {
            d2.config.i18n.sources.add('global.properties');
            d2.config.i18n.sources.add('nonglobal.properties');
            d2.config.i18n.sources.add('systemsettings.properties');

            d2.init(undefined, apiMock);
            d2.getInstance()
                .then(() => {
                    expect(i18nMock.addSource).toHaveBeenCalledTimes(3);
                    done();
                })
                .catch((e) => {
                    done(e);
                });
        });

        it('should call addStrings for the pre-init added strings', (done) => {
            d2.config.i18n.strings.add('name');
            d2.config.i18n.strings.add('yes');

            d2.init(undefined, apiMock);
            d2.getInstance()
                .then(() => {
                    expect(i18nMock.addStrings).toHaveBeenCalledWith(['name', 'yes']);
                    done();
                })
                .catch((e) => {
                    done(e);
                });
        });
    });

    describe('getInstance', () => {
        it('should return a promise', () => {
            expect(d2.getInstance()).toBeInstanceOf(Promise);
        });

        it('should return the d2 instance after init', (done) => {
            Promise.all([d2.init({ baseUrl: '/dhis/api' }, apiMock), d2.getInstance()])
                .then(([d2FromInit, d2FromFactory]) => {
                    expect(d2FromInit).toBe(d2FromFactory);
                    done();
                })
                .catch(done);
        });

        it('should return the same instance on getInstance calls', (done) => {
            d2.init({ baseUrl: '/dhis/api' }, apiMock);

            Promise.all([d2.getInstance(), d2.getInstance()])
                .then(([firstCallResult, secondCallResult]) => {
                    expect(firstCallResult).toBe(secondCallResult);
                    done();
                })
                .catch(done);
        });

        it('should return a different instance after re-init', (done) => {
            d2.init(undefined, apiMock);
            const instanceAfterFirstInit = d2.getInstance();

            instanceAfterFirstInit.then((first) => {
                d2.init({ baseUrl: '/dhis/api' }, apiMock);
                const instanceAfterSecondInit = d2.getInstance();

                return Promise.all([first, instanceAfterSecondInit]);
            })
                .then(([first, second]) => {
                    expect(first).not.toBe(second);
                    done();
                })
                .catch(done);
        });

        it('should return a promise when calling getInstance before init', () => {
            expect(d2.getInstance()).toBeInstanceOf(Promise);
        });
    });

    it('should set the base url onto the api', () => {
        d2.init({ baseUrl: '/dhis/api' }, apiMock);

        expect(apiMock.setBaseUrl).toHaveBeenCalledWith('/dhis/api');
    });

    it('should set the baseUrl to the default /api', () => {
        d2.init({}, apiMock);

        expect(apiMock.setBaseUrl).toBeCalled();
    });

    it('should throw an error when the passed config is not an object', () => {
        function shouldThrowOnString() {
            d2.init(' ');
        }

        function shouldThrowOnFunction() {
            d2.init(() => true);
        }

        expect(shouldThrowOnString).toThrowError('Expected Config parameter to have type object');
        expect(shouldThrowOnFunction).toThrowError('Expected Config parameter to have type object');
    });

    it('should not throw an error when no config is passed', () => {
        function shouldNotThrow() {
            d2.init(undefined, apiMock);
        }

        expect(shouldNotThrow).not.toThrowError();
    });

    it('should call the api', () => d2.init({ baseUrl: '/dhis/api' }, apiMock)
        .then(() => {
            const fields = 'apiEndpoint,name,displayName,authorities,singular,plural,' +
                'shareable,metadata,klass,identifiableObject,translatable,' +
                'properties[href,writable,collection,collectionName,name,propertyType,persisted,required,min,max,' +
                'ordered,unique,constants,owner,itemPropertyType,translationKey,embeddedObject]';

            expect(apiMock.get).toHaveBeenCalledWith('schemas', { fields });
        }));

    it('should log the error when schemas can not be requested', () => {
        apiMock.get = jest.fn().mockReturnValueOnce(Promise.reject(new Error('Failed')));

        return d2.init({ baseUrl: '/dhis/api' }, apiMock, loggerMock)
            .then(
                () => Promise.reject('No error occurred'),
                () => {
                    expect(loggerMock.error).toHaveBeenCalledTimes(1);
                    expect(loggerMock.error)
                        .toHaveBeenCalledWith('Unable to get schemas from the api', '{}', new Error('Failed'));
                },
            );
    });

    it('should return an object with the api object', (done) => {
        d2.init({ baseUrl: '/dhis/api' }, apiMock)
            .then((newD2) => {
                expect(newD2.Api.getApi()).toBe(apiMock);
                done();
            })
            .catch(done);
    });

    it('should call the api for all startup calls', (done) => {
        d2.init({ baseUrl: '/dhis/api' }, apiMock)
            .then(() => {
                expect(apiMock.get).toHaveBeenCalledTimes(7);
                done();
            })
            .catch(done);
    });

    it('should query the api for all the attributes', (done) => {
        d2.init({ baseUrl: '/dhis/api' }, apiMock)
            .then(() => {
                const attributeCallArgs = apiMock.get.mock.calls[1];
                /* 0: Url, 1: Data, 1: Query params, 2: Request options */
                expect(attributeCallArgs[0]).toBe('attributes');
                expect(attributeCallArgs[1]).toEqual({ fields: ':all,optionSet[:all,options[:all]]', paging: false });
                done();
            })
            .catch(done);
    });

    describe('creation of ModelDefinitions', () => {
        it('should add the model definitions object to the d2 object', (done) => {
            d2.init(undefined, apiMock)
                .then((newD2) => {
                    expect(newD2.models).toBeDefined();
                    // expect(newD2.models.modelsMockList).to.equal(true);
                    done();
                })
                .catch(done);
        });

        // FIXME: Test fails because the the ModelDefinitions class is a singleton
        /*
        xit('should create a ModelDefinition for each of the schemas', (done) => {
            d2.init(undefined, apiMock)
                .then(() => {
                    expect(ModelDefinitionMock.createFromSchema).to.have.been.called;
                    expect(ModelDefinitionMock.createFromSchema.callCount).to.equal(3);
                    done();
                })
                .catch(done);
        });
*/

        /*
        xit('should call the ModelDefinition.createFromSchema with the schema', (done) => {
            d2.init(undefined, apiMock)
                .then(() => {
                    expect(ModelDefinitionMock.createFromSchema).toHaveBeenCalledWith(fixtures.get('/api/schemas/dataElement'), fixtures.get('/dataElementAttributes'));
                    done();
                })
                .catch(done);
        });
*/

        it('should add the ModelDefinitions to the models list', (done) => {
            d2.init(undefined, apiMock)
                .then((newD2) => {
                    expect(newD2.models.dataElement).toBeDefined();
                    done();
                })
                .catch(done);
        });
    });

    describe('currentUser', () => {
        it('should be available on the d2 object', () => {
            d2.init(undefined, apiMock);

            return d2.getInstance()
                .then((newD2) => {
                    expect(newD2.currentUser).toBeDefined();
                });
        });
    });

    describe('with specific schema loading', () => {
        it('should have only loaded a single schema', () => {
            apiMock.get
                // First init round
                .mockReturnValueOnce(Promise.resolve(fixtures.get('/api/schemas/user')));

            d2.init({
                schemas: ['user'],
            }, apiMock);

            return d2.getInstance()
                .then(() => {
                    expect(apiMock.get).toHaveBeenCalledWith('schemas/user', {
                        fields: 'apiEndpoint,name,displayName,authorities,singular,plural,shareable,metadata,klass,' +
                        'identifiableObject,translatable,' +
                        'properties[href,writable,collection,collectionName,name,propertyType,persisted,required,min,' +
                        'max,ordered,unique,constants,owner,itemPropertyType,translationKey,embeddedObject]',
                    });
                });
        });
    });

    describe('DataStore', () => {
        it('should have a dataStore object on the instance', () => d2.init(undefined, apiMock)
            .then((d2Instance) => {
                expect(d2Instance.dataStore).toBeInstanceOf(DataStore);
            }));
    });

    describe('getUserSettings', () => {
        it('should be a function', () => {
            expect(typeof d2.getUserSettings).toBe('function');
        });

        it('should return an object with the uiLocale', () => {
            apiMock.get = jest.fn().mockReturnValueOnce(Promise.resolve(fixtures.get('/api/userSettings')));

            return d2.getUserSettings(apiMock)
                .then((settings) => {
                    expect(settings.keyUiLocale).toBe('fr');
                });
        });

        it('should call the api for keyUiLocale', () => {
            d2.getUserSettings(apiMock);

            expect(apiMock.get).toBeCalled();
        });

        it('should use the default base url when the set baseUrl is not valid', (done) => {
            d2.config.baseUrl = undefined;

            d2.getUserSettings(apiMock)
                .then(() => {
                    expect(apiMock.setBaseUrl).not.toBeCalled();
                    expect(apiMock.get).toHaveBeenCalledWith('userSettings');
                    done();
                })
                .catch(done);
        });
    });

    describe('getManifest', () => {
        it('should be a function', () => {
            expect(typeof d2.getManifest).toBe('function');
        });

        it('should return a promise', () => {
            expect(d2.getManifest('manifest.webapp', apiMock)).toBeInstanceOf(Promise);
        });

        it('should request the manifest.webapp', (done) => {
            apiMock.get.mockReturnValueOnce(Promise.resolve({}));

            d2.getManifest('manifest.webapp', apiMock)
                .then(() => {
                    expect(apiMock.get).toHaveBeenCalledWith('manifest.webapp');
                    done();
                })
                .catch(done);
        });

        it('should return the manifest.webapp object', (done) => {
            const expectedManifest = {
                name: 'MyApp',
            };

            apiMock.get = jest.fn().mockReturnValueOnce(Promise.resolve(expectedManifest));

            d2.getManifest('manifest.webapp', apiMock)
                .then((manifest) => {
                    expect(manifest.name).toBe(expectedManifest.name);
                    done();
                })
                .catch(done);
        });

        it('should add the getBaseUrl convenience method', (done) => {
            const expectedManifest = {
                name: 'MyApp',
                activities: {
                    dhis: {
                        href: 'http://localhost:8080',
                    },
                },
            };

            apiMock.get = jest.fn().mockReturnValueOnce(Promise.resolve(expectedManifest));

            d2.getManifest('manifest.webapp', apiMock)
                .then((manifest) => {
                    expect(manifest.getBaseUrl()).toBe('http://localhost:8080');
                    done();
                })
                .catch(done);
        });
    });
});
