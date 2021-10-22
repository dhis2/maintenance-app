/**
 * @module i18n
 */

import Api from '../api/Api';

/**
 * I18n class for dealing with translations
 */
class I18n {
    constructor(sources = [], api = Api.getApi()) {
        this.sources = sources;
        this.api = api;
        this.strings = new Set();
        this.translations = undefined;
    }

    /**
     * Adds a .properties file to the list of sources to load translations from
     *
     * Files are loaded in the order they're added, and the first translation of each string that's encountered will be
     * used.
     *
     * @param {String} path
     */
    addSource(path) {
        this.sources.push(path);
    }

    /**
     * Adds one or more strings to the list of strings to translate
     *
     * @param {(String[]|String)} strings
     */
    addStrings(strings) {
        if (typeof strings === 'string' && strings.trim().length > 0) {
            this.strings.add(strings.trim());
        } else {
            Array.from(strings)
                .filter(string => string && (`${string}`).trim().length > 0)
                .forEach(string => this.strings.add(string));
        }
    }

    /**
     * Load translations
     *
     * First, all properties files (specified with addSource) are loaded.
     * Then, if any untranslated strings remain, these are POSTed to the i18n endpoint of the DHIS2 API.
     *
     * @returns {Promise}
     */
    load() {
        const i18n = this;
        i18n.translations = {};

        function parseProperties(text) {
            return text.split('\n').reduce((props, line) => {
                const [key, value] = line.split('=').map(out => out.trim());
                if (key !== undefined && value !== undefined && !props.hasOwnProperty(key)) {
                    props[key] = value // eslint-disable-line no-param-reassign
                        .replace(/\\u([0-9a-f]{4})/gi, (match, grp) => String.fromCharCode(parseInt(grp, 16)));
                }
                return props;
            }, {});
        }

        const propFiles = [];

        this.sources.forEach((source) => {
            propFiles.push(
                i18n.api.request('GET', source).then(
                    data => Promise.resolve(parseProperties(data)),

                    // Resolve errors to an empty object, so that one missing file doesn't prevent
                    // the rest from being loaded
                    () => Promise.resolve({}),
                ),
            );
        });

        return Promise.all(propFiles).then((propFile) => {
            propFile.forEach((props) => {
                Object.keys(props).forEach((str) => {
                    if (!i18n.translations.hasOwnProperty(str)) {
                        i18n.translations[str] = props[str];
                    }
                    this.strings.delete(str);
                });
            });

            if (this.strings.size > 0) {
                return i18n.api.post('i18n', Array.from(i18n.strings)).then((res) => {
                    Object.keys(res)
                        .filter(str => str !== res[str])
                        .forEach((str) => {
                            i18n.translations[str] = res[str];
                            i18n.strings.delete(str);
                        });

                    return Promise.resolve(i18n.translations);
                });
            }

            return Promise.resolve(i18n.translations);
        });
    }

    /**
     * Gets the translated version of the specified string
     *
     * If no translation exists for the specified string, the string is returned as is with two asterisks on each side,
     * in order to easily identify missing translations in the UI
     *
     * @param string
     * @returns {String}
     */
    getTranslation(string, variables = {}) {
        if (this.translations === undefined) {
            throw new Error('Tried to translate before loading translations!');
        }
        const translatedString = this.translations.hasOwnProperty(string)
            ? this.translations[string]
            : `** ${string} **`;

        if (Object.keys(variables).length) {
            return translatedString
                .replace(/\$\$(.+?)\$\$/gi, (match, partial) => variables[partial] || '');
        }

        return translatedString;
    }

    /**
     * Check if a translation exists for the specified string
     *
     * @param string
     * @returns {boolean} True if a translation exists, false otherwise
     */
    isTranslated(string) {
        if (this.translations === undefined) {
            throw new Error('Tried to translate before loading translations!');
        }
        return this.translations.hasOwnProperty(string);
    }


    /**
     * Get the list of strings that don't have translations
     *
     * If no translations have been loaded yet, `undefined` is returned in stead.
     *
     * @returns {Array|undefined} Array of untranslated strings, or undefined if translations haven't been loaded
     */
    getUntranslatedStrings() {
        return this.translations ? Array.from(this.strings) : undefined;
    }

    /**
     * Return a new instance of this class
     *
     * @returns {I18n}
     */
    static getI18n() {
        return new I18n();
    }
}

export default I18n;
