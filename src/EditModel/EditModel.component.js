import React from 'react';
import Paper from 'material-ui/lib/paper';
import EditModelForm from './EditModelForm.component';
import { goToRoute } from '../router';

function onSaveError(errorMessage, props) {
    if (errorMessage === 'No changes to be saved') {
        goToRoute(`/list/${props.groupName}/${props.modelType}`);
    }
}

export default function EditModel(props) {
    return (
        <Paper>
            <EditModelForm
                {...props}
                onCancel={() => goToRoute(`/list/${props.groupName}/${props.modelType}`)}
                onSaveSuccess={() => goToRoute(`/list/${props.groupName}/${props.modelType}`)}
                onSaveError={(errorMessage) => onSaveError(errorMessage, props)}
            />
        </Paper>
    );
}
