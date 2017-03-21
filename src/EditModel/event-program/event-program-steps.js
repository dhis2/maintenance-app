import React from 'react';
import EditModel from '../EditModel.component';
import mapProps from 'recompose/mapProps';

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
        component: () => (<div>Data element management</div>),
    },
    {
        key: 'data_entry_forms',
        name: 'create_data_entry_form',
        component: () => (<div>Data entry form management</div>),
    },
    {
        key: 'organisation_units',
        name: 'assign_organisation_units',
        component: () => (<div>Orgunits management</div>),
    },
    {
        key: 'notifications',
        name: 'create_notifications',
        component: () => (<div>Notifications management</div>),
    },
];

export default steps;
