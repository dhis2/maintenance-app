import React from 'react';
import programIndicatorStore from './programIndicatorStore';
import { editFieldChanged } from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createFormFor } from '../formHelpers';
import { get, compose, difference } from 'lodash/fp';
import fieldOrder from '../../config/field-config/field-order';
import { flattenRouterProps, wrapInPaper } from '../componentHelpers';

const editDetailsFields = difference(fieldOrder.for('programIndicator'), ['expression', 'filter']);

const mapDispatchToProps = dispatch => bindActionCreators({ editFieldChanged }, dispatch);

const programIndicator$ = programIndicatorStore
    .map(get('programIndicator'));

export const STEP_DETAILS = 'program_indicator__details';
export const STEP_EXPRESSION_EDIT = 'program_indicator__edit_expression';
export const STEP_FILTER_EDIT = 'program_indicator__edit_filter';

const connectExpressionField = compose(
    flattenRouterProps,
    connect(null, mapDispatchToProps),
);

const EditProgramIndicatorDetailsForm = connectExpressionField(wrapInPaper(createFormFor(programIndicator$, 'programIndicator', editDetailsFields)));
const DataExpressionForm = connectExpressionField(createFormFor(programIndicator$, 'programIndicator', ['expression'], false));
const FilterExpressionForm = connectExpressionField(createFormFor(programIndicator$, 'programIndicator', ['filter'], false));

const steps = [
    {
        key: STEP_DETAILS,
        name: STEP_DETAILS,
        component: EditProgramIndicatorDetailsForm,
    },
    {
        key: STEP_EXPRESSION_EDIT,
        name: STEP_EXPRESSION_EDIT,
        component: DataExpressionForm,
    },
    {
        key: STEP_FILTER_EDIT,
        name: STEP_FILTER_EDIT,
        component: FilterExpressionForm,
    },
];

export default steps;
