import React from 'react';
import sideBarStore, { organisationUnitTreeChanged$ } from './sideBarStore';
import LinearProgress from 'material-ui/lib/linear-progress';
import { onSectionChanged, onOrgUnitSearch } from './sideBarActions';
import { setAppState } from '../App/appStateStore';
import MaintenanceSideBar from './MaintenanceSidebar.component';
import OrganisationUnitTreeWithSingleSelectionAndSearch from '../OrganisationUnitTree/OrganisationUnitTreeWithSingleSelectionAndSearch.component';

class SideBarContainer extends React.Component {
    componentWillMount() {
        this.disposable = sideBarStore
            .subscribe(sideBarState => {
                this.setState({
                    ...sideBarState,
                    organisationUnitsToReload: this.state && this.state.organisationUnitsToReload ? this.state.organisationUnitsToReload : [],
                });
            });

        this.organisationUnitSaved = organisationUnitTreeChanged$
            .subscribe(organisationUnitToReload => {
                this.setState({ organisationUnitsToReload: [organisationUnitToReload.id] }, () => this.forceUpdate());
            });
    }

    componentWillUnmount() {
        if (this.disposable && this.disposable) {
            this.disposable.dispose();
        }

        if (this.organisationUnitSaved && this.organisationUnitSaved.dispose) {
            this.organisationUnitSaved.dispose();
        }
    }

    getSideBarItems() {
        if (this.state.currentSubSection === 'organisationUnit') {
            if (this.state.userOrganisationUnits && this.state.selectedOrganisationUnit) {
                const styles = {
                    wrapperStyle: {
                        padding: '1.5rem',
                        overflowY: 'auto',
                        overflowX: 'auto',
                        flex: '1',
                        width: '295px',
                    },
                };

                return (
                    <div style={styles.wrapperStyle}>
                        <OrganisationUnitTreeWithSingleSelectionAndSearch
                            onUpdateInput={this._searchOrganisationUnits.bind(this)}
                            onAutoCompleteValueSelected={this._onAutoCompleteValueSelected.bind(this)}
                            autoCompleteDataSource={(this.state.autoCompleteOrganisationUnits || []).map(model => model.displayName)}
                            roots={this.state.userOrganisationUnits.toArray()}
                            selected={[this.state.selectedOrganisationUnit && this.state.selectedOrganisationUnit.id]}
                            initiallyExpanded={this.state.userOrganisationUnits.toArray().map(v => v.id).concat(this.state.initiallyExpanded || [])}
                            onClick={this._onChangeSelectedOrgUnit.bind(this)}
                            idsThatShouldBeReloaded={this.state.organisationUnitsToReload}
                        />
                    </div>
                );
            }

            return (
                <LinearProgress indeterminate />
            );
        }
        return null;
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

    render() {
        if (!this.state || !this.state.sections) {
            return (
                <LinearProgress indeterminate />
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
}

export default SideBarContainer;
