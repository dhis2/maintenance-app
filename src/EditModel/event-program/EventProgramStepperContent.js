import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapPropsStream from 'recompose/mapPropsStream';
import { get } from 'lodash/fp';
import { createStepperContentFromConfig } from '../steps/stepper';
import { activeStepSelector } from './selectors';
import { steps } from './event-program-steps';
import eventProgramStore from './eventProgramStore';
import AssignOrganisationUnits from './assign-organisation-units/AssignOrganisationUnits';
import EventProgramNotifications from './notifications/EventProgramNotifications';
import AssignDataElements from './assign-data-elements/AssignDataElements';
import { createFormFor } from '../formHelpers';
import { editFieldChanged } from './actions';
import { flattenRouterProps, wrapInPaper } from '../componentHelpers';
import EditDataEntryForm from './create-data-entry-form/CreateDataEntryForm.component';

const program$ = eventProgramStore
    .map(get('program'));

const mapDispatchToProps = dispatch => bindActionCreators({ editFieldChanged }, dispatch);

const connectExpressionField = compose(
    flattenRouterProps,
    connect(null, mapDispatchToProps)
);

const EditProgramDetailsForm = connectExpressionField(wrapInPaper(createFormFor(program$, 'program')));

const stepComponents = {
    EditProgramDetailsForm,
    AssignDataElements,
    EditDataEntryForm,
    AssignOrganisationUnits,
    EventProgramNotifications,
};

const stepsWithComponents = steps.map((step) => {
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
            props$.combineLatest(eventProgramStore, (props, { program }) => ({ ...props, modelToEdit: program }))
        )
    )(createStepperContentFromConfig(stepsWithComponents));

export default EventProgramStepperContent;
