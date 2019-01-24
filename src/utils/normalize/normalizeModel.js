import { normalize, schema } from 'normalizr';
import { get } from 'lodash/fp';

export const getModelValidationProperty = propertyName =>
    get(`modelValidations.${propertyName}`);

export const getTypeFromModelDefinition = (property, modelDefinition) =>
    get('type')(getModelValidationProperty(property)(modelDefinition));

// Mapping of a models propertyName to its entity-name
const propertyNameToEntityName = {
    relatedProgram: 'programs',
};

// The normalzr schema-definition of the modelDefinition
const modeDefinitionEntities = new Map();

// The completed schemas, used for caching
const modelDefinitionSchemas = new Map();

const defaultOpts = {
    includeCollection: true,
    includeReference: false,
};
export function createNormalizrSchema(
    modelDefinition,
    opts = defaultOpts,
    normalzrOpts = {},
    definitionOverride = {}
) {
    // eslint-disable-next-line no-param-reassign
    opts = { ...defaultOpts, ...opts };
    let nestedProperties = {};

    for (let propertyName of Object.keys(modelDefinition.modelValidations)) {
        const propertyType = getTypeFromModelDefinition(
            propertyName,
            modelDefinition
        );
        const entityName =
            propertyNameToEntityName[propertyName] || propertyName;
        let nestedSchemaEntity = modeDefinitionEntities.get(entityName);
        if (!nestedSchemaEntity) {
            nestedSchemaEntity = new schema.Entity(entityName);
            modeDefinitionEntities.set(entityName, nestedSchemaEntity);
        }

        if (opts.includeCollection && propertyType === 'COLLECTION') {
            nestedProperties[propertyName] = new schema.Array(
                nestedSchemaEntity
            );
        }

        if (opts.includeReference && propertyType === 'REFERENCE') {
            nestedProperties[propertyName] = nestedSchemaEntity;
        }
    }

    const definition = {...nestedProperties, ...definitionOverride };

    const normalzrSchema = new schema.Entity(
        modelDefinition.plural,
        definition,
        normalzrOpts
    );
    modelDefinitionSchemas.set(modelDefinition.plural, normalzrSchema);
    return normalzrSchema;
}

export function normalizeModel(model, opts) {
    const modelDefinition = model.modelDefinition;
    const schema = createNormalizrSchema(modelDefinition);
    return normalize(model, schema);
}

export function normalizeWithModelDefinition(obj, modelDefinition, opts) {
    const schema =
        modelDefinitionSchemas.get(modelDefinition.plural) ||
        createNormalizrSchema(modelDefinition);
    return normalize(obj, schema);
}
