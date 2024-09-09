import React from 'react';
import MultiSelect from '../../forms/form-fields/multi-select';

export default new Map([
    ['categories', {
        required: true,
        validators: [{ // regular isRequired does not check for empty collection or array
            validator(value, formState) {
                return value && value.size > 0;
            },
           message: 'categories_cannot_be_empty',
        }],
        component: (props) => {
            let queryFilter;

            if (props.model.dataDimensionType) {
                queryFilter = `dataDimensionType:eq:${props.model.dataDimensionType}`;
            }

            return (
                <MultiSelect
                    {...props}
                    queryParamFilter={queryFilter}
                />
            );
        },
    }],
]);
