import ModelDefinition from 'd2/lib/model/ModelDefinition';
import ModelCollection from 'd2/lib/model/ModelCollection';

let cachedLocales = null;
const resetCache = () => {
    cachedLocales = null;
};

export default class LocaleModelDefinition extends ModelDefinition {
    getLocalesAndAuthorities() {
        // Return cached results if available
        if (cachedLocales) {
            return Promise.resolve(cachedLocales);
        }

        // Otherwise fetch
        return Promise.all([
            // TODO: This is a new API endpoint. Make sure to introduce new .war file first
            this.api.get('/locales/dbLocales'),
            this.api.get('me/authorization'),
        ]).then(([locales, authorities]) => {
            const canCreateAndDelete = authorities.some(auth => ['F_SYSTEM_SETTING', 'ALL'].includes(auth));
            const access = {
                read: true,
                update: canCreateAndDelete,
                externalize: false,
                delete: canCreateAndDelete,
                write: canCreateAndDelete,
                manage: false,
            };

            // Cache the response first time and keep using it
            cachedLocales = locales.map((locale) => {
                const model = this.create({
                    // TODO: Check if id is indeed a property of locale, because it is required for a new Model instance
                    ...locale,
                    access,
                    displayName: locale.name,
                });
                model.customSaveMethod = this.save;
                return model;
            });
            return cachedLocales;
        });
    }

    get(id) {
        const promise = cachedLocales ?
            Promise.resolve(cachedLocales) :
            this.getLocalesAndAuthorities();

        return promise.then(locales => locales.find(locale => locale.id === id));
    }

    list() {
        // Read the query string manually from the filters instance because we don't want to transform 
        // it to query parameters for API calls. We will do client side filtering instead. 
        const nameFilter = this.filters.filters.find(({ propertyName }) => propertyName === 'displayName');
        const queryString = nameFilter && nameFilter.filterValue;

        return this.getLocalesAndAuthorities()
            .then((locales) => {
                const filteredLocales = locales.filter(locale =>
                    !queryString ||
                    (locale.locale.toLowerCase()).indexOf(queryString) > -1 ||
                    (locale.name.toLowerCase()).indexOf(queryString) > -1,
                );

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

    save(model) {
        const { name: language, locale: country } = model;
        const locale = `${language.id}_${country.id}`;
        const name = `${language.text} (${country.text})`;
        // TODO: Fix API call when DHIS2-3801 is done
        // Final code should look a little bit like this
        // return this.api.post('/locales/dbLocales', { locale: model.locale, name: model.name })
        //     .then(() => {
        //         resetCache();

        //         return {
        //             status: 'OK',
        //         };
        //     });

        // FAKE - This will only add on the client
        return this.getLocalesAndAuthorities().then((locales) => {
            const newLocale = this.create({
                name,
                locale,
                id: 'E4sMBVqTjMu',
                access: {
                    read: true,
                    update: true,
                    externalize: false,
                    delete: true,
                    write: true,
                    manage: false,
                },
                displayName: model.name,
            });
            cachedLocales = [newLocale, ...locales];
            return {
                status: 'OK',
            };
        });
    }

    delete(model) {
        console.log(model);
        // TODO: Fix API call when DHIS2-3801 is done
        // Final code should look a little bit like this
        // return this.api.delete(`/locales/dbLocales/${model.id}`).then(() => {
        //     resetCache();

        //     return {
        //         status: 'OK',
        //     };
        // });

        // FAKE - This will only delte on the client
        return Promise.resolve('I did not delete anything').then(() => {
            cachedLocales = cachedLocales.filter(({ id }) => id !== model.id);
            return {
                status: 'OK',
            };
        });
    }
}
