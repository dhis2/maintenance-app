import React from 'react';
import List from '../List.component';
import appState from '../../App/appStateStore';
import { getInstance } from 'd2/lib/d2';
import listActions, { fieldFilteringForQuery } from '../list.actions';
import log from 'loglevel';
import ModelCollection from 'd2/lib/model/ModelCollection';

export default class OrganisationUnitList extends React.Component {
    componentDidMount() {
        this.subscription = appState
            // Only do this is we're actually about to show organisation units
            .filter(appState => appState.sideBar.currentSubSection === 'organisationUnit')
            .map(({ selectedOrganisationUnit, userOrganisationUnits }) => ({
                selectedOrganisationUnit,
                userOrganisationUnitIds: userOrganisationUnits
                    .toArray()
                    .map(model => model.id),
            }))
            .filter(state => state.selectedOrganisationUnit)
            .distinctUntilChanged(null, state => state.selectedOrganisationUnit)
            .subscribe(
                async ({ selectedOrganisationUnit, userOrganisationUnitIds }) => {
                    const d2 = await getInstance();

                    if (!selectedOrganisationUnit.id) {
                        return listActions.setListSource(ModelCollection.create(d2.models.organisationUnit));
                    }

                    let organisationUnitList = d2.models.organisationUnit
                        .filter().on('name').notEqual('default');

                    organisationUnitList = await organisationUnitList
                        .filter().on('name').notEqual('default')
                        .filter().on('parent.id').equals(selectedOrganisationUnit.id)
                        .list({ fields: fieldFilteringForQuery });

                    // DHIS2-2160 Add the selected node to the list to
                    // avoid having to select the parent node to edit
                    // the selected node...
                    let filteredOrgUnits = organisationUnitList.toArray();
                    filteredOrgUnits.unshift(selectedOrganisationUnit);
                    let prependedOrgUnitList = ModelCollection.create(d2.models.organisationUnit, filteredOrgUnits);

                    listActions.setListSource(prependedOrgUnitList);
                },
                error => log.error(error)
            );
    }

    componentWillUnmount() {
        this.subscription && this.subscription.unsubscribe && this.subscription.unsubscribe();
    }

    render() {
        const { params, ...otherProps } = this.props;

        return (
            <List
                {...otherProps}
                params={Object.assign({ modelType: 'organisationUnit' }, params)}
            />
        );
    }
}
