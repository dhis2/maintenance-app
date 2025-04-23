/**
 * This is a script used as part of the build process to generate manifest translations
 *
 * This script is specific to the maintenance app - other apps that use the platform tools have this support
 * through @dhis2/cli-app-scripts (and i18next under the hood) - so this script adapts to the specifics of the maintenance app
 * in order to support translations for shortcuts.
 *
 * In general, it performs three steps:
 * 
 * 1. It reads the i18n_module_en.properties which is the source of truth for translation keys (not "en.pot")
 * 2. It looks for keys that start with MANIFEST_ prefix (this is an internal convention)
 * 3. It generates manifest.webapp.translations.json file in the format expected by the backend
 *
 */
const { readFileSync, readdirSync, writeFileSync } = require('node:fs');
const { getProperties } = require('properties-file');

try {
    const SOURCE_DIR = 'src/i18n';

    console.debug('---- generating manifest translations');

    // i18n_module_en.properties is our template file (equivalent to .pot)
    // we use it to find the manifest keys that should be translated
    const keyToMatch = /^MANIFEST_/;
    const baseLanguageProperties = getProperties(readFileSync(`${SOURCE_DIR}/i18n_module_en.properties`))
    const shortcutKeys = Object.keys(
        baseLanguageProperties
    ).filter(key => {
        return keyToMatch.exec(key);
    });
    console.debug(`${shortcutKeys.length} keys with MANIFEST_ prefix found.`);

    // Finding all the .properties file for all languages
    const propsFiles = readdirSync(SOURCE_DIR).filter(fn =>
        fn.endsWith('.properties')
    );

    console.debug(`${propsFiles.length} .properties files found.`);

    const result = propsFiles.map(file => {
        // read the properties file using getProperties library
        const properties = getProperties(readFileSync('src/i18n/' + file));
        const locale = file
            .replace(/^i18n_module_/, '')
            .replace('.properties', '');
        const foundTranslations = Object.entries(properties).filter(
            ([key, value]) => {
                return shortcutKeys.includes(key);
            }
        );
        // change the translations to the format expected by the backend
        const translations = foundTranslations.reduce((prev, curr) => {
            const [key, value] = curr

            // For shortcuts, the key should be in the format of SHORTCUT_NAME_VALUE where NAME_VALUE is the "name" property for a shortcut in d2.config or manifest.webapp
            // the java .properties file do not use spaces for the keys (unlike pot files) so we're getting that value manually here instead of relying on the key as we do in app-platform
            let keyToUse = baseLanguageProperties[key]
            
            let cleaned_key = key?.replace(/MANIFEST_/, '')
            cleaned_key = cleaned_key.startsWith('SHORTCUT') ? `SHORTCUT_${keyToUse}` : cleaned_key

            prev[cleaned_key] = value;
            return prev;
        }, {});

        return {
            locale,
            translations,
        };
    });

    writeFileSync(
        './build/manifest.webapp.translations.json',
        JSON.stringify(result, null, 2)
    );
    console.log(
        `---- generated "./build/manifest.webapp.translations.json" file`
    );
} catch (err) {
    console.error('Generating the manifest.webapp translations failed.');
    console.error(err);
}
