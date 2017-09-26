import { next, previous, first } from '../steps/stepIterator';

const stepDefinitions = [
    {
        key: 'details',
        name: 'add_program_details',
        componentName: 'EditProgramDetailsForm',
    },
    {
        key: 'data_elements',
        name: 'assign_data_elements',
        componentName: 'AssignDataElements',
    },
    {
        key: 'data_entry_forms',
        name: 'create_data_entry_form',
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

const steps = {
    list: stepDefinitions,
    next: activeStepKey => next(stepDefinitions, activeStepKey),
    previous: activeStepKey => previous(stepDefinitions, activeStepKey),
    first: () => first(stepDefinitions),
};

export default steps;
