import React, { Component } from 'react';
import PropTypes from 'prop-types';
import log from 'loglevel';
import { getInstance } from 'd2/lib/d2';
import ModelCollection from 'd2/lib/model/ModelCollection';

import List from '../List.component';
import appState from '../../App/appStateStore';
import listActions, { fieldFilteringForQuery } from '../list.actions';

export default class OrganisationUnitList extends Component {
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

                    // When a root organisation unit is selected we also add the root organisation unit to the list
                    // of available organisation units to pick from
                    if (userOrganisationUnitIds.indexOf(selectedOrganisationUnit.id) >= 0) {
                        organisationUnitList.add(selectedOrganisationUnit);
                    }

                    listActions.setListSource(organisationUnitList);
                },
                error => log.error(error),
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
                params={{ ...{ modelType: 'organisationUnit' }, ...params }}
            />
        );
    }
}

OrganisationUnitList.propTypes = { params: PropTypes.object.isRequired };
