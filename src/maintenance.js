if (process.env.NODE_ENV !== 'production') {
    jQuery.ajaxSetup({
        headers: {
            Authorization: 'Basic ' + btoa('admin:district'), // btoa('system:System123'), //btoa('testadmin:Testadmin1234')
        },
    });
}

import React from 'react';
import Router from 'react-router';
import Action from 'd2-flux/action/Action';
import router from './router';
import {init, config, getUserSettings, getManifest} from 'd2/lib/d2';
import log from 'loglevel';
import LoadingMask from './loading-mask/LoadingMask.component';
import dhis2 from 'd2-ui/lib/header-bar/dhis2';

if (process.env.NODE_ENV !== 'production') {
    log.setLevel(log.levels.DEBUG);
} else {
    log.setLevel(log.levels.ERROR);
}

const routeActions = Action.createActionsFromNames(['transition']);

function configI18n({uiLocale}) {
    if (uiLocale !== 'en') {
        config.i18n.sources.add(`./i18n/i18n_module_${uiLocale}.properties`);
    }
    config.i18n.sources.add('./i18n/i18n_module_en.properties');
}

function startApp() {
    router.run(Root => {
        React.render(<Root/>, document.getElementById('app'));
        routeActions.transition(Router.HashLocation.getCurrentPath());
    });
}

React.render(<LoadingMask />, document.getElementById('app'));

getManifest(`./manifest.webapp`)
    .then(manifest => {
        config.baseUrl = manifest.getBaseUrl() + '/api';

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


