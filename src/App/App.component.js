import React from 'react';
import classes from 'classnames';
import HeaderBar from 'd2-ui/lib/header-bar/HeaderBar.component';
import MainContent from '../MainContent/MainContent.component';
import SideBar from '../SideBar/SideBarContainer.component';
import SnackbarContainer from '../Snackbar/SnackbarContainer.component';
import {getInstance} from 'd2/lib/d2';
import AppWithD2 from 'd2-ui/lib/app/AppWithD2.component';
import log from 'loglevel';
import appTheme from './app.theme';
import LoadingMask from '../loading-mask/LoadingMask.component';
import '../translationRegistration';

log.setLevel(log.levels.INFO);

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
            muiTheme: appTheme,
        });
    }

    render() {
        const classList = classes('app');

        if (!this.state.d2) {
            return (<LoadingMask />);
        }

        return (
            <div className={classList}>

                <MainContent>
                    <div className="sidebar-container">
                        <SideBar />
                    </div>
                    <div className="main-container">
                        {this.props.children}
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
