import React from 'react';
import sideBarStore from './sideBarStore';
import LinearProgress from 'material-ui/lib/linear-progress';
import {onSectionChanged, onOrgUnitSearch} from './sideBarActions';
import BackButton from '../EditModel/BackButton.component'; // TODO: Move backbutton out to it's own folder if it's used in multiple places
import OrganisationUnitTree from 'd2-ui/lib/org-unit-tree';
import { setAppState } from '../App/appStateStore';
import MaintenanceSideBar from './MaintenanceSidebar.component';
import AutoComplete from 'material-ui/lib/auto-complete';

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
            bottom: '0',
            top: '7rem',
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
                    flex: '1',
                    width: '256px',
                };

                const innerWrapperStyle = {};

                return (
                    <div style={wrapperStyle}>
                        <div style={innerWrapperStyle}>
                            <AutoComplete
                                hintText="Search"
                                onUpdateInput={this._searchOrganisationUnits}
                                onNewRequest={this._onAutoCompleteValueSelected.bind(this)}
                                dataSource={(this.state.autoCompleteOrganisationUnits || []).map(model => model.displayName)}
                                filter={AutoComplete.noFilter}
                            />
                            <OrganisationUnitTree
                                roots={this.state.userOrganisationUnits.toArray()}
                                selected={[this.state.selectedOrganisationUnit && this.state.selectedOrganisationUnit.id]}
                                initiallyExpanded={this.state.userOrganisationUnits.toArray().map(v => v.id).concat(this.state.initiallyExpanded || [])}
                                labelStyle={{
                                        whiteSpace: 'nowrap',
                                    }}
                                onClick={this._onChangeSelectedOrgUnit.bind(this)}
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

    _searchOrganisationUnits(searchValue) {
        onOrgUnitSearch(searchValue)
            .subscribe(() => {}, (e) => console.error(e));
    }

    _onChangeSelectedOrgUnit(event, model) {
        setAppState({
            selectedOrganisationUnit: model,
        });

        this.setState({
            initiallyExpanded: model.path ? model.path.split('/').filter(v => v).slice(0, -1) : [],
        });
    }

    _onAutoCompleteValueSelected(displayName) {
        const ouToSelect = (this.state.autoCompleteOrganisationUnits || [])
            .find(model => model.displayName === displayName);

        if (ouToSelect) {
            this._onChangeSelectedOrgUnit(null, ouToSelect);
        }
    }

    _onChangeSection(newSection) {
        onSectionChanged({
            section: this.state.currentSection,
            subSection: newSection,
        });
    }
}

export default SideBarContainer;
