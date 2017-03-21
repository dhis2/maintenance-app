import { createStepperFromConfig } from './stepper';
import { connect } from 'react-redux';
import steps from './event-program-steps';

const mapStateToProps = (state) => ({ ...state });
const mapDispatchToProps = (dispatch) => ({
    stepperClicked: (v) => dispatch({ type: 'STEP_CHANGE', payload: v })
});

const EventProgramStepper = connect(mapStateToProps, mapDispatchToProps)(createStepperFromConfig(steps));

export default EventProgramStepper;
