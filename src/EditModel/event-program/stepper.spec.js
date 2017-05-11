import React from 'react';
import { createStepperFromConfig, createStepperContentFromConfig, StepperNavigationBack, StepperNavigationForward } from './stepper';
import { shallow } from 'enzyme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Stepper from 'material-ui/Stepper/Stepper';
import Step from 'material-ui/Stepper/Step';
import StepContent from 'material-ui/Stepper/StepContent';
import StepButton from 'material-ui/Stepper/StepButton';
import IconButton from 'material-ui/IconButton';
import ForwardIcon from 'material-ui/svg-icons/navigation/arrow-forward';
import BackwardIcon from 'material-ui/svg-icons/navigation/arrow-back';
import log from 'loglevel';

describe('Stepper utility functions', () => {
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
        it('should render a Stepper component', () => {
            expect(renderedStepper).to.be.type(Stepper);
        });

        it('should render 2 steps', () => {
            expect(renderedStepper).to.have.exactly(2).descendants(Step);
        });

        it('should render in default horizontal position', () => {
            expect(renderedStepper).to.have.prop('orientation', 'horizontal');
        });

        it('should render in vertical position', () => {
            const VerticalStepper = createStepperFromConfig(stepperConfig, 'vertical');
            renderedStepper = shallow(<VerticalStepper />);

            expect(renderedStepper).to.have.prop('orientation', 'vertical');
        });

        it('should render both steps as not active', () => {
            expect(renderedStepper.find(Step).at(0)).to.have.prop('active', false);
            expect(renderedStepper.find(Step).at(1)).to.have.prop('active', false);
        });

        it('should render the 2nd step as active', () => {
            renderedStepper = renderStepper(stepperConfig, {
                activeStep: 'last',
            });

            expect(renderedStepper.children().at(0)).to.have.prop('active', false);
            expect(renderedStepper.children().at(1)).to.have.prop('active', true);
        });

        it('should render the 2nd step as active by index', () => {
            renderedStepper = renderStepper(stepperConfig, {
                activeStep: 1,
            });

            expect(renderedStepper.children().at(0)).to.have.prop('active', false);
            expect(renderedStepper.children().at(1)).to.have.prop('active', true);
        });

        it('should render a StepContent component when a step has content', () => {
            stepperConfig[0].content = () => <div>Content!</div>;
            renderedStepper = renderStepper(stepperConfig);

            expect(renderedStepper.find(Step).at(0)).to.have.exactly(1).descendants(StepContent);
        });

        it('should render call the stepperClicked callback', () => {
            const stepperClicked = sinon.spy();
            renderedStepper = renderStepper(stepperConfig, { stepperClicked });

            renderedStepper.find(StepButton).at(0).simulate('click');

            expect(stepperClicked).to.have.been.calledWith('first');
        });
    });

    describe('createStepperContentFromConfig', () => {
        beforeEach(() => {
            sinon.stub(log, 'warn');
        });

        afterEach(() => {
            log.warn.restore();
        });

        it('should log a warning when no active step has been passed', () => {
            const ContentStepper = createStepperContentFromConfig(stepperConfig);
            renderedStepper = shallow(<ContentStepper />);

            expect(log.warn).to.be.calledWith('The `activeStep` prop is undefined, therefore the component created by `createStepperContentFromConfig` will render null');
        });

        it('should log a warning when the step does not have a component', () => {
            const ContentStepper = createStepperContentFromConfig(stepperConfig);
            renderedStepper = shallow(<ContentStepper activeStep="first" />);

            expect(log.warn).to.be.calledWith(`Could not find a content component for a step with key (first) in`, stepperConfig);
        });

        it('should render null when no component has been provided', () => {
            const ContentStepper = createStepperContentFromConfig(stepperConfig);
            renderedStepper = shallow(<ContentStepper activeStep="first" />);

            expect(renderedStepper).to.be.blank();
        });

        it('should render the component that is provided with the step when that step is active', () => {
            const MyContent = () => (<div>My content</div>);
            stepperConfig[0].component = MyContent;

            const ContentStepper = createStepperContentFromConfig(stepperConfig);
            renderedStepper = shallow(<ContentStepper activeStep="first" />);

            expect(renderedStepper).to.have.type(MyContent);
        });

        it('should pass the props (besides `activeStep`) through to the step component', () => {
            const MyContent = () => (<div>My content</div>);
            stepperConfig[0].component = MyContent;

            const ContentStepper = createStepperContentFromConfig(stepperConfig);
            renderedStepper = shallow(<ContentStepper activeStep="first" name="John" coolStyle={true} />);

            expect(renderedStepper.props()).to.deep.equal({ name: 'John', coolStyle: true });
        });
    });

    describe('StepperNavigationBack', () => {
        let backButton;
        let onBackClickSpy;

        beforeEach(() => {
            onBackClickSpy = sinon.spy();
            backButton = shallow(<StepperNavigationBack onBackClick={onBackClickSpy} />)
        });

        it('should render a IconButton', () => {
            expect(backButton).to.have.type(IconButton);
        });

        it('should render a BackwardIcon', () => {
            expect(backButton).to.have.exactly(1).descendants(BackwardIcon);
        });

        it('should call the onBackClick callback when the button is clicked', () => {
            backButton.simulate('click');

            expect(onBackClickSpy).to.be.called;
        });
    });

    describe('StepperNavigationForward', () => {
        let forwardButton;
        let onForwardClickSpy;

        beforeEach(() => {
            onForwardClickSpy = sinon.spy();
            forwardButton = shallow(<StepperNavigationForward onForwardClick={onForwardClickSpy} />)
        });

        it('should render a IconButton', () => {
            expect(forwardButton).to.have.type(IconButton);
        });

        it('should render a ForwardIcon', () => {
            expect(forwardButton).to.have.exactly(1).descendants(ForwardIcon);
        });

        it('should call the onForwardClick callback when the button is clicked', () => {
            forwardButton.simulate('click');

            expect(onForwardClickSpy).to.be.called;
        });
    });
});
