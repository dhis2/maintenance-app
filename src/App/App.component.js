import React from 'react';
import classes from 'classnames';
import {RouteHandler} from 'react-router';
import HeaderBar from '../HeaderBar/HeaderBar.component';
import MainContent from '../MainContent/MainContent.component';
import SideBar from '../SideBar/SideBarContainer.component';
import SnackbarContainer from '../Snackbar/SnackbarContainer.component';
import {getInstance} from 'd2';
import AppWithD2 from 'd2-ui/app/AppWithD2.component';
import log from 'loglevel';
import appTheme from './app.theme';

log.setLevel(log.levels.INFO);

const ThemeManager = require('material-ui/lib/styles/theme-manager');

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const withMuiContext = Object.assign(AppWithD2.childContextTypes, {muiTheme: React.PropTypes.object});
class App extends AppWithD2 {
    childContextTypes: withMuiContext

    getChildContext() {
        return Object.assign({}, super.getChildContext(), {
            muiTheme: ThemeManager.getMuiTheme(appTheme),
        });
    }

    render() {
        const classList = classes('app');

        if (!this.state.d2) {
            return (<div>App loading...</div>);
        }

        return (
            <div className={classList}>
                <HeaderBar />
                <MainContent>
                    <div className="sidebar-container">
                        <div className="sidebar-container--hide-scroll-bar">
                            <SideBar />
                        </div>
                    </div>
                    <div className="main-container">
                        <RouteHandler />
                    </div>
                </MainContent>
                <SnackbarContainer />
            </div>
        );
    }
}
App.defaultProps = {
    d2: getInstance(),
};

export default App;
