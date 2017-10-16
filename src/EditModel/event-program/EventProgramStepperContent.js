import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import mapPropsStream from 'recompose/mapPropsStream';
import { get, compose } from 'lodash/fp';
import { createStepperContentFromConfig } from '../stepper/stepper';
import { activeStepSelector } from './selectors';
import eventProgramStore from './eventProgramStore';
import steps from './event-program-steps';
import AssignDataElements from './assign-data-elements/AssignDataElements';
import EditDataEntryForm from './create-data-entry-form/CreateDataEntryForm.component';
import AssignOrganisationUnits from './assign-organisation-units/AssignOrganisationUnits';
import EventProgramNotifications from './notifications/EventProgramNotifications';
import { createFormFor } from '../formHelpers';
import { editFieldChanged } from './actions';
import { flattenRouterProps, wrapInPaper } from '../componentHelpers';

const stepperConfig = () => {
    const program$ = eventProgramStore
        .map(get('program'));

    const mapDispatchToProps = dispatch => bindActionCreators({ editFieldChanged }, dispatch);

    const connectEditForm = compose(
        flattenRouterProps,
        connect(null, mapDispatchToProps)
    );

    const stepComponents = {
        EditProgramDetailsForm: connectEditForm(wrapInPaper(createFormFor(program$, 'program'))),
        AssignDataElements,
        EditDataEntryForm,
        AssignOrganisationUnits,
        EventProgramNotifications,
    };

    return steps.map((step) => {
        step.component = stepComponents[step.componentName]; // eslint-disable-line no-param-reassign
        return step;
    });
};

const mapStateToProps = state => ({
    activeStep: activeStepSelector(state),
});

const EventProgramStepperContent =
    compose(
        connect(mapStateToProps),
        mapPropsStream(props$ =>
            props$.combineLatest(eventProgramStore, (props, { program }) => ({ ...props, modelToEdit: program }))
        )
    )(createStepperContentFromConfig(stepperConfig()));

export default EventProgramStepperContent;
