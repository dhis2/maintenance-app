import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { StepperNavigationBack, StepperNavigationForward } from './stepper';
import { previousStep, nextStep } from './actions';

const mapDispatchToProps = dispatch => bindActionCreators(
    { onBackClick: previousStep, onForwardClick: nextStep },
    dispatch
);

export const EventProgramStepperNavigationForward = connect(undefined, mapDispatchToProps)(StepperNavigationForward);
export const EventProgramStepperNavigationBackward = connect(undefined, mapDispatchToProps)(StepperNavigationBack)

