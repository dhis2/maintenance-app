import organisationUnitGroupSetDefaults from './model-defaults/organisationUnitGroupSet';
import categoryDefaults from './model-defaults/category';
import categoryOptionGroupSetDefaults from './model-defaults/categoryOptionGroupSet';
import dataElementDefaults from './model-defaults/dataElement';
import dataElementGroupSetDefaults from './model-defaults/dataElementGroupSet';
import dataSetDefaults from './model-defaults/dataSet';
import externalMapLayer from './model-defaults/externalMapLayer';
import validationNotificationTemplate from './model-defaults/validationNotificationTemplate';
import validationRuleDefaults from './model-defaults/validationRule';
import programDefaults from './model-defaults/program';
import programNotificationTemplateDefaults from './model-defaults/programNotificationTemplate';

export const defaultValues = new Map([
    ['organisationUnitGroupSet', organisationUnitGroupSetDefaults],
    ['category', categoryDefaults],
    ['categoryOptionGroupSet', categoryOptionGroupSetDefaults],
    ['dataElement', dataElementDefaults],
    ['dataElementGroupSet', dataElementGroupSetDefaults],
    ['dataSet', dataSetDefaults],
    ['externalMapLayer', externalMapLayer],
    ['validationNotificationTemplate', validationNotificationTemplate],
    ['validationRule', validationRuleDefaults],
    ['program', programDefaults],
    ['programNotificationTemplate', programNotificationTemplateDefaults],
]);

export function getDefaultValuesForModelType(modelDefinitionName) {
    if (defaultValues.has(modelDefinitionName)) {
        return defaultValues.get(modelDefinitionName);
    }
    return {};
}

const schemaFields = [
    'apiEndpoint',
    'name',
    'displayName',
    'authorities',
    'singular',
    'plural',
    'shareable',
    'metadata',
    'klass',
    'identifiableObject',
    'translatable',
];

const schemaPropertyFields = [
    'href',
    'writable',
    'collection',
    'collectionName',
    'name',
    'propertyType',
    'persisted',
    'required',
    'min',
    'max',
    'ordered',
    'unique',
    'constants',
    'owner',
    'itemPropertyType',
    'translationKey',
    'embeddedObject',
];

export const fieldsForSchemas = schemaFields.concat(`properties[${schemaPropertyFields.join(',')}]`).join(',');
