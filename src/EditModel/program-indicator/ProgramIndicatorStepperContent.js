import { connect } from 'react-redux';
import { createStepperContentFromConfig } from '../steps/stepper';
import { activeStepSelector } from './selectors';
import steps from './program-indicator-steps';
import compose from 'recompose/compose';
import mapPropsStream from 'recompose/mapPropsStream';
import programIndicatorStore from './programIndicatorStore';
import { editFieldChanged } from './actions';
import { bindActionCreators } from 'redux';
import { createFormFor } from '../formHelpers';
import { get, difference } from 'lodash/fp';
import fieldOrder from '../../config/field-config/field-order';
import { flattenRouterProps, wrapInPaper } from '../componentHelpers';

const editDetailsFields = difference(fieldOrder.for('programIndicator'), ['expression', 'filter']);

const mapDispatchToProps = dispatch => bindActionCreators({ editFieldChanged }, dispatch);

const programIndicator$ = programIndicatorStore
    .map(get('programIndicator'));

const connectExpressionField = compose(
    flattenRouterProps,
    connect(null, mapDispatchToProps),
);

const EditProgramIndicatorDetailsForm = connectExpressionField(wrapInPaper(createFormFor(programIndicator$, 'programIndicator', editDetailsFields)));
const DataExpressionForm = connectExpressionField(createFormFor(programIndicator$, 'programIndicator', ['expression'], false));
const FilterExpressionForm = connectExpressionField(createFormFor(programIndicator$, 'programIndicator', ['filter'], false));

const stepComponents = {
    EditProgramIndicatorDetailsForm,
    DataExpressionForm,
    FilterExpressionForm,
};

const stepsWithComponents = steps.list.map((step) => {
    step.component = stepComponents[step.componentName]; // eslint-disable-line no-param-reassign

    return step;
});

const mapStateToProps = state => ({
    activeStep: activeStepSelector(state),
});

const EventProgramStepperContent =
    compose(
        connect(mapStateToProps),
        mapPropsStream(props$ =>
            props$.combineLatest(Observable.of({}), (props, { program }) => ({ ...props, modelToEdit: program }))
        )
    )(createStepperContentFromConfig(stepsWithComponents));

export default EventProgramStepperContent;
