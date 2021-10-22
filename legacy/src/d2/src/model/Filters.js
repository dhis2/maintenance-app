import { isType, checkValidRootJunction } from '../lib/check';
import { identity } from '../lib/utils';
import Filter from '../model/Filter';

/**
 * @description
 * Collection class that contains filters that are to be applied when loading Model objects from the api.
 *
 * @memberof module:model
 */
class Filters {
    /**
     * Creates a new Filters instance.
     *
     * The Filters instance keeps a list of all the applied filters for a modelDefinition.
     *
     * @param {ModelDefinition} modelDefinition The ModelDefinition for which this Filters object should create filters.
     * @param {Filter[]} filters A list of Filter objects
     */
    constructor(modelDefinition, filters = []) {
        /**
         * @type {Array<Filter>}
         * @private
         */
        this.filters = filters;
        this.modelDefinition = modelDefinition;
        this.rootJunction = null;
    }

    /**
     * Shortcut for triggering the creation of a Filter. This is the function that is triggered when creating new
     * filters on a ModelDefinition. The Filter will receive a callback that can be used to add the finalized filter
     * to the list of filters.
     *
     * @param {string} propertyName The property that the filter should apply to. (e.g. `name`)
     * @returns {Filter} The created filter object for `propertyName`.
     */
    on(propertyName) {
        const addFilter = this.add.bind(this);

        return Filter.getFilter(addFilter).on(propertyName);
    }

    /**
     * Utility method to add a filter to the list of filters.
     *
     * @private
     * @param {Filter} filter The Filter to be added to the list of current filters.
     * @returns {ModelDefinition} The modelDefiniton that the filter applies to. This is used to support calling `.list()`
     * on the modelDefinition after the filter was created.
     * @throws {TypeError} Thrown when the given filter is not a Filter object.
     */
    add(filter) {
        if (!isType(filter, Filter)) {
            throw new TypeError('filter should be an instance of Filter');
        }
        this.filters.push(filter);

        return this.modelDefinition;
    }

    /**
     * @deprecated
     * @returns {Promise} Proxy the list() call on the filters object.
     */
    list() {
        return this.modelDefinition.list();
    }

    /**
     * Get an array of DHIS2 metadata filter values to send to the API.
     *
     * This will return ['id:eq:UYXOT4A7JMI', 'name:like:ANC'] for filters created as follows
     * dataElement
     *  .filter().on('id').equals(UYXOT4A7JMI)
     *  .filter().on('name').like('ANC')
     *
     * @returns {Array<string>} A list of query param values to be used with the filter key.
     */
    getQueryFilterValues() {
        return this.filters.map(filter => filter.getQueryParamFormat());
    }

    /**
     * @deprecated Deprecated since 2.28, use getQueryFilterValues instead.
     * @returns {Array.<string>}
     */
    getFilters() {
        return this.getQueryFilterValues();
    }

    /**
     * Get a list of Filter objects that are in applied in this Filters instance
     *
     * @returns {Array<Filter>} The list of Filter objects.
     */
    getFilterList() {
        return this.filters.map(identity);
    }

    /**
     * The logic mode to use on the filters.
     *
     * Default behavior is AND.
     * Note that the logic will be used across all the filters, which
     * means with OR, results will be returned when any of the filter match.
     * It MUST be called last on the chain of filters when called 
     * through modelDefinition.filter().
     * @see {@link https://docs.dhis2.org/master/en/developer/html/webapi_metadata_object_filter.html|Object filter Docs }
     * @example
     * d2.programs.filter().on('name').like('Child')
     * .filter().logicMode('OR').on('code').equals('Child')
     * @param {string} junction The logic operator to use. One of ['OR', 'AND'];
     */
    logicMode(junction) {
        checkValidRootJunction(junction);
        this.rootJunction = junction;
        return this;
    }

    /**
     * Factory method to create a Filters object.
     *
     * @param {ModelDefinition} modelDefinition The modelDefinition that the filters should apply to.
     * @param {Filter[]} priorFilters List of previously applied filters that the new filter list should start with.
     * @returns {Filters} A Filters object for the given modelDefinition.
     */
    static getFilters(modelDefinition, priorFilters = []) {
        return new Filters(modelDefinition, priorFilters);
    }
}

export default Filters;
