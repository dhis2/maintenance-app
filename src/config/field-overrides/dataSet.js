import React from 'react';
import DropDown from '../../forms/form-fields/drop-down';
import OrganisationUnitTreeMultiSelect from '../../forms/form-fields/orgunit-tree-multi-select';
import DataSetElementField from './data-set/DataSetElementField.component';
import DataInputPeriods from './data-set/DataInputPeriods.component';
import periodTypeStore from '../../App/periodTypeStore';

export default new Map([
    ['categoryCombo', {
        referenceType: 'categoryCombo',
        fieldOptions: {
            queryParamFilter: ['dataDimensionType:eq:ATTRIBUTE', 'name:eq:default'],
        },
    }],
    ['periodType', {
        component: DropDown,
        fieldOptions: {
            options: periodTypeStore.getState(),
        },
    }],
    ['organisationUnits', {
        component: OrganisationUnitTreeMultiSelect,
        fieldOptions: {},
    }],
    ['dataSetElements', {
        component: DataSetElementField,
    }],
    ['dataInputPeriods', {
        component: DataInputPeriods,
    }],
]);
