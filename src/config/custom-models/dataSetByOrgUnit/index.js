import DataSetByOrgUnitModelDefinition from './DataSetByOrgUnitModelDefinition';
import dataSetByOrgUnitSchemeDefinition from './dataSetByOrgUnitSchemaDefinition';
import dataSetByOrgUnitSchemaAttributes from './dataSetByOrgUnitSchemaAttributes';

const dataSetByOrgUnit = {
    CustomModelDefinition: DataSetByOrgUnitModelDefinition,
    schema: dataSetByOrgUnitSchemeDefinition,
    schemaAttributes: dataSetByOrgUnitSchemaAttributes,
};

export default dataSetByOrgUnit;
