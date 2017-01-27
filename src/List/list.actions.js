import Action from 'd2-ui/lib/action/Action';
import listStore from './list.store';
import detailsStore from './details.store';
import { getInstance } from 'd2/lib/d2';
import { Observable } from 'rx';
import Store from 'd2-ui/lib/store/Store';
import appState from '../App/appStateStore';
import { isUndefined } from 'lodash/fp';
import log from 'loglevel';

export const fieldFilteringForQuery = 'displayName,shortName,id,lastUpdated,created,displayDescription,code,publicAccess,access,href,level';
const listActions = Action.createActionsFromNames(['loadList', 'setListSource', 'searchByName', 'getNextPage', 'getPreviousPage', 'hideDetailsBox']);

function getSchemaWithFilters(schema, modelName) {
    const schemasThatShouldHaveDefaultInTheList = new Set([
        'categoryOptionCombo',
    ]);

    if (!schemasThatShouldHaveDefaultInTheList.has(modelName)) {
        return schema.filter().on('name').notEqual('default');
    }
    return schema;
}

function getQueryForSchema(schema, modelName) {
    return {
        fields: fieldFilteringForQuery,
        order: 'displayName:ASC',
    };
}

listActions.setListSource.subscribe((action) => {
    listStore.listSourceSubject.onNext(Observable.just(action.data));
});

listActions.loadList
    .filter(({ data }) => data !== 'organisationUnit')
    .combineLatest(Observable.fromPromise(getInstance()), (action, d2) => ({ ...action, d2 }))
    .flatMap(({ data: modelName, complete, error, d2 }) => {
        // We can not search for non existing models
        if (isUndefined(d2.models[modelName])) {
            error(`${modelName} is not a valid schema name`);
            throw new Error(`${modelName} is not a valid schema name`);
        }

        return Observable.just({
            schema: getSchemaWithFilters(d2.models[modelName], modelName),
            query: getQueryForSchema(d2.models[modelName], modelName),
            complete,
            error,
        });
    })
    .subscribe(async ({ schema, query, complete, error }) => {
        const listResultsCollection = await schema.list(query);

        listActions.setListSource(listResultsCollection);

        complete(`${schema.name} list loading`);
    }, log.error.bind(log));

listActions.searchByName
    .filter(({ data }) => data.modelType === 'organisationUnit')
    .subscribe(async ({ data, complete, error }) => {
        const d2 = await getInstance();
        let organisationUnitModelDefinition = d2.models.organisationUnits;

        // When an organisation unit is present on the appState we constrain the query to the children of the
        // selected organisation unit.
        if (appState.state && appState.state.selectedOrganisationUnit) {
            organisationUnitModelDefinition = organisationUnitModelDefinition
                .filter().on('parent.id').equals(appState.state.selectedOrganisationUnit.id);
        }
        const organisationUnitsThatMatchQuery = await organisationUnitModelDefinition
            .list({
                fields: fieldFilteringForQuery,
                query: data.searchString,
                withinUserHierarchy: true,
            });

        listActions.setListSource(organisationUnitsThatMatchQuery);
        complete();
    }, log.error.bind(log));

const nonDefaultSearchSchemas = new Set(['organisationUnit']);
listActions.searchByName
    .filter(({ data }) => nonDefaultSearchSchemas.has(data.modelType) === false)
    .subscribe(async ({ data, complete, error }) => {
        const d2 = await getInstance();

        if (!d2.models[data.modelType]) {
            error(`${data.modelType} is not a valid schema name`);
        }

        let modelDefinition = d2.models[data.modelType];

        if (data.searchString) {
            modelDefinition = d2.models[data.modelType].filter().on('displayName').ilike(data.searchString);
        }

        const searchResultsCollection = await getSchemaWithFilters(modelDefinition, data.modelType)
            .list({ fields: fieldFilteringForQuery });

        listActions.setListSource(searchResultsCollection);

        complete(`${data.modelType} list with search on 'displayName' for '${data.searchString}' is loading`);
    }, log.error.bind(log));

// TODO: For simple action mapping like this we should be able to do something less boiler plate like
listActions.getNextPage.subscribe(() => {
    listStore.getNextPage();
});

listActions.getPreviousPage.subscribe(() => {
    listStore.getPreviousPage();
});

listActions.hideDetailsBox.subscribe(() => {
    detailsStore.setState(null);
});

export default listActions;
