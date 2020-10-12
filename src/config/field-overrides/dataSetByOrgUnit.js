import OrganisationUnitSingleSelect from '../../forms/form-fields/orgunit-single-select';
import DataSetElementFieldByOrgUnit from './data-set/DataSetElementFieldByOrgUnit.component';
import DataInputPeriods from './data-set/DataInputPeriods.component';
import PeriodTypeDropDown from '../../forms/form-fields/period-type-drop-down';

export default new Map([
    ['categoryCombo', {
        referenceType: 'categoryCombo',
        fieldOptions: {
            queryParamFilter: ['dataDimensionType:eq:ATTRIBUTE', 'name:eq:default'],
        },
    }],
    ['periodType', {
        component: PeriodTypeDropDown,
    }],
    ['organisationUnits', {
        component: OrganisationUnitSingleSelect,
        fieldOptions: {},
    }],
    ['dataSetElements', {
        component: DataSetElementFieldByOrgUnit,
    }],
    ['dataInputPeriods', {
        component: DataInputPeriods,
    }],
]);
