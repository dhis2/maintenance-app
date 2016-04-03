import React from 'react';
import EditModel from './EditModel.component';

export default function EditModelContainer(props) {
    return (
        <EditModel groupName={props.params.groupName} modelType={props.params.modelType} modelId={props.params.modelId} />
    );
}
