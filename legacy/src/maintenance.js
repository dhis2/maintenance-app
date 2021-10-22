import React from 'react';
import ReactDOM from 'react-dom';
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

Error.stackTraceLimit = Infinity;
setObservableConfig(rxjsconfig);

if (process.env.NODE_ENV !== 'production') {
    log.setLevel(log.levels.DEBUG);
} else {
    log.setLevel(log.levels.INFO);
}

export default class Maintenance extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			d2: null,
			loaded: false,
		}
	}

	async componentDidMount() {
		if (!this.state.loaded) {
			const manifest = await getManifest('./manifest.webapp')

			const baseUrl = manifest.getBaseUrl()
			config.baseUrl = `https://debug.dhis2.org/dev/api/38`;
			log.info(`Loading: ${manifest.name} v${manifest.version}`);
			log.info(`Built ${manifest.manifest_generated_at}`);

			const userSettings = await getUserSettings()
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

			const d2 = await init()
			log.info('d2', d2)

			customModelDefinitions.forEach((customModel) => {
				d2.models.add(customModel);
			});

			const [ settings, periodTypeDefs, userConfiguredColumnsAction ] = await Promise.all([
				d2.system.settings.all(),
				d2.Api.getApi().get('periodTypes'),
				loadAllColumnsPromise(d2)
			])

			log.info('settings', settings)

			systemSettingsStore.setState(settings);

			periodTypeStore.setState(periodTypeDefs.periodTypes.map(p => ({
				text: d2.i18n.getTranslation(p.name.toLocaleLowerCase()),
				value: p.name,
			})));

			store.dispatch(userConfiguredColumnsAction);

			this.setState({
				d2: d2,
				loaded: true
			})
		}
	}

	render() {
		if (this.state.loaded) {
			return (
				<MuiThemeProvider muiTheme={appTheme}>
					<div>
						{routes}
					</div>
				</MuiThemeProvider>
			)
		} else {
			return (<div>wait for load</div>)
		}
	}
}
