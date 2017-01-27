import React from 'react';
import sideBarStore, { organisationUnitTreeChanged$ } from './sideBarStore';
import LinearProgress from 'material-ui/LinearProgress/LinearProgress';
import { onSectionChanged, onOrgUnitSearch } from './sideBarActions';
import { setAppState, default as appState } from '../App/appStateStore';
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
            .filter(orgUnits => orgUnits)
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
        if (this.state.currentSubSection === 'organisationUnit' && !/#\/edit\//.test(document.location.hash)) {
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

                const orgUnitSearchHits = appState.getState().sideBar.organisationUnits;
                const roots = Array.isArray(orgUnitSearchHits)
                    ? orgUnitSearchHits
                    : this.state.userOrganisationUnits.toArray().map(ou => Object.assign(ou, { displayName: ou.name }));

                const initiallyExpanded = orgUnitSearchHits && orgUnitSearchHits.length
                    ? []
                    : this.state.userOrganisationUnits.toArray().map(v => v.path).concat(this.state.initiallyExpanded || []);

                return (
                    <div style={styles.wrapperStyle}>
                        <OrganisationUnitTreeWithSingleSelectionAndSearch
                            onUpdateInput={this._searchOrganisationUnits.bind(this)}
                            onAutoCompleteValueSelected={this._onAutoCompleteValueSelected.bind(this)}
                            autoCompleteDataSource={(this.state.autoCompleteOrganisationUnits || []).map(model => model.name)}
                            roots={roots}
                            selected={[this.state.selectedOrganisationUnit && this.state.selectedOrganisationUnit.path]}
                            initiallyExpanded={initiallyExpanded}
                            onClick={this._onChangeSelectedOrgUnit.bind(this)}
                            idsThatShouldBeReloaded={orgUnitSearchHits || this.state.organisationUnitsToReload}
                            noHitsLabel={this.context.d2.i18n.getTranslation('no_matching_organisation_units')}
                        />
                    </div>
                );
            }

            return (
                <LinearProgress />
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
                <LinearProgress />
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
SideBarContainer.contextTypes = { d2: React.PropTypes.object };

export default SideBarContainer;
