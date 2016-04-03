import React from 'react';
import Sidebar from 'd2-ui/lib/sidebar/Sidebar.component';
import SideBarButtons from './SideBarButtons.component';
import sideBarStore from './sideBarStore';
import LinearProgress from 'material-ui/lib/linear-progress';
import {onSectionChanged, onBackToSections} from './sideBarActions';
import BackButton from '../EditModel/BackButton.component'; // TODO: Move backbutton out to it's own folder if it's used in multiple places
import OrganisationUnitTree from 'd2-ui/lib/org-unit-tree';
import { setAppState } from '../App/appStateStore';

function noop() {}

function MaintenanceSideBar(props) {
    const sideBarWrapperStyle = {
            //display: 'flex',
            //flexDirection: 'column',
            //flexFlow: 'column',
            //flex: 1,
        };

    return (
        <div style={sideBarWrapperStyle}>
            <SideBarButtons />
            <Sidebar
                sections={props.sections}
                onChangeSection={props.onChangeSection || noop}
                currentSection={props.currentSection}
                styles={Object.assign({leftBar: {overflowY: 'initial'}}, props.style)}
            />
            {props.children}
        </div>
    );
}
MaintenanceSideBar.propTypes = {
    style: React.PropTypes.object,
    sections: React.PropTypes.arrayOf(React.PropTypes.object),
    onChangeSection: React.PropTypes.func,
    currentSection: React.PropTypes.string,
};
MaintenanceSideBar.defaultProps = {
    style: {},
    sections: [],
};

class SideBarOrganisationUnitTree extends React.Component {
    componentWillMount() {
        sideBarStore
            .subscribe(sideBarState => {
                this.setState(sideBarState);
            });
    }

    render() {
        return (
            <LinearProgress indeterminate={true} />
        );
    }
}

class SideBarContainer extends React.Component {
    componentWillMount() {
        sideBarStore
            .subscribe(sideBarState => {
                this.setState(sideBarState);
            });
    }

    render() {
        if (!this.state || !this.state.sections) {
            return (
                <LinearProgress indeterminate={true} />
            );
        }

        const sideBarWrapperStyle = {
            display: 'flex',
            flexDirection: 'column',
            flexFlow: 'column',
            flex: 1,
        };

        return (
            <div style={sideBarWrapperStyle}>
                <div style={{paddingLeft: '.75rem'}}>
                    {this.state.currentSection ? <BackButton onClick={this._onBackToSections} /> : null}
                </div>
                <MaintenanceSideBar
                    sections={this.state.sections}
                    currentSection={this.state.activeItem || '-- not set --'}
                    onChangeSection={this._onChangeSection.bind(this)}
                />
                {this.getSideBarItems()}
            </div>
        );
    }

    getSideBarItems() {
        if (this.state.currentSubSection === 'organisationUnit') {
            if (this.state.userOrganisationUnits && this.state.selectedOrganisationUnit) {
                const wrapperStyle = {
                    padding: '1.5rem',
                    overflowY: 'auto',
                    overflowX: 'auto',
                    marginBottom: '2rem',
                    flex: '1',
                    width: '256px',
                };

                const innerWrapperStyle = {};

                return (
                    <div style={wrapperStyle}>
                        <div style={innerWrapperStyle}>
                            <OrganisationUnitTree
                                roots={this.state.userOrganisationUnits.toArray()}
                                selected={[this.state.selectedOrganisationUnit.id]}
                                initiallyExpanded={this.state.userOrganisationUnits.toArray().map(v => v.id)}
                                labelStyle={{
                                        whiteSpace: 'nowrap',
                                    }}
                                onClick={this._onChangeSelectedOrgUnit}
                            />
                        </div>
                    </div>
                );
            } else {
                return (
                    <LinearProgress indeterminate={true} />
                );
            }
        }
    }

    _onChangeSelectedOrgUnit(event, model) {
        setAppState({
            selectedOrganisationUnit: model,
        });
    }

    _onChangeSection(newSection) {
        onSectionChanged({
            section: this.state.currentSection,
            subSection: newSection,
        });
    }

    _onBackToSections() {
        onBackToSections();
    }
}

export default SideBarContainer;

//import React from 'react';
//import { hashHistory } from 'react-router';
//import sideBarItemsStore from './sideBarItems.store';
//import { config } from 'd2/lib/d2';
//import Translate from 'd2-ui/lib/i18n/Translate.mixin';
//import camelCaseToUnderscores from 'd2-utilizr/lib/camelCaseToUnderscores';
//import Sidebar from 'd2-ui/lib/sidebar/Sidebar.component';
//import SideBarButtons from './SideBarButtons.component';
//import {goToRoute} from '../router';
//import BackButton from '../EditModel/BackButton.component'; // TODO: Move backbutton out to it's own folder if it's used in multiple places
//import OrganisationUnitTree from 'd2-ui/lib/org-unit-tree';
//import LinearProgress from 'material-ui/lib/linear-progress';
//import listActions from '../List/list.actions';
//import {setAppState} from '../App/appStateStore';
//
//config.i18n.strings.add('maintenance');
//config.i18n.strings.add('filter_menu_items_by_name');
//config.i18n.strings.add('press_enter_to_go_to_first');
//config.i18n.strings.add('search');
//
//const SideBarContainer = React.createClass({
//    contextTypes: {
//        router: React.PropTypes.object,
//    },
//
//    mixins: [Translate],
//
//    getInitialState() {
//        return {
//            sideBarItems: [],
//            searchString: '',
//            currentUser: {
//                orgUnitRoots: [],
//            },
//        };
//    },
//
//    componentWillMount() {
//        this.disposable = sideBarItemsStore
//            .subscribe((sideBarState) => {
//                console.log(sideBarState)
//            });
//
//        this.context.d2.currentUser.getOrganisationUnits()
//            .then(orgUnits => this.setState({
//                currentUser: {
//                    orgUnitRoots: orgUnits.toArray(),
//                },
//                selectedOrgUnit: orgUnits
//                    .toArray()
//                    .reduce((selectedOU, orgUnit) => {
//                        if (!selectedOU.path || (selectedOU.path.length > orgUnit.path.length)) {
//                            return orgUnit;
//                        }
//                        return selectedOU;
//                    }, {}),
//            }));
//    },
//
//    componentWillUnmount() {
//        if (this.disposable && this.disposable.dispose) {
//            this.disposable.dispose();
//        }
//    },
//
//    onChangeSection(listItem) {
//        // If the clickedItem is a main section, display it's children
//        if (sideBarItemsStore.isMainSection(listItem)) {
//            goToRoute(`/list/${listItem}`);
//        } else {
//            goToRoute(`/list/${this.props.activeGroupName}/${listItem}`);
//
//            if (listItem === 'organisationUnit') {
//                listActions.loadChildernForOrganisationUnit({})
//                    .subscribe(
//                        (message) => {
//                            log.debug(message);
//                        },
//                        (message) => {
//                            log.error(message);
//                            goToRoute('/');
//                        }
//                    );
//            }
//        }
//
//    },
//
//    filterChildren(searchString, child) {
//        // Both values are transformed to lowercase so we can do case insensitive search
//        return child.toLowerCase().indexOf(searchString.toLowerCase()) >= 0;
//    },
//
//    renderSidebarHeader() {
//        if (sideBarItemsStore.isMainSection(this.props.activeGroupName)) {
//            const tooltipText = this.getTranslation(`go_back_to_meta_data_section_list`);
//
//            return (
//                <BackButton onClick={this._backToSection} tooltip={tooltipText} />
//            );
//        }
//    },
//
//    renderExtaSideBarFields() {
//        // Render an OU tree under the available options
//        if (this.props.activeGroupName && this.props.activeModelType && this.props.activeModelType === 'organisationUnit') {
//            if (this.state.currentUser && this.state.currentUser.orgUnitRoots) {
//                const wrapperStyle = {
//                    padding: '1.5rem',
//                    overflowY: 'auto',
//                    overflowX: 'auto',
//                    marginBottom: '2rem',
//                    flex: '1',
//                    width: '256px',
//                };
//
//                const innerWrapperStyle = {
//                };
//
//                return (
//                    <div style={wrapperStyle}>
//                        <div style={innerWrapperStyle}>
//                            <OrganisationUnitTree
//                                roots={this.state.currentUser.orgUnitRoots}
//                                selected={this.state.selectedOrgUnit ? [this.state.selectedOrgUnit.id] : []}
//                                initiallyExpanded={this.state.currentUser.orgUnitRoots.map(v => v.id)}
//                                labelStyle={{
//                                    whiteSpace: 'nowrap',
//                                }}
//                                onClick={this._onChangeSelectedOrgUnit}
//                            />
//                        </div>
//                    </div>
//                );
//            }
//            return <LinearProgress indeterminate={true} />
//        }
//    },
//
//    render() {
//        console.log(this.props.activeGroupName, sideBarItemsStore.getSideBarItems(this.props.activeGroupName));
//        let items = sideBarItemsStore.getSideBarItems(this.props.activeGroupName)
//            .map(listItem => ({
//                label: this.getTranslation(camelCaseToUnderscores(listItem)),
//                key: listItem,
//            }))
//            .filter(listItem => listItem.label.toLowerCase().indexOf(this.state.searchString.toLowerCase()) >= 0);
//
//        const activeItem = this.state.sideBarItems
//            .reduce((acc, item) => {
//                // Stick to the first found
//                if (acc !== '') {
//                    return acc;
//                }
//
//                // Check if the route is an active list route
//                if (this.context.router.isActive(`/list/${item}`)) {
//                    return item;
//                }
//
//                return '';
//            }, '');
//
//        const sideBarWrapperStyle = {
//            display: 'flex',
//            flexDirection: 'column',
//            flexFlow: 'column',
//            flex: 1,
//        };
//
//        // TODO: SidebarButtons are not passed to the sidebar component anymore, perhaps we should add the availability
//        // of the BackButton to the sidebar. This should probably be a higher order component that supports either/or
//        // extra buttons and multiple sections
//        return (
//            <div style={sideBarWrapperStyle}>
//                <SideBarButtons />
//                {this.renderSidebarHeader(activeItem)}
//                <Sidebar
//                    sections={items}
//                    onChangeSection={this.onChangeSection}
//                    currentSection={activeItem || '--not-set--'}
//                    styles={{leftBar: {overflowY: 'initial'}}}
//                />
//                {this.renderExtaSideBarFields()}
//            </div>
//        );
//    },
//
//    _backToSection() {
//        goToRoute(`/`);
//    },
//
//    _onChangeSelectedOrgUnit(event, selectedOuModel) {
//        this.setState({
//            selectedOrgUnit: selectedOuModel,
//        });
//        setAppState({
//
//        });
//    }
//});
//
//export default SideBarContainer;
