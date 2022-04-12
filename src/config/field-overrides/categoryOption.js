import Validators from '@dhis2/d2-ui-forms/Validators';
import OrganisationUnitTreeMultiSelect from '../../forms/form-fields/orgunit-tree-multi-select';

const { isStartDateBeforeEndDate } = Validators

export default new Map([
    ['organisationUnits', {
        component: OrganisationUnitTreeMultiSelect,
        fieldOptions: {},
    }],
    [
        'startDate', {
            validators: [{
                validator(value, formState) {
                    return isStartDateBeforeEndDate(value, formState.fields.endDate.value);
                },
                message: 'end_date_cannot_be_before_start_date',
            }],
        },
    ],
    [
        'endDate', {
            validators: [{
                validator(value, formState) {
                    return isStartDateBeforeEndDate(formState.fields.startDate.value, value);
                },
                message: 'end_date_cannot_be_before_start_date',
            }],
        },
    ],
]);
