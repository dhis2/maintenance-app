import OrgUnitSelectDialogField from '../../forms/form-fields/orgunit-select-dialog-field';
import CoordinateField from '../../forms/form-fields/coordinate-field';

export default new Map([
    [
        'parent',
        {
            component: OrgUnitSelectDialogField,
            fieldOptions: {
                labelText: 'parent_organisation_unit',
            },
        },
    ],
    [
        'coordinates', {
            component: CoordinateField,
            fieldOptions: {},
        },
    ],
]);
