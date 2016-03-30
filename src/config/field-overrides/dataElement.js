import React from 'react';
import DropDownAsync from '../../forms/form-fields/drop-down-async';
import objectActions from '../../EditModel/objectActions';

export default new Map([
    ['aggregationLevels', {
        referenceType: 'organisationUnitLevel',
        fieldOptions: {},
    }],
    ['categoryCombo', {
        component: DropDownAsync,
    }]
]);
