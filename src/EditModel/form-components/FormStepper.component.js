import React from 'react';
import PropTypes from 'prop-types';
import { Step, Stepper, StepButton } from 'material-ui/Stepper';

import fieldGroups from '../../config/field-config/field-groups';

const FormStepper = ({ modelType, onChange, activeStep }, context) => {
    const steps = fieldGroups.for(modelType);
    const stepCount = steps.length;
    const stepperStyle = { margin: '0 -16px' };

    const Steps = steps.map((step, s) => {
        const setActiveStep = () => onChange(s);
        const stepLabel = context.d2.i18n.getTranslation(step.label);

        return (
            <Step key={step.label}>
                <StepButton onClick={setActiveStep}>
                    {stepLabel}
                </StepButton>
            </Step>
        );
    });

    return stepCount > 1 && (
        <Stepper
            activeStep={activeStep}
            linear={false}
            style={stepperStyle}
        >
            {Steps}
        </Stepper>
    );
};

FormStepper.propTypes = {
    modelType: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    activeStep: PropTypes.number.isRequired,
};
FormStepper.contextTypes = { d2: PropTypes.object.isRequired };

export default FormStepper;
