import fixtures from '../../__fixtures__/fixtures';
import MockApi from '../../api/Api';
import System from '../System';
import SystemConfiguration from '../SystemConfiguration';
import SystemSettings from '../SystemSettings';

jest.mock('../../api/Api');

describe('System', () => {
    let system;
    let apiMock;

    beforeEach(() => {
        apiMock = new MockApi();
        system = new System(new SystemSettings(), new SystemConfiguration());
    });

    afterEach(() => {
        MockApi.mockReset();
    });

    it('should be an instance of System', () => {
        expect(system).toBeInstanceOf(System);
    });

    it('should not be allowed to be called without new', () => {
        expect(() => System()).toThrowError('Cannot call a class as a function');
    });

    it('should contain an instance of SystemConfiguration', () => {
        expect(system.configuration).toBeInstanceOf(SystemConfiguration);
    });

    it('should contain an instance of SystemSettings', () => {
        expect(system.settings).toBeInstanceOf(SystemSettings);
    });

    describe('loadInstalledApps()', () => {
        let appsFromApi;

        beforeEach(() => {
            appsFromApi = [
                {
                    version: '0.4.8',
                    name: 'Data Approval',
                    description: 'Approvals app for PEPFAR',
                    icons: {
                        48: 'img/icons/dataapproval.png',
                    },
                    developer: {
                        url: 'http://www.dhis2.org',
                        name: 'Mark Polak',
                        company: 'DHIS2 Core Team',
                        email: 'markpo@ifi.uio.no',
                    },
                    activities: {
                        dhis: {
                            href: 'http://localhost:8080/dhis',
                        },
                    },
                    folderName: 'approvals',
                    launchUrl: 'http://localhost:8080/dhis/api/apps/approvals/index.html?v=0.4.8',
                    key: 'approvals',
                    launch_path: 'index.html?v=0.4.8',
                    default_locale: 'en',
                },
                {
                    version: '0.0.1',
                    name: 'Data Export Log',
                    description: 'Data export log viewer',
                    icons: {
                        48: 'icons/export.png',
                    },
                    developer: {
                        url: '',
                        name: 'Mark Polak',
                    },
                    activities: {
                        dhis: {
                            href: 'http://localhost:8080/dhis',
                        },
                    },
                    folderName: 'data-export-log',
                    launchUrl: 'http://localhost:8080/dhis/api/apps/data-export-log/index.html?1.0.0-rc1',
                    key: 'data-export-log',
                    launch_path: 'index.html?1.0.0-rc1',
                    default_locale: 'en',
                },
            ];

            apiMock.get = jest.fn().mockReturnValue(Promise.resolve(appsFromApi));
        });

        it('should set the list of installed apps onto the Settings object', () => system.loadInstalledApps()
            .then(() => {
                expect(system.installedApps).toEqual(appsFromApi);
            }));

        it('should reject the promise if the request fails', () => {
            apiMock.get = jest.fn().mockReturnValue(Promise.reject('Apps can not be loaded'));

            return system.loadInstalledApps()
                .catch(error => error)
                .then((message) => {
                    expect(message).toBe('Apps can not be loaded');
                });
        });

        it('should resolve with the returned list of apps', () => system.loadInstalledApps()
            .then((apps) => {
                expect(apps).toEqual(appsFromApi);
            }));
    });

    describe('uploadApp()', () => {
        let appendSpy;
        let formData;

        beforeEach(() => {
            jest.spyOn(apiMock, 'post')
                .mockReturnValue(Promise.resolve());

            // Fake FormData object
            appendSpy = jest.fn();
            formData = {
                append: appendSpy,
            };
            // Fake formData global constructor
            global.FormData = function FormData() {
                return formData;
            };
        });

        afterEach(() => {
            global.FormData = undefined;
        });

        it('should be a function on the system object', () => {
            expect(typeof system.uploadApp).toBe('function');
        });

        it('should call the post with the correct options', () => {
            const xhrOptions = {
                contentType: false,
                processData: false,
                xhr: undefined,
            };

            system.uploadApp('ZipFile');

            expect(apiMock.post).toBeCalledWith('apps', formData, xhrOptions);
        });

        it('should call append on the formData object to add the file to upload', () => {
            system.uploadApp('ZipFile');

            expect(formData.append).toBeCalledWith('file', 'ZipFile');
        });

        describe('xhr', () => {
            let progressCallbackSpy;
            let xhrMock;

            beforeEach(() => {
                progressCallbackSpy = jest.fn();
                xhrMock = {
                    upload: {},
                };
                global.XMLHttpRequest = function XMLHttpRequest() {
                    return xhrMock;
                };
            });

            afterEach(() => {
                global.XMLHttpRequest = undefined;
            });

            it('should pass custom XMLHttpRequest Object with an on progress callback as an option', () => {
                system.uploadApp('ZipFile', progressCallbackSpy);

                expect(typeof apiMock.post.mock.calls[0][2].xhr).toBe('function');
                expect(apiMock.post.mock.calls[0][2].xhr.call()).toBe(xhrMock);
            });

            it('should define the onprogress function onto the upload object of the xhr', () => {
                system.uploadApp('ZipFile', progressCallbackSpy);

                expect(typeof xhrMock.upload.onprogress).toBe('function');
            });

            it('should not call the callback if the progress can not be computed', () => {
                system.uploadApp('ZipFile', progressCallbackSpy);
                xhrMock.upload.onprogress({});

                expect(progressCallbackSpy).not.toBeCalled();
            });

            it('should call the callback spy if the progress can be computed', () => {
                system.uploadApp('ZipFile', progressCallbackSpy);
                xhrMock.upload.onprogress({
                    lengthComputable: true,
                    loaded: 10,
                    total: 50,
                });

                expect(progressCallbackSpy).toBeCalledWith(0.2);
            });
        });
    });

    describe('loadAppStore()', () => {
        // Useful constants!
        const sysVersionMinusTwo = '2.26';
        const sysVersionMinusOne = '2.27';
        const sysVersion = '2.28';
        const sysVersionPlusOne = '2.29';
        const sysVersionPlusTwo = '2.30';

        beforeEach(() => {
            system.setSystemInfo({
                version: sysVersion,
            });

            jest.spyOn(apiMock, 'get')
                .mockReturnValue(Promise.resolve(fixtures.get('/appStore')));
        });

        it('should be a function on the system object', () => {
            expect(typeof system.loadAppStore).toBe('function');
        });

        it('should return a promise', () => {
            expect(system.loadAppStore()).toBeInstanceOf(Promise);
        });

        it('should request the api for the appStore', () => {
            system.loadAppStore();

            expect(apiMock.get).toBeCalledWith('appStore');
        });

        it('should return the compatible apps from the api', () => {
            // Apps 3 and 6 are compatible with 2.28
            const expectedApps = fixtures.get('/appStore').filter((app, i) => [3, 6].includes(i));

            return system.loadAppStore()
                .then((apps) => {
                    expect(apps).toEqual(expectedApps);
                });
        });

        describe('with version 2.24', () => {
            beforeEach(() => {
                system.setSystemInfo({
                    version: '2.24',
                });
            });

            it('should return the compatible apps from the API', () => {
                // Apps 2, 4 and 6 are compatible with 2.24
                const expectedApps = fixtures.get('/appStore').filter((app, i) => [2, 4, 6].includes(i));

                return system.loadAppStore()
                    .then((apps) => {
                        expect(apps).toEqual(expectedApps);
                    });
            });
        });

        describe('with version 2.25', () => {
            beforeEach(() => {
                system.setSystemInfo({
                    version: '2.25',
                });
            });

            it('should return the compatible apps from the API', () => {
                // Apps 1, 2, 4, 5 and 6 are compatible with 2.25
                const expectedApps = fixtures.get('/appStore').filter((app, i) => [1, 2, 4, 5, 6].includes(i));

                return system.loadAppStore()
                    .then((apps) => {
                        expect(apps).toEqual(expectedApps);
                    });
            });
        });

        it('should return the compatible apps', () => {
            // const returnedApps = fixtures.get('/appStore');

            const returnedApps = [
                {
                    versions: [ // One version compatible
                        { min_platform_version: sysVersionMinusTwo, max_platform_version: sysVersionMinusOne },
                        { min_platform_version: sysVersionMinusOne }, // compatible
                    ],
                },
                {
                    versions: [ // Both incompatible
                        { min_platform_version: sysVersionPlusOne, max_platform_version: sysVersionPlusTwo },
                        { min_platform_version: sysVersionPlusTwo },
                    ],
                },
                {
                    versions: [ // Compatible
                        { min_platform_version: sysVersionMinusOne },
                    ],
                },
                {
                    versions: [ // Incompatible
                        { max_platform_version: sysVersionMinusOne },
                    ],
                },
                {
                    versions: [ // One version compatible
                        { minDhisVersion: sysVersionMinusTwo, maxDhisVersion: sysVersionMinusOne },
                        { minDhisVersion: sysVersionMinusOne }, // compatible
                    ],
                },
                {
                    versions: [ // Both incompatible
                        { minDhisVersion: sysVersionPlusOne, maxDhisVersion: sysVersionPlusTwo },
                        { minDhisVersion: sysVersionPlusTwo },
                    ],
                },
                {
                    versions: [ // Compatible
                        { minDhisVersion: sysVersionMinusOne },
                    ],
                },
                {
                    versions: [ // Incompatible
                        { maxDhisVersion: sysVersionMinusOne },
                    ],
                },
            ];

            apiMock.get.mockReturnValue(Promise.resolve(returnedApps));

            return system.loadAppStore()
                .then((apps) => {
                    expect(apps.length).toBe(4);
                });
        });

        it('should return all the apps when compatibility flag is set to false', () => system.loadAppStore(false)
            .then((apps) => {
                expect(apps.length).toBe(fixtures.get('/appStore').length);
            }));

        it('should reject the promise when the request fails', () => {
            apiMock.get.mockReturnValue(Promise.reject('Request for appStore failed'));

            return system.loadAppStore()
                .catch(error => error)
                .then((error) => {
                    expect(error).toBe('Request for appStore failed');
                });
        });

        it('should reject the promise when system.version is not set', () => {
            system.version = undefined;

            return system.loadAppStore()
                .catch(error => error)
                .then((error) => {
                    expect(error.message).toBe('Cannot read property \'major\' of undefined');
                });
        });
    });

    describe('installAppVersion()', () => {
        beforeEach(() => {
            apiMock.post.mockReturnValue(Promise.resolve(''));
        });

        it('should be a function on the system object', () => {
            expect(typeof system.installAppVersion).toBe('function');
        });

        it('should reject the promise when the request fails', () => {
            apiMock.post.mockReturnValue(Promise.reject('Request for installation failed'));

            return system.installAppVersion('PyYnjVl5iGt')
                .catch(error => error)
                .then((errorMessage) => {
                    expect(errorMessage).toBe('Request for installation failed');
                });
        });

        it('should call the api with the correct url', () => system.installAppVersion('PyYnjVl5iGt')
            .then(() => {
                expect(apiMock.post).toBeCalledWith('appStore/PyYnjVl5iGt', '', { dataType: 'text' });
            }));

        it('should resolve the promise without a value', () => system.installAppVersion('PyYnjVl5iGt')
            .then((response) => {
                expect(response).toBeUndefined();
            }));
    });

    describe('uninstallApp()', () => {
        beforeEach(() => {
            apiMock.delete = jest.fn().mockReturnValue(Promise.resolve({}));
        });

        it('should be a function on the system object', () => {
            expect(typeof system.uninstallApp).toBe('function');
        });

        it('should call the api.delete method with the correct url', () => system.uninstallApp('PyYnjVl5iGt')
            .then(() => {
                expect(apiMock.delete).toBeCalledWith('apps/PyYnjVl5iGt');
            }));

        it('should resolve the request even when the api request fails', () => {
            apiMock.delete = jest.fn().mockReturnValue(Promise.reject({}));

            return system.uninstallApp('PyYnjVl5iGt');
        });
    });

    describe('reloadApps()', () => {
        beforeEach(() => {
            jest.spyOn(apiMock, 'update')
                .mockReturnValue(Promise.resolve());

            jest.spyOn(system, 'loadInstalledApps')
                .mockReturnValueOnce(Promise.resolve());
        });

        it('should be a function on the system object', () => {
            expect(typeof system.reloadApps).toBe('function');
        });

        it('should call the update method on the api', () => system.reloadApps()
            .then(() => {
                expect(apiMock.update.mock.calls[0][0]).toBe('apps');
            }));

        it('should call system.loadInstalledApps on success ', () => system.reloadApps()
            .then(() => {
                expect(system.loadInstalledApps).toBeCalled();
            }));

        it('should chain the promise from loadInstalledApps', () => {
            const loadInstalledAppsPromise = Promise.resolve('Apps loaded');

            system.loadInstalledApps.mockReset();
            system.loadInstalledApps.mockReturnValue(loadInstalledAppsPromise);

            return system.reloadApps()
                .then(message => expect(message).toBe('Apps loaded'));
        });

        it('should not call loadInstalledApps when the update request fails', () => {
            apiMock.update.mockReturnValue(Promise.reject());
            jest.spyOn(system, 'loadInstalledApps');

            return system.reloadApps()
                .catch(message => message)
                .then(() => {
                    expect(system.loadInstalledApps).not.toBeCalled();
                });
        });
    });

    describe('compareVersions()', () => {
        let systemVersion;
        let appVersion;

        beforeEach(() => {
            systemVersion = {
                major: 2,
                minor: 23,
                snapshot: true,
            };
            appVersion = {
                major: 2,
                minor: 23,
                snapshot: true,
            };
        });

        it('should be a function on the system class', () => {
            expect(typeof System.compareVersions).toBe('function');
        });

        it('should return 0 for equal versions', () => {
            expect(System.compareVersions(systemVersion, appVersion)).toBe(0);
        });

        it('should return 1 for a larger major system version', () => {
            systemVersion.major = 3;

            expect(System.compareVersions(systemVersion, appVersion)).toBe(1);
        });

        it('should return 1 for a larger minor version', () => {
            systemVersion.minor = 24;

            expect(System.compareVersions(systemVersion, appVersion)).toBe(1);
        });

        it('should return 1 when the app is a snapshot version', () => {
            systemVersion.snapshot = false;
            appVersion.snapshot = true;

            expect(System.compareVersions(systemVersion, appVersion)).toBe(1);
        });

        it('should return -1 when the app is not a snapshot', () => {
            systemVersion.snapshot = true;
            appVersion.snapshot = false;

            expect(System.compareVersions(systemVersion, appVersion)).toBe(-1);
        });

        it('should do correct comparison when a string is passed as a version', () => {
            expect(System.compareVersions('2.15', '2.16')).toBe(-1);
            expect(System.compareVersions('2.20-SNAPSHOT', '2.16')).toBe(4);
        });
    });

    describe('isVersionCompatible()', () => {
        let appVersion;
        let systemVersion;

        beforeEach(() => {
            jest.spyOn(System, 'compareVersions');
            appVersion = {
                min_platform_version: '2.23',
                max_platform_version: '2.23',
            };
            systemVersion = '2.23';
        });

        afterEach(() => {
            System.compareVersions.mockRestore();
        });

        it('should return false when the app is too new', () => {
            expect(System.isVersionCompatible(
                systemVersion,
                Object.assign(appVersion, { min_platform_version: '2.24' }),
            )).toBe(false);
        });

        it('should return false when the app is too old', () => {
            expect(System.isVersionCompatible(
                systemVersion,
                Object.assign(appVersion, { max_platform_version: '2.22' }),
            )).toBe(false);
        });

        it('should return true when the system version is within the app version range', () => {
            appVersion.min_platform_version = '2.20';
            appVersion.max_platform_version = '2.25';

            expect(System.isVersionCompatible(systemVersion, appVersion));
        });

        it('should return true when no version bounds are given', () => {
            appVersion = {};

            expect(System.isVersionCompatible(systemVersion, appVersion)).toBe(true);
        });

        it('should return false when the version is not compatible', () => {
            expect(System.isVersionCompatible('2.22', {
                min_platform_version: '2.17',
                max_platform_version: '2.20',
            })).toBe(false);
        });


        describe('with 2.28 app version format', () => {
            beforeEach(() => {
                appVersion = {
                    minDhisVersion: '2.22',
                    maxDhisVersion: '2.23-SNAPSHOT',
                };
                systemVersion = '2.23';
            });

            it('should return false when the app is too new', () => {
                expect(System.isVersionCompatible(
                    systemVersion,
                    Object.assign(appVersion, { minDhisVersion: '2.24' }),
                )).toBe(false);
            });

            it('should return false when the app is too old', () => {
                expect(System.isVersionCompatible(
                    systemVersion,
                    Object.assign(appVersion, { maxDhisVersion: '2.22' }),
                )).toBe(false);
            });

            it('should return true when the system version is within the app version range', () => {
                appVersion.minDhisVersion = '2.20';
                appVersion.maxDhisVersion = '2.25';

                expect(System.isVersionCompatible(systemVersion, appVersion));
            });

            it('should return true when no version bounds are given', () => {
                appVersion = {};

                expect(System.isVersionCompatible(systemVersion, appVersion)).toBe(true);
            });

            it('should return false when the version is not compatible', () => {
                expect(System.isVersionCompatible('2.22', {
                    minDhisVersion: '2.17',
                    maxDhisVersion: '2.20',
                })).toBe(false);
            });
        });
    });

    describe('getSystem', () => {
        it('should return the same instance on consecutive requests', () => {
            expect(System.getSystem()).toBe(System.getSystem());
        });
    });
});
