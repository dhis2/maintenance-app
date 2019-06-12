import { isStartDateBeforeEndDate } from 'd2-ui/lib/forms/Validators';
import OrgUnitSelectDialogField from '../../forms/form-fields/orgunit-select-dialog-field';
import GeometryField, { validators as GeometryValidators } from '../../forms/form-fields/geometry-field';

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
        'geometry', {
            component: GeometryField,
            validators: GeometryValidators,
        },
    ],
    [
        'openingDate', {
            validators: [{
                validator(value, formState) {
                    return isStartDateBeforeEndDate(value, formState.fields.closedDate.value);
                },
                message: 'closed_date_cannot_be_before_opening_date',
            }],
        },
    ],
    [
        'closedDate', {
            validators: [{
                validator(value, formState) {
                    return isStartDateBeforeEndDate(formState.fields.openingDate.value, value);
                },
                message: 'closed_date_cannot_be_before_opening_date',
            }],
        },
    ],
]);
