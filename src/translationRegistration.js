import {config} from 'd2/lib/d2';

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
].forEach(key => config.i18n.strings.add(key));
