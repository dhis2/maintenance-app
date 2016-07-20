/**
 * Rules for the form fields.
 * If multiple `when` objects are specified these are evaluated as an OR.
 * The following would result check if either of the statements return true
 * ```
    when: [{
        field: 'valueType',
        operator: 'ONEOF',
        value: [
            'TEXT',
            'LONG_TEXT',
            'LETTER',
            'PHONE_NUMBER',
            'EMAIL',
            'TRACKER_ASSOCIATE',
            'USERNAME',
            'FILE_RESOURCE',
            'COORDINATE',
        ]
        }, {
            field: 'domainType',
            operator: 'EQUALS',
            value: 'TRACKER',
        }],
 * ```
 */
export default new Map([['dataElement',
    [
        {
            field: 'domainType',
            when: {
                operator: 'EQUALS',
                value: 'TRACKER',
            },
            operations: [{
                field: 'categoryCombo',
                type: 'SET_PROP',
                propName: 'disabled',
                thenValue: true,
                elseValue: false,
            }],
        },
        {
            field: 'valueType',
            when: {
                field: 'optionSet',
                operator: 'HAS_VALUE',
            },
            operations: [
                {
                    type: 'SET_PROP',
                    propName: 'disabled',
                    thenValue: true,
                    elseValue: false,
                },
                {
                    type: 'CHANGE_VALUE',
                    setValue: (model, fieldConfig) => {
                        // TODO: This is not an immutable modification. It is more efficient this way however it might
                        // collide and is not very transparent. Especially the fact that the new value needs to be set
                        // on both the model and the fieldConfig is not very clear.
                        // It would probably make sense to run the model modification rules before.
                        fieldConfig.value = model[fieldConfig.name] = model.optionSet.valueType;
                    },
                }
            ],
        },
        {
            field: 'aggregationType',
            when: [{
                field: 'valueType',
                operator: 'ONEOF',
                value: [
                    'TEXT',
                    'LONG_TEXT',
                    'LETTER',
                    'PHONE_NUMBER',
                    'EMAIL',
                    'TRACKER_ASSOCIATE',
                    'USERNAME',
                    'FILE_RESOURCE',
                    'COORDINATE',
                ]
            }, {
                field: 'domainType',
                operator: 'EQUALS',
                value: 'TRACKER',
            }],
            operations: [
                {
                    field: 'aggregationType',
                    type: 'SET_PROP',
                    propName: 'disabled',
                    thenValue: true,
                    elseValue: false,
                },
                {
                    field: 'aggregationType',
                    type: 'CHANGE_VALUE',
                    setValue: (model, fieldConfig) => {
                        fieldConfig.value = model[fieldConfig.name] = 'NONE';
                    },
                }
            ]
        }
    ],
], ['attribute', [
    {
        field: 'valueType',
        when: {
            field: 'optionSet',
            operator: 'HAS_VALUE',
        },
        operations: [
            {
                type: 'SET_PROP',
                propName: 'disabled',
                thenValue: true,
                elseValue: false,
            },
            {
                type: 'CHANGE_VALUE',
                setValue: (model, fieldConfig) => {
                    fieldConfig.value = model[fieldConfig.property] = model.optionSet.valueType;
                },
            }
        ]
    }
]]]);
