import ModelDefinition from 'd2/lib/model/ModelDefinition';
import ModelCollection from 'd2/lib/model/ModelCollection';
import { generateUid } from 'd2/lib/uid.js';
import IconModelCollection from './IconModelCollection.js';

let cachedLocales = null;
const resetCache = () => {
    cachedLocales = null;
};

export default class IconModelDefinition extends ModelDefinition {
    getLocalesAndAuthorities() {
        // Return cached results if available
        if (cachedLocales) {
            return Promise.resolve(cachedLocales);
        }

        // Otherwise fetch
        return Promise.all([
            this.api.get('locales/dbLocales'),
            this.api.get('me/authorization'),
        ]).then(([locales, authorities]) => {
            const deleteAuthorities = ['F_SYSTEM_SETTING', 'ALL'];
            const addAuthorities = ['F_LOCALE_ADD'];
            const canDelete = authorities.some(auth =>
                deleteAuthorities.includes(auth)
            );
            const canAdd =
                canDelete ||
                authorities.some(auth => addAuthorities.includes(auth));

            const access = {
                read: true,
                update: canAdd,
                externalize: false,
                delete: canDelete,
                write: canAdd,
                manage: false,
            };

            // Cache the response first time and keep using it
            cachedLocales = locales.map(locale => {
                const model = this.create({
                    ...locale,
                    access,
                    displayName: locale.name,
                });
                return model;
            });
            return cachedLocales;
        });
    }

    iconToModel(iconData) {
        const access = {
            read: true,
            update: true,
            externalize: false,
            delete: true,
            write: true,
            manage: true,
        };
        return this.create({
            ...iconData,
            access,
            name: iconData.key,
            displayName: iconData.key,
            id: iconData.key,
            user: iconData.createdBy,
            icon: iconData.href
        });
    }
    get(id) {
        // id is actually key here
        console.log('get', id);

        return this.api.get(`icons/${id}`).then(icon => this.iconToModel(icon));
    }

    list() {
        console.log('icon list!');
        // Read the query string manually from the filters instance because we don't want to transform
        // it to query parameters for API calls. We will do client side filtering instead.
        const nameFilter = this.filters.filters.find(
            ({ propertyName }) => propertyName === 'identifiable'
        );
        const queryString = nameFilter && nameFilter.filterValue;

        const access = {
            read: true,
            update: true,
            externalize: false,
            delete: true,
            write: true,
            manage: true,
        };

        const params = {
            fields:
                'key,description,custom,created,lastUpdated,createdBy[id,displayName,name],fileResource,href',
            type: 'custom',
            search: queryString || '',
        };

        const res = this.api
            .get('icons', params)
            .then(response => ({
                ...response,
                icons: response.icons.map(this.iconToModel.bind(this)),
            }))
            .then(response => {
                console.log({ response });
                const collection = IconModelCollection.create(
                    this,
                    response.icons,
                    response.pager
                );
                return collection;
            });
        return res;
    }

    async save(model) {
        // key can only be edited during creation, so this should indicate whether it's an update or not
        const isUpdate = !model.getDirtyPropertyNames().includes('key')

        const baseSaveObject = {
            description: model.description,
            keywords: model.keywords
        }

        if(isUpdate) {
            return this.api.update(`icons/${model.key}`, baseSaveObject)
        }

        const newObject = {
            ...baseSaveObject,
            key: model.key,
            fileResourceId: model.fileResource.id
        }
        return this.api.post('icons', newObject)

    }

    delete(model) {
        // TODO: change url to locales/dbLocales?....
        return this.api.delete(`locales/dbLocales/${model.id}`).then(() => {
            resetCache();

            return {
                status: 'OK',
            };
        });
    }
}
