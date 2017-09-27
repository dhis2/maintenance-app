import { connect } from 'react-redux';
import mapPropsStream from 'recompose/mapPropsStream';
import { createStepperContentFromConfig } from '../steps/stepper';
import { activeStepSelector } from './selectors';
import eventProgramStore from './eventProgramStore';
import steps from './event-program-steps';
import AssignOrganisationUnits from './assign-organisation-units/AssignOrganisationUnits';
import EventProgramNotifications from './notifications/EventProgramNotifications';
import AssignDataElements from './assign-data-elements/AssignDataElements';
import { createFormFor } from '../formHelpers';
import { get, compose } from 'lodash/fp';
import { editFieldChanged } from './actions';
import { bindActionCreators } from 'redux';
import { flattenRouterProps, wrapInPaper } from '../componentHelpers';
import EditDataEntryForm from './create-data-entry-form/CreateDataEntryForm.component';

const stepperConfig = () => {
    const program$ = eventProgramStore
        .map(get('program'));

    const mapDispatchToProps = dispatch => bindActionCreators({ editFieldChanged }, dispatch);

    const connectEditForm = compose(
        flattenRouterProps,
        connect(null, mapDispatchToProps)
    );

    const EditProgramDetailsForm = connectEditForm(wrapInPaper(createFormFor(program$, 'program')));

    const stepComponents = {
        EditProgramDetailsForm,
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
