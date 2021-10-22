import Api from '../api/Api';
import ModelCollection from './ModelCollection';

/**
 * A ModelCollectionProperty instance is a ModelCollection that is a property of
 * a model instance. ModelCollectionProperties can be operated on independently of
 * the Model that owns them.
 *
 * @memberof module:model
 */
class ModelCollectionProperty extends ModelCollection {
    /**
     * @constructor
     *
     * @param {Model} parentModel The `Model` of the parent of this `ModelCollectionProperty`
     * @param {ModelDefinition} modelDefinition The `ModelDefinition` that this `ModelCollection` property is for
     * @param {String} propName The name of this property on the parent model
     * @param {Model[]|boolean} values Initial values that should be added to the collection property
     * @param {Api} api The class to use for API calls
     *
     * @description
     *
     * Creates a new `ModelCollectionProperty` object. This is a subclass of `ModelCollection`, which adds logic
     * for adding and removing elements to the collection and saving the changes to the API.
     *
     * If the value is `true` or `undefined` is specified instead of an array of data values, this indicates that the
     * collection contains (or may contain) data that has not yet been loaded from the API.
     */
    constructor(parentModel, modelDefinition, propName, values, api) {
        super(modelDefinition, values, undefined);

        // The name of this property on the parent object - necessary for loading values lazily
        this.propName = propName;

        // Dirty bit - true if any models have been added to or removed from the collection
        this.dirty = false;

        // Keep track of added and removed elements
        this.added = new Set();
        this.removed = new Set();

        // Using field transformers, it's possible to query the API for the presence of data without actually fetching
        // the data. For instance this is used to determine if an organization unit has any children without actually
        // loading the children. If yes, it will be displayed as an expandable branch within the tree.
        // For more information, see the documentation about field transformers, specifically the isNotEmpty operator:
        // https://docs.dhis2.org/master/en/developer/html/dhis2_developer_manual_full.html#webapi_field_transformers
        this.hasUnloadedData = (values === true) || (values === undefined);

        this.api = api;

        // Store the parent model of this collection so we can construct the URI for API calls
        this.parentModel = parentModel;
    }

    /**
     * @param {Model} value Model instance to add to the collection.
     * @returns {ModelCollectionProperty} Returns itself for chaining purposes.
     *
     * @description
     * Calls the `add` method on the parent `ModelCollection` class, and then performs checks to keep track of
     * what, if any, changes that have been made to the collection.
     */
    add(value) {
        if (this.valuesContainerMap.has(value.id)) {
            return this;
        }

        super.add(value);

        if (this.removed.has(value.id)) {
            this.removed.delete(value.id);
        } else {
            this.added.add(value.id);
        }

        this.updateDirty();
        return this;
    }

    /**
     * If the collection contains an object with the same id as the `value` parameter, that object is removed
     * from the collection. Checks are then performed to keep track of what, if any, changes that have been
     * made to the collection.
     *
     * @param {Model} value Model instance to remove from the collection.
     * @returns {ModelCollectionProperty} Returns itself for chaining purposes.
     */
    remove(value) {
        ModelCollection.throwIfContainsOtherThanModelObjects([value]);
        ModelCollection.throwIfContainsModelWithoutUid([value]);

        if (this.delete(value.id)) {
            if (this.added.has(value.id)) {
                this.added.delete(value.id);
            } else {
                this.removed.add(value.id);
            }
        }

        this.updateDirty();
        return this;
    }

    /**
     * Checks whether any changes have been made to the collection, and updates the dirty flag accordingly.
     *
     * @returns {boolean} True if the collection has changed, false otherwise.
     */
    updateDirty() {
        this.dirty = this.added.size > 0 || this.removed.size > 0;
        return this.dirty;
    }

    /**
     * Sets dirty=false and resets the added and removed sets used for dirty state tracking.
     */
    resetDirtyState() {
        this.dirty = false;
        this.added = new Set();
        this.removed = new Set();
    }

    /**
     * Checks if the collection property has been modified.
     * @param {boolean} [includeValues=true] If true, also checks if any models in the collection
     * has been edited by checking the dirty flag on each model.
     * @returns {boolean} true if any elements have been added to or removed from the collection
     */
    isDirty(includeValues = true) {
        if (includeValues) {
            return this.dirty || this.toArray()
                .filter(model => model && (model.isDirty() === true)).length > 0;
        }
        return this.dirty;
    }

    /**
     * If any changes have been made to the collection, these changes will be submitted to the API. The returned
     * promise will resolve successfully when the changes have been saved to the API, and will be rejected if
     * either the changes weren't saved or if there were no changes to save.
     *
     * @returns {Promise} A `Promise`
     */
    save() {
        // Calling save when there's nothing to be saved is a no-op (not an error)
        if (!this.isDirty()) {
            return Promise.resolve({});
        }

        const url = [this.parentModel.href, this.modelDefinition.plural].join('/');
        const data = {
            additions: Array.from(this.added).map(id => ({ id })),
            deletions: Array.from(this.removed).map(id => ({ id })),
        };

        return this.api.post(url, data)
            .then(() => {
                this.resetDirtyState();
                return Promise.resolve({});
            })
            .catch(err => Promise.reject('Failed to alter collection:', err));
    }

    load(options, forceReload = false) {
        if (!this.hasUnloadedData && !forceReload) {
            return Promise.resolve(this);
        }

        const url = [this.parentModel.modelDefinition.apiEndpoint, this.parentModel.id].join('/');
        const requestOptions = Object.assign({
            paging: false,
        }, options, { fields: `${this.propName}[${(options && options.fields) || ':all'}]` });

        return this.api.get(url, requestOptions)
            .then(data => data[this.propName])
            .then((values) => {
                if (Array.isArray(values)) {
                    this.valuesContainerMap.clear();
                    values.forEach(value => this.valuesContainerMap.set(value.id, this.modelDefinition.create(value)));
                }
                this.hasUnloadedData = false;
                return Promise.resolve(this);
            });
    }

    /**
     * See `ModelCollectionProperty.constructor`.
     *
     * @param {Model} parentModel
     * @param {ModelDefinition} modelDefinition
     * @param {Model[]} values
     * @returns {ModelCollectionProperty}
     */
    static create(parentModel, modelDefinition, propName, values) {
        return new ModelCollectionProperty(parentModel, modelDefinition, propName, values, Api.getApi());
    }
}


export default ModelCollectionProperty;
