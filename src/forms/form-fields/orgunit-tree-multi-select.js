import React from 'react';
import OrgunitTree from 'd2-ui/lib/org-unit-tree';
import TextField from 'material-ui/lib/text-field';
import Action from 'd2-ui/lib/action/Action';
import {Observable} from 'rx';

export default class OrganisationUnitTreeMultiSelect extends React.Component {
    constructor(...args) {
        super(...args);

        this.state = {
            searchValue: '',
            rootOrgUnits: [],
            selectedOrgUnits: [],
        };

        this._searchOrganisationUnits = Action.create('searchOrganisationUnits');
    }

    componentDidMount() {
        this.context.d2.currentUser.getOrganisationUnits()
            .then(ou => ou.toArray())
            .then(rootOrgUnits => {
                rootOrgUnits
                    .filter(ou => (new RegExp(`${this.state.searchValue}`)).test(ou.displayName));

                this.setState({
                    originalRoots: rootOrgUnits,
                    rootOrgUnits,
                    selectedOrgUnits: this.props.value
                        .toArray()
                        .map(ou => ou.id),
                });
            });

        const dataFromAction = this._searchOrganisationUnits.map(action => action.data)

        dataFromAction
            .filter(searchValue => !searchValue.trim())
            .subscribe(() => this.setState({ rootOrgUnits: this.state.originalRoots }));

        dataFromAction
            .filter(searchValue => searchValue.trim())
            .debounce(400)
            .map(searchValue => {
                const organisationUnitRequest = this.context.d2.models.organisationUnits
                    .filter().on('displayName').ilike(searchValue)
                    .list({fields: 'id,displayName,path,children::isNotEmpty'})
                    .then(modelCollection => modelCollection.toArray());

                return Observable.fromPromise(organisationUnitRequest);
            })
            .concatAll()
            .subscribe((models) => this.setState({ rootOrgUnits: models }));
    }

    renderRoots() {
        if (this.state.rootOrgUnits.length) {
            return this.state.rootOrgUnits.map(rootOu => {
                return (
                    <OrgunitTree
                        key={rootOu.id}
                        selected={this.state.selectedOrgUnits}
                        root={rootOu}
                        onClick={this._handleClick.bind(this)}
                        emitModel={true}
                        initiallyExpanded={[rootOu.id]}
                    />
                );
            });
        }

        return (
            <div>{this.context.d2.i18n.getTranslation('no_roots_found')}</div>
        );
    }

    render() {
        if (!this.state.rootOrgUnits) {
            return  (<div>this.context.d2.i18n.getTranslation('determining_your_root_orgunits')</div>);
        }

        return (
            <div>
                <TextField onChange={(event) => this._searchOrganisationUnits(event.target.value)} floatingLabelText={this.context.d2.i18n.getTranslation('filter_organisation_units_by_name')} />
                <div className="organisation-unit-tree__selected">{this.state.selectedOrgUnits.length} {this.context.d2.i18n.getTranslation('organisation_units_selected')}</div>
                {this.renderRoots()}
            </div>
        );
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
    d2: React.PropTypes.object,
};
OrganisationUnitTreeMultiSelect.defaultProps = {
    value: [],
};
