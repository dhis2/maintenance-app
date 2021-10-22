import Api from '../api/Api';
import BaseStoreNamespace from './BaseStoreNamespace';

/**
 * @augments module:datastore.BaseStoreNamespace
 * @description
 * Represents a namespace in the dataStore that can be used to be used to interact with
 * the remote API.
 *
 * @property {array} keys an array of the loaded keys.
 * @property {string} namespace Name of the namespace as on the server.
 *
 * @memberof module:current-user
 */
class UserDataStoreNamespace extends BaseStoreNamespace {
    constructor(namespace, keys, api = Api.getApi(), endPoint = 'userDataStore') {
        super(namespace, keys, api, endPoint);
    }
}

export default UserDataStoreNamespace;
