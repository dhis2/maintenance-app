import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { MainContent, withStateFrom, SinglePanel, TwoPanel } from '@dhis2/d2-ui-core';
import SideBar from '../SideBar/SideBarContainer.component';
import SnackbarContainer from '../Snackbar/SnackbarContainer.component';
import { getInstance } from 'd2';
import LoadingMask from '../loading-mask/LoadingMask.component';
import SectionTabs from '../TopBar/SectionTabs.component';
import { Observable } from 'rxjs';
import { goToRoute } from '../router-utils';
import appState, { setAppState } from './appStateStore';
import { Provider } from 'react-redux';
import store from '../store';
import { HeaderBar } from "@dhis2/ui";
import DialogRouter from '../Dialog/DialogRouter';

import 'typeface-roboto';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

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

// From https://github.com/dhis2/d2-ui/blob/v29.0.35/src/app/AppWithD2.component.js
class AppWithD2 extends Component {
    state = {};

    componentDidMount() {
        if (!this.props.d2) {
            log.error('D2 is a required prop to <AppWithD2 />');
        } else {
            this.props.d2
                .then(d2 => this.setState({ d2 }))
                .catch(error => log.error(error));
        }
    }

    getChildContext = () => {
        return {
            d2: this.state.d2,
        };
    };

    render() {
        const getChildren = () => {
            if (!this.props.children) { return null; }
            return React.Children.map(this.props.children, child => React.cloneElement(child));
        };

        return (
            <div>
                {getChildren()}
            </div>
        );
    }
}

AppWithD2.propTypes = {
    children: PropTypes.element,
    d2: PropTypes.shape({
        then: PropTypes.func.isRequired,
    }),
};

AppWithD2.childContextTypes = {
    d2: PropTypes.object,
};

class App extends AppWithD2 {
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
            .map(state => (
                // Check if the current section is in the list of mainSections
                state.mainSections.some(mainSection => mainSection.key === state.sideBar.currentSection)
            ));

        this.subscription = Observable
            .merge(allSectionSelected$, nonAllSectionSelected$)
            // Do not emit the value more often than needed to prevent unnecessary react triggers
            .distinctUntilChanged()
            .subscribe(hasSection => this.setState({
                ...this.state,
                hasSection,
            }));
    }

    componentWillUnmount() {
        if (super.componentWillUnmount) { super.componentWillUnmount(); }

        if (this.subscription && this.subscription.unsubscribe) {
            this.subscription.unsubscribe();
        }
    }

    render() {
        if (!this.state.d2) {
            return (<LoadingMask />);
        }

        return (
            <Provider store={store}>
                <div>
                    <SectionTabsWrap disabled={!!this.props.children.props.route.disableTabs} />
                    {this.state.hasSection && !this.props.children.props.route.hideSidebar ? (
                        <TwoPanel>
                            <SideBar
                                activeGroupName={this.props.params.groupName}
                                activeModelType={this.props.params.modelType}
                            />
                            <MainContent>{this.props.children}</MainContent>
                        </TwoPanel>
                    ) : (
                        <SinglePanel>
                            <MainContent>{this.props.children}</MainContent>
                        </SinglePanel>
                    )}
                    <SnackbarContainer />
                </div>
            </Provider>
        );
    }
}
App.defaultProps = {
    d2: getInstance(),
};

export default App;
