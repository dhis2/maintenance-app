import DataStoreNamespace from '../../datastore/DataStoreNamespace';
import MockApi from '../../api/Api';

jest.mock('../../api/Api');

describe('DataStoreNamespace', () => {
    const keys = ['key1', 'a key', 'aowelfkxuw'];
    let namespace;
    let apiMock;

    beforeEach(() => {
        apiMock = MockApi.getApi();

        namespace = new DataStoreNamespace('DHIS', keys, apiMock);

        apiMock.get.mockReturnValue(Promise.resolve());
        apiMock.post.mockReturnValue(Promise.resolve());
        apiMock.update.mockReturnValue(Promise.resolve());
        apiMock.delete.mockReturnValue(Promise.resolve());
    });

    afterEach(() => {
        MockApi.mockReset();
    });

    it('should throw an error if not called with a string', () => {
        expect(() => new DataStoreNamespace()).toThrowError(
            'BaseStoreNamespace must be called with a string to identify the Namespace',
        );
    });

    it('should contain an array of keys', () => {
        expect(Array.isArray(namespace.keys)).toBe(true);
        expect(namespace.keys).toEqual(keys);
    });

    it('should contain a string of a namespace', () => {
        expect(typeof namespace.namespace).toBe('string');
    });

    describe('getKeys()', () => {
        const refreshedKeys = keys.concat('newkey');
        beforeEach(() => {
            apiMock.get.mockClear();
            apiMock.get.mockReturnValue(Promise.resolve(keys));
        });

        it('should return an array of keys', (done) => {
            namespace
                .getKeys()
                .then((res) => {
                    expect(res).toEqual(keys);
                    done();
                })
                .catch(e => done(e));
        });

        it('should be backwards compatible with getKeys(false), but send request either way', () => {
            namespace.getKeys().then((res) => {
                expect(res).toEqual(keys);
                expect(apiMock.get).toHaveBeenCalled();
            });
        });

        it('should call remote api if forceload is true and update internal array', (done) => {
            apiMock.get.mockReturnValueOnce(Promise.resolve(refreshedKeys));

            namespace
                .getKeys(true)
                .then((res) => {
                    expect(res).toEqual(refreshedKeys);
                    expect(namespace.keys).toEqual(refreshedKeys);
                    expect(apiMock.get).toBeCalledWith('dataStore/DHIS');
                    done();
                })
                .catch(e => done(e));
        });

        it('should throw an error when there is no response', (done) => {
            apiMock.get.mockReturnValueOnce(Promise.resolve({}));

            return namespace
                .getKeys(true)
                .then(() => done('It did not fail!'))
                .catch((namespaceRes) => {
                    expect(namespaceRes.message).toBe(
                        'The requested namespace has no keys or does not exist.',
                    );
                    done();
                });
        });
    });

    describe('get()', () => {
        beforeEach(() => {
            apiMock.get.mockReturnValueOnce(Promise.resolve('value'));
        });

        it('should call API with correct parameters', (done) => {
            namespace
                .get('key1')
                .then(() => {
                    expect(apiMock.get).toBeCalledWith('dataStore/DHIS/key1');
                    done();
                })
                .catch(e => done(e));
        });

        it('should return a value', (done) => {
            namespace
                .get('key1')
                .then((val) => {
                    expect(val).toBe('value');
                    done();
                })
                .catch(e => done(e));
        });
    });

    describe('getMetaData()', () => {
        const key = 'key1';
        const metaObj = {
            created: '2017-01-22T14:15:14.176',
            lastUpdated: '2017-01-22T14:15:14.176',
            externalAccess: false,
            namespace: 'DHIS',
            key: 'key1',
            value: '{}',
            id: 'B6SZPkuigc0',
        };
        beforeEach(() => {
            apiMock.get.mockReturnValueOnce(Promise.resolve(metaObj));
        });

        it('should retrieve an object with metaData', (done) => {
            namespace
                .getMetaData(key)
                .then((res) => {
                    expect(res).toBe(metaObj);
                    done();
                })
                .catch(e => done(e));
        });

        it('should call api.get() with correct parameters', (done) => {
            namespace
                .getMetaData(key)
                .then(() => {
                    expect(apiMock.get).toBeCalledWith(
                        `dataStore/DHIS/${key}/metaData`,
                    );
                    done();
                })
                .catch(e => done(e));
        });
    });

    describe('set()', () => {
        const valueData = 'value';
        beforeEach(() => {
            jest.spyOn(namespace, 'update');
            jest.spyOn(namespace, 'set');
        });

        it('should call the api with correct url', (done) => {
            const setKey = 'DHIS2';

            return namespace.set(setKey, valueData).then(() => {
                expect(apiMock.post).toBeCalledWith(
                    `dataStore/DHIS/${setKey}`,
                    valueData,
                );
                done();
            });
        });

        it('should update if the key exists', () => {
            const setKey = 'key1';

            return namespace.set(setKey, valueData).then(() => {
                expect(namespace.update).toBeCalledWith(setKey, valueData);
                expect(apiMock.update).toBeCalledWith(
                    `dataStore/DHIS/${setKey}`,
                    valueData,
                );
            });
        });

        it('should call post if the key exists and override is true', () => {
            const setKey = 'key1';

            return namespace.set(setKey, valueData, true).then(() => {
                expect(namespace.update).not.toHaveBeenCalled();
                expect(apiMock.post).toBeCalledWith(
                    `dataStore/DHIS/${setKey}`,
                    valueData,
                );
            });
        });

        it('should add key to internal array', (done) => {
            const arr = namespace.keys;
            const key = 'key';
            namespace
                .set('key', valueData)
                .then(() => {
                    expect(namespace.keys).toEqual(arr.concat(key));
                    done();
                })
                .catch(e => done(e));
        });

        it('should work with encrypt = true', async () => {
            const encryptedVal = {
                prop: 'am encrypted',
            };
            await namespace.set('encrypt', encryptedVal, false, true);

            const calls = apiMock.post.mock.calls;
            expect(namespace.set).toHaveBeenCalledWith(
                'encrypt',
                encryptedVal,
                false,
                true,
            );

            expect(calls[calls.length - 1][0]).toContain('encrypt'); // last call with arg0
        });
    });

    describe('delete()', () => {
        it('should call api.delete() with the correct url', (done) => {
            namespace
                .delete('key1')
                .then(() => {
                    expect(apiMock.delete).toBeCalledWith(
                        'dataStore/DHIS/key1',
                    );
                    done();
                })
                .catch(e => done(e));
        });

        it('should delete key from internal array', (done) => {
            const orgLen = namespace.keys.length;
            namespace
                .delete('key1')
                .then(() => {
                    expect(namespace.keys.length).toBe(orgLen - 1);
                    done();
                })
                .catch(e => done(e));
        });

        it('should call api.delete() even if the key was not present in the internal array', (done) => {
            namespace
                .delete('someInaginaryKeyIJustMadeUp')
                .then(() => {
                    expect(apiMock.delete).toBeCalledWith(
                        'dataStore/DHIS/someInaginaryKeyIJustMadeUp',
                    );
                    done();
                })
                .catch(e => done(e));
        });

        it('should throw if not called with a string', async () => {
            /* this way of handling errors is quite weird, see
                    https://github.com/facebook/jest/issues/3601
                 */
            let err = null;
            try {
                await namespace.delete({});
            } catch (e) {
                err = e;
            }
            expect(err.message).toMatch(/Expected key to be string, but got/);
        });
    });

    describe('update()', () => {
        const valueData = 'value';

        it('should call the api with correct url', (done) => {
            const setKey = 'DHIS';
            namespace
                .update(setKey, valueData)
                .then(() => {
                    expect(apiMock.update).toBeCalledWith(
                        `dataStore/DHIS/${setKey}`,
                        valueData,
                    );
                    done();
                })
                .catch(e => done(e));
        });
    });
});
