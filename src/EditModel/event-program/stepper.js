// TODO: Move this to d2-ui?
import Stepper from 'material-ui/Stepper/Stepper';
import StepButton from 'material-ui/Stepper/StepButton';
import Step from 'material-ui/Stepper/Step';
import Translate from 'd2-ui/lib/i18n/Translate.component';
import log from 'loglevel';

export const createStepperFromConfig = (stepperConfig) => ({ activeStep, stepperClicked }) => (
    <Stepper linear={false}>
        {stepperConfig.map(step => (
            <Step key={step.key} active={activeStep === step.key}>
                <StepButton onClick={() => stepperClicked(step.key)}><Translate>{step.name}</Translate></StepButton>
            </Step>
        ))}
    </Stepper>
);

export const createStepperContentFromConfig = (stepperConfig) => ({ activeStep, ...props }) => {
    const step = stepperConfig.find(stepConfig => stepConfig.key === activeStep);

    if (step && step.component) {
        return <step.component {...props} />
    }

    log.warn(`Could not find a content component for a step with key (${activeStep} in`, stepperConfig);

    return null;
};
