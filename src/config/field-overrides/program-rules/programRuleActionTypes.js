const actionTypeFieldMapping = {
    'DISPLAYTEXT': {
        label: 'display_text',
        required: ['location', 'content'],
        optional: ['data'],
    },
    'DISPLAYKEYVALUEPAIR': {
        label: 'display_key_value_pair',
        required: ['location', 'content'],
        optional: ['data'],
    },
    'HIDEFIELD': {
        label: 'hide_field',
        optional: ['dataElement', 'trackedEntityAttribute', 'content'],
    },
    'HIDESECTION': {
        label: 'hide_section',
        required: ['programStageSection'],
    },
    'HIDEPROGRAMSTAGE': {
        label: 'hide_program_stage',
        required: ['programStage'],
    },
    'ASSIGN': {
        label: 'assign_value',
        required: ['data'],
        optional: ['dataElement', 'trackedEntityAttribute', 'content'],
    },
    'SHOWWARNING': {
        label: 'show_warning',
        required: ['content'],
        optional: ['dataElement', 'trackedEntityAttribute', 'data'],
    },
    'SHOWERROR': {
        label: 'show_error',
        required: ['content'],
        optional: ['dataElement', 'trackedEntityAttribute', 'data'],
    },
    'WARNINGONCOMPLETE': {
        label: 'warning_on_complete',
        required: ['content'],
        optional: ['dataElement', 'data'],
    },
    'ERRORONCOMPLETE': {
        label: 'error_on_complete',
        required: ['content'],
        optional: ['dataElement', 'data'],
    },
    'CREATEEVENT': {
        label: 'create_event',
        required: ['programStage'],
        optional: ['data'],
    },
    'SETMANDATORYFIELD': {
        label: 'set_field_to_be_mandatory',
        optional: ['dataElement', 'trackedEntityAttribute'],
    },
};

export default actionTypeFieldMapping;
