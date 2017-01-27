const dhisDevConfig = DHIS_CONFIG; // eslint-disable-line

Error.stackTraceLimit = Infinity;

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
import { Observable } from 'rx';
import setObservableConfig from 'recompose/setObservableConfig';
import $$observable from 'symbol-observable';
import systemSettingsStore from './App/systemSettingsStore';

const recomposeConfig = {
    fromESObservable: observable => Observable.create(observer => {
        const { unsubscribe } = observable.subscribe({
            next: val => observer.onNext(val),
            error: error => observer.onError(error),
            complete: () => observer.onCompleted()
        });
        return unsubscribe
    }),
    toESObservable: rxObservable => ({
        subscribe: observer => {
            const subscription = rxObservable.subscribe(
                val => observer.next(val),
                error => observer.error(error),
                () => (observer.complete && observer.complete())
            );
            return { unsubscribe: () => subscription.dispose() }
        },
        [$$observable]() {
            return this
        }
    })
};
setObservableConfig(recomposeConfig);

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
}

function getSystemSettings(d2) {
    return d2.system.settings.all().then(settings => systemSettingsStore.setState(settings));
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
    .then(manifest => {
        const baseUrl = process.env.NODE_ENV === 'production' ? manifest.getBaseUrl() : dhisDevConfig.baseUrl;
        config.baseUrl = `${baseUrl}/api/26`;
        log.info(`Loading: ${manifest.name} v${manifest.version}`);
        log.info(`Built ${manifest.manifest_generated_at}`);
    })
    .then(getUserSettings)
    .then(configI18n)
    .then(init)
    .then(getSystemSettings)
    .then(startApp)
    .catch(log.error.bind(log));
