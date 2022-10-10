import LeftSideExpressionField from './validation-rules/LeftSideExpressionField';
import RightSideExpressionField from './validation-rules/RightSideExpressionField';
import PeriodTypeDropDown from '../../forms/form-fields/period-type-drop-down';

export default new Map([
    ['periodType', {
        component: PeriodTypeDropDown,
    }],
    ['importance', {
        required: true,
    }],
    ['leftSide', {
        component: LeftSideExpressionField,
        unique: false,
    }],
    ['rightSide', {
        component: RightSideExpressionField,
        unique: false,
    }],
    ['organisationUnitLevels', {
        referenceType: 'organisationUnitLevel',
        fieldOptions: {},
    }],
]);
