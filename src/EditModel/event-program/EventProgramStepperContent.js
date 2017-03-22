import { connect } from 'react-redux';
import { createStepperContentFromConfig } from './stepper';
import { modelSelector } from './selectors';
import { activeStepSelector } from './selectors';
import steps from './event-program-steps';

const mapStateToProps = (state) => ({
    activeStep: activeStepSelector(state),
    modelToEdit: modelSelector(state),
});

const EventProgramStepperContent = connect(mapStateToProps)(createStepperContentFromConfig(steps));

export default EventProgramStepperContent;
