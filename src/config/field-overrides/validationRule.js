import LeftSideExpressionField from './validation-rules/LeftSideExpressionField';
import RightSideExpressionField from './validation-rules/RightSideExpressionField';

export default new Map([
    ["leftSide", {
        component: LeftSideExpressionField,
    }],
    ["rightSide", {
        component: RightSideExpressionField,
    }],
]);