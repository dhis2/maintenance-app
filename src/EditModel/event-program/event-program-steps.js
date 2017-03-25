import React from 'react';
import mapProps from 'recompose/mapProps';
import EditModel from '../EditModel.component';
import AssignOrganisationUnits from './assign-organisation-units/AssignOrganisationUnits';
import EventProgramNotifications from './notifications/EventProgramNotifications';

const EditProgramDetailsForm = mapProps(props => ({
    groupName: props.params.groupName,
    modelType: props.schema,
    modelId: props.params.modelId })
)(EditModel);

const steps = [
    {
        key: 'details',
        name: 'add_program_details',
        component: EditProgramDetailsForm,
    },
    {
        key: 'data_elements',
        name: 'assign_data_elements',
        component: (props) => {
            console.log(props.modelToEdit.name)
            return (<div>Data element management</div>);
        },
    },
    {
        key: 'data_entry_forms',
        name: 'create_data_entry_form',
        component: () => (<div>Data entry form management</div>),
    },
    {
        key: 'organisation_units',
        name: 'assign_organisation_units',
        component: AssignOrganisationUnits,
    },
    {
        key: 'notifications',
        name: 'create_notifications',
        component: EventProgramNotifications,
    },
];

export default steps;
