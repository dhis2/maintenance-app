/**
 * @module d2
 *
 * @description
 * Module that contains the entry points for working with the d2 instance. Most of the api related functionality will be available through this package.
 *
 * The most important functions from the module are {@link module:d2.init|init} and {@link module:d2.init|getInstance} these are used to create and to get
 * a hold of the initialized instance of {@link module:d2.init~d2|d2}. The initialized instance is the object that allows you access most of d2's functionality.
 *
 * @example
 * import { init } from 'd2/lib/d2';
 *
 * init({ baseUrl: 'https://play.dhis2.org/demo/api/27/' })
 *  .then(d2 => console.log(d2.currentUser.name));
 */
import 'whatwg-fetch';
import { pick, Deferred, updateAPIUrlWithBaseUrlVersionNumber } from './lib/utils';
import Logger from './logger/Logger';
import model from './model';
import Api from './api/Api';
import System from './system/System';
import I18n from './i18n/I18n';
import Config from './config';
import CurrentUser from './current-user/CurrentUser';
import { fieldsForSchemas } from './model/config';
import DataStore from './datastore/DataStore';
import Analytics from './analytics/Analytics';
import GeoFeatures from './geofeatures/GeoFeatures';

let firstRun = true;
let deferredD2Init = Deferred.create();

const preInitConfig = Config.create();

/**
 * Utility function to load the app manifest.
 *
 * The manifest well be enhanced with a `getBaseUrl()` utility function that will return the base url of the DHIS2 instance.
 * This is a simple getter for the `activities.dhis.href` property on the manifest.
 *
 * @example
 * import { getManifest } from 'd2/lib/d2';
 *
 * getManifest()
 *   .then(manifest => {
 *      console.log(manifest.getBaseUrl());
 *   });
 *
 * @param {string} url The location of the manifest. Generally this is located in the root of your app folder. (e.g. './manifest.webapp)
 * @param {Api} [ApiClass] An implementation of the Api class that will be used to fetch the manifest.
 *
 * @returns {Promise} Returns a Promise to  the DHIS2 app manifest with the added `getBaseUrl` method.
 */
export function getManifest(url, ApiClass = Api) {
    const api = ApiClass.getApi();
    api.setBaseUrl('');

    const manifestUtilities = {
        getBaseUrl() {
            return this.activities.dhis.href;
        },
    };

    return api.get(`${url}`)
        .then(manifest => Object.assign({}, manifest, manifestUtilities));
}


/**
 * @function getUserSettings
 *
 * @returns {Promise} A promise to the current user settings
 *
 * @description
 * The object that is the result of the promise will have the following properties
 *
 * @example
 * import {getUserSettings} from 'd2/lib/d2';
 *
 * getUserSettings()
 *  .then(userSettings => {
 *      console.log(userSettings);
 *  });
 */
export function getUserSettings(ApiClass = Api) {
    const api = ApiClass.getApi();

    if (preInitConfig.baseUrl && firstRun) {
        api.setBaseUrl(preInitConfig.baseUrl);
    }

    return api.get('userSettings');
}

function getModelRequests(api, schemaNames) {
    const modelRequests = [];
    const loadSchemaForName = schemaName => api.get(`schemas/${schemaName}`, { fields: fieldsForSchemas });

    if (Array.isArray(schemaNames)) {
        const individualSchemaRequests = schemaNames.map(loadSchemaForName).concat([]);

        const schemasPromise = Promise
            .all(individualSchemaRequests)
            .then(schemas => ({ schemas }));

        modelRequests.push(schemasPromise);

        if (schemaNames.length > 0) {
            // If schemas are loaded, attributes should be as well
            modelRequests.push(api.get('attributes', { fields: ':all,optionSet[:all,options[:all]]', paging: false }));
        } else {
            // Otherwise, just return an empty list of attributes
            modelRequests.push({ attributes: [] });
        }
    } else {
        // If no schemas are specified, load all schemas and attributes
        modelRequests.push(api.get('schemas', { fields: fieldsForSchemas }));
        modelRequests.push(api.get('attributes', { fields: ':all,optionSet[:all,options[:all]]', paging: false }));
    }


    return modelRequests;
}

/**
 * Init function that used to initialise {@link module:d2.init~d2|d2}. This will load the schemas from the DHIS2 api and configure your {@link module:d2.init~d2|d2} instance.
 *
 * The `config` object that can be passed into init can have the following properties:
 *
 * baseUrl: Set this when the url is something different then `/api`. If you are running your dhis instance in a subdirectory of the actual domain
 * for example http://localhost/dhis/ you should set the base url to `/dhis/api`
 *
 * @param {Object} initConfig Configuration object that will be used to configure to define D2 Setting.
 * See the description for more information on the available settings.
 * @returns {Promise.<D2>} A promise that resolves with the intialized {@link init~d2|d2} object.
 *
 * @example
 * import init from 'd2';
 *
 * init({baseUrl: '/dhis/api'})
 *   .then((d2) => {
 *     console.log(d2.model.dataElement.list());
 *   });
 */
export function init(initConfig, ApiClass = Api, logger = Logger.getLogger()) {
    const api = ApiClass.getApi();

    const config = Config.create(preInitConfig, initConfig);

    if (config.headers) {
        api.setDefaultHeaders(config.headers);
    }

    /**
     * @namespace
     */
    const d2 = {
        /**
         * @description
         * This is the entry point for the modelDefinitions that were loaded. To start interacting with the metadata api
         * you would pick a modelDefinition from this object to interact with.
         *
         * @type {Object.<string, ModelDefinition>}
         * @instance
         */
        models: undefined,
        /**
         * Collection of the {@link module:model} classes
         *
         * @deprecated There is probably no point to expose this.
         * @instance
         */
        model, // TODO: Remove (Breaking)
        /**
         * Api class that is used throughout the api interaction. This can be used to get hold of the module:Api singleton.
         *
         * @example
         * d2.Api.getApi()      // Returns the api object
         *  .get('resources')   // Do a get request for /api/resources
         *  .then(resources => {
         *      console.log(resources);
         *  });
         *
         * @see {@link module:api~Api#getApi}
         *
         * @instance
         */
        Api: ApiClass,
        /**
         * System instance to interact with system information like system settings, system info etc.
         *
         * @example
         * console.log(d2.system.version.major); // 2 for DHIS 2.27
         *
         * @see {@link module:system/System~System|System}
         * @instance
         */
        system: System.getSystem(),
        /**
         * I18n instance with the loaded translations.
         *
         * Usually used for retrieving translations for a given key using `getTranslation(key: string)`
         *
         * @example
         * d2.i18n.getTranslation('success'); // Returns "Success" for the english locale
         *
         * @see {@link module:i18n~I18n#getTranslation|getTranslation}
         *
         * @instance
         */
        i18n: I18n.getI18n(),
        /**
         * Instance of the DataStore class for interaction with the dataStore api.
         *
         * @see {@link module:datastore.DataStore DataStore}
         *
         * @instance
         */
        dataStore: DataStore.getDataStore(),

        /**
         * Analytics instance for requesting analytics data from various endpoints.
         *
         * @example
         * d2.analytics.aggregate
         *  .addDimensions([
         *   'dx:Uvn6LCg7dVU;OdiHJayrsKo',
         *   'pe:LAST_4_QUARTERS',
         *   'ou:lc3eMKXaEfw;PMa2VCrupOd',
         *  ])
         *  .addFilter('pe:2016Q1;2016Q2')
         *  .getRawData({
         *    startDate: '2017-10-01',
         *    endDate: '2017-10-31'
         *  })
         *  .then(console.log)
         *
         * @see {@link module:analytics.Analytics Analytics}
         * @instance
         */
        analytics: Analytics.getAnalytics(),

        /*
         * GeoFeatures instance
         *
         * @see {@link module:geoFeatures.GeoFeatures GeoFeatures}
         * @instance
         */
        geoFeatures: GeoFeatures.getGeoFeatures(),
    };

    // Process the config in a the config class to keep all config calls together.
    Config.processConfigForD2(config, d2);

    // Because when importing the getInstance method in dependencies the getInstance could run before
    // init we have to resolve the current promise on first run and for consecutive ones replace the
    // old one with a fresh promise.
    if (firstRun) {
        firstRun = false;
    } else {
        deferredD2Init = Deferred.create();
    }

    const modelRequests = getModelRequests(api, config.schemas);

    const userRequests = [
        api.get('me', { fields: ':all,organisationUnits[id],userGroups[id],userCredentials[:all,!user,userRoles[id]' }),
        api.get('me/authorization'),
        getUserSettings(ApiClass),
    ];

    const systemRequests = [
        api.get('system/info'),
        api.get('apps'),
    ];

    return Promise.all([
        ...modelRequests,
        ...userRequests,
        ...systemRequests,
        d2.i18n.load(),
    ])
        .then((res) => {
            const responses = {
                schemas: pick('schemas')(res[0]),
                attributes: pick('attributes')(res[1]),
                currentUser: res[2],
                authorities: res[3],
                userSettings: res[4],
                systemInfo: res[5],
                apps: res[6],
            };

            responses.schemas
                // We only deal with metadata schemas
                .filter(schema => schema.metadata)
                // TODO: Remove this when the schemas endpoint is versioned or shows the correct urls for the requested version
                // The schemas endpoint is not versioned which will result into the modelDefinitions always using the
                // "default" endpoint, we therefore modify the endpoint url based on the given baseUrl.
                .map((schema) => {
                    schema.apiEndpoint = updateAPIUrlWithBaseUrlVersionNumber(schema.apiEndpoint, config.baseUrl); // eslint-disable-line no-param-reassign

                    return schema;
                })
                .forEach((schema) => {
                    // Attributes that do not have values do not by default get returned with the data,
                    // therefore we need to grab the attributes that are attached to this particular schema to be able to know about them
                    const schemaAttributes = responses.attributes
                        .filter((attributeDescriptor) => {
                            const attributeNameFilter = [schema.singular, 'Attribute'].join('');
                            return attributeDescriptor[attributeNameFilter] === true;
                        });

                    if (!Object.prototype.hasOwnProperty.call(d2.models, schema.singular)) {
                        d2.models.add(model.ModelDefinition.createFromSchema(schema, schemaAttributes));
                    }
                });

            /**
             * An instance of {@link module:current-user/CurrentUser~CurrentUser|CurrentUser}
             *
             * The currentUser can be used to retrieve data related to the currentUser.
             *
             * These things primarily include:
             * - currentUser properties retrieved from `/api/me`
             * - Lazily request collections related to the user such as
             *      - userRoles
             *      - userGroups
             *      - organisationUnits
             *      - dataViewOrganisationUnits
             * - authorities
             * - userSettings
             * - utility methods for ACL
             *
             * @example
             * d2.currentUser.canCreate(d2.models.dataElement); // Returns true when the user can create either a private/public dataElement
             * d2.currentUser.canCreate(d2.models.organisationUnit); // Returns true the user can create an organisationUnit
             *
             * @see {@link module:current-user/CurrentUser~CurrentUser|CurrentUser}
             * @instance
             */
            d2.currentUser = CurrentUser.create(
                responses.currentUser,
                responses.authorities,
                d2.models,
                responses.userSettings,
            );
            d2.system.setSystemInfo(responses.systemInfo);
            d2.system.setInstalledApps(responses.apps);

            deferredD2Init.resolve(d2);
            return deferredD2Init.promise;
        })
        .catch((error) => {
            logger.error('Unable to get schemas from the api', JSON.stringify(error), error);

            deferredD2Init.reject('Unable to get schemas from the DHIS2 API');
            return deferredD2Init.promise;
        });
}

/**
 * This function can be used to retrieve the `singleton` instance of d2. The instance is being created by calling
 * the `init` method.
 *
 * @returns {Promise.<D2>} A promise to the initialized {@link module:d2.init~d2|d2} instance.
 *
 * @example
 * import {init, getInstance} from 'd2';
 *
 * init({baseUrl: '/dhis2/api/'});
 * getInstance()
 *   .then(d2 => {
 *      d2.models.dataElement.list();
 *      // and all your other d2 magic.
 *   });
 */
export function getInstance() {
    return deferredD2Init.promise;
}

export function setInstance(d2) {
    console.warn('[d2] Overriding d2 instance; you better be sure about this.');
    deferredD2Init.resolve(d2);
}

/**
 * Can be used to set config options before initialisation of d2.
 *
 * @example
 * import {config, init} from 'd2';
 *
 * config.baseUrl = '/demo/api';
 * config.i18n.sources.add('i18n/systemsettingstranslations.properties');
 *
 * init()
 *   .then(d2 => {
 *     d2.system.settings.all()
 *       .then(systemSettings => Object.keys())
 *       .then(systemSettingsKey => {
 *         d2.i18n.getTranslation(systemSettingsKey);
 *       });
 *   });
 *   @type Config
 */
export const config = preInitConfig; // Alias preInitConfig to be able to `import {config} from 'd2';`

export default {
    init,
    config,
    getInstance,
    getUserSettings,
    getManifest,
};
