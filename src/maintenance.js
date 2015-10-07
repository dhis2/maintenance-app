import React from 'react';
import Router from 'react-router';
import Action from 'd2-flux/action/Action';
import router from './router';
import {init, config, getUserSettings, getManifest} from 'd2';
import log from 'loglevel';
import LoadingMask from './loading-mask/LoadingMask.component';

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
        config.baseUrl = manifest.getBaseUrl();
        config.baseUrl = 'http://localhost:8080/dhis/api';
    })
    .then(getUserSettings)
    .then(configI18n)
    .then(init)
    .then(startApp)
    .catch(log.error.bind(log));


