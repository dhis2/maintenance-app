import OrganisationUnitTreeMultiSelect from '../../../forms/form-fields/orgunit-tree-multi-select';

export default function AssignOrganisationUnits({model}) {
    return (
        <OrganisationUnitTreeMultiSelect
            value={model.organisationUnits}
            model={model}
            modelDefinition={model.modelDefinition}
        />
    );
}
