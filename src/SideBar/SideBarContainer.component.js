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
                                roots={this.state.userOrganisationUnits.toArray().map(v => { console.log(v.displayName); return v; })}
                                selected={[this.state.selectedOrganisationUnit && this.state.selectedOrganisationUnit.id]}
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
