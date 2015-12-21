import React from 'react/addons';
import {element} from 'd2-testutils';
import injectTheme from '../config/inject-theme';
import LabelWrapperWithoutContext from '../../src/wrappers/LabelWrapper.component';
import FormFieldMixin from '../../src/FormField.mixin.js';

const Input = React.createClass({
    mixins: [FormFieldMixin],
    render() {
        return <input {...this.formFieldHandlers} />;
    },
});

const TestUtils = React.addons.TestUtils;

describe('LabelWrapper component', () => {
    let labelWrapperComponent;

    beforeEach(() => {
        const LabelWrapper = injectTheme(LabelWrapperWithoutContext);
        const renderedComponents = TestUtils.renderIntoDocument(
            <LabelWrapper inputFieldKey="userForm__myInput" formName={'userForm'} fieldConfig={{key: 'myInput', templateOptions: {label: 'name'}}} />
        );
        labelWrapperComponent = TestUtils.findRenderedComponentWithType(renderedComponents, LabelWrapperWithoutContext);
    });

    it('should have rendered a label', () => {
        expect(() => TestUtils.findRenderedDOMComponentWithTag(labelWrapperComponent, 'label')).not.to.throw();
    });

    it('should have rendered the label text', () => {
        const labelComponent = TestUtils.findRenderedDOMComponentWithTag(labelWrapperComponent, 'label');

        expect(React.findDOMNode(labelComponent).textContent).to.equal('name_translated');
    });

    it('should set the for attribute of the label to the id of the input', () => {
        expect(React.findDOMNode(TestUtils.findRenderedDOMComponentWithTag(labelWrapperComponent, 'label')).getAttribute('for')).to.equal('userForm__myInput');
    });

    it('should just the key if there is no form name', () => {
        const LabelWrapper = injectTheme(LabelWrapperWithoutContext);
        labelWrapperComponent = TestUtils.renderIntoDocument(
            <LabelWrapper inputFieldKey="userForm__myInput" fieldConfig={{key: 'myInput', templateOptions: {label: 'name'}}} />
        );

        expect(React.findDOMNode(TestUtils.findRenderedDOMComponentWithTag(labelWrapperComponent, 'label')).getAttribute('for')).to.equal('myInput');
    });

    it('should set the default templateOptions object', () => {
        const LabelWrapper = injectTheme(LabelWrapperWithoutContext);
        const renderedComponents = TestUtils.renderIntoDocument(
            <LabelWrapper />
        );
        labelWrapperComponent = TestUtils.findRenderedComponentWithType(renderedComponents, LabelWrapperWithoutContext);

        expect(labelWrapperComponent.props.fieldConfig.templateOptions).to.deep.equal({});
    });

    it('should create a templateOptions shortcut on the instance', () => {
        expect(labelWrapperComponent.to).to.deep.equal({label: 'name'});
    });

    it('should place an added child in the result', () => {
        const LabelWrapper = injectTheme(LabelWrapperWithoutContext);
        labelWrapperComponent = TestUtils.renderIntoDocument(
            <LabelWrapper>
                <input />
            </LabelWrapper>
        );

        expect(() => TestUtils.findRenderedDOMComponentWithTag(labelWrapperComponent, 'input')).not.to.throw();
    });

    it('should add the d2-input class to the wrapper', () => {
        expect(element(labelWrapperComponent).hasClass('d2-input')).to.be.true;
    });

    it('should add the d2-input--focused class if the input has content', () => {
        const LabelWrapper = injectTheme(LabelWrapperWithoutContext);
        labelWrapperComponent = TestUtils.renderIntoDocument(
            <LabelWrapper>
                <Input />
            </LabelWrapper>
        );

        TestUtils.Simulate.focus(TestUtils.findRenderedDOMComponentWithTag(labelWrapperComponent, 'input'));

        expect(element(labelWrapperComponent).hasClass('d2-input--focused')).to.be.true;
    });

    it('should remove the d2-input--focused class if the input has content', () => {
        const LabelWrapper = injectTheme(LabelWrapperWithoutContext);
        labelWrapperComponent = TestUtils.renderIntoDocument(
            <LabelWrapper>
                <Input />
            </LabelWrapper>
        );

        TestUtils.Simulate.focus(TestUtils.findRenderedDOMComponentWithTag(labelWrapperComponent, 'input'));

        expect(element(labelWrapperComponent).hasClass('d2-input--focused')).to.be.true;

        TestUtils.Simulate.blur(TestUtils.findRenderedDOMComponentWithTag(labelWrapperComponent, 'input'));

        expect(element(labelWrapperComponent).hasClass('d2-input--focused')).to.be.false;
    });

    it('should have the component name as a class', () => {
        expect(element(labelWrapperComponent).hasClass('d2-input')).to.be.true;
    });

    describe('with input content', () => {
        beforeEach(() => {
            const LabelWrapper = injectTheme(LabelWrapperWithoutContext);
            labelWrapperComponent = TestUtils.renderIntoDocument(
                <LabelWrapper model={{name: undefined}} fieldConfig={{key: 'name', templateOptions: {label: 'name'}}}>
                    <Input model={{name: undefined}} fieldConfig={{key: 'name', templateOptions: {label: 'name'}}} />
                </LabelWrapper>
            );
        });

        it('should not add the d2-input--content class when the element has no content', () => {
            expect(element(React.findDOMNode(labelWrapperComponent)).hasClass('d2-input--content')).to.be.false;
        });

        it('should add the d2-input--content class when the element has content', () => {
            const inputComponent = TestUtils.findRenderedDOMComponentWithTag(labelWrapperComponent, 'input');
            React.findDOMNode(inputComponent).value = 'Mark';

            TestUtils.Simulate.change(inputComponent);

            expect(element(React.findDOMNode(labelWrapperComponent)).hasClass('d2-input--content')).to.be.true;
        });

        it('should add the d2-input--content class on initial load based on the model value', () => {
            const LabelWrapper = injectTheme(LabelWrapperWithoutContext);
            labelWrapperComponent = TestUtils.renderIntoDocument(
                <LabelWrapper model={{name: 'Mark'}} fieldConfig={{key: 'name', templateOptions: {label: 'name'}}}>
                    <Input />
                </LabelWrapper>
            );

            expect(element(React.findDOMNode(labelWrapperComponent)).hasClass('d2-input--content')).to.be.true;
        });
    });

    describe('with validation', () => {
        let runValidation;

        beforeEach(() => {
            runValidation = spy();

            const LabelWrapper = injectTheme(LabelWrapperWithoutContext);
            const renderedComponents = TestUtils.renderIntoDocument(
                <LabelWrapper validationClasses={['invalid-required', 'invalid']} contentUpdated={runValidation}>
                    <Input />
                </LabelWrapper>
            );
            labelWrapperComponent = TestUtils.findRenderedComponentWithType(renderedComponents, LabelWrapperWithoutContext);
        });

        it('should render the validation input classes', () => {
            expect(element(React.findDOMNode(labelWrapperComponent)).hasClass('invalid-required')).to.be.true;
        });

        it('should pass its own contentUpdated', () => {
            expect(labelWrapperComponent.props.children.contentUpdated).to.not.equal(runValidation);
        });

        it('should call runValidation when content updated', () => {
            labelWrapperComponent.contentUpdated();

            expect(runValidation).to.be.called;
        });
    });

    describe('required field', () => {
        let fieldConfig;

        function renderLabel() {
            const LabelWrapper = injectTheme(LabelWrapperWithoutContext);
            return TestUtils.renderIntoDocument(
                <LabelWrapper validationClasses={['invalid-required', 'invalid']} fieldConfig={fieldConfig}>
                    <Input />
                </LabelWrapper>
            );
        }

        beforeEach(() => {
            fieldConfig  = {
                templateOptions: {
                    required: true,
                    label: 'name',
                },
            };
        });

        it('should have rendered the required_translated text', () => {
            labelWrapperComponent = renderLabel();

            const labelComponent = TestUtils.findRenderedDOMComponentWithTag(labelWrapperComponent, 'label');

            expect(React.findDOMNode(labelComponent).textContent).to.equal('name_translated required_translated');
        });

        it('should not render the `(required)` text', () => {
            fieldConfig.templateOptions.required = false;

            labelWrapperComponent = renderLabel();

            const labelComponent = TestUtils.findRenderedDOMComponentWithTag(labelWrapperComponent, 'label');

            expect(React.findDOMNode(labelComponent).textContent).to.equal('name_translated');
        });
    });
});
