import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { createStepper } from '../stepper/stepper';
import { getActiveStep } from './programIndicator.selectors';
import { changeStep } from '../stepper/stepper.actions';

const mapStateToProps = state => ({ activeStep: getActiveStep(state) });

const mapDispatchToProps = dispatch =>
    bindActionCreators({ stepperClicked: step => changeStep(step) }, dispatch);

const ProgramIndicatorNumberStepper = connect(
    mapStateToProps,
    mapDispatchToProps,
)(createStepper);

export default ProgramIndicatorNumberStepper;
