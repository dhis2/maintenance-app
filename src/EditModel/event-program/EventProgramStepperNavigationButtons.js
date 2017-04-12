import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { StepperNavigationButtons } from './stepper';
import { previousStep, nextStep } from './actions';

const mapDispatchToProps = dispatch => bindActionCreators(
    { onBackClick: previousStep, onForwardClick: nextStep },
    dispatch
);

const EventProgramStepperNavigationButtons = connect(undefined, mapDispatchToProps)(StepperNavigationButtons);

export default EventProgramStepperNavigationButtons;
