import React from 'react/addons';
import {element} from 'd2-testutils';
import InputWithoutContext from '../src/Input.component';
import injectTheme from './config/inject-theme';

const TestUtils = React.addons.TestUtils;

describe('Input component', () => {
    let inputComponent;
    let fieldConfig;
    let model;
    let Input;

    beforeEach(() => {
        fieldConfig = {key: 'name'};
        model = {};

        Input = injectTheme(InputWithoutContext);

        inputComponent = TestUtils.renderIntoDocument(<Input formName={'user-form'} fieldConfig={fieldConfig} model={model} />);
        inputComponent = TestUtils.findRenderedComponentWithType(inputComponent, InputWithoutContext);
    });

    it('should render the value in the inputbox', () => {
        inputComponent.handleChange({target: {value: 'Lars'}});

        expect(inputComponent.getValue()).to.equal('Lars');
    });

    it('should have the formName + key as an id', () => {
        expect(element(inputComponent, 'input').attr('id')).to.equal('user-form__name');
    });

    it('should just use the key if there is no formName', () => {
        delete fieldConfig.formName;
        inputComponent = TestUtils.renderIntoDocument(<Input fieldConfig={fieldConfig} model={model} />);

        expect(element(inputComponent, 'input').attr('id')).to.equal('name');
    });

    it('should set the type of input to text', () => {
        expect(element(inputComponent, 'input').attr('type')).to.equal('text');
    });

    it('should have set the min and max validators', () => {
        expect(inputComponent.validators.min).not.to.be.undefined;
        expect(inputComponent.validators.max).not.to.be.undefined;
    });

    describe('with validation classes', () => {
        it('should render the classes', () => {
            inputComponent = TestUtils.renderIntoDocument(<Input fieldConfig={fieldConfig} model={model} validationClasses={['invalid-required']} />);

            expect(element(React.findDOMNode(inputComponent)).hasClass('invalid-required')).to.be.true;
        });
    });

    describe('validation', () => {
        it('should call contentUpdated', () => {
            const runValidation = spy();
            inputComponent = TestUtils.renderIntoDocument(<Input formName={'user-form'} fieldConfig={fieldConfig} model={model} contentUpdated={runValidation} />);
            inputComponent = TestUtils.findRenderedComponentWithType(inputComponent, InputWithoutContext);

            inputComponent.handleChange({target: {value: 'Lars'}});

            expect(runValidation).to.be.called;
        });
    });

    it('should render the label', () => {
        expect(element(inputComponent, 'label').element.textContent).to.equal('name_translated');
    });
});
