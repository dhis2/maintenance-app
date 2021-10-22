/**
 * @module current-user
 */
import UserAuthorities from './UserAuthorities';
import UserSettings from './UserSettings';
import { noCreateAllowedFor } from '../defaultConfig';
import UserDataStore from '../datastore/UserDataStore';

const models = Symbol('models');
const propertiesToIgnore = new Set([
    'userCredentials',
    'userGroups',
    'userRoles',
    'organisationUnits',
    'dataViewOrganisationUnits',
]);

/**
 * Authorities lookup map to be used for determining the list of authorities to check.
 *
 * @private
 * @type {Object.<string, string[]>}
 * @readonly
 * @typedef {Object} AuthorityType
 * @memberof module:current-user
 */
const authTypes = {
    READ: ['READ'],
    CREATE: ['CREATE', 'CREATE_PUBLIC', 'CREATE_PRIVATE'],
    CREATE_PUBLIC: ['CREATE_PUBLIC'],
    CREATE_PRIVATE: ['CREATE_PRIVATE'],
    DELETE: ['DELETE'],
    UPDATE: ['UPDATE'],
    EXTERNALIZE: ['EXTERNALIZE'],
};

/**
 * Create a map of `propertyName` -> `Symbol`. This map is used to hide values for these properties. We will instead add
 * add convenience methods for these properties. (e.g. the `userGroups` property on the currentUser object becomes
 * `getUserGroups()`
 *
 * @private
 * @type {Object.<string, Symbol>}
 */
const propertySymbols = Array
    .from(propertiesToIgnore)
    .reduce((result, property) => {
        result[property] = Symbol(property); // eslint-disable-line no-param-reassign
        return result;
    }, {});

/**
 * Creates a map of propertyName and propertyValue pairs of properties to be attached to the currentUser object.
 * These are all the regular properties that are returned when calling `api/27/me` but with the `userCredentials`
 * merged onto the same object.
 *
 * What would originally be `currentUser.userCredentials.username` would just be `currentUser.username`
 *
 * @private
 * @param {Object} currentUserObject The user payload as it is received from the api. https://play.dhis2.org/demo/api/27/me
 * @returns {Object} A map with propertyName/propertyValue pairs.
 */
function getPropertiesForCurrentUserObject(currentUserObject) {
    let properties;
    // The userCredentials object on the userObject is confusing so we set the properties straight onto the currentUser
    // object itself
    if (currentUserObject.userCredentials) {
        properties = Object.assign({}, currentUserObject.userCredentials, currentUserObject);
    } else {
        properties = Object.assign({}, currentUserObject);
    }

    return Object.keys(properties)
        .reduce((result, property) => {
            if (propertiesToIgnore.has(property)) {
                if (properties[property].map) {
                    result[propertySymbols[property]] = properties[property] // eslint-disable-line no-param-reassign
                        .map(value => value.id);
                }
            } else {
                result[property] = properties[property]; // eslint-disable-line no-param-reassign
            }
            return result;
        }, {});
}

/**
 * Checks the noCreateAllowedFor list if the object can be created.
 *
 * @private
 * @param {ModelDefinition} modelDefinition The modelDefinition to check for.
 * @returns {boolean} True when it exists in the list, false otherwise.
 */
function isInNoCreateAllowedForList(modelDefinition) {
    return Boolean(modelDefinition && noCreateAllowedFor.has(modelDefinition.name));
}

/**
 * Represents the current logged in user
 *
 * @memberof module:current-user
 */
class CurrentUser {
    /**
     * Creates the CurrentUser.
     *
     * @param {Object} userData Payload as returned from the api when requesting the currentUser object.
     * @param {UserAuthorities} userAuthorities The UserAuthorities object for the currentUsers authorities.
     * @param {ModelDefinition[]} modelDefinitions The modelDefinitions that need to be used for checking access.
     * @param {UserSettings} settings The userSettings object to be set onto the current user object.
     */
    constructor(userData, userAuthorities, modelDefinitions, settings) {
        Object.assign(this, getPropertiesForCurrentUserObject(userData));

        /**
         *
         * @type {UserAuthorities}
         */
        this.authorities = userAuthorities;

        this[models] = modelDefinitions;

        /**
         * Contains a reference to a `UserSettings` instance that can be used
         * to retrieve and save system settings.
         * @type {UserSettings}
         * @description
         * ```js
         * d2.currentUser.userSettings.get('keyUiLocale')
         *  .then(userSettingsValue => {
         *    console.log('UI Locale: ' + userSettingsValue);
         *  });
         * ```
         */
        this.userSettings = settings;

        /**
         * Contains a reference to {@link module:current-user.UserDataStore UserDataStore}
         * @type UserDataStore
         *
         */
        this.dataStore = UserDataStore.getUserDataStore();
    }

    /**
     * Get a ModelCollection of userGroup models that are assigned to the currentUser
     *
     * The user groups are lazy loaded on init of the library. This method can be used to load the full representation
     * of the userGroups.
     *
     * The request done is equivalent do doing https://play.dhis2.org/demo/api/27/me.json?fields=userGroups[:all]
     *
     * @returns {Promise<ModelCollection>} The model collection that contains the user's groups.
     */
    getUserGroups() {
        const userGroupIds = this[propertySymbols.userGroups];

        return this[models].userGroup.list({ filter: [`id:in:[${userGroupIds.join(',')}]`], paging: false });
    }

    /**
     * Get a ModelCollection of userRole models that are assigned to the currentUser
     *
     * The user roles are lazy loaded on init of the library. This method can be used to load the full representation
     * of the userGroups.
     *
     * The request done is equivalent do doing https://play.dhis2.org/demo/api/27/me.json?fields=userCredentials[userRoles[:all]]
     *
     * @returns {Promise<ModelCollection>} A ModelCollection that contains the user's groups.
     */
    getUserRoles() {
        const userRoleIds = this[propertySymbols.userRoles];

        return this[models].userRole.list({ filter: [`id:in:[${userRoleIds.join(',')}]`], paging: false });
    }

    /**
     * Requests a users primary organisation units from the api.
     *
     * The users organisation units are lazy loaded on init of the library (just the ids). This method can be used to
     * load the full representation of the organisationUnits.
     *
     * @param {Object} [listOptions={}] Additional query parameters that should be send with the request.
     * @returns {Promise<ModelCollection>} A ModelCollection that contains the user's organisationUnits.
     */
    getOrganisationUnits(listOptions = {}) {
        const organisationUnitsIds = this[propertySymbols.organisationUnits];

        return this[models].organisationUnit.list(
            Object.assign(
                { fields: ':all,displayName,path,children[id,displayName,path,children::isNotEmpty]', paging: false },
                listOptions,
                { filter: [`id:in:[${organisationUnitsIds.join(',')}]`] },
            ),
        );
    }

    /**
     * Requests a users data view organisation units from the api.
     *
     * The users data view organisation units are lazy loaded on init of the library (just the ids). This method can
     * be used to load the full representation of the dataViewOrganisationUnits.
     *
     * @param {Object} [listOptions={}] Additional query parameters that should be send with the request.
     * @returns {Promise<ModelCollection>} A ModelCollection that contains the user's dataViewOrganisationUnits.
     */
    getDataViewOrganisationUnits(listOptions) {
        const organisationUnitsIds = this[propertySymbols.dataViewOrganisationUnits];

        return this[models].organisationUnit.list(
            Object.assign(
                { fields: ':all,displayName,path,children[id,displayName,path,children::isNotEmpty]', paging: false },
                listOptions,
                { filter: [`id:in:[${organisationUnitsIds.join(',')}]`] },
            ),
        );
    }

    /**
     * Helper function to check if the currentUser can perform an action.
     *
     * A schema from the api defines the authorities as follows:
     * "authorities": [
     *   {
     *     "type": "CREATE_PUBLIC",
     *     "authorities": [
     *       "F_DATAELEMENT_PUBLIC_ADD"
     *     ]
     *   }, {
     *      "type": "CREATE_PRIVATE",
     *      "authorities": [
     *        "F_DATAELEMENT_PRIVATE_ADD"
     *      ]
     *    }, {
     *      "type": "DELETE",
     *      "authorities": [
     *        "F_DATAELEMENT_DELETE"
     *      ]
     *    }
     *
     * ],
     *
     * So for example, when asking for `currentUser.canCreate(modelDefinition)` we look at the authorities map for CREATE, we
     * collect the authorities from the schema based on the values of `CREATE`. So in the case of above schema authorities
     * we take the authorities for 'CREATE_PUBLIC' and 'CREATE_PRIVATE' and check if the user has at least one of the
     * authorities in the combined list. If we had asked for `currentUser.canCreatePrivate(modelDefinition)` we would only
     * need to check if the user has `F_DATAELEMENT_PRIVATE_ADD` However for just create the user could still create when he
     * has either private or public.
     *
     * @private
     * @param {AuthorityType} authorityType The type of authority to check for.
     * @param {ModelDefinition} modelDefinition The ModelDefinition for the type of object that the authority should
     * be checked for.
     * @returns {boolean} True when the user has the authority to perform the action, otherwise false.
     */
    checkAuthorityForType(authorityType, modelDefinition) {
        if (!modelDefinition || !Array.isArray(modelDefinition.authorities)) {
            return false;
        }

        return modelDefinition.authorities
            // Filter the correct authority to check for from the model
            .filter(authority => authorityType.some(authToHave => authToHave === authority.type))
            // Check the left over schema authority types
            .some(schemaAuthority => schemaAuthority.authorities
                .some(authorityToCheckFor => this.authorities.has(authorityToCheckFor)), // Check if one of the schema authorities are available in the users authorities
            );
    }

    /**
     * Helper method to first check the special "not allowed to create list" before checking the users authorities.
     *
     * @private
     * @param {AuthorityType} authType The type of authority that should be checked. (CREATE, CREATE_PRIVATE
     * or CREATE_PUBLIC)
     * @param {ModelDefinition} modelDefinition The modelDefinition that the authorities should be checked for.
     * @returns {boolean} True when the user has the permission to create the object
     */
    checkCreateAuthorityForType(authType, modelDefinition) {
        // When the modelDefinition is mentioned in the the list of modelTypes that are not
        // allowed to be created we return false
        if (isInNoCreateAllowedForList(modelDefinition)) {
            return false;
        }

        // Otherwise we check using the normal procedure for checking authorities
        return this.checkAuthorityForType(authType, modelDefinition);
    }

    /**
     * Check if the user has the authority to create objects of a type of Model (based on it's modelDefinition)
     * If the object supports public and private objects then both are checked, and the method will return true if one
     * of them is true. (e.g. will also return true if the user can only create private objects)
     *
     * @param {ModelDefinition} modelDefinition The modelDefinition that the authorities should be checked for.
     * @returns {boolean} True when the user has the permission to create the object
     */
    canCreate(modelDefinition) {
        return this.checkCreateAuthorityForType(authTypes.CREATE, modelDefinition);
    }

    /**
     * Check if the user has the authority to create public objects of a type of Model (based on it's modelDefinition)
     *
     * @param {ModelDefinition} modelDefinition The modelDefinition that the authorities should be checked for.
     * @returns {boolean} True when the user has the permission to create the object
     */
    canCreatePublic(modelDefinition) {
        return this.checkCreateAuthorityForType(authTypes.CREATE_PUBLIC, modelDefinition);
    }

    /**
     * Check if the user has the authority to create private objects of a type of Model (based on it's modelDefinition)
     *
     * @param {ModelDefinition} modelDefinition The modelDefinition that the authorities should be checked for.
     * @returns {boolean} True when the user has the permission to create the object
     */
    canCreatePrivate(modelDefinition) {
        return this.checkCreateAuthorityForType(authTypes.CREATE_PRIVATE, modelDefinition);
    }

    /**
     * Check if the user has the authority to delete objects of a type of Model (based on it's modelDefinition)
     *
     * @param {ModelDefinition} modelDefinition The modelDefinition that the authorities should be checked for.
     * @returns {boolean} True when the user has the permission to delete the object
     *
     * @deprecated Delete should be checked through the `Model.access.delete` property instead, as that also takes into
     * account sharing. Just checking if the user has the authority to delete a specific object does not take into account
     * the full ACL.
     */
    canDelete(modelDefinition) {
        return this.checkAuthorityForType(authTypes.DELETE, modelDefinition);
    }

    /**
     * Check if the user has the authority to update objects of a type of Model (based on it's modelDefinition)
     *
     * @param {ModelDefinition} modelDefinition The modelDefinition that the authorities should be checked for.
     * @returns {boolean} True when the user has the permission to update the object
     *
     * @deprecated Update should be checked through the `Model.access.update` property instead, as that also takes into
     * account sharing. Just checking if the user has the authority to update a specific object does not take into account
     * the full ACL.
     */
    canUpdate(modelDefinition) {
        if (this.checkAuthorityForType(authTypes.UPDATE, modelDefinition)) {
            return true;
        }
        return this.checkAuthorityForType(authTypes.CREATE, modelDefinition);
    }

    /**
     * Factory method for creating a CurrentUser instance
     *
     * @param {Object} userData Payload as returned from the api when requesting the currentUser object.
     * @param {string[]} authorities A list of authorities that the currentUser has.
     * @param {ModelDefinition[]} modelDefinitions The modelDefinitions that need to be used for checking access.
     * @param {Object} userSettings Payload as returned from the api when request the userSettings
     * @returns {CurrentUser} The created CurrentUser object based on the data given.
     */
    static create(userData, authorities, modelDefinitions, userSettings) {
        return new CurrentUser(
            userData,
            UserAuthorities.create(authorities),
            modelDefinitions,
            new UserSettings(userSettings),
        );
    }
}

export default CurrentUser;
