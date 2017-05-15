import DropDown from '../../forms/form-fields/drop-down';
import LeftSideExpressionField from './validation-rules/LeftSideExpressionField';
import RightSideExpressionField from './validation-rules/RightSideExpressionField';
import periodTypeStore from '../../App/periodTypeStore';

export default new Map([
    ['periodType', {
        component: DropDown,
        fieldOptions: {
            options: periodTypeStore.getState(),
        },
    }],
    ['importance', {
        required: true,
    }],
    ["leftSide", {
        component: LeftSideExpressionField,
    }],
    ["rightSide", {
        component: RightSideExpressionField,
    }],
]);
