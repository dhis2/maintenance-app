import React from 'react';
import PropTypes from 'prop-types';

import Paper from 'material-ui/Paper/Paper';
import EditModelForm from './EditModelForm.component';
import { goToAndScrollUp } from '../router-utils';

const EditModel = ({ groupName, modelType, modelId }) => {
    const onCancel = () => goToAndScrollUp(`/list/${groupName}/${modelType}`);
    const onSaveSuccess = () => goToAndScrollUp(`/list/${groupName}/${modelType}`);

    const onSaveError = (errorMessage) => {
        if (errorMessage === 'No changes to be saved') {
            goToAndScrollUp(`/list/${groupName}/${modelType}`);
        }
    };
    const onError = errorMessage => onSaveError(errorMessage);

    return (
        <Paper>
            <EditModelForm
                modelId={modelId}
                modelType={modelType}
                onSaveSuccess={onSaveSuccess}
                onSaveError={onError}
                onCancel={onCancel}
            />
        </Paper>
    );
};

EditModel.propTypes = {
    groupName: PropTypes.string.isRequired,
    modelType: PropTypes.string.isRequired,
    modelId: PropTypes.string.isRequired,
};

export default EditModel;
