import React from 'react/addons';
import {element} from 'd2-testutils';
import injectTheme from './config/inject-theme';
import FormForModel from '../src/FormForModel.component';

const TestUtils = React.addons.TestUtils;

describe('FormForModel component', () => {
    let formForModelComponent;
    let d2Mock;
    let modelMock;

    beforeEach(() => {
        modelMock = {modelDefinition: {modelValidations: fixtures.get('modelValidations')}};
        d2Mock = {
            models: {
                optionSet: {
                    list: () => new Promise(() => {}),
                },
                legendSet: {
                    list: () => new Promise(() => {}),
                },
                categoryCombo: {
                    list: () => new Promise(() => {}),
                },
            },
        };

        const ComponentToRender = injectTheme(FormForModel);
        const renderedComponents = TestUtils.renderIntoDocument(<ComponentToRender d2={d2Mock} model={modelMock} />);

        formForModelComponent = TestUtils.findRenderedComponentWithType(renderedComponents, FormForModel);
    });

    it('should have the component name as a class', () => {
        expect(element(formForModelComponent.getDOMNode()).hasClass('form-for-model')).to.be.true;
    });
});
