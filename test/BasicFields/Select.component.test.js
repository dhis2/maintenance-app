import React from 'react/addons';
import {element} from 'd2-testutils';

/* eslint-disable no-unused-vars */
import Select from '../src/Select.component';
/* eslint-enable no-unused-vars */

const TestUtils = React.addons.TestUtils;

describe('Select component', () => {
    let selectComponent;

    beforeEach(() => {
        selectComponent = TestUtils.renderIntoDocument(
            <Select />
        );
    });

    it('should have the component name as a class', () => {
        expect(element(selectComponent.getDOMNode()).hasClass('d2-select')).to.be.true;
    });

    it('should have set the select type to handle object values', () => {
        const model = {
            optionSet: {name: 'OptionSet 1', id: '1'},
        };
        const fieldConfig = {
            key: 'optionSet',
            templateOptions: {
                options: [
                    {name: 'OptionSet 1', id: '1'},
                    {name: 'OptionSet 2', id: '2'},
                ],
            },
        };
        selectComponent = TestUtils.renderIntoDocument(
            <Select fieldConfig={fieldConfig} model={model} />
        );

        expect(selectComponent.state.isObjectValue).to.be.true;
    });

    it('should call the handleChange method when the input is changed', () => {
        const model = {
            optionSet: {name: 'OptionSet 1', id: '1'},
        };
        const fieldConfig = {
            key: 'optionSet',
            templateOptions: {
                options: [
                    {name: 'OptionSet 1', id: '1'},
                    {name: 'OptionSet 2', id: '2'},
                ],
            },
        };
        selectComponent = TestUtils.renderIntoDocument(
            <Select fieldConfig={fieldConfig} model={model} />
        );
        spy(selectComponent, 'handleChange');

        selectComponent.refs.reactSelect.props.onChange();

        expect(selectComponent.handleChange).to.be.called;
    });

    it('should call the handleChange method with the object if the options are objects with ids', () => {
        const model = {
            optionSet: {name: 'OptionSet 1', id: '1'},
        };
        const fieldConfig = {
            key: 'optionSet',
            templateOptions: {
                options: [
                    {name: 'OptionSet 1', id: '1'},
                    {name: 'OptionSet 2', id: '2'},
                ],
            },
        };
        selectComponent = TestUtils.renderIntoDocument(
            <Select fieldConfig={fieldConfig} model={model} />
        );
        spy(selectComponent, 'handleChange');

        selectComponent.refs.reactSelect.props.onChange('2');

        expect(selectComponent.handleChange).to.be.calledWith({target: {value: {name: 'OptionSet 2', id: '2'}}});
    });

    it('should pass clearable=false to ReactSelect if templateOptions.required=true', () => {
        const model = {
            optionSet: {name: 'OptionSet 1', id: '1'},
        };
        const fieldConfig = {
            key: 'optionSet',
            templateOptions: {
                options: [
                    {name: 'OptionSet 1', id: '1'},
                    {name: 'OptionSet 2', id: '2'},
                ],
                required: true,
            },
        };
        selectComponent = TestUtils.renderIntoDocument(
            <Select fieldConfig={fieldConfig} model={model} />
        );

        expect(selectComponent.refs.reactSelect.props.clearable).to.be.false;
    });

    it('should load options when they are strings', () => {
        const model = {};
        const fieldConfig = {
            key: 'options',
            templateOptions: {
                options: ['Option 1', 'Option 2'],
            },
        };
        selectComponent = TestUtils.renderIntoDocument(
            <Select fieldConfig={fieldConfig} model={model} />
        );
        spy(selectComponent, 'handleChange');

        selectComponent.refs.reactSelect.props.onChange('Option 2');

        expect(selectComponent.handleChange).to.be.calledWith({target: {value: 'Option 2'}});
    });

    it('should set the loading state to false after async load completes', (done) => {
        const model = {};
        const fieldConfig = {
            key: 'options',
            data: {
                sourcePromise: new Promise((resolve) => { setTimeout(resolve([])); }),
                loading: true,
            },
            templateOptions: {
                options: [],
            },
        };
        selectComponent = TestUtils.renderIntoDocument(
            <Select fieldConfig={fieldConfig} model={model} />
        );

        expect(selectComponent.state.isLoading).to.be.true;

        setTimeout(() => {
            expect(selectComponent.state.isLoading).to.be.false;
            done();
        }, 10);
    });

    it('should call the updateCurrentValue value after async load to add the options to the render', (done) => {
        const model = {};
        const fieldConfig = {
            key: 'options',
            data: {
                sourcePromise: new Promise((resolve) => { setTimeout(resolve([])); }),
                loading: true,
            },
            templateOptions: {
                options: [],
            },
        };
        selectComponent = TestUtils.renderIntoDocument(
            <Select fieldConfig={fieldConfig} model={model} />
        );

        spy(selectComponent, 'updateCurrentValue');

        expect(selectComponent.updateCurrentValue).not.to.be.called;

        setTimeout(() => {
            expect(selectComponent.updateCurrentValue).to.be.called;
            done();
        }, 10);
    });

    it('should pass correctly pass the object to the change method', () => {
        const model = {
            optionSet: {name: 'OptionSet 1', id: '1'},
        };
        const fieldConfig = {
            key: 'optionSet',
            templateOptions: {
                options: [
                    {name: 'OptionSet 1', id: '1'},
                    {name: 'OptionSet 2', id: '2'},
                ],
                required: true,
            },
        };
        selectComponent = TestUtils.renderIntoDocument(
            <Select fieldConfig={fieldConfig} model={model} />
        );
        spy(selectComponent, 'handleChange');

        selectComponent.refs.reactSelect.props.onChange('1');

        expect(selectComponent.handleChange).to.be.calledWith({target: {value: {name: 'OptionSet 1', id: '1'}}});
    });

    it('should transform the value before it it send to the formUpdate', () => {
        const model = {};
        const fieldConfig = {
            key: 'options',
            templateOptions: {
                options: [
                    {
                        id: 'a3423423422',
                        name: 'Option 1',
                    }, {
                        id: 'b3423423422',
                        name: 'Option 2',
                    },
                ],
            },
            toModelTransformer: valueOnModel => {
                return valueOnModel.name;
            },
        };
        selectComponent = TestUtils.renderIntoDocument(
            <Select fieldConfig={fieldConfig} model={model} />
        );
        spy(selectComponent, 'handleChange');

        selectComponent.refs.reactSelect.props.onChange('b3423423422');

        expect(selectComponent.handleChange).to.be.calledWith({target: {value: 'Option 2'}});
    });

    it('should transform the value from the model before using it', () => {
        const model = {
            attributes: {
                name: 'Low',
            },
        };
        const fieldConfig = {
            key: 'attributes.name',
            templateOptions: {
                options: [
                    {
                        id: 'a3423423422',
                        name: 'Low',
                        code: 'Low',
                    }, {
                        id: 'b3423423422',
                        name: 'Option 2',
                        code: 'Option 2',
                    },
                ],
            },
            fromModelTransformer: function transformAttribute(valueOnModel) {
                return this.templateOptions.options.reduce((result, option) => {
                    if (!result && option.code === valueOnModel.attributes.name) {
                        return option;
                    }
                    return result;
                }, undefined);
            },
        };

        fieldConfig.fromModelTransformer = fieldConfig.fromModelTransformer.bind(fieldConfig);

        selectComponent = TestUtils.renderIntoDocument(
            <Select fieldConfig={fieldConfig} model={model} />
        );

        expect(selectComponent.reactSelectProps.value).to.deep.equal({label: 'Low', value: 'a3423423422'});
    });
});
