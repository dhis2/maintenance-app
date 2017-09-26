export const next = (steps, activeStep) => {
    const currentStepIndex = steps.findIndex(step => step.key === activeStep);

    if (steps[currentStepIndex + 1]) {
        return steps[currentStepIndex + 1].key;
    }

    return activeStep;
};

export const previous = (steps, activeStep) => {
    const currentStepIndex = steps.findIndex(step => step.key === activeStep);

    if (steps[currentStepIndex - 1]) {
        return steps[currentStepIndex - 1].key;
    }

    return activeStep;
};

export const first = steps => steps[0].key;
