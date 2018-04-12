const STEP_DETAILS = 'program_indicator__details';
const STEP_EXPRESSION_EDIT = 'program_indicator__edit_expression';
const STEP_FILTER_EDIT = 'program_indicator__edit_filter';

const steps = [
    {
        key: STEP_DETAILS,
        name: STEP_DETAILS,
        componentName: 'EditProgramIndicatorDetailsForm',
    },
    {
        key: STEP_EXPRESSION_EDIT,
        name: STEP_EXPRESSION_EDIT,
        componentName: 'DataExpressionForm',
    },
    {
        key: STEP_FILTER_EDIT,
        name: STEP_FILTER_EDIT,
        componentName: 'FilterExpressionForm',
    },
];

export default steps;
