/**
 * @module system
 *
 * @requires module:api/Api
 */

import Api from '../api/Api';
import SystemSettings from './SystemSettings';
import SystemConfiguration from './SystemConfiguration';

/**
 * @description
 * Represents the system that can be interacted with. There is a single instance of this pre-defined onto the d2
 * object after initialisation. This can be interacted with using its property objects to among other be used
 * to get and save systemSettings.
 *
 * @memberof module:system
 */
class System {
    constructor(settings, configuration) {
        /**
         * Contains a reference to a `SystemSettings` instance that can be used
         * to retrieve and save system settings.
         *
         * ```js
         * d2.system.settings.get('keyLastSuccessfulResourceTablesUpdate')
         *  .then(systemSettingsValue => {
         *    console.log('Analytics was last updated on: ' + systemSettingsValue);
         *  });
         * ```
         * @type {SystemSettings}
         *
         */
        this.settings = settings;

        /**
         * A representation of the system configuration,
         * that can be used to retrieve and change system configuration options.
         * @type {SystemConfiguration}
         */
        this.configuration = configuration;

        /**
         * An object containing system information about the DHIS2 instance
         * @type {Object}
         */
        this.systemInfo = undefined;

        /**
         * An object containing version information about the DHIS2 instance
         * @type {Object}
         */
        this.version = undefined;

        /**
         * An array of all the webapps that are installed on the current DHIS2 instance
         * @type {Array}
         */
        this.installedApps = undefined;
    }

    /**
     * Sets the systemInfo and version properties
     *
     * @param systemInfo
     */
    setSystemInfo(systemInfo) {
        this.version = System.parseVersionString(systemInfo.version);
        this.systemInfo = systemInfo;
    }

    /**
     * Sets the list of currently installed webapps
     *
     * @param apps
     */
    setInstalledApps(apps) {
        this.installedApps = apps;
    }

    /**
     * Refreshes the list of currently installed webapps
     *
     * @returns {Promise} A promise that resolves to the list of installed apps
     */
    loadInstalledApps() {
        const api = Api.getApi();

        return api.get('apps')
            .then((apps) => {
                this.setInstalledApps(apps);

                return apps;
            });
    }

    /**
     * Upload and install a zip file containing a new webapp
     *
     * @param zipFile Zip file data from a file input form field
     * @param onProgress An optional callback that will be called whenever file upload progress info is available
     * @returns {Promise}
     */
    uploadApp(zipFile, onProgress) { // eslint-disable-line class-methods-use-this
        const api = Api.getApi();
        const data = new FormData();
        let xhr;
        data.append('file', zipFile);

        if (onProgress !== undefined) {
            xhr = new XMLHttpRequest();
            xhr.upload.onprogress = (progress) => {
                if (progress.lengthComputable) {
                    onProgress(progress.loaded / progress.total);
                }
            };
        }

        return api.post('apps', data, {
            contentType: false,
            processData: false,
            xhr: xhr !== undefined ? () => xhr : undefined,
        });
    }

    /**
     * Load the list of apps available in the DHIS 2 app store
     *
     * @param compatibleOnly If true, apps that are incompatible with the current system will be filtered out
     * @returns {Promise}
     */
    loadAppStore(compatibleOnly = true) {
        return new Promise((resolve, reject) => {
            const api = Api.getApi();
            api.get('appStore')
                .then(appStoreData => resolve(appStoreData
                    .map((appData) => {
                        const app = Object.assign({}, appData);

                        if (compatibleOnly) {
                            app.versions = app.versions
                                .filter(versionData => System.isVersionCompatible(this.version, versionData));
                        }

                        return app;
                    })
                    .filter(appData => appData.versions.length > 0)),
                )
                .catch(err => reject(err));
        });
    }

    /**
     * Install the specified app version from the DHIS 2 app store
     *
     * @param uid The uid of the app version to install
     * @returns {Promise}
     */
    installAppVersion(uid) { // eslint-disable-line class-methods-use-this
        const api = Api.getApi();
        return new Promise((resolve, reject) => {
            api.post(['appStore', uid].join('/'), '', { dataType: 'text' }).then(() => {
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    }

    /**
     * Remove the specified app from the system
     *
     * @param appKey The key of the app to remove
     * @returns {Promise}
     */
    uninstallApp(appKey) { // eslint-disable-line class-methods-use-this
        const api = Api.getApi();

        return api.delete(['apps', appKey].join('/'))
            // TODO: Stop jQuery from rejecting successful promises
            .catch(() => undefined);
    }

    /**
     * Refresh the list of apps that are installed on the server
     *
     * @returns {Promise} A promise that resolves to the updated list of installed apps
     */
    reloadApps() {
        const api = Api.getApi();
        return api.update('apps').then(() => this.loadInstalledApps());
    }

    /**
     * @static
     * @typedef {Object} ParsedVersion
     * @property {number} major - Major version of the parsed-string (before .)
     * @property {number} minor - Minor version of the parsed-string (after .)
     * @property {boolean} snapshot - If it's a snapshot-version
     */
    // TODO: Validate string
    // TODO: Handle valid version objects too
    /**
     * Parses a version string into an object describing the version.
     * @param {string} version Version-string to parse
     * @returns {module:system.ParsedVersion}
     */
    static parseVersionString(version) {
        return {
            major: Number.parseInt(version, 10),
            minor: Number.parseInt(version.substring(version.indexOf('.') + 1), 10),
            snapshot: version.indexOf('-SNAPSHOT') >= 0,
        };
    }

    // Disable eslint complexity warning
    /* eslint-disable complexity */
    /**
     * Compares version a to version b.
     * @param a {string|module:system.ParsedVersion}
     * @param b {string|module:system.ParsedVersion}
     * @returns {number} 0 if same version, else a - b.
     */
    static compareVersions(a, b) {
        const from = (typeof a === 'string' || a instanceof String) ? System.parseVersionString(a) : a;
        const to = (typeof b === 'string' || b instanceof String) ? System.parseVersionString(b) : b;

        if (from.major !== to.major) {
            return from.major - to.major;
        } else if (from.minor !== to.minor) {
            return from.minor - to.minor;
        }

        return (from.snapshot ? 0 : 1) - (to.snapshot ? 0 : 1);
    }

    /**
     * Checks if systemVersion is compatible with appVersion.
     * Versions are compatible if appVersion.minDhisVersion <= parsed systemVersion and
     * if appVersion.maxDhisVersion >= parsed systemVersion.
     * @param systemVersion {string|module:system.ParsedVersion} systemVersion to check
     * @param {Object} appVersion - AppVersion object to check
     * @returns {boolean} true if compatible, false otherwise.
     */
    static isVersionCompatible(systemVersion, appVersion) {
        const minVersion = appVersion.minDhisVersion || appVersion.min_platform_version || null;
        const maxVersion = appVersion.maxDhisVersion || appVersion.max_platform_version || null;

        const isNewEnough = (minVersion ? System.compareVersions(systemVersion, minVersion) >= 0 : true);
        const isNotTooOld = (maxVersion ? System.compareVersions(systemVersion, maxVersion) <= 0 : true);

        return isNewEnough && isNotTooOld;
    }
    /* eslint-enable */

    /**
     * Get a new instance of the system object. This will function as a singleton, when a System object has been created
     * when requesting getSystem again the original version will be returned.
     *
     * @returns {System} Object with the system interaction properties
     */
    static getSystem() {
        if (!System.getSystem.system) {
            System.getSystem.system = new System(new SystemSettings(), new SystemConfiguration());
        }

        return System.getSystem.system;
    }
}

export default System;
