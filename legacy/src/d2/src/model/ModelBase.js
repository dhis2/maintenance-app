import ModelValidation from './ModelValidation';
import { getJSONForProperties } from './helpers/json';
import {
    hasModelValidationForProperty,
    pickTypeFromModelValidation,
    pickEmbeddedObjectFromModelValidation,
    pickOwnerFromModelValidation,
    updateModelFromResponseStatus,
} from './helpers/models';

const modelValidator = ModelValidation.getModelValidation();

export const DIRTY_PROPERTY_LIST = Symbol('List to keep track of dirty properties');

/**
 * Base class that supplies functionality to the Model classes
 *
 * @memberof module:model
 */
class ModelBase {
    constructor() {
        this.modelDefinition = {
            modelValidations: {},
        };
    }
    /**
     * @returns {Promise} Returns a promise that resolves when the model has been saved or rejected with the result from
     * the `validate()` call.
     *
     * @definition
     * Will save model as a new object to the server using a POST request. This method would generally be used if
     * you're creating models with pre-specified IDs. Note that this does not check if the model is marked as dirty.
     */
    create() {
        return this.validate()
            .then((validationState) => {
                if (!validationState.status) {
                    return Promise.reject(validationState);
                }

                return this.modelDefinition
                    .saveNew(this)
                    .then(apiResponse => updateModelFromResponseStatus.call(this, apiResponse));
            });
    }

    /**
     * @returns {Promise} Returns a promise that resolves when the model has been saved
     * or rejects with the result from the `validate()` call.
     *
     * @description
     * Checks if the model is dirty. When the model is dirty it will check if the values of the model are valid by calling
     * `validate`. If this is correct it will attempt to save the [Model](#/model/Model) to the api.
     *
     * ```js
     * myModel.save()
     *   .then((message) => console.log(message));
     * ```
     */
    save(includeChildren) {
        // Calling save when there's nothing to be saved is a no-op
        if (!this.isDirty(includeChildren)) {
            return Promise.resolve({});
        }

        return this.validate()
            .then((validationState) => {
                if (!validationState.status) {
                    return Promise.reject(validationState);
                }

                return this.modelDefinition
                    .save(this)
                    .then(apiResponse => updateModelFromResponseStatus.call(this, apiResponse));
            });
    }

    /**
     * @returns {Promise} Promise that resolves with an object with a status property that represents if the model
     * is valid or not the fields array will return the names of the fields that are invalid.
     *
     * @description
     * This will run the validations on the properties which have validations set. Normally these validations are defined
     * through the DHIS2 schema. It will check min/max for strings/numbers etc. Additionally it will
     * run model validations against the schema.
     *
     * ```js
     * myModel.validate()
     *  .then(myModelStatus => {
     *    if (myModelStatus.status === false) {
     *      myModelStatus.fields.forEach((fieldName) => console.log(fieldName));
     *    }
     * });
     * ```
     *
     * @deprecated The api now validates the object on save, so doing the additional request to validate the object
     * is not very useful anymore as the validation on POST/PUT is more extensive than the /api/schemas validation.
     */
    validate() {
        return new Promise((resolve, reject) => {
            let validationMessages = [];

            function unique(current, property) {
                if (property && current.indexOf(property) === -1) {
                    current.push(property);
                }
                return current;
            }

            function asyncRemoteValidation(model) {
                return modelValidator.validateAgainstSchema(model);
            }

            // Run async validation against the api
            asyncRemoteValidation(this)
                .catch((remoteMessages) => {
                    // Errors are ok in this case
                    if (Array.isArray(remoteMessages)) {
                        return remoteMessages;
                    }
                    return Promise.reject(remoteMessages);
                })
                .then((remoteMessages) => {
                    validationMessages = validationMessages.concat(remoteMessages);

                    const validationState = {
                        status: remoteMessages.length === 0,
                        fields: validationMessages
                            .map(validationMessage => validationMessage.property)
                            .reduce(unique, []),
                        messages: validationMessages,
                    };
                    resolve(validationState);
                })
                .catch(message => reject(message));
        });
    }

    // TODO: Cloning large graphs is very slow
    clone() {
        const modelClone = this.modelDefinition.create(
            getJSONForProperties(
                this,
                Object.keys(this.modelDefinition.modelValidations),
                true,
            ),
        );

        if (this.isDirty()) {
            modelClone.dirty = this.isDirty(true);
        }

        return modelClone;
    }

    /**
     * Deletes the object from the server.
     *
     * This will fire a DELETE request to have the object be removed from the system.
     *
     * @returns {Promise} Resolves when the object was successfully deleted.
     */
    delete() {
        return this.modelDefinition.delete(this);
    }

    /**
     * Check if the model is in a dirty state and is a candidate to be saved.
     *
     * It will check for direct properties that have been changed and if any of the children have been changed.
     *
     * @param {boolean} includeChildren If set to false only the models direct properties will be checked.
     * @returns {boolean} Returns true when the model is in a dirty state.
     */
    isDirty(includeChildren = true) {
        return this.dirty || (includeChildren === true && this.hasDirtyChildren());
    }

    /**
     * Utility method to reset the dirty state of the object.
     *
     * This is called after a successful save operation was done.
     *
     * @returns {ModelBase} Returns itself for potential chaining
     */
    resetDirtyState() {
        this.dirty = false;

        // Also set it's children to be clean
        this.getDirtyChildren()
            .forEach((value) => {
                if (value.resetDirtyState) {
                    value.resetDirtyState();
                } else {
                    value.dirty = false; // eslint-disable-line no-param-reassign
                }
            });

        this[DIRTY_PROPERTY_LIST].clear();

        return this;
    }

    /**
     * Returns a list of properties that have been changed.
     *
     * @returns {Array<string>} The names of the properties that were changed.
     */
    getDirtyPropertyNames() {
        return Array.from(this[DIRTY_PROPERTY_LIST].values());
    }

    /**
     * This will return the properties that are marked as `owner: true` in the schema definition for the model.
     *
     * @returns {Array<any>} Returns an array of properties that are owned by the object
     */
    // TODO: This name is very misleading and should probably be renamed to something like `getOwnerProperties` (would be a breaking change)
    getCollectionChildren() {
        return Object.keys(this)
            .filter(propertyName =>
                this[propertyName] &&
                hasModelValidationForProperty(this, propertyName) &&
                pickOwnerFromModelValidation(propertyName, this),
            )
            .map(propertyName => this[propertyName]);
    }

    /**
     * Gets the names of the properties that are collections on the object.
     *
     * These are usually the properties that contain ModelCollectionProperties.
     *
     * @returns {Array<string>} A list of property names that are marked as type `COLLECTION` in the schema.
     */
    getCollectionChildrenPropertyNames() {
        return Object
            .keys(this)
            .filter(propertyName => pickTypeFromModelValidation(propertyName, this) === 'COLLECTION');
    }

    /**
     * Gets the names of the properties that are references on the object.
     *
     * These are usually the properties that contain a Model of a different type. (e.g DataElement -> CategoryCombo)
     *
     * @returns {Array<string>} A list of property names that are marked as type `REFERENCE` in the schema.
     */
    getReferenceProperties() {
        return Object
            .keys(this)
            .filter(propertyName =>
                pickTypeFromModelValidation(propertyName, this) === 'REFERENCE' &&
                pickEmbeddedObjectFromModelValidation(propertyName, this) === false,
            );
    }

    /**
     * Gets the names of the properties that are embedded objects.
     *
     * These the properties that are not represented by a different Model, but are just plain objects that are
     * embedded within the current object.
     *
     * @returns {Array<string>} A list of property names of embedded objects.
     */
    getEmbeddedObjectCollectionPropertyNames() {
        return this.getCollectionChildrenPropertyNames()
            .filter(propertyName => pickEmbeddedObjectFromModelValidation(propertyName, this));
    }

    /**
     * Returns a list of child properties that are marked as dirty. This uses the `getCollectionChildren()` method
     * to retrieve the children properties and then checks if they are marked as dirty.
     *
     * The method does not check if direct properties are dirty as those are tracked on the Model itself.
     *
     * @returns {Array<any>}
     */
    getDirtyChildren() {
        return this.getCollectionChildren()
            .filter(property => property && (property.dirty === true));
    }

    /**
     * Check if any of the Model's child collections are dirty.
     *
     * @returns {boolean} True when one of the children is dirty.
     */
    hasDirtyChildren() {
        return this.getDirtyChildren().length > 0;
    }

    /**
     * This method is generally intended to, by default, usefully serialize Model objects during JSON serialization.
     *
     * This method will take all the properties that are defined on the schema and create an object with the keys and
     * values for those properties. This will remove any circular dependencies that could have occurred otherwise.
     *
     * @returns {Object}
     */
    toJSON() {
        return getJSONForProperties(this, Object.keys(this.modelDefinition.modelValidations));
    }
}

export default new ModelBase();
