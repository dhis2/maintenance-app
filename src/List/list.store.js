import { getInstance as getD2 } from 'd2/lib/d2';
import { Subject, Observable } from 'rx';
import Store from 'd2-ui/lib/store/Store';
import appState from '../App/appStateStore';

export const fieldFilteringForQuery = 'displayName|rename(name),shortName,id,lastUpdated,created,displayDescription,code,publicAccess,access,href,level';

const columnObservable = appState
    .filter(appState => appState.sideBar && appState.sideBar.currentSubSection)
    .map(appState => appState.sideBar.currentSubSection)
    .distinctUntilChanged()
    .map(subSection => {
        if (subSection === 'organisationUnitLevel') {
            return ['name', 'level', 'lastUpdated'];
        }

        return ['name', 'publicAccess', 'lastUpdated'];
    });


export default Store.create({
    listSourceSubject: new Subject(),

    initialise() {
        this.listSourceSubject
            .concatAll()
            .combineLatest(columnObservable)
            .subscribe(([modelCollection, columns]) => {
                this.setState({
                    tableColumns: columns,
                    pager: modelCollection.pager,
                    list: modelCollection.toArray(),
                });
            });
        return this;
    },

    getListFor(modelName, complete, error) {
        getD2().then(d2 => {
            if (d2.models[modelName]) {
                const listPromise = d2.models[modelName]
                    .filter().on('name').notEqual('default')
                    .list({
                        fields: fieldFilteringForQuery,
                        order: (modelName === 'organisationUnitLevel') ? 'level:ASC' : 'displayName:ASC'
                    });

                this.listSourceSubject.onNext(Observable.fromPromise(listPromise));

                complete(`${modelName} list loading`);
            } else {
                error(`${modelName} is not a valid schema name`);
            }
        });
    },

    getNextPage() {
        this.listSourceSubject.onNext(Observable.fromPromise(this.state.pager.getNextPage()));
    },

    getPreviousPage() {
        this.listSourceSubject.onNext(Observable.fromPromise(this.state.pager.getPreviousPage()));
    },

    async searchByName(modelType, searchString, complete, error) {
        // TODO: Move this out to different observables in list.actions
        if (modelType === 'organisationUnit') {
            const d2 = await getD2();
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
                    query: searchString,
                    withinUserHierarchy: true,
                });

            this.listSourceSubject.onNext(Observable.just(organisationUnitsThatMatchQuery));
            complete();
        } else {
            getD2().then(d2 => {
                if (!d2.models[modelType]) {
                    error(`${modelType} is not a valid schema name`);
                }

                let modelDefinition = d2.models[modelType];

                if (searchString) {
                    modelDefinition = d2.models[modelType].filter().on('displayName').ilike(searchString);
                }

                const listSearchPromise = modelDefinition
                    .filter().on('name').notEqual('default')
                    .list({ fields: fieldFilteringForQuery });

                this.listSourceSubject.onNext(Observable.fromPromise(listSearchPromise));

                complete(`${modelType} list with search on 'displayName' for '${searchString}' is loading`);
            });
        }
    },
}).initialise();
