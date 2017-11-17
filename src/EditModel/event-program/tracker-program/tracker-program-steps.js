const steps = [
    {
        key: 'details',
        name: 'add_program_details',
        componentName: 'EditProgramDetailsForm',
    },
    {
        key: 'enrollment',
        name: 'enrollment',
        componentName: 'Enrollment'
    },
    {
        key: 'tracked_attributes',
        name: 'assign_attributes',
        componentName: 'AssignAttributes'
    },
    {
        key: 'data_elements',
        name: 'assign_data_elements',
        componentName: 'AssignDataElements',
    },
    {
        key: 'stages',
        name: 'program_stages',
        componentName: 'EditDataEntryForm',
    },
    {
        key: 'assign_organisation_units',
        name: 'assign_organisation_units',
        componentName: 'AssignOrganisationUnits',
    },
    {
        key: 'notifications',
        name: 'create_notifications',
        componentName: 'EventProgramNotifications',
    },
];

export default steps;
