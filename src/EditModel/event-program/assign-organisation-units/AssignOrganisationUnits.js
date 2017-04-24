import React from 'react';
import Paper from 'material-ui/Paper/Paper';
import OrganisationUnitTreeMultiSelect from '../../../forms/form-fields/orgunit-tree-multi-select';

const styles = {
    paper: {
        padding: '3rem',
    },
};

export default function AssignOrganisationUnits({ modelToEdit }) {
    if (!modelToEdit) {
        return null;
    }
    return (
        <Paper style={styles.paper}>
            <OrganisationUnitTreeMultiSelect
                value={modelToEdit.organisationUnits}
                model={modelToEdit}
                modelDefinition={modelToEdit.modelDefinition}
            />
        </Paper>
    );
}
