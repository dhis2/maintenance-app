import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { createStepper } from '../stepper/stepper';
import { activeStepSelector } from './selectors';
import { changeStep } from './actions';

const mapStateToProps = state => ({ activeStep: activeStepSelector(state) });

const mapDispatchToProps = dispatch =>
    bindActionCreators({ stepperClicked: step => changeStep(step) }, dispatch);

const ProgramIndicatorStepper = connect(
    mapStateToProps,
    mapDispatchToProps,
)(createStepper);

export default ProgramIndicatorStepper;
