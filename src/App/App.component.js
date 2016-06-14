import React from 'react';
import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import MainContent from 'd2-ui/lib/layout/main-content/MainContent.component';
import SideBar from '../SideBar/SideBarContainer.component';
import SnackbarContainer from '../Snackbar/SnackbarContainer.component';
import { getInstance } from 'd2/lib/d2';
import AppWithD2 from 'd2-ui/lib/app/AppWithD2.component';
import log from 'loglevel';
import appTheme from './app.theme';
import LoadingMask from '../loading-mask/LoadingMask.component';
import '../translationRegistration';
import SectionTabs from '../TopBar/SectionTabs.component';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';
import { Observable } from 'rx';
import SinglePanelLayout from 'd2-ui/lib/layout/SinglePanel.component';
import TwoPanelLayout from 'd2-ui/lib/layout/TwoPanel.component';

log.setLevel(log.levels.INFO);

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import appState, { setAppState } from './appStateStore';
import { goToRoute } from '../router';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

const sections$ = appState
    .map(state => ({
        sections: state.sideBar.mainSections,
        current: state.sideBar.currentSection,
        changeSection: (sectionName) => {
            setAppState({
                sideBar: Object.assign({}, state.sideBar, {
                    currentSection: sectionName,
                }),
            });
            goToRoute(`/list/${sectionName}`);
        },
    }));

const SectionTabsWrap = withStateFrom(sections$, SectionTabs);

const withMuiContext = Object.assign(AppWithD2.childContextTypes, { muiTheme: React.PropTypes.object });
class App extends AppWithD2 {
    getChildContext() {
        return Object.assign({}, super.getChildContext(), {
            muiTheme: appTheme,
        });
    }

    componentDidMount() {
        super.componentDidMount();

        // The all section is a special section that should not be treated like a normal section as it does not
        // have the sidebar. It is used to display the collection of all meta data objects. The all section will
        // therefore always emit false.
        const allSectionSelected$ = appState
            .filter(state => state.sideBar.currentSection === 'all')
            .map(() => false);

        const nonAllSectionSelected$ = appState
            // The all section is managed separately so we do not want to process those any further
            .filter(state => state.sideBar.currentSection !== 'all')
            .map((state) => (
                // Check if the current section is in the list of mainSections
                state.mainSections.some(mainSection => mainSection.key === state.sideBar.currentSection)
            ));

        this.disposable = Observable
            .merge(allSectionSelected$, nonAllSectionSelected$)
            // Do not emit the value more often than needed to prevent unnecessary react triggers
            .distinctUntilChanged()
            .subscribe((hasSection) => this.setState({
                ...this.state,
                hasSection,
            }));
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        if (this.disposable && this.disposable.dispose) {
            this.disposable.dispose();
        }
    }

    render() {
        if (!this.state.d2) {
            return (<LoadingMask />);
        }

        return (
            <div>
                <HeaderBar />
                <SectionTabsWrap />
                {this.state.hasSection && !this.props.children.props.route.disableSidebar ? <TwoPanelLayout>
                    <SideBar activeGroupName={this.props.params.groupName} activeModelType={this.props.params.modelType} />
                    <MainContent>
                        {this.props.children}
                    </MainContent>
                </TwoPanelLayout> : <SinglePanelLayout>
                    <MainContent>{this.props.children}</MainContent>
                </SinglePanelLayout>}
                <SnackbarContainer />
            </div>
        );
    }
}
App.defaultProps = {
    d2: getInstance(),
};
App.childContextTypes = withMuiContext;

export default App;
