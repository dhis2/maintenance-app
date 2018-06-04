import React from 'react';
import Paper from 'material-ui/Paper/Paper';
import Heading from 'd2-ui/lib/headings/Heading.component';
import OrganisationUnitTreeMultiSelect from '../../../forms/form-fields/orgunit-tree-multi-select';
import ProgramAccessControl from '../program-access-control/ProgramAccessControl';

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
            <Heading>Organisation Units</Heading>
            <OrganisationUnitTreeMultiSelect
                value={modelToEdit.organisationUnits}
                model={modelToEdit}
                modelDefinition={modelToEdit.modelDefinition}
            />
            <Heading>Roles and access</Heading>
            <ProgramAccessControl
                model={modelToEdit}
            />
        </Paper>
    );
}
