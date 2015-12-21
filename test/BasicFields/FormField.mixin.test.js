import React from 'react/addons';
import FormFieldMixin from '../src/FormField.mixin.js';

const TestUtils = React.addons.TestUtils;

describe('FormFieldMixin', () => {
    let FormField; // eslint-disable-line no-unused-vars
    let formFieldComponent;

    beforeEach(() => {
        FormField = React.createClass({
            mixins: [FormFieldMixin],

            render() {
                return <input {...this.formFieldHandlers} />;
            },
        });

        formFieldComponent = TestUtils.renderIntoDocument(
            <FormField />
        );
    });

    it('should set the fieldConfig as a default prop', () => {
        expect(formFieldComponent.props.fieldConfig).to.deep.equal({templateOptions: {}, validators: {}});
    });

    describe('hasContent()', () => {
        let fieldConfig;
        let model;

        beforeEach(() => {
            fieldConfig = {key: 'name'};
            model = {name: 'Mark'};

            formFieldComponent = TestUtils.renderIntoDocument(<FormField fieldConfig={fieldConfig} model={model} />);
        });


        it('should return true if the model has a a value', () => {
            expect(formFieldComponent.hasContent()).to.be.true;
        });

        it('should return false if there is no value', () => {
            formFieldComponent = TestUtils.renderIntoDocument(<FormField fieldConfig={{key: 'shortName'}} model={model} />);

            expect(formFieldComponent.hasContent()).to.be.false;
        });
    });

    describe('handleFocus()', () => {
        it('should have an initial focus of false', () => {
            expect(formFieldComponent.state.hasFocus).to.be.false;
        });

        it('should set the hasFocus property on the state', () => {
            TestUtils.Simulate.focus(React.findDOMNode(formFieldComponent));

            expect(formFieldComponent.state.hasFocus).to.be.true;
        });
    });

    describe('handleBlur()', () => {
        beforeEach(() => {
            TestUtils.Simulate.focus(React.findDOMNode(formFieldComponent));
        });

        it('should set hasFocus to false', () => {
            TestUtils.Simulate.blur(React.findDOMNode(formFieldComponent));

            expect(formFieldComponent.state.hasFocus).to.be.false;
        });
    });

    describe('handleChange()', () => {
        let fieldConfig;
        let model;
        let context;

        beforeEach(() => {
            fieldConfig = {key: 'name'};
            model = {};

            context = {
                updateForm: function updateForm(name, newVal) {
                    model[name] = newVal;
                },
            };

            spy(context, 'updateForm');

            React.withContext(context, function withContextCallback() {
                formFieldComponent = TestUtils.renderIntoDocument(<FormField fieldConfig={fieldConfig} model={model} />);
            });
        });

        it('should call the contentUpdated handler with the fieldName and the new and old value', () => {
            formFieldComponent.handleChange({target: {value: 'Lars'}});

            expect(context.updateForm).to.be.calledWith('name', 'Lars', undefined);
        });

        it('should make hasContent return true if a value has been supplied', () => {
            expect(formFieldComponent.hasContent()).to.be.false;

            formFieldComponent.handleChange({target: {value: 'Lars'}});

            expect(formFieldComponent.hasContent()).to.be.true;
        });

        it('should make hasContent return false when a value was removed', () => {
            formFieldComponent.handleChange({target: {value: ''}});

            expect(formFieldComponent.hasContent()).to.be.false;
        });
    });

    describe('event handler callbacks', () => {
        let whenFocusReceived;
        let whenFocusLost;
        let contentUpdated;

        beforeEach(() => {
            whenFocusReceived = spy();
            whenFocusLost = spy();
            contentUpdated = spy();

            formFieldComponent = TestUtils.renderIntoDocument(
                <FormField whenFocusReceived={whenFocusReceived}
                           whenFocusLost={whenFocusLost}
                           contentUpdated={contentUpdated} />
            );
        });

        it('should call the provided method when focus is received', () => {
            TestUtils.Simulate.focus(React.findDOMNode(formFieldComponent));

            expect(whenFocusReceived).to.be.called;
        });

        it('should call the provided method when blur is received', () => {
            TestUtils.Simulate.focus(React.findDOMNode(formFieldComponent));
            TestUtils.Simulate.blur(React.findDOMNode(formFieldComponent));

            expect(whenFocusLost).to.be.called;
        });

        it('should call the provided method when content is updated', () => {
            formFieldComponent.handleChange({target: {value: 'Lars'}});

            expect(contentUpdated).to.be.called;
        });

        it('should pass the component to the callback', (done) => {
            const fieldConfig = {key: 'name'};
            const model = {name: 'Mark'};

            function callback(hasContent, value) {
                setTimeout(function timeoutCallback() {
                    expect(hasContent).to.equal(true);
                    expect(value).to.equal('Lars');
                    done();
                }, 10);
            }

            formFieldComponent = TestUtils.renderIntoDocument(
                <FormField fieldConfig={fieldConfig} model={model} contentUpdated={callback} />
            );

            formFieldComponent.handleChange({target: {value: 'Lars'}});
        });

        it('should call `props.updateForm` after change when it is available', (done) => {
            React.withContext({updateForm: done}, () => {
                formFieldComponent = TestUtils.renderIntoDocument(
                    <FormField />
                );

                formFieldComponent.handleChange({target: {value: 'Lars'}});
            });
        });
    });
});
