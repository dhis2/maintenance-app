import { connect } from 'react-redux';
import { createStepperContentFromConfig } from './stepper';
import steps from './event-program-steps';

const mapStateToProps = (state) => ({ ...state });

const EventProgramStepperContent = connect(mapStateToProps)(createStepperContentFromConfig(steps));

export default EventProgramStepperContent;
