import 'isomorphic-fetch';
import { init } from '../../../d2';
import UserDataStoreNamespace from '../../UserDataStoreNamespace';

describe('UserDataStore', () => {
    const credentials = `Basic ${btoa('admin:district')}`;
    let d2;
    let namespace;
    let store;

    beforeAll(async () => {
        d2 = await init({ baseUrl: 'https://play.dhis2.org/demo/api', schemas: [], headers: { authorization: credentials } });
        store = d2.currentUser.dataStore;

        try {
            namespace = await store.create('namespace');
        } catch (e) { // delete if exists
            expect(e).toThrow(/already exist/);
            await store.delete('namespace');
        }

        if (await store.has('new namespace')) {
            await store.delete('new namespace');
        }
    });

    afterAll(async () => {
        await store.delete('namespace');
    });

    describe('get()', () => {
        it('should fetch asynchronously', async () => {
            const value = { value: '123' };
            const key = 'key';
            await namespace.set(key, value);
            const retVal = await namespace.get(key);

            expect(Array.isArray(namespace.keys)).toBe(true);
            expect(namespace.keys).toEqual([key]);
            expect(retVal).toEqual(value);
        });

        it('should work when autoLoad = false', async () => {
            const ns = await store.get('another namespace', false);

            expect(ns).toBeInstanceOf(UserDataStoreNamespace);
            expect(ns.keys).toHaveLength(0);
        });
    });

    describe('getAll()', () => {
        it('should get asynchronously', async () => {
            const newNamespace = await store.create('new namespace');
            const stringVal = 'a random string';
            await newNamespace.set('key', stringVal);

            const namespaces = await store.getAll();
            const serverVal = await newNamespace.get('key');

            expect(namespaces).toContain(newNamespace.namespace);
            expect(serverVal).toEqual(stringVal);

            await store.delete('new namespace');
        });
    });

    describe('delete()', () => {
        it('should delete asynchronously', async () => {
            const newNamespace = await store.create('new namespace');
            const stringVal = 'a random string';
            await newNamespace.set('key', stringVal);

            await store.delete('new namespace');
            // should throw as it does not exist
            await expect(store.get('new namespace')).rejects.toBeDefined();
        });
    });
});
