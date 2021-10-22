import { isString } from '../lib/check';
import Api from '../api/Api';

/**
 * @description
 * Handles communication with the systemSettings endpoint. Can be used to get or save systemSettings.
 *
 * @memberof module:system
 * @requires lib/check
 * @requires api/Api
 */
// TODO: Return the values from the local cache if we have not updated it? We could
class SystemSettings {
    constructor(api = Api.getApi()) {
        this.api = api;
    }

    /**
     * Loads all the system settings in the system and returns them as an object from the promise.
     *
     * @returns {Promise} Promise that resolves with the systemsettings object from the api.
     *
     * @example
     * d2.system.settings.all()
     *  .then(systemSettings => {
     *    console.log('Analytics was last updated on: ' + systemSettings.keyLastSuccessfulResourceTablesUpdate);
     *  });
     */
    all() {
        return this.settings
            ? Promise.resolve(this.settings)
            : this.api.get('systemSettings')
                .then((settings) => {
                    this.settings = settings;
                    return Promise.resolve(this.settings);
                });
    }

    /**
     * Get a single systemSetting for the given key.
     *
     * This will use the cached value of the key if it has been previously loaded.
     *
     * @param {String} systemSettingsKey The identifier of the system setting that should be retrieved.
     * @returns {Promise} A promise that resolves with the value or will fail if the value is not available.
     *
     * @example
     * d2.system.settings.get('keyLastSuccessfulResourceTablesUpdate')
     *  .then(systemSettingsValue => {
     *    console.log('Analytics was last updated on: ' + systemSettingsValue);
     *  });
     */
    get(systemSettingsKey) {
        if (this.settings && this.settings[systemSettingsKey]) {
            return Promise.resolve(this.settings[systemSettingsKey]);
        }

        function processValue(value) {
            // Attempt to parse the response as JSON. If this fails we return the value as is.
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        }

        return new Promise((resolve, reject) => {
            if (!isString(systemSettingsKey)) {
                throw new TypeError('A "key" parameter should be specified when calling get() on systemSettings');
            }

            const options = { headers: { accept: 'text/plain' } };
            this.api.get(
                ['systemSettings', systemSettingsKey].join('/'), undefined, options)
                .then((response) => {
                    if (response) {
                        resolve(processValue(response));
                    }
                    reject(new Error('The requested systemSetting has no value or does not exist.'));
                });
        });
    }

    set(systemSettingsKey, value) {
        delete this.settings;

        const settingUrl = ['systemSettings', systemSettingsKey].join('/');
        if (value === null || (`${value}`).length === 0) {
            return this.api.delete(settingUrl);
        }
        return this.api.post(settingUrl, value, { headers: { 'Content-Type': 'text/plain' } });
    }
}

export default SystemSettings;
