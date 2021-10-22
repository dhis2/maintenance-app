import { checkType, hasKeys } from '../lib/check';
import { pickOr } from '../lib/utils';
import ModelBase, { DIRTY_PROPERTY_LIST } from './ModelBase';
import createPropertyDefinitionsForAttributes from './helpers/attibutes';

const pickAttributeValues = pickOr('attributeValues', []);

// TODO: Perhaps we can generate model classes dynamically based on the schemas and inherit from this.
/**
 * @extends ModelBase
 *
 * @description
 * A Model represents an object from the DHIS2 Api. A model is created based of a ModelDefinition. The ModelDefinition
 * has the properties that the model should have.
 *
 * @memberof module:model
 */
class Model {
    /**
     * @constructor
     *
     * @param {ModelDefinition} modelDefinition The model definition that corresponds with the model.
     * This is essential defining what type the model is representing.
     *
     * @description
     * Will create a new model instanced based on the model definition. When creating a new instance the model
     * definition needs to have both the modelValidations and modelProperties.
     *
     * The model properties will depend on the ModelDefinition. A model definition is based on a DHIS2 Schema.
     */
    constructor(modelDefinition) {
        checkType(modelDefinition, 'object', 'modelDefinition');
        checkType(modelDefinition.modelProperties, 'object', 'modelProperties');

        /**
         * @property {ModelDefinition} modelDefinition Stores reference to the modelDefinition that was used when
         * creating the model. This property is not enumerable or writable and will therefore not show up when looping
         * over the object properties.
         */
        Object.defineProperty(this, 'modelDefinition', { value: modelDefinition });

        /**
         * @property {Boolean} dirty Represents the state of the model. When the model is concidered `dirty`
         * there are pending changes.
         * This property is not enumerable or writable and will therefore not show up when looping
         * over the object properties.
         */
        Object.defineProperty(this, 'dirty', { writable: true, value: false });

        /**
         * @private
         * @property {Object} dataValues Values object used to store the actual model values. Normally access to the
         * Model data will be done through accessor properties that are generated from the modelDefinition.
         *
         * @note {warning} This should not be accessed directly.
         */
        Object.defineProperty(this, 'dataValues', { configurable: true, writable: true, value: {} });

        /**
         * Attach the modelDefinition modelProperties (the properties from the schema) onto the Model.
         *
         * For a data element model the modelProperties would be the following
         * https://play.dhis2.org/demo/api/schemas/dataElement.json?fields=properties
         */
        Object.defineProperties(this, modelDefinition.modelProperties);

        const attributes = {};
        const attributeProperties = modelDefinition.attributeProperties;
        if (hasKeys(attributeProperties)) {
            /**
             * @property {Object} attributes The attributes objects contains references to custom attributes defined
             * on the metadata object.
             *
             * @description
             * These properties are generated based of the attributes that are created for the the specific schema.
             * As these properties are not defined on the schemas they're put on a separate attributes object.
             * When there are no attributes defined for the object type, the attributes property will not be attached
             * to the model.
             *
             * @see https://docs.dhis2.org/2.27/en/user/html/dhis2_user_manual_en_full.html#manage_attribute
             */
            Object.defineProperty(this, 'attributes', { value: attributes });

            const getAttributeValues = () => pickAttributeValues(this);
            const setAttributeValues = attributeValues => (this.attributeValues = attributeValues);
            const setDirty = () => (this.dirty = true);
            const attributeDefinitions = createPropertyDefinitionsForAttributes(
                attributeProperties,
                getAttributeValues,
                setAttributeValues,
                setDirty,
            );

            Object.defineProperties(attributes, attributeDefinitions);
        }

        this[DIRTY_PROPERTY_LIST] = new Set([]);
    }

    /**
     * @static
     *
     * @param {ModelDefinition} modelDefinition ModelDefinition from which the model should be created
     * @returns {Model} Returns an instance of the model.
     *
     * @description The static method is a factory method to create Model objects. It calls `new Model()` with the passed `ModelDefinition`.
     *
     * ```js
     * let myModel = Model.create(modelDefinition);
     * ```
     */
    static create(modelDefinition) {
        return new Model(modelDefinition);
    }
}

// Set the prototype of the Model class, this way we're able to extend from an single object
Model.prototype = ModelBase;

export default Model;
