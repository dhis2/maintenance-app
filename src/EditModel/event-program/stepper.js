// TODO: Move this to d2-ui?
import React from 'react';
import Stepper from 'material-ui/Stepper/Stepper';
import StepButton from 'material-ui/Stepper/StepButton';
import Step from 'material-ui/Stepper/Step';
import IconButton from 'material-ui/IconButton/IconButton';
import ForwardIcon from 'material-ui/svg-icons/navigation/arrow-forward';
import BackwardIcon from 'material-ui/svg-icons/navigation/arrow-back';
import Translate from 'd2-ui/lib/i18n/Translate.component';
import log from 'loglevel';

/**
 * Create a Stepper component from a configuration object.
 *
 * @param {Array} stepperConfig Config array that defines the steps that should be shown.
 *
 * @returns {ReactComponent} A React component that will render the steps as defined by the `stepperConfig`
 *
 * @example
 * ```
 * const steps = [
 *      { key: 'first', name: 'First step!' },
 *      { key: 'last', name: 'My last step!' },
 * ];
 * const MyStepperComponent = createStepperFromConfig(steps)
 *
 * // <MyStepperComponent activeStep={activeStep.key} />
 * ```
 */
export const createStepperFromConfig = (stepperConfig) => ({ activeStep, stepperClicked }) => (
    <Stepper linear={false}>
        {stepperConfig.map(step => (
            <Step key={step.key} active={activeStep === step.key}>
                <StepButton onClick={() => stepperClicked(step.key)}><Translate>{step.name}</Translate></StepButton>
            </Step>
        ))}
    </Stepper>
);

/**
 * Create a StepperContent component from a configuration object. The StepperContent component renders the content that
 * belongs to the current `activeStep`. When the config does not specify a `component` property for the current active
 * step a warning is logged and `null` is rendered.
 * The `component` is passed all the props passed to the StepperContent.
 *
 * @param {Array} stepperConfig Config array that defines the steps and the components that should be rendered for the
 * currently active step.
 *
 * @returns {ReactComponent} A React component that will render the `component` property of the currently active step.
 *
 * @example
 * ```
 * const steps = [
 *      { key: 'first', name: 'First step!', component: () => (<div>First</div>) },
 *      { key: 'last', name: 'My last step!', component: () => (<div>First</div>) },
 * ];
 * const MyStepperComponent = createStepperFromConfig(steps)
 *
 * // <MyStepperComponent activeStep="first" /> // Will render <div>First</div>
 * ```
 */
export const createStepperContentFromConfig = (stepperConfig) => ({ activeStep, ...props }) => {
    const step = stepperConfig.find(stepConfig => stepConfig.key === activeStep);

    if (step && step.component) {
        return <step.component {...props} />
    }

    log.warn(`Could not find a content component for a step with key (${activeStep} in`, stepperConfig);

    return null;
};

const styles = {
    buttons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
};

export function StepperNavigationButtons({ onBackClick, onForwardClick, style }) {
    const wrapStyle = Object.assign({}, styles.buttons, style);

    return (
        <div style={wrapStyle}>
            <IconButton onClick={onBackClick}>
                <BackwardIcon />
            </IconButton>
            <IconButton onClick={onForwardClick}>
                <ForwardIcon />
            </IconButton>
        </div>
    );
}
