import React from 'react/addons';
import {element} from 'd2-testutils';
import log from 'loglevel';
import injectTheme from './config/inject-theme';
import InputFieldWithoutContext from '../src/InputField.component';
import LabelWrapper from '../src/wrappers/LabelWrapper.component';

const TestUtils = React.addons.TestUtils;

// TODO: Extract this out to testutils
function wrapComponentForTest(ComponentUnderTest) {
    return React.createClass({
        getInitialState() {
            return Object.keys(this.props)
                .reduce((state, prop) => {
                    state[prop] = this.props[prop];
                    return state;
                }, {});
        },

        render() {
            return <ComponentUnderTest ref="componentUnderTest" {...this.state}/>;
        },
    });
}

function renderWrappedInput(props) {
    const WrappedComponentUnderTest = wrapComponentForTest(InputFieldWithoutContext);
    const ComponentToRender = injectTheme(WrappedComponentUnderTest);
    const renderedComponents = TestUtils.renderIntoDocument(
        <ComponentToRender {...props} />
    );

    return TestUtils.findRenderedComponentWithType(renderedComponents, WrappedComponentUnderTest);
}

describe('InputField component', () => {
    let inputFieldComponent;
    let fieldConfig;
    let Input;

    const renderInputField = (props) => {
        const WrappedInputField = injectTheme(InputFieldWithoutContext);
        const renderedComponents = TestUtils.renderIntoDocument(
            <WrappedInputField {...props} />
        );

        return TestUtils.findRenderedComponentWithType(renderedComponents, InputFieldWithoutContext);
    };

    beforeEach(() => {
        spy(console, 'warn');

        Input = React.createClass({ // eslint-disable-line react/no-multi-comp
            render() {
                return <input {...this.props} />;
            },
        });

        fieldConfig = {key: 'name', type: Input, templateOptions: {label: 'name'}};
    });

    it('should render the passed field type', () => {
        inputFieldComponent = renderInputField({fieldConfig});

        expect(React.findDOMNode(inputFieldComponent).tagName).to.equal('INPUT');
    });

    it('should throw an error when fieldConfig is not supplied', () => {
        const render = () => renderInputField();

        expect(render).to.throw('`fieldConfig.type` is required to render the input field');
    });

    it('should not render the element if the hide property is true', () => {
        fieldConfig.hide = true;

        inputFieldComponent = renderInputField({fieldConfig});

        expect(React.findDOMNode(inputFieldComponent)).to.equal(null);
    });

    it('should not render the element if the hide function resturns true', () => {
        fieldConfig.hide = (model) => {
            return !model.name;
        };

        inputFieldComponent = renderInputField({fieldConfig});

        expect(React.findDOMNode(inputFieldComponent)).to.equal(null);
    });

    it('should render the field when the model hide expression has changed', () => {
        fieldConfig.hide = (model) => {
            if (model.name) {
                return false;
            }
            return true;
        };

        const parentComponent = renderWrappedInput({fieldConfig});

        expect(React.findDOMNode(parentComponent)).to.equal(null);

        parentComponent.setState({
            model: {name: 'Mark'},
        });

        expect(React.findDOMNode(parentComponent)).not.to.equal(null);
    });

    it('should pass the fieldConfig and model props onto the field', () => {
        const model = {name: undefined};
        const parentComponent = renderWrappedInput({fieldConfig, model});
        const propsToFieldComponent = parentComponent.refs.componentUnderTest.refs.field.props;

        expect(propsToFieldComponent.fieldConfig).to.equal(fieldConfig);
        expect(propsToFieldComponent.model).to.equal(model);
    });

    describe('with wrapped inputs', () => {
        let model;

        beforeEach(() => {
            fieldConfig.wrapper = LabelWrapper;
            model = {name: 'Mark'};

            inputFieldComponent = renderInputField({fieldConfig, model});
        });

        it('should render the wrapper component', () => {
            expect(element(inputFieldComponent).element.tagName).to.equal('DIV');
            expect(element(inputFieldComponent).hasClass('d2-input')).to.be.true;
        });

        it('should set up a ref for the wrapper component', () => {
            expect(inputFieldComponent.refs.wrapper).not.to.be.undefined;
        });

        it('should pass fieldConfig and model props to the wrapper', () => {
            expect(inputFieldComponent.refs.wrapper.props.fieldConfig).to.equal(fieldConfig);
            expect(inputFieldComponent.refs.wrapper.props.model).to.equal(model);
        });

        it('should set up a ref on the field', () => {
            expect(inputFieldComponent.refs.field).not.to.be.undefined;
        });
    });

    describe('validation', () => {
        function createComponent(fc, model) {
            return renderInputField({fieldConfig: fc, model});
        }

        beforeEach(() => {
            inputFieldComponent = createComponent({type: Input, templateOptions: {}}, {});
        });

        it('should return true when nothing was set', () => {
            expect(inputFieldComponent.isValid()).to.be.true;
        });

        it('should return false if there is not value when it is required', () => {
            inputFieldComponent = createComponent({type: Input, templateOptions: {required: true}}, {});

            expect(inputFieldComponent.isValid()).to.be.false;
        });

        it('should return true if the value is there when the field is required', () => {
            inputFieldComponent = createComponent({key: 'name', type: Input, templateOptions: {required: true}}, {name: 'Mark'});

            expect(inputFieldComponent.isValid()).to.be.true;
        });

        it('should run the custom validator', () => {
            const myValidator = stub().returns(true);
            fieldConfig = {
                key: 'name',
                type: Input,
                templateOptions: {
                    required: true,
                },
                validators: {
                    myValidator: myValidator,
                },
            };

            inputFieldComponent = createComponent(fieldConfig, {name: 'Mark'});

            inputFieldComponent.isValid();

            expect(myValidator).to.be.called;
        });

        it('should log a warning if there was no validator object found', () => {
            spy(log, 'debug');

            inputFieldComponent = createComponent({type: Input, templateOptions: {}}, {});

            inputFieldComponent.isValid();

            expect(log.debug).to.be.called;
        });

        it('should have set the validation state', () => {
            const myValidator = stub().returns(false);

            fieldConfig = {
                key: 'name',
                type: Input,
                templateOptions: {
                    required: true,
                },
                validators: {
                    myValidator: myValidator,
                },
            };

            inputFieldComponent = createComponent(fieldConfig, {name: ''});

            inputFieldComponent.isValid();

            expect(inputFieldComponent.state.validation.isValid).to.be.false;
            expect(inputFieldComponent.state.validation.validationClasses).to.include('invalid');
            expect(inputFieldComponent.state.validation.validationClasses).to.include('invalid-myValidator');
            expect(inputFieldComponent.state.validation.validationClasses).to.include('invalid-required');
        });

        it('should have added the classes to the wrapper', () => {
            fieldConfig = {
                key: 'name',
                wrapper: LabelWrapper,
                type: Input,
                templateOptions: {
                    required: true,
                },
                validators: {},
            };

            inputFieldComponent = createComponent(fieldConfig, {name: ''});

            expect(inputFieldComponent.refs.wrapper.props.validationClasses).to.deep.equal(['invalid-required', 'invalid']);
            expect(inputFieldComponent.refs.field.props.validationClasses).to.deep.equal(['invalid-required', 'invalid']);
        });

        it('should have added the classes to the field without wrapper', () => {
            fieldConfig = {
                key: 'name',
                type: Input,
                templateOptions: {
                    required: true,
                },
                validators: {},
            };

            inputFieldComponent = createComponent(fieldConfig, {name: ''});

            expect(inputFieldComponent.refs.field.props.validationClasses).to.deep.equal(['invalid-required', 'invalid']);
        });

        it('should pass runValidation to the field as contentUpdated', () => {
            fieldConfig = {
                key: 'name',
                type: Input,
                templateOptions: {
                    required: true,
                },
                validators: {},
            };

            inputFieldComponent = createComponent(fieldConfig, {name: ''});

            expect(inputFieldComponent.refs.field.props.contentUpdated).to.equal(inputFieldComponent.runValidation);
        });
    });
});
