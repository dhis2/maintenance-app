import React from 'react';
import Paper from 'material-ui/Paper/Paper';
import OrganisationUnitTreeMultiSelect from '../../../forms/form-fields/orgunit-tree-multi-select';

const styles = {
    paper: {
        padding: '3rem',
    },
};

export default function AssignOrganisationUnits({model}) {
    return (
        <Paper style={styles.paper}>
            <OrganisationUnitTreeMultiSelect
                value={model.organisationUnits}
                model={model}
                modelDefinition={model.modelDefinition}
            />
        </Paper>
    );
}
