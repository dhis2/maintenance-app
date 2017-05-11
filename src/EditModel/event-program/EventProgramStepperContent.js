import { connect } from 'react-redux';
import { createStepperContentFromConfig } from './stepper';
import { activeStepSelector } from './selectors';
import steps from './event-program-steps';
import eventProgramStore from './eventProgramStore';
import compose from 'recompose/compose';
import mapPropsStream from 'recompose/mapPropsStream';

const mapStateToProps = (state) => ({
    activeStep: activeStepSelector(state),
});

const EventProgramStepperContent =
    compose(
        connect(mapStateToProps),
        mapPropsStream(props$ =>
            props$.combineLatest(eventProgramStore, (props, { program }) => ({ ...props, modelToEdit: program }))
        )
    )
    (createStepperContentFromConfig(steps));

export default EventProgramStepperContent;
