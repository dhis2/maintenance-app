import React from 'react';
import { shallow } from 'enzyme';
import Stepper from 'material-ui/Stepper/Stepper';
import Step from 'material-ui/Stepper/Step';
import StepContent from 'material-ui/Stepper/StepContent';
import StepButton from 'material-ui/Stepper/StepButton';
import IconButton from 'material-ui/IconButton';
import ForwardIcon from 'material-ui/svg-icons/navigation/arrow-forward';
import BackwardIcon from 'material-ui/svg-icons/navigation/arrow-back';
import log from 'loglevel';
import {
    createStepperFromConfig,
    createStepperContentFromConfig,
    StepperNavigationBack,
    StepperNavigationForward,
} from '../stepper';

describe.skip('Stepper utility functions', () => {
    const renderStepper = (stepperConfig, props = {}) => {
        const GeneratedStepper = createStepperFromConfig(stepperConfig);

        return shallow(<GeneratedStepper {...props} />);
    };

    let stepperConfig;
    let renderedStepper;

    beforeEach(() => {
        stepperConfig = [
            { key: 'first', name: 'First step!' },
            { key: 'last', name: 'My last step!' },
        ];

        renderedStepper = renderStepper(stepperConfig);
    });

    describe('createStepperFromConfig', () => {
        test('should render a Stepper component', () => {
            expect(renderedStepper).to.be.type(Stepper);
        });

        test('should render 2 steps', () => {
            expect(renderedStepper).to.have.exactly(2).descendants(Step);
        });

        test('should render in default horizontal position', () => {
            expect(renderedStepper).toHaveProperty('orientation', 'horizontal');
        });

        test('should render in vertical position', () => {
            const VerticalStepper = createStepperFromConfig(stepperConfig, 'vertical');
            renderedStepper = shallow(<VerticalStepper />);

            expect(renderedStepper).toHaveProperty('orientation', 'vertical');
        });

        test('should render both steps as not active', () => {
            expect(renderedStepper.find(Step).at(0)).toHaveProperty('active', false);
            expect(renderedStepper.find(Step).at(1)).toHaveProperty('active', false);
        });

        test('should render the 2nd step as active', () => {
            renderedStepper = renderStepper(stepperConfig, {
                activeStep: 'last',
            });

            expect(renderedStepper.children().at(0)).toHaveProperty('active', false);
            expect(renderedStepper.children().at(1)).toHaveProperty('active', true);
        });

        test('should render the 2nd step as active by index', () => {
            renderedStepper = renderStepper(stepperConfig, {
                activeStep: 1,
            });

            expect(renderedStepper.children().at(0)).toHaveProperty('active', false);
            expect(renderedStepper.children().at(1)).toHaveProperty('active', true);
        });

        test.skip('should render a StepContent component when a step has content', () => {
            stepperConfig[0].content = () => <div>Content!</div>;
            renderedStepper = renderStepper(stepperConfig);

            expect(renderedStepper.find(Step).at(0)).to.have.exactly(1).descendants(StepContent);
        });

        test('should render call the stepperClicked callback', () => {
            const stepperClicked = jest.fn();
            renderedStepper = renderStepper(stepperConfig, { stepperClicked });

            renderedStepper.find(StepButton).at(0).simulate('click');

            expect(stepperClicked).toHaveBeenCalledWith('first');
        });
    });

    describe('createStepperContentFromConfig', () => {
        beforeEach(() => {
            jest.spyOn(log, 'warn');
        });

        afterEach(() => {
            log.warn.restore();
        });

        test('should log a warning when no active step has been passed', () => {
            const ContentStepper = createStepperContentFromConfig(stepperConfig);
            renderedStepper = shallow(<ContentStepper />);

            expect(log.warn).toBeCalledWith('The `activeStep` prop is undefined, therefore the component created by `createStepperContentFromConfig` will render null');
        });

        test('should log a warning when the step does not have a component', () => {
            const ContentStepper = createStepperContentFromConfig(stepperConfig);
            renderedStepper = shallow(<ContentStepper activeStep="first" />);

            expect(log.warn).toBeCalledWith('Could not find a content component for a step with key (first) in', stepperConfig);
        });

        test.skip('should render null when no component has been provided', () => {
            const ContentStepper = createStepperContentFromConfig(stepperConfig);
            renderedStepper = shallow(<ContentStepper activeStep="first" />);

            expect(renderedStepper).to.be.blank();
        });

        test.skip(
            'should render the component that is provided with the step when that step is active',
            () => {
                const MyContent = () => (<div>My content</div>);
                stepperConfig[0].component = MyContent;

                const ContentStepper = createStepperContentFromConfig(stepperConfig);
                renderedStepper = shallow(<ContentStepper activeStep="first" />);

                // expzect(renderedStepper).to.have.type(MyContent);
            }
        );

        test(
            'should pass the props (besides `activeStep`) through to the step component',
            () => {
                const MyContent = () => (<div>My content</div>);
                stepperConfig[0].component = MyContent;

                const ContentStepper = createStepperContentFromConfig(stepperConfig);
                renderedStepper = shallow(<ContentStepper activeStep="first" name="John" coolStyle />);

                expect(renderedStepper.props()).toEqual({ name: 'John', coolStyle: true });
            }
        );
    });

    describe('StepperNavigationBack', () => {
        let backButton;
        let onBackClickSpy;

        beforeEach(() => {
            onBackClickSpy = jest.spyOn();
            backButton = shallow(<StepperNavigationBack onBackClick={onBackClickSpy} />);
        });

        test('should render a IconButton', () => {
            expect(backButton).to.have.type(IconButton);
        });

        test('should render a BackwardIcon', () => {
            expect(backButton).to.have.exactly(1).descendants(BackwardIcon);
        });

        test('should call the onBackClick callback when the button is clicked', () => {
            backButton.simulate('click');

            expect(onBackClickSpy).toHaveBeenCalled();
        });
    });

    describe('StepperNavigationForward', () => {
        let forwardButton;
        let onForwardClickSpy;

        beforeEach(() => {
            onForwardClickSpy = jest.spyOn();
            forwardButton = shallow(<StepperNavigationForward onForwardClick={onForwardClickSpy} />);
        });

        test('should render a IconButton', () => {
            expect(forwardButton).to.have.type(IconButton);
        });

        test('should render a ForwardIcon', () => {
            expect(forwardButton).to.have.exactly(1).descendants(ForwardIcon);
        });

        test(
            'should call the onForwardClick callback when the button is clicked',
            () => {
                forwardButton.simulate('click');

                expect(onForwardClickSpy).toHaveBeenCalled();
            }
        );
    });
});
