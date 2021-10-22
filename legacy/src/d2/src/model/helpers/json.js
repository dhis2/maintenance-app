import { isFunction, isEmpty, contains } from '../../lib/check';
import { pick } from '../../lib/utils';

/**
 * Map propertyName to modelType
 * The model with propertyName will be treated as a regular array
 * (no collection) if the combination of [propertyName, modelType] exists in the object
 * Empty arrays means it applies to any modelType.
 *
 * @private
 */
const NON_MODEL_COLLECTIONS = {
    aggregationLevels: ['dataElement'],
    grantTypes: ['oAuth2Client'],
    translations: [],
    deliveryChannels: ['programNotificationTemplate', 'dataSetNotificationTemplate'],
    redirectUris: ['oAuth2Client'],
    organisationUnitLevels: ['validationRule'],
    favorites: [],
    userGroupAccesses: [],
    userAccesses: [],
};

const isNonModelCollection = (propertyName, modelType) => {
    const modelTypes = NON_MODEL_COLLECTIONS[propertyName];

    if (!modelTypes) {
        return false;
    }

    return contains(modelType, modelTypes) || isEmpty(modelTypes);
};
function isPlainValue(collection) {
    return function isPlainValueInCollection(property) {
        return collection.indexOf(property) === -1;
    };
}

function isCollectionProperty(collection) {
    return property => !isPlainValue(collection)(property);
}

function isReferenceProperty(collection) {
    return property => collection.indexOf(property) >= 0;
}

// TODO: Misnamed as it does not actually return JSON
export function getJSONForProperties(model, properties, keepFullModels = false) {
    const objectToSave = {};
    const collectionPropertiesNames = model
        .getCollectionChildrenPropertyNames()
        // Even though attributeValues are considered collections, they are handled separately due to their
        // difference in structure.
        .filter(propertyName => propertyName !== 'attributeValues');

    const propertyNames = Object.keys(model.modelDefinition.modelValidations)
        .filter(propertyName => properties.indexOf(propertyName) >= 0)
        .filter(propertyName => (
            model.dataValues[propertyName] !== undefined &&
            model.dataValues[propertyName] !== null),
        );

    // Handle plain values
    propertyNames
        .filter(isPlainValue(collectionPropertiesNames))
        .filter(v => !isReferenceProperty(model.getReferenceProperties())(v))
        .forEach((propertyName) => {
            objectToSave[propertyName] = model.dataValues[propertyName];
        });

    // Handle reference properties
    propertyNames
        .filter(isPlainValue(collectionPropertiesNames))
        .filter(isReferenceProperty(model.getReferenceProperties()))
        .forEach((propertyName) => {
            objectToSave[propertyName] = { id: model.dataValues[propertyName].id };
        });

    // Handle non-embedded collection properties
    propertyNames
        .filter(isCollectionProperty(collectionPropertiesNames))
        .forEach((propertyName) => {
            // TODO: This is not the proper way to do this. We should check if the array contains Models
            // These objects are not marked as embedded objects but they behave like they are
            if (isNonModelCollection(propertyName, model.modelDefinition.name)) {
                objectToSave[propertyName] = Array.from(model.dataValues[propertyName]);
                return;
            }

            const values = Array.isArray(model.dataValues[propertyName]) ?
                model.dataValues[propertyName] : Array.from(model.dataValues[propertyName].values());

            // If the collection is a embedded collection we can save it as is.
            if (model.getEmbeddedObjectCollectionPropertyNames().indexOf(propertyName) !== -1) {
                objectToSave[propertyName] = values;
                return;
            }

            // Transform an object collection to an array of objects with id properties
            objectToSave[propertyName] = values
                .filter(pick('id'))
                // For any other types we return an object with just an id
                .map((childModel) => {
                    if (keepFullModels && isFunction(childModel.clone)) {
                        return childModel.clone();
                    }
                    return ({ id: childModel.id });
                });
        });

    return objectToSave;
}

// TODO: Misnamed as it does not actually return JSON
export function getOwnedPropertyJSON(model) {
    const ownedProperties = model.modelDefinition.getOwnedPropertyNames();

    return getJSONForProperties(model, ownedProperties);
}
