import React from 'react';
import AssignOrganisationUnits from './assign-organisation-units/AssignOrganisationUnits';
import EventProgramNotifications from './notifications/EventProgramNotifications';
import EditProgramDetailsForm from './program-details/EditProgramDetailsForm';
import AssignDataElements from './assign-data-elements/AssignDataElements';

export const STEP_DETAILS = 'details';
export const STEP_DATA_ELEMENTS = 'data_elements';
export const STEP_DATA_ENTRY_FORMS = 'data_entry_forms';
export const STEP_ASSIGN_ORGANISATION_UNITS = 'assign_organisation_units';
export const STEP_NOTIFICATIONS = 'notifications';

const steps = [
    {
        key: STEP_DETAILS,
        name: 'add_program_details',
        component: EditProgramDetailsForm,
    },
    {
        key: STEP_DATA_ELEMENTS,
        name: 'assign_data_elements',
        component: AssignDataElements,
    },
    {
        key: STEP_DATA_ENTRY_FORMS,
        name: 'create_data_entry_form',
        component: () => (<div>Data entry form management</div>),
    },
    {
        key: STEP_ASSIGN_ORGANISATION_UNITS,
        name: 'assign_organisation_units',
        component: AssignOrganisationUnits,
    },
    {
        key: STEP_NOTIFICATIONS,
        name: 'create_notifications',
        component: EventProgramNotifications,
    },
];

export default steps;
