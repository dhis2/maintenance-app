import React from 'react';
import OrgUnitTree from 'd2-ui/lib/org-unit-tree/OrgUnitTreeMultipleRoots.component';
import OrgUnitSelectByLevel from 'd2-ui/lib/org-unit-select/OrgUnitSelectByLevel.component';
import OrgUnitSelectByGroup from 'd2-ui/lib/org-unit-select/OrgUnitSelectByGroup.component';
import OrgUnitSelectAll from 'd2-ui/lib/org-unit-select/OrgUnitSelectAll.component';
import TextField from 'material-ui/lib/text-field';
import Action from 'd2-ui/lib/action/Action';
import { Observable } from 'rx';
import { config } from 'd2/lib/d2';

config.i18n.strings.add('determining_your_root_orgunits');
config.i18n.strings.add('filter_organisation_units_by_name');
config.i18n.strings.add('organisation_units_selected');

export default class OrganisationUnitTreeMultiSelect extends React.Component {
    constructor(...args) {
        super(...args);

        this.state = {
            searchValue: '',
            rootOrgUnits: [],
            selectedOrgUnits: [],
        };

        this._searchOrganisationUnits = Action.create('searchOrganisationUnits');

        this._handleClick = this._handleClick.bind(this);
        this._setSelection = this._setSelection.bind(this);
    }

    componentDidMount() {
        const d2 = this.context.d2;

        Promise.all([
            d2.currentUser.getOrganisationUnits(),
            d2.models.organisationUnitLevels.list({
                paging: false,
                fields: 'id,level,displayName',
                order: 'level:asc',
            }),
            d2.models.organisationUnitGroups.list({
                paging: false,
                fields: 'id,displayName',
            }),
        ])
            .then(([
                orgUnits,
                levels,
                groups,
            ]) => {
                const rootOrgUnits = orgUnits
                    .toArray()
                    .filter(ou => (new RegExp(`${this.state.searchValue}`)).test(ou.displayName));

                this.setState({
                    originalRoots: rootOrgUnits,
                    rootOrgUnits,
                    selectedOrgUnits: this.props.value
                        .toArray()
                        .map(ou => ou.id),
                    orgUnitGroups: groups,
                    orgUnitLevels: levels,
                });
            });

        this.disposable = this._searchOrganisationUnits.map(action => action.data)
            .debounce(400)
            .map(searchValue => {
                if (!searchValue.trim()) {
                    return Observable.just(this.state.originalRoots);
                }

                const organisationUnitRequest = this.context.d2.models.organisationUnits
                    .filter().on('displayName').ilike(searchValue)
                    // withinUserHierarchy makes the query only apply to the subtrees of the organisation units that are
                    // assigned to the current user
                    .list({ fields: 'id,displayName,path,children::isNotEmpty', withinUserHierarchy: true })
                    .then(modelCollection => modelCollection.toArray());

                return Observable.fromPromise(organisationUnitRequest);
            })
            .concatAll()
            .subscribe((models) => this.setState({ rootOrgUnits: models }));
    }

    componentWillUnmount() {
        this.disposable && this.disposable.dispose();
    }

    renderRoots() {
        if (this.state.rootOrgUnits.length) {
            return (
                <div style={{ maxHeight: 350, maxWidth: 480, overflow: 'auto' }}>
                    {this.state.rootOrgUnits.map(rootOu => (
                        <OrgUnitTree
                            key={rootOu.id}
                            selected={this.state.selectedOrgUnits}
                            root={rootOu}
                            onClick={this._handleClick}
                            emitModel
                            initiallyExpanded={[rootOu.id]}
                        />
                    ))}
                </div>
            );
        }

        return (
            <div>{this.context.d2.i18n.getTranslation('no_roots_found')}</div>
        );
    }

    render() {
        if (!this.state.rootOrgUnits) {
            return (<div>this.context.d2.i18n.getTranslation('determining_your_root_orgunits')</div>);
        }

        const controlStyles = {
            float: 'right',
            // position: 'absolute',
            // top: 64, right: 24,
            width: 475,
            zIndex: 1,
            background: 'white',
        };

        return (
            <div style={{ position: 'relative', minWidth: 800 }}>
                <TextField
                    onChange={(event) => this._searchOrganisationUnits(event.target.value)}
                    floatingLabelText={this.context.d2.i18n.getTranslation('filter_organisation_units_by_name')}
                    fullWidth
                />
                <div className="organisation-unit-tree__selected">{this.state.selectedOrgUnits.length} {this.context.d2.i18n.getTranslation('organisation_units_selected')}</div>
                {this.state.orgUnitGroups && this.state.orgUnitLevels && (
                    <div style={controlStyles}>
                        <OrgUnitSelectByLevel
                            levels={this.state.orgUnitLevels}
                            selected={this.state.selectedOrgUnits}
                            onUpdateSelection={this._setSelection}
                        />
                        <OrgUnitSelectByGroup
                            groups={this.state.orgUnitGroups}
                            selected={this.state.selectedOrgUnits}
                            onUpdateSelection={this._setSelection}
                        />
                        <div style={{ marginTop: 16 }}>
                            <OrgUnitSelectAll
                                selected={this.state.selectedOrgUnits}
                                onUpdateSelection={this._setSelection}
                            />
                        </div>
                    </div>
                )}
                {this.renderRoots()}
            </div>
        );
    }

    _setSelection(selectedOrgUnits) {
        const d2 = this.context.d2;
        const modelOrgUnits = this.props.model.organisationUnits;
        const assigned = modelOrgUnits.toArray().map(ou => ou.id);

        const additions = selectedOrgUnits
        // Filter out already assigned ids
            .filter(id => assigned.indexOf(id) === -1)
            // Add the rest
            .map(id => d2.models.organisationUnits.create({ id }));

        const deletions = assigned
        // Filter out ids that should be left in
            .filter(id => selectedOrgUnits.indexOf(id) === -1)
            // Add the rest
            .map(id => d2.models.organisationUnits.create({ id }));

        additions.forEach(ou => {
            modelOrgUnits.add(ou);
        });
        deletions.forEach(ou => {
            modelOrgUnits.remove(ou);
        });

        this.setState({ selectedOrgUnits });
    }

    _handleClick(event, orgUnit) {
        if (this.state.selectedOrgUnits.indexOf(orgUnit.id) >= 0) {
            this.setState(state => {
                state.selectedOrgUnits.splice(state.selectedOrgUnits.indexOf(orgUnit.id), 1);

                this.props.model.organisationUnits.remove(orgUnit);

                return {
                    selectedOrgUnits: state.selectedOrgUnits,
                };
            });
        } else {
            this.setState(state => {
                state.selectedOrgUnits.push(orgUnit.id);

                this.props.model.organisationUnits.add(orgUnit);

                return {
                    selectedOrgUnits: state.selectedOrgUnits,
                };
            });
        }
    }
}
OrganisationUnitTreeMultiSelect.contextTypes = {
    d2: React.PropTypes.object.isRequired,
};
OrganisationUnitTreeMultiSelect.propTypes = {
    value: React.PropTypes.object,
}
OrganisationUnitTreeMultiSelect.defaultProps = {
    value: [],
};
