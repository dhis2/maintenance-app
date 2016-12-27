import DropDown from '../../forms/form-fields/drop-down';
import LeftSideExpressionField from './validation-rules/LeftSideExpressionField';
import RightSideExpressionField from './validation-rules/RightSideExpressionField';
import periodTypes from '../periodTypes';

export default new Map([
    ['periodType', {
        component: DropDown,
        fieldOptions: {
            options: periodTypes,
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