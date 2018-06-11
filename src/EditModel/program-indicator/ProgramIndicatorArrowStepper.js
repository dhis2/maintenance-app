import { previousStep, nextStep } from './actions';
import {
    createConnectedForwardButton,
    createConnectedBackwardButton,
    createStepperNavigation,
} from '../stepper/stepper';

const EventProgramStepperNavigationForward = createConnectedForwardButton(nextStep);
const EventProgramStepperNavigationBackward = createConnectedBackwardButton(previousStep);

const ArrowStepperNavigation = createStepperNavigation(
    EventProgramStepperNavigationBackward,
    EventProgramStepperNavigationForward,
);

export default ArrowStepperNavigation;
