import { createStepperFromConfig } from '../../stepper/stepper';
import { activeStepSelector, disabledSelector } from '../selectors';
import { connect } from 'react-redux';
import steps from './tracker-program-steps';
import { changeStep, changeStepperDisabledState } from '../actions';
import { bindActionCreators } from 'redux';

const mapStateToProps = state => ({
    activeStep: activeStepSelector(state),
    disabled: disabledSelector(state),
});

const mapDispatchToProps = dispatch =>
    bindActionCreators({ stepperClicked: changeStep }, dispatch);
const EventProgramStepper = connect(mapStateToProps, mapDispatchToProps)(
    createStepperFromConfig(steps)
);

export default EventProgramStepper;
