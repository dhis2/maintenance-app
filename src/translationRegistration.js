import { config } from 'd2';
import Validators from '@dhis2/d2-ui-forms/Validators';

const { isRequired, isUrl, isNumber: isNumberValidator, isEmail } = Validators;

[
    'file_resource',
    'username',
    'tracker_associate',
    'integer_zero_or_positive',
    'integer_negative',
    'integer_positive',
    'integer',
    'letter',
    'phone_number',
    'email',
    'boolean',
    'true_only',
    'datetime',
    'text',
    'long_text',
    'letter',
    'percentage',
    'unit_interval',
    'sum',
    'average',
    'average_sum_org_unit',
    'count',
    'stddev',
    'variance',
    'none',
    'default',
    'custom',
    'average_sum_int',
    'average_sum_int_disaggregation',
    'average_int',
    'average_int_disaggregation',
    'average_bool',
    'displayName',
    'code',
    'displayDescription',
    'created',
    'lastUpdated',
    'id',
    'start_date',
    'end_date',
    'back',
    'cancel',
    'name',
    'code',
    'short_name',
    'done',
    'save',
    'saving',
    'object_will_created_public',
    'object_will_created_private',
    isRequired.message,
    isUrl.message,
    isNumberValidator.message,
    isEmail.message,
    'value_not_max',
    'value_not_min',
    'value_not_max',
    'value_not_min',
    'could_not_run_async_validation',
    'value_not_unique',
    'search_available_selected_items',
    'determining_your_root_orgunits',
    'filter_organisation_units_by_name',
    'organisation_units_selected',
    'edit',
    'clone',
    'delete',
    'details',
    'translate',
    'sharing',
    'sectionForm',
    'dataEntryForm',
    'pdfDataSetForm',
    'search_by_name',
    'success',
    'dismiss',
].forEach(key => config.i18n.strings.add(key));
