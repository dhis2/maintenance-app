import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStepperFromConfig } from '../steps/stepper';
import { activeStepSelector } from './selectors';
import steps from './event-program-steps';
import { changeStep } from './actions';

const mapStateToProps = state => ({
    activeStep: activeStepSelector(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({ stepperClicked: changeStep }, dispatch);
const EventProgramStepper = connect(mapStateToProps, mapDispatchToProps)(createStepperFromConfig(steps.list));

export default EventProgramStepper;
