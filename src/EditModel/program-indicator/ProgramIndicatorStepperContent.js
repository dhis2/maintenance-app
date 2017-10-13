import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { get, difference } from 'lodash/fp';
import compose from 'recompose/compose';
import mapPropsStream from 'recompose/mapPropsStream';
import { createStepperContentFromConfig } from '../stepper/stepper';
import { activeStepSelector } from './selectors';
import steps from './program-indicator-steps';
import programIndicatorStore from './programIndicatorStore';
import { editFieldChanged } from './actions';
import { createFormFor } from '../formHelpers';
import fieldOrder from '../../config/field-config/field-order';
import { flattenRouterProps, wrapInPaper } from '../componentHelpers';

const stepperConfig = () => {
    const editDetailsFields = difference(fieldOrder.for('programIndicator'), ['expression', 'filter']);

    const mapDispatchToProps = dispatch => bindActionCreators({ editFieldChanged }, dispatch);

    const programIndicator$ = programIndicatorStore
        .map(get('programIndicator'));

    const connectEditForm = compose(
        flattenRouterProps,
        connect(null, mapDispatchToProps),
    );

    const stepComponents = {
        EditProgramIndicatorDetailsForm: connectEditForm(wrapInPaper(createFormFor(programIndicator$, 'programIndicator', editDetailsFields))),
        DataExpressionForm: connectEditForm(createFormFor(programIndicator$, 'programIndicator', ['expression'], false)),
        FilterExpressionForm: connectEditForm(createFormFor(programIndicator$, 'programIndicator', ['filter'], false)),
    };

    return steps.map((step) => {
        step.component = stepComponents[step.componentName]; // eslint-disable-line no-param-reassign
        return step;
    });
};

const mapStateToProps = state => ({
    activeStep: activeStepSelector(state),
});

const ProgramIndicatorStepperContent =
    compose(
        connect(mapStateToProps),
        mapPropsStream(props$ =>
            props$.combineLatest(Observable.of({}), (props, { program }) => ({ ...props, modelToEdit: program }))
        )
    )(createStepperContentFromConfig(stepperConfig()));

export default ProgramIndicatorStepperContent;
