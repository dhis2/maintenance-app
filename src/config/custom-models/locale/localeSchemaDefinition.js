const localeSchemaDefinition = {
    klass: 'org.hisp.dhis.locales.ui',
    shareable: false,
    translatable: false,
    metadata: false,
    identifiableObject: false,
    apiEndpoint: 'http://localhost:8080/dhis/api/29/locales/ui',
    plural: 'locales',
    displayName: 'UI Locale',
    name: 'locales',
    singular: 'locale',
    authorities: [
        {
            type: 'CREATE_PUBLIC',
            authorities: [
                'F_SYSTEM_SETTING'
            ]
        },
        {
            type: 'CREATE_PRIVATE',
            authorities: [
                'F_SYSTEM_SETTING'
            ]
        },
        {
            type: 'DELETE',
            authorities: [
                'F_SYSTEM_SETTING'
            ]
        }
    ],
    properties: [
        {
            owner: false,
            ordered: false,
            max: 5,
            collection: false,
            required: true,
            writable: true,
            min: 2,
            embeddedObject: false,
            propertyType: 'TEXT',
            unique: true,
            name: 'locale',
            persisted: true
        },
        {
            owner: false,
            ordered: false,
            max: 500,
            collection: false,
            required: true,
            writable: true,
            min: 2,
            embeddedObject: false,
            propertyType: 'TEXT',
            unique: true,
            name: 'name',
            persisted: true
        },
    ]
}

export default localeSchemaDefinition;