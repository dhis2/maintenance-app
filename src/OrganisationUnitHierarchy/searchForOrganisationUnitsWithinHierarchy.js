import { getInstance } from 'd2/lib/d2';

export default async function searchForOrganisationUnitsWithinHierarchy(searchValue, limit = 15) {
    const d2 = await getInstance();
    const organisationUnitsThatMatchQuery = await d2.models.organisationUnits
        .list({
            fields: 'id,displayName,path,children::isNotEmpty',
            query: searchValue,
            withinUserHierarchy: true,
            pageSize: limit,
        });

    return organisationUnitsThatMatchQuery.toArray();
}
