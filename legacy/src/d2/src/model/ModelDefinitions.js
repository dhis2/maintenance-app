import { checkType, isType } from '../lib/check';

/**
 * Contains all the `ModelDefinition`s that are available. The definitions are properties on the object.
 * This would be used as a main entry point to do any interaction.
 *
 * After calling the initialise function `d2({baseUrl: 'dhis/api'})` this object is the `models` property
 * that allows you to access
 *
 * @example
 * models.dataElement.getList();
 *
 * @memberof module:model
 */
class ModelDefinitions {
    // TODO: Elaborate this documentation
    /**
     * This will allow you to add your own custom ModelDefinitions.
     *
     * The Definition object should have the following properties
     * `modelName, modelNamePlural, modelOptions, properties, validations`
     *
     * @param {ModelDefinition} modelDefinition Add a model definition to the definitions collection
     *
     * @example
     * models.add({name: 'MyDefinition', plural: 'MyDefinitions', endPointname: '/myDefinition'});
     */
    add(modelDefinition) {
        try {
            checkType(modelDefinition.name, 'string');
        } catch (e) {
            throw new Error('Name should be set on the passed ModelDefinition to add one');
        }

        if (this[modelDefinition.name]) {
            throw new Error(['Model', modelDefinition.name, 'already exists'].join(' '));
        }
        this[modelDefinition.name] = modelDefinition;

        if (isType(modelDefinition.plural, 'string')) {
            this[modelDefinition.plural] = modelDefinition;
        }
    }

    /**
     * Map through the modelDefinitions like you would with a simple `Array.map()`
     *
     * @param {Function} transformer Transformer function that will be run for each `ModelDefinition`
     * @returns {Array} Array with the `ModelDefinition` objects.
     *
     * @example
     * models.mapThroughDefinitions(definition => console.log(definition.name);
     *
     * @note {info} When mapping through the definition list `transformer` is called with the just the definition
     * Unlike other map functions, no index or the full object is being passed.
     *
     * @note {warn} The resulting array contains references to the actual objects. It does not work like immutable array functions.
     *
     */
    mapThroughDefinitions(transformer) {
        checkType(transformer, 'function', 'transformer');

        return Object.keys(this)
            .filter(modelDefinition => this.hasOwnProperty(modelDefinition)
                && !(this[modelDefinition].plural === modelDefinition),
            )
            .map(modelDefinition => transformer(this[modelDefinition]));
    }
}

// Model definitions singleton!
function getModelDefinitions() {
    if (getModelDefinitions.modelDefinitions) {
        return getModelDefinitions.modelDefinitions;
    }
    return (getModelDefinitions.modelDefinitions = new ModelDefinitions());
}

ModelDefinitions.getModelDefinitions = getModelDefinitions;

export default ModelDefinitions;
