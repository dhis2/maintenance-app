import React from 'react';
import { render } from 'react-dom';
import { init, config, getUserSettings, getManifest } from 'd2/lib/d2';
import log from 'loglevel';
import LoadingMask from './loading-mask/LoadingMask.component';
import routes from './router';
import '../scss/maintenance.scss';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './translationRegistration';
import appTheme from './App/app.theme';
import customModelDefinitions from './config/custom-models';
import systemSettingsStore from './App/systemSettingsStore';
import rxjsconfig from 'recompose/rxjsObservableConfig';
import setObservableConfig from 'recompose/setObservableConfig';
import periodTypeStore from './App/periodTypeStore';
import store from './store';
import { loadAllColumnsPromise } from './List/columns/epics';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const dhisDevConfig = DHIS_CONFIG; // eslint-disable-line

Error.stackTraceLimit = Infinity;
setObservableConfig(rxjsconfig);

if (process.env.NODE_ENV !== 'production') {
    log.setLevel(log.levels.DEBUG);
} else {
    log.setLevel(log.levels.INFO);
}

function configI18n(userSettings) {
    const uiLocale = userSettings.keyUiLocale;

    if (uiLocale && uiLocale !== 'en') {
        // Add the language sources for the preferred locale
        config.i18n.sources.add(`./i18n/i18n_module_${uiLocale}.properties`);
    }

    // Add english as locale for all cases (either as primary or fallback)
    config.i18n.sources.add('./i18n/i18n_module_en.properties');

    // Force load strings for the header-bar
    config.i18n.strings.add('app_search_placeholder');
    config.i18n.strings.add('manage_my_apps');
    config.i18n.strings.add('log_out');
    config.i18n.strings.add('account');
    config.i18n.strings.add('profile');
    config.i18n.strings.add('settings');
    config.i18n.strings.add('about_dhis2');
    config.i18n.strings.add('help');
    config.i18n.strings.add('no_results_found');

    // Others
    config.i18n.strings.add('version');
}

function copy(dest, src) {
    var p;
    for (p in src) {
        if (src.hasOwnProperty(p) && !dest.hasOwnProperty(p)) {
            dest[p] = src[p];
        }
    }
    dest.__proto__ = src.__proto__;
}

function addCustomModels(d2) {
    customModelDefinitions.forEach((customModel) => {
        log.info(d2.models.dataSet);

        if (customModel.name === 'dataSetByOrgUnit'){
            var tempObj = {};
            copy(tempObj, customModel);
            customModel = tempObj;
            customModel.apiEndpoint = d2.models.dataSet.apiEndpoint;
            d2.models.add(Object.freeze(customModel));
        }else{
            d2.models.add(customModel);
        }
        
    });
    return d2;
}

function getSystemSettings(d2) {
    return Promise.all([
        d2.system.settings.all(),
        d2.Api.getApi().get('periodTypes'),
        loadAllColumnsPromise(d2)
    ]).then(([settings, periodTypeDefs, userConfiguredColumnsAction]) => {
        systemSettingsStore.setState(settings);
        periodTypeStore.setState(periodTypeDefs.periodTypes.map(p => ({
            text: d2.i18n.getTranslation(p.name.toLocaleLowerCase()),
            value: p.name,
        })));
        store.dispatch(userConfiguredColumnsAction);
    });
}

function startApp() {
    render(
        <MuiThemeProvider muiTheme={appTheme}>
            <div>
                {routes}
            </div>
        </MuiThemeProvider>,
        document.getElementById('app')
    );
}

render(
    <MuiThemeProvider muiTheme={appTheme}>
        <LoadingMask />
    </MuiThemeProvider>,
    document.getElementById('app')
);

getManifest('./manifest.webapp')
    .then((manifest) => {
        const baseUrl = process.env.NODE_ENV === 'production' ? manifest.getBaseUrl() : dhisDevConfig.baseUrl;
        config.baseUrl = `${baseUrl}/api/29`;
        log.info(`Loading: ${manifest.name} v${manifest.version}`);
        log.info(`Built ${manifest.manifest_generated_at}`);
    })
    .then(getUserSettings)
    .then(configI18n)
    .then(init)
    .then(addCustomModels)
    .then(getSystemSettings)
    .then(startApp)
    .catch(log.error.bind(log));
