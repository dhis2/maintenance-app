const dhisDevConfig = DHIS_CONFIG;
if (process.env.NODE_ENV !== 'production') {
    jQuery.ajaxSetup({ headers: { Authorization: dhisDevConfig.authorization } }); // eslint-disable-line
}

Error.stackTraceLimit = Infinity;

import React from 'react';
import { render } from 'react-dom';
import { init, config, getUserSettings, getManifest } from 'd2/lib/d2';
import log from 'loglevel';
import LoadingMask from './loading-mask/LoadingMask.component';
import dhis2 from 'd2-ui/lib/header-bar/dhis2';
import routes from './router';

if (process.env.NODE_ENV !== 'production') {
    log.setLevel(log.levels.DEBUG);
} else {
    log.setLevel(log.levels.INFO);
}

function configI18n(userSettings) {
    const uiLocale = userSettings.keyUiLocale;
    if (uiLocale !== 'en') {
        // Add the language sources for the preferred locale
        config.i18n.sources.add(`./i18n/i18n_module_${uiLocale}.properties`);
    }

    // Add english as locale for all cases (either as primary or fallback)
    config.i18n.sources.add('./i18n/i18n_module_en.properties');
}

function startApp() {
    render(
        routes,
        document.getElementById('app'));
}

render(<LoadingMask />, document.getElementById('app'));

getManifest('./manifest.webapp')
    .then(manifest => {
        const baseUrl = process.env.NODE_ENV === 'production' ? manifest.getBaseUrl() : dhisDevConfig.baseUrl;
        config.baseUrl = `${baseUrl}/api`;
        log.info(`Loading: ${manifest.name} v${manifest.version}`);
        log.info(`Built ${manifest.manifest_generated_at}`);

        // Set the baseUrl to localhost if we are in dev mode
        if (process.env.NODE_ENV !== 'production') {
            config.baseUrl = `${baseUrl}/api`;
            dhis2.settings.baseUrl = baseUrl;
        }
    })
    .then(getUserSettings)
    .then(configI18n)
    .then(init)
    .then(startApp)
    .catch(log.error.bind(log));
