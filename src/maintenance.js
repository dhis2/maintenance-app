if (process.env.NODE_ENV !== 'production') {
    jQuery.ajaxSetup({ // eslint-disable-line no-undef
        headers: {
            Authorization: `Basic ${btoa('admin:district')}`,
        },
    });
}

Error.stackTraceLimit = Infinity;

import React from 'react';
import {render} from 'react-dom';
// import Router from 'react-router';
import Action from 'd2-ui/lib/action/Action';
import { init, config, getUserSettings, getManifest } from 'd2/lib/d2';
import log from 'loglevel';
import LoadingMask from './loading-mask/LoadingMask.component';
import dhis2 from 'd2-ui/lib/header-bar/dhis2';
// import moment from 'moment';
import routes from './router';
// import {Router, Route, hashHistory} from 'react-router';


if (process.env.NODE_ENV !== 'production') {
    log.setLevel(log.levels.DEBUG);
} else {
    log.setLevel(log.levels.ERROR);
}

const routeActions = Action.createActionsFromNames(['transition']);

function configI18n({ uiLocale }) {
    if (uiLocale !== 'en') {
        config.i18n.sources.add(`./i18n/i18n_module_${uiLocale}.properties`);
        // moment.locale(uiLocale);
    }
    config.i18n.sources.add('./i18n/i18n_module_en.properties');
}

function startApp() {
    render(
        routes,
        document.getElementById('app'));
    // routeActions.transition(hashHistory.getCurrentPath());
}

render(<LoadingMask />, document.getElementById('app'));

getManifest('./manifest.webapp')
    .then(manifest => {
        config.baseUrl = `${manifest.getBaseUrl()}/api`;

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
