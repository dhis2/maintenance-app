import React from 'react';
import Paper from 'material-ui/Paper/Paper';
import Heading from 'd2-ui/lib/headings/Heading.component';
import OrganisationUnitTreeMultiSelect from '../../../forms/form-fields/orgunit-tree-multi-select';
import ProgramStagesAccess from './ProgramStagesAccess';
import { branch, renderComponent } from 'recompose';

const styles = {
    paper: {
        padding: '3rem',
    },
    padding: {
        paddingTop: '3rem',
    }
};

const ProgramNotSavedMessage = () => (
    <div>Save the program in order to access sharing settings</div>
);

const ProgramStagesAccessHOC = branch(
    props => !props.model.dataValues.publicAccess,
    renderComponent(ProgramNotSavedMessage)
)(ProgramStagesAccess);

export default function ProgramAccess({ modelToEdit }) {
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
            <Heading style={styles.padding}>Roles and access</Heading>
            <ProgramStagesAccessHOC
                model={modelToEdit}
            />
        </Paper>
    );
}
