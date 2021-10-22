import UserDataStore from '../../datastore/UserDataStore';
import UserDataStoreNamespace from '../../datastore/UserDataStoreNamespace';
import MockApi from '../../api/Api';

jest.mock('../../api/Api');

describe('UserDataStore', () => {
    const namespaces = ['DHIS', 'History', 'social-media-video'];
    const keys = ['key1', 'a key', 'aowelfkxuw'];
    let userDataStore;
    let apiMock;

    beforeEach(() => {
        apiMock = new MockApi();
        userDataStore = new UserDataStore(apiMock);
    });

    afterEach(() => {
        MockApi.mockReset();
    });

    describe('get()', () => {
        it('should return an instance of UserDatastoreNamespace', () => {
            apiMock.get.mockReturnValueOnce(Promise.resolve(namespaces));

            return userDataStore.get('DHIS').then((namespace) => {
                expect(namespace).toBeInstanceOf(UserDataStoreNamespace);
            });
        });


        it('should return a UserDatastoreNamespace with keys if it exists', () => {
            apiMock.get.mockReturnValueOnce(Promise.resolve(namespaces))
                .mockReturnValueOnce(Promise.resolve(keys));

            return userDataStore.get('DHIS').then(namespace => namespace.getKeys().then((res) => {
                expect(res).toEqual(keys);
                expect(apiMock.get).toHaveBeenCalledTimes(2);
            }));
        });

        it('should not request API if autoload is false', () => userDataStore.get('DHIS', false).then((res) => {
            expect(res).toBeInstanceOf(UserDataStoreNamespace);
            expect(apiMock.get).not.toHaveBeenCalled();
        }));

        it('should throw an error when no response', () => {
            apiMock.get.mockReturnValueOnce(Promise.resolve(null));

            return userDataStore.get('DHIS').catch((e) => {
                expect(e.message).toBe('The requested namespace has no keys or does not exist.');
            });
        });

        it('should throw an error if namespace does not exist on server', () => {
            const err = { httpStatusCode: 404 };
            apiMock.get.mockReturnValueOnce(Promise.reject(err));

            return expect(userDataStore.get('DHIS').catch((e) => {
                expect(e).toThrow();
            })).rejects.toBeDefined();
        });

        it('should throw when error is not 404', () => {
            const error = { httpStatusCode: 500 };
            apiMock.get.mockReturnValueOnce(Promise.reject(error));

            return userDataStore.get('DHIS')
                .catch((e) => {
                    expect(e).toEqual(error);
                });
        });

        it('should throw an error if response is an empty array', () => {
            apiMock.get.mockReturnValueOnce(Promise.resolve([]));
            expect.assertions(1);
            return userDataStore.get('namespace').then(() => {
                throw new Error('this hould have failed');
            }).catch((e) => {
                expect(e.message).toMatch(/does not exist/);
            });
        });

        describe('for an invalid namespace', () => {
            beforeEach(() => {
                apiMock.get.mockReturnValueOnce(Promise.reject([
                    '{',
                    '"httpStatus":"Not Found",',
                    '"httpStatusCode":404,',
                    '"status":"ERROR",',
                    '"message":"The namespace \'not-my-namespace\' was not found."',
                    '}',
                ].join('')));
            });

            it('should throw an error', (done) => {
                return userDataStore.get('not-my-namespace').then(() => {
                    throw new Error('this should have failed');
                }).catch(() => done());
            });
        });
    });

    describe('getAll()', () => {
        it('should return an array of namespaces', (done) => {
            apiMock.get.mockReturnValueOnce(Promise.resolve(namespaces));
            userDataStore
                .getAll()
                .then((namespaceRes) => {
                    expect(namespaces).toEqual(namespaceRes);
                    done();
                })
                .catch(done);
        });

        it('should throw an error when there is no response', (done) => {
            apiMock.get.mockReturnValueOnce(Promise.resolve(null));

            return userDataStore.getAll()
                .then(done)
                .catch((namespaceRes) => {
                    expect(namespaceRes.message).toBe('No namespaces exist.');
                    done();
                });
        });
    });

    describe('delete()', () => {
        beforeEach(() => {
            apiMock.delete.mockReturnValueOnce(Promise.resolve());
        });

        it('should call the api with correct url', () => {
            const namespaceDel = 'DHIS';

            return userDataStore.delete(namespaceDel).then(() => {
                expect(apiMock.delete).toBeCalledWith(`userDataStore/${namespaceDel}`);
            });
        });
    });

    describe('getUserDataStore', () => {
        it('should return an instance of UserDataStore', () => {
            expect(UserDataStore.getUserDataStore()).toBeInstanceOf(UserDataStore);
        });

        it('should return the same object when called twice', () => {
            expect(UserDataStore.getUserDataStore()).toBe(UserDataStore.getUserDataStore());
        });
    });

    describe('create()', () => {
        it('should return an instance of UserDataStoreNamespace if namespace do not exist', () => {
            const error = { httpStatusCode: 404 };
            apiMock.get.mockReturnValueOnce(Promise.reject(error));

            return userDataStore.create('DHIS').then((namespace) => {
                expect(namespace).toBeInstanceOf(UserDataStoreNamespace);
                expect(namespace.keys).toHaveLength(0);
            });
        });

        it('should return an error if namespace exists', () => {
            apiMock.get.mockReturnValueOnce(Promise.resolve(keys));

            return userDataStore.get('DHIS').then((namespace) => {
                expect(namespace).toBeInstanceOf(UserDataStoreNamespace);
            });
        });
    });

    describe('has', () => {
        it('should resolve with true if namespace exists', async () => {
            apiMock.get.mockReturnValueOnce(Promise.resolve(keys));
            const hasNamespace = await userDataStore.has('DHIS');
            expect(hasNamespace).toBe(true);
        });

        it('should resolve with false if namespace does not exists (404 from server)', async () => {
            const err = { httpStatusCode: 404 };
            apiMock.get.mockReturnValueOnce(Promise.reject(err));
            const hasNamespace = await userDataStore.has('arandomnamespace');
            expect(hasNamespace).toBe(false);
        });

        it('should resolve with false if namespace does not exists (empty array)', async () => {
            apiMock.get.mockReturnValueOnce(Promise.resolve([]));
            const hasNamespace = await userDataStore.has('arandomnamespace');
            expect(hasNamespace).toBe(false);
        });

        it('should throw an error if resolved response is not an array', async () => {
            apiMock.get.mockReturnValueOnce(Promise.resolve({}));
            await expect(userDataStore.has('arandomnamespace')).rejects.toBeDefined();
        });

        it('should throw an error if rejected response is not 404 or empty array ', async () => {
            const err = { httpStatusCode: 500 };
            apiMock.get.mockReturnValueOnce(Promise.resolve(err));
            await expect(userDataStore.has('arandomnamespace')).rejects.toBeDefined();
        });
    });
});
