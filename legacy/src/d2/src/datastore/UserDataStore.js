import BaseStore from './BaseStore';
import UserDataStoreNamespace from './UserDataStoreNamespace';
import Api from '../api/Api';

/**
 * @augments module:datastore.BaseStore
 * @description
 * Represents the UserDataStore that can be interacted with. This can be used to get instances of UserDataStoreNamespace, which
 * can be used to interact with the {@link module:current-user.UserDataStoreNamespace namespace API}.
 *
 * The store is a key-value store, where a namespace contains a list of keys, and
 * a key corresponds to an arbitrary JSON-object. The store is per-user, and only the currently logged-in user
 * has access to the namespaces.
 *
 * Note that a namespace cannot exist without at least one key-value pair, for this reason
 * you need to call {@link module:current-user.UserDataStoreNamespace#set set()} after {@link module:current-user.UserDataStore#create create()} to save a namespace
 * with a key and a value.
 *
 * @example <caption>Getting a value with promise-syntax</caption>
 * import { init } from 'd2';
 *
 * init({baseUrl: 'https://play.dhis2.org/demo/api'})
 *   .then((d2) => {
 *     d2.currentUser.dataStore.get('namespace').then(namespace => {
 *          namespace.get('key').then(value => console.log(value))
 *      });
 *   });
 *
 * @example <caption>Creation of namespace with async-syntax</caption>
 * const namespace = await d2.currentUser.dataStore.create('new namespace', false);
 * // The namespace is not actually created on the server before 'set' is called
 * await namespace.set('new key', value);
 *
 * @memberof module:current-user
 */
class UserDataStore extends BaseStore {
    constructor(api = Api.getApi(), endPoint = 'userDataStore') {
        super(api, endPoint, UserDataStoreNamespace);
    }

    /**
     * @description
     * Tries to get the given namespace from the server, and returns an instance of 'UserDataStore' that
     * may be used to interact with this namespace. See {@link module:current-user.UserDataStoreNamespace UserDataStoreNamespace}.
     *
     * @example <caption>Getting a namespace</caption>
     * d2.currentUser.dataStore.get('namespace').then(namespace => {
     *     namespace.set('new key', value);
     *});
     *
     * @param {string} namespace - Namespace to get.
     * @param {boolean} [autoLoad=true] - If true, autoloads the keys of the namespace from the server.
     * If false, an instance of the namespace is returned without any keys (no request is sent to the server).
     *
     * @returns {Promise<UserDataStoreNamespace>} An instance of a UserDataStoreNamespace representing the namespace that can be interacted with.
     */
    get(namespace, autoLoad = true) {
        return super.get(namespace, autoLoad);
    }

    /**
     * Creates a namespace. Ensures that the namespace does not exists on the server.
     * Note that for the namespace to be saved on the server, you need to call {@link module:current-user.UserDataStoreNamespace#set set}.
     *
     * @example <caption>Creating a namespace</caption>
     * d2.currentUser.dataStore.create('new namespace').then(namespace => {
     *     namespace.set('new key', value);
     * });
     * @param {string} namespace The namespace to create.
     * @returns {Promise<UserDataStoreNamespace>} An instance of the current store-Namespace-instance representing the namespace that can be interacted with, or
     * an error if namespace exists.
     */
    create(namespace) {
        return super.create(namespace);
    }

    /**
     * @static
     *
     * @returns {UserDataStore} Object with the userDataStore interaction properties
     *
     * @description
     * Get a new instance of the userDataStore object. This will function as a singleton - when a UserDataStore object has been created
     * when requesting getUserDataStore again, the original version will be returned.
     */

    static getUserDataStore() {
        if (!UserDataStore.getUserDataStore.dataStore) {
            UserDataStore.getUserDataStore.dataStore = new UserDataStore(Api.getApi(), 'userDataStore');
        }

        return UserDataStore.getUserDataStore.dataStore;
    }
}

export default UserDataStore;
