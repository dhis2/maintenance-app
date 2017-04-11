import React from 'react';
import AssignOrganisationUnits from './assign-organisation-units/AssignOrganisationUnits';
import EventProgramNotifications from './notifications/EventProgramNotifications';
import AssignDataElements from './assign-data-elements/AssignDataElements';
import { createFormFor } from '../formHelpers';
import { get, compose, first } from 'lodash/fp';
import { connect } from 'react-redux';
import eventProgramStore from './eventProgramStore';
import { editFieldChanged } from './actions';
import { bindActionCreators } from 'redux';
import { flattenRouterProps, wrapInPaper } from '../componentHelpers';
import EditDataEntryForm from './EditDataEntryForm.component';
import EditDataEntryForm from './edit-data-entry-form/EditDataEntryForm.component';
import EditDataEntryForm from './create-data-entry-form/EditDataEntryForm.component';

export const STEP_DETAILS = 'details';
export const STEP_DATA_ELEMENTS = 'data_elements';
export const STEP_DATA_ENTRY_FORMS = 'data_entry_forms';
export const STEP_ASSIGN_ORGANISATION_UNITS = 'assign_organisation_units';
export const STEP_NOTIFICATIONS = 'notifications';

const program$ = eventProgramStore
    .map(get('program'));

const mapDispatchToProps = (dispatch) => bindActionCreators({ editFieldChanged }, dispatch);

const connectExpressionField = compose(
    flattenRouterProps,
    connect(null, mapDispatchToProps)
);

const EditProgramDetailsForm = connectExpressionField(wrapInPaper(createFormFor(program$, 'program')));

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
        component: EditDataEntryForm,
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
