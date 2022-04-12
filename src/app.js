import './css/index.js'
import './d2-ui/scss/index.js'
import { useConfig } from '@dhis2/app-runtime'
import React, { useEffect, useState } from 'react'
import { render } from 'react-dom';
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import log from 'loglevel';
import LoadingMask from './loading-mask/LoadingMask.component';
import routes from './router';
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

Error.stackTraceLimit = Infinity;
setObservableConfig(rxjsconfig);

if (process.env.NODE_ENV !== 'production') {
    log.setLevel(log.levels.DEBUG);
} else {
    log.setLevel(log.levels.INFO);
}

function addCustomModels(d2) {
    customModelDefinitions.forEach((customModel) => {
        d2.models.add(customModel);
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

export default function App() {
    const { d2, d2Error } = useD2({
        onInitialized: async d2 => {
            await addCustomModels(d2)
            await getSystemSettings(d2)
        }
    })

    if (!d2) {
        return (
            <MuiThemeProvider muiTheme={appTheme}>
                <LoadingMask />
            </MuiThemeProvider>
        )
    }

    if (d2Error) {
        return (
            <MuiThemeProvider muiTheme={appTheme}>
                <div>Error: ${d2Error.toString()}</div>
            </MuiThemeProvider>
        )
    }

    return (
        <MuiThemeProvider muiTheme={appTheme}>
            <div>{routes}</div>
        </MuiThemeProvider>
    );
}
