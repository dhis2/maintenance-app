import React from 'react';
import Paper from 'material-ui/lib/paper';
import EditModelForm from './EditModelForm.component';
import { goToRoute } from '../router';

function goToAndScrollUp(url) {
    goToRoute(url);
    global.scrollTo && global.scrollTo(0, 0);
}

function onSaveError(errorMessage, props) {
    if (errorMessage === 'No changes to be saved') {
        goToAndScrollUp(`/list/${props.groupName}/${props.modelType}`);
    }
}

export default function EditModel(props) {
    return (
        <Paper>
            <EditModelForm
                {...props}
                onCancel={() => goToAndScrollUp(`/list/${props.groupName}/${props.modelType}`)}
                onSaveSuccess={() => goToAndScrollUp(`/list/${props.groupName}/${props.modelType}`)}
                onSaveError={(errorMessage) => onSaveError(errorMessage, props)}
            />
        </Paper>
    );
}
