import DropDownAsync from '../../forms/form-fields/drop-down-async';

export default new Map([
    ['aggregationLevels', {
        referenceType: 'organisationUnitLevel',
        fieldOptions: {},
    }],
    ['categoryCombo', {
        component: DropDownAsync,
    }],
]);
