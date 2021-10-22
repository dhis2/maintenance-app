import { isValidUid } from '../../uid';
import { hasOwnProperty } from '../../lib/check';
import { pick } from '../../lib/utils';

const hasPropertyOnModelValidation = (property, model) => Boolean(
    pick(`modelDefinition.modelValidations.${property}`)(model),
);

export function hasModelValidationForProperty(model, property) {
    return Boolean(
        hasPropertyOnModelValidation(property, model) &&
        hasOwnProperty(model.modelDefinition.modelValidations, property),
    );
}

const pickHttpStatus = pick('httpStatus');
const pickResponseUid = pick('response.uid');
const getModelValidationForProperty = propertyName => pick(`modelDefinition.modelValidations.${propertyName}`);
const pickType = pick('type');
const pickEmbeddedObject = pick('embeddedObject');
const pickOwner = pick('owner');

export const pickTypeFromModelValidation = (property, model) => pickType(
    getModelValidationForProperty(property)(model),
);
export const pickEmbeddedObjectFromModelValidation = (property, model) => pickEmbeddedObject(
    getModelValidationForProperty(property)(model),
);

export const pickOwnerFromModelValidation = (property, model) => pickOwner(
    getModelValidationForProperty(property)(model),
);

// This function is called with `.call` with the Model as it's `this`
export function updateModelFromResponseStatus(result) {
    const responseUid = pickResponseUid(result);

    // Set the id and href of the newly created object if we got an id in the response
    if (pickHttpStatus(result) === 'Created' && isValidUid(responseUid)) {
        this.dataValues.id = responseUid;
        this.dataValues.href = [this.modelDefinition.apiEndpoint, this.dataValues.id].join('/');
    }

    // Object is saved to the api, so it's now clean
    this.resetDirtyState();

    return result;
}
