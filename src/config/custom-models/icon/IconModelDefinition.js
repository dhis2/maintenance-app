import ModelDefinition from 'd2/lib/model/ModelDefinition';
import IconModelCollection from './IconModelCollection.js';
import { uploadIcon } from '../../../forms/form-fields/helpers/IconPickerDialog/uploadIcon.js';

export default class IconModelDefinition extends ModelDefinition {
    iconToModel(iconData) {
        // apparently there's no restriction for icon access, so just hardcode it
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
            icon: iconData.href,
        });
    }
    get(id) {
        // id is actually key here
        return this.api.get(`icons/${id}`).then(icon => this.iconToModel(icon));
    }

    list(listParams = {}) {
        const nameFilter = this.filters.filters.find(
            ({ propertyName }) => propertyName === 'identifiable'
        );
        const search = nameFilter && nameFilter.filterValue;
        const params = {
            fields:
                'key,description,custom,created,lastUpdated,createdBy[id,displayName,name],fileResource,href',
            type: 'custom',
            ...(search && { search }),
            ...(listParams.page && { page: listParams.page }),
        };

        return this.api
            .get('icons', params)
            .then(response => ({
                ...response,
                icons: response.icons.map(icon => this.iconToModel(icon)),
            }))
            .then(response => {
                // icons API doesnt have nextPage and prevPage...
                // we only need these to be defined for it to work
                const pager = {
                    ...response.pager,
                    nextPage:
                        response.pager.page < response.pager.pageCount ||
                        undefined,
                    prevPage: response.pager.page === 1 && undefined,
                };
                const collection = IconModelCollection.create(
                    this,
                    response.icons,
                    pager
                );
                return collection;
            });
    }

    async save(model) {
        // href is not set before after creation
        const isUpdate = model.href;

        const baseSaveObject = {
            description: model.description,
            keywords: model.keywords,
        };

        if (isUpdate) {
            return this.api.update(`icons/${model.key}`, baseSaveObject);
        }

        if (model.file) {
            return uploadIcon(model.file, {
                ...baseSaveObject,
                key: model.key,
            });
        }

        return Promise.reject('Choose a file to upload');
    }

    delete(model) {
        return this.api.delete(`icons/${model.id}`);
    }
}
