import React from 'react';
import Paper from 'material-ui/Paper/Paper';
import PropTypes from 'prop-types';
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

const ProgramNotSavedMessage = (_, { d2 } ) => (
    <div>{d2.i18n.getTranslation('save_the_program_in_order_to_access_sharing_settings')}</div>
);

ProgramNotSavedMessage.contextTypes = {
    d2: PropTypes.object,
}

const ProgramStagesAccessHOC = branch(
    props => !props.model.dataValues.sharing,
    renderComponent(ProgramNotSavedMessage)
)(ProgramStagesAccess);

const ProgramAccess = ({ modelToEdit }, { d2 }) => {
    if (!modelToEdit) {
        return null;
    }
    
    return (
        <Paper style={styles.paper}>
            <Heading>{d2.i18n.getTranslation("organisation_units")}</Heading>
            <OrganisationUnitTreeMultiSelect
                value={modelToEdit.organisationUnits}
                model={modelToEdit}
                modelDefinition={modelToEdit.modelDefinition}
            />
            <Heading style={styles.padding}>{d2.i18n.getTranslation("roles_and_access")}</Heading>
            <ProgramStagesAccessHOC
                model={modelToEdit}
            />
        </Paper>
    );
}

ProgramAccess.contextTypes = {
    d2: PropTypes.object,
};

export default ProgramAccess;