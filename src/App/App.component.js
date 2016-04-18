import React from 'react';
import classes from 'classnames';
import HeaderBar from 'd2-ui/lib/header-bar/HeaderBar.component';
import MainContent from '../MainContent/MainContent.component';
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
import {Observable} from 'rx';

log.setLevel(log.levels.INFO);

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import FlatButton from 'material-ui/lib/flat-button';
import { setAppState, default as appState } from './appStateStore';
import { goToRoute } from '../router';

const sections$ = appState
    .map(appState => {
        return {
            sections: appState.sideBar.mainSections,
            current: appState.sideBar.currentSection,
            changeSection: (sectionName) => {
                setAppState({
                    sideBar: Object.assign({}, appState.sideBar, {
                        currentSection: sectionName,
                    }),
                });
                goToRoute(`/list/${sectionName}`);
            }
        };
    });

const SectionTabsWrap = withStateFrom(sections$, SectionTabs);

function TwoPanelSelector(props) {
    const {children, ...otherProps} = props;
    const styles = {
        mainStyle: {
            flex: 1,
            display: 'flex',
            flexOrientation: 'row',
            marginTop: '8rem',
        },
    };

    const flexedChilden = children
        .map((childComponent, index) => {
            const childStyle = Object
                .assign({}, styles.childWrapStyle, {
                    flex: props.sizeRatio[index],
                    paddingRight: (index === children.length - 1) ? '2rem' : undefined,
                });

            return (
                <div key={index} style={childStyle}>{childComponent}</div>
            );
        });

    return (
        <main style={styles.mainStyle} {...otherProps}>
            {flexedChilden}
        </main>
    );
}
TwoPanelSelector.defaultProps = {
    sizeRatio: ['0 0 320px', 1],
};

function SinglePanel(props) {
    const {children, ...otherProps} = props;

    const styles = {
        mainStyle: {
            flex: 1,
            display: 'flex',
            flexOrientation: 'row',
            marginTop: '8rem',
            marginLeft: '2rem',
            marginRight: '2rem',
        },
    };

    return (
        <main style={styles.mainStyle} {...otherProps}>
            {children}
        </main>
    );
}

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
            // Check if the current section is in the list of mainSections
            .map((state) => state.mainSections.some(mainSection => mainSection.key === state.sideBar.currentSection));

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

        this.disposable && this.disposable.dispose();
    }

    render() {
        if (!this.state.d2) {
            return (<LoadingMask />);
        }

        return (
            <div>
                <HeaderBar />
                <SectionTabsWrap />
                {this.state.hasSection ? <TwoPanelSelector>
                    <SideBar activeGroupName={this.props.params.groupName} activeModelType={this.props.params.modelType} />
                    <MainContent>
                        {this.props.children}
                    </MainContent>
                </TwoPanelSelector>: <SinglePanel> <MainContent>
                    {this.props.children}
                </MainContent></SinglePanel>}
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
