if (process.env.NODE_ENV !== 'production') {
    jQuery.ajaxSetup({ // eslint-disable-line no-undef
        headers: {
            Authorization: `Basic ${btoa('admin:district')}`,
        },
    });

    jQuery('head').append(`
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <link href='https://fonts.googleapis.com/css?family=Roboto:400,300,500,700' rel='stylesheet' type='text/css'/>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
    `);
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

function configI18n({ uiLocale }) {
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
        config.baseUrl = `${manifest.getBaseUrl()}/api`;
        log.info(`Loading: ${manifest.name} v${manifest.version}`);
        log.info(`Built ${manifest.manifest_generated_at}`);

        // Set the baseUrl to localhost if we are in dev mode
        if (process.env.NODE_ENV !== 'production') {
            config.baseUrl = 'http://localhost:8080/dhis/api';
            dhis2.settings.baseUrl = 'http://localhost:8080/dhis';
        }
    })
    .then(getUserSettings)
    .then(configI18n)
    .then(init)
    .then(startApp)
    .catch(log.error.bind(log));
