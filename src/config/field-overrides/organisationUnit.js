import { isStartDateBeforeEndDate } from 'd2-ui/lib/forms/Validators';
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
    [
        'openingDate', {
            validators: [{
                validator(value, formState) {
                    return isStartDateBeforeEndDate(value, formState.fields.closedDate.value);
                },
                message: 'end_date_cannot_be_before_start_date',
            }],
        },
    ],
    [
        'closedDate', {
            validators: [{
                validator(value, formState) {
                    return isStartDateBeforeEndDate(formState.fields.openingDate.value, value);
                },
                message: 'end_date_cannot_be_before_start_date',
            }],
        },
    ],
]);
