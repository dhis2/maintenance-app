import React from 'react';
import List from '../List.component';
import appState from '../../App/appStateStore';
import { getInstance } from 'd2/lib/d2';
import { fieldFilteringForQuery } from '../list.store';
import listActions from '../list.actions';
import log from 'loglevel';
import ModelCollection from 'd2/lib/model/ModelCollection';

export default class OrganisationUnitList extends React.Component {
    componentDidMount() {
        this.disposable = appState
            .map(({ selectedOrganisationUnit, userOrganisationUnits }) => ({
                selectedOrganisationUnit,
                userOrganisationUnitIds: userOrganisationUnits
                    .toArray()
                    .map(model => model.id),
            }))
            .filter(state => state.selectedOrganisationUnit)
            .distinctUntilChanged(state => state.selectedOrganisationUnit)
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
                (error) => log.error(error)
            );
    }

    componentWillUnmount() {
        this.disposable && this.disposable.dispose && this.disposable.dispose();
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
