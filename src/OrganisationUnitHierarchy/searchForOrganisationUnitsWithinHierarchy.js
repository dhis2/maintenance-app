import { getInstance } from 'd2/lib/d2';
import appState from '../App/appStateStore';

export default async function searchForOrganisationUnitsWithinHierarchy(searchValue, limit = 15) {
    const d2 = await getInstance();

    if (!searchValue.trim().length) {
        return appState.getState().userOrganisationUnits.toArray().map(ou => d2.models.organisationUnits.create({
            id: ou.id,
            path: ou.path,
            displayName: ou.displayName,
            access: ou.access,
        }));
    }

    const organisationUnitsThatMatchQuery = await d2.models.organisationUnits
        .list({
            fields: 'id,parent[id,displayName,path,children,access],displayName,path,children::isNotEmpty,access',
            query: searchValue,
            withinUserHierarchy: true,
            pageSize: limit,
        });

    return organisationUnitsThatMatchQuery.toArray();
}
