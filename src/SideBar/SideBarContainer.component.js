import React from 'react';
import sideBarStore from './sideBarStore';
import LinearProgress from 'material-ui/lib/linear-progress';
import {onSectionChanged, onBackToSections} from './sideBarActions';
import BackButton from '../EditModel/BackButton.component'; // TODO: Move backbutton out to it's own folder if it's used in multiple places
import OrganisationUnitTree from 'd2-ui/lib/org-unit-tree';
import { setAppState } from '../App/appStateStore';
import MaintenanceSideBar from './MaintenanceSidebar.component';

class SideBarContainer extends React.Component {
    componentWillMount() {
        this.disposable = sideBarStore
            .subscribe(sideBarState => {
                this.setState(sideBarState);
            });
    }

    componentWillUnmount() {
        this.disposable && this.disposable.dispose();
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
            position: 'fixed',
        };

        return (
            <div style={sideBarWrapperStyle}>
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
}

export default SideBarContainer;
