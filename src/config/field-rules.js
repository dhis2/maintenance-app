import { getInstance } from 'd2/lib/d2';

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
                    // TODO: This function does a mutable modification. It is more efficient this way however it might
                    // collide and is not very transparent. Especially the fact that the new value needs to be set
                    // on both the model and the fieldConfig is not very clear.
                    // It would probably make sense to run the model modification rules before sending the values to
                    // the FormBuilder.
                    setValue: (model, fieldConfig) => {
                        // Do not not change the valueType when there is no optionSet or when there is no valueType
                        // for the optionSet (which can occur during the initial run of the rules)
                        if (model.optionSet && model.optionSet.valueType) {
                            // Update the fieldConfig to contain the correct value
                            fieldConfig.value = model.optionSet.valueType;

                            // Update the model only when the value is not the same as the current
                            if (model[fieldConfig.name] !== model.optionSet.valueType) {
                                model[fieldConfig.name] = model.optionSet.valueType;
                            }
                        }
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
