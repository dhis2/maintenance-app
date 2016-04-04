import React from 'react';
import List from '../List.component';
import appState from '../../App/appStateStore';
import { getInstance } from 'd2/lib/d2';
import { fieldFilteringForQuery } from '../list.store';
import listActions from '../list.actions';
import log from 'loglevel';

export default class OrganisationUnitList extends React.Component {
    componentDidMount() {
        this.disposable = appState
            .map((state) => state.selectedOrganisationUnit)
            .filter(selectedOrganisationUnit => selectedOrganisationUnit)
            .distinctUntilChanged()
            .subscribe(
                async (selectedOrganisationUnit) => {
                    const d2 = await getInstance();
                    let organisationUnitList = d2.models.organisationUnit
                        .filter().on('name').notEqual('default');
                    let rootOrgUnits = [];

                    organisationUnitList = await organisationUnitList
                        .filter().on('name').notEqual('default')
                        .filter().on('parent.id').equals(selectedOrganisationUnit.id)
                        .list({ fields: fieldFilteringForQuery });

                    // When a root organisation unit is selected we also add the root organisation units to the list
                    // of available organisation units to pick from
                    // TODO: Checking if there is a path is not very reliable...
                    if (selectedOrganisationUnit.path) {
                        rootOrgUnits = await d2.models.organisationUnit
                            .filter().on('name').notEqual('default')
                            .filter().on('name').notEqual('default')
                            .list({ fields: fieldFilteringForQuery, level: 1 });

                        rootOrgUnits
                            .toArray()
                            .forEach(rootOuModel => {
                                organisationUnitList.add(rootOuModel);
                            });
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
        const {params, ...otherProps} = this.props;

        return (
            <List
                {...otherProps}
                params={Object.assign({ modelType: 'organisationUnit' }, params)}
            />
        );
    }
}
