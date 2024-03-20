import { isValidUid, isArray, checkType } from 'd2/lib/lib/check';
import { throwError } from 'd2/lib/lib/utils';
import Model from 'd2/lib/model/Model';
import ModelDefinition from 'd2/lib/model/ModelDefinition';
import Pager from 'd2/lib/pager/Pager';

function throwIfContainsOtherThanModelObjects(values) {
    if (values && values[Symbol.iterator]) {
        const toCheck = [...values];
        toCheck.forEach((value) => {
            if (!(value instanceof Model)) {
                throwError('Values of a ModelCollection must be instances of Model');
            }
        });
    }
}

/* This is needed because ModelCollection throws if ID is not valid - icons do not have ids (we use icon.key)
 We also cannot extend ModelCollection, because the throw is called in the constructor, and we would need to call super()
    So it's the exact same class, just that the constructor doesn't check for valid Uuid*/ 

/**
 * Collection of `Model` objects that can be interacted upon. Can contain a pager object to easily navigate
 * pages within the system.
 *
 * @memberof module:model
 */
class IconModelCollection {
    /**
     * @constructor
     *
     * @param {ModelDefinition} modelDefinition The `ModelDefinition` that this collection is for. This defines the type of models that
     * are allowed to be added to the collection.
     * @param {Model[]} values Initial values that should be added to the collection.
     * @param {Object} pagerData Object with pager data. This object contains data that will be put into the `Pager` instance.
     *
     * @description
     *
     * Creates a new `ModelCollection` object based on the passed `modelDefinition`. Additionally values can be added by passing
     * `Model` objects in the `values` parameter. The collection also exposes a pager object which can be used to navigate through
     * the pages in the collection. For more information see the `Pager` class.
     */
    constructor(modelDefinition, values, pagerData) {
        checkType(modelDefinition, ModelDefinition);
        /**
         * @property {ModelDefinition} modelDefinition The `ModelDefinition` that this collection is for. This defines the type of models that
         * are allowed to be added to the collection.
         */
        this.modelDefinition = modelDefinition;

        /**
         * @property {Pager} pager Pager object that is created from the pagerData that was passed when the collection was constructed. If no pager data was present
         * the pager will have default values.
         */
        this.pager = new Pager(pagerData, modelDefinition);

        // We can not extend the Map object right away in v8 contexts.
        this.valuesContainerMap = new Map();
        this[Symbol.iterator] = this.valuesContainerMap[Symbol.iterator].bind(this.valuesContainerMap);

        throwIfContainsOtherThanModelObjects(values);
        // THIS IS THE ONLY CHANGE
        // throwIfContainsModelWithoutUid(values);

        // Add the values separately as not all Iterators return the same values
        if (isArray(values)) {
            values.forEach(value => this.valuesContainerMap.set(value.id, value));
        }
    }

    /**
     * @property {Number} size The number of Model objects that are in the collection.
     *
     * @description
     * Contains the number of Model objects that are in this collection. If the collection is a collection with a pager. This
     * does not take into account all the items in the database. Therefore when a pager is present on the collection
     * the size will return the items on that page. To get the total number of items consult the pager.
     */
    get size() {
        return this.valuesContainerMap.size;
    }

    /**
     * Adds a Model instance to the collection. The model is checked if it is a correct instance of `Model` and if it has
     * a valid id. A valid id is a uid string of 11 alphanumeric characters.
     *
     * @param {Model} value Model instance to add to the collection.
     * @returns {ModelCollection} Returns itself for chaining purposes.
     *
     * @throws {Error} When the passed value is not an instance of `Model`
     * @throws {Error} Throws error when the passed value does not have a valid id.
     */
    add(value) {
        throwIfContainsOtherThanModelObjects([value]);
        //throwIfContainsModelWithoutUid([value]);

        this.set(value.id, value);
        return this;
    }

    /**
     * If working with the Map type object is inconvenient this method can be used to return the values
     * of the collection as an Array object.
     *
     * @returns {Array} Returns the values of the collection as an array.
     */
    toArray() {
        const resultArray = [];

        this.forEach((model) => {
            resultArray.push(model);
        });

        return resultArray;
    }

    static create(modelDefinition, values, pagerData) {
        return new IconModelCollection(modelDefinition, values, pagerData);
    }

    static throwIfContainsOtherThanModelObjects(value) {
        return throwIfContainsOtherThanModelObjects(value);
    }


    /**
     * Clear the collection and remove all it's values.
     *
     * @returns {this} Returns itself for chaining purposes;
     */
    // TODO: Reset the pager?
    clear() {
        return this.valuesContainerMap.clear.call(this.valuesContainerMap);
    }

    delete(...args) {
        return this.valuesContainerMap.delete.call(this.valuesContainerMap, ...args);
    }

    entries() {
        return this.valuesContainerMap.entries.call(this.valuesContainerMap);
    }

    // FIXME: This calls the forEach function with the values Map and not with the ModelCollection as the third argument
    forEach(...args) {
        return this.valuesContainerMap.forEach.call(this.valuesContainerMap, ...args);
    }

    get(...args) {
        return this.valuesContainerMap.get.call(this.valuesContainerMap, ...args);
    }

    has(...args) {
        return this.valuesContainerMap.has.call(this.valuesContainerMap, ...args);
    }

    keys() {
        return this.valuesContainerMap.keys.call(this.valuesContainerMap);
    }

    set(...args) {
        return this.valuesContainerMap.set.call(this.valuesContainerMap, ...args);
    }

    values() {
        return this.valuesContainerMap.values.call(this.valuesContainerMap);
    }
}

export default IconModelCollection;
