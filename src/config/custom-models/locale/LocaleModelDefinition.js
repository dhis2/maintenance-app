import ModelDefinition from 'd2/lib/model/ModelDefinition';
import ModelCollection from 'd2/lib/model/ModelCollection';
import { generateUid } from 'd2/lib/uid';

export default class LocaleModelDefinition extends ModelDefinition {
    list() {
        // Read the query string manually from the filters instance because we don't want to transform 
        // it to query parameters for API calls. We will do client side filtering instead. 
        const nameFilter = this.filters.filters.find(({ propertyName }) => propertyName === 'displayName');
        const queryString = nameFilter && nameFilter.filterValue;
        // Only fetch the locales
        const promise = this.allLocales ? Promise.resolve(this.allLocales) : this.api.get('/locales/ui');

        return promise
            .then((locales) => {
                // Cache the locales first time and keep using them
                // TODO: make sure this.allLocales is set to null after an items was created or deleted
                // so this method will refetch.
                if (!this.allLocales) {
                    this.allLocales = locales;
                }

                const filteredLocales = locales.reduce((acc, locale) => {
                    if (!queryString ||
                        (locale.locale.toLowerCase()).indexOf(queryString) > -1 ||
                        (locale.name.toLowerCase()).indexOf(queryString) > -1
                    ) {
                        acc.push(
                            // Artificially add an ID to so the model can be created
                            this.create({ ...locale, id: generateUid() }),
                        );
                    }
                    return acc;
                }, []);
                
                return ModelCollection.create(
                    this,
                    filteredLocales,
                    // Server does not return pager data for locales, but it can be manually created
                    {
                        page: 1,
                        pageCount: 1,
                        total: filteredLocales.length,
                        query: {
                            pageSize: filteredLocales.length,
                        },
                    },
                );
            });
    }

    invalidateCachedLocales() {
        this.allLocales = null;
    }
}
