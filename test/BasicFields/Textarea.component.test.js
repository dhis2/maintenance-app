import React from 'react/addons';
import {element} from 'd2-testutils';
import TextareaWithoutContent from '../src/Textarea.component';
import injectTheme from './config/inject-theme';

const {
    scryRenderedDOMComponentsWithTag,
    findRenderedComponentWithType,
    renderIntoDocument,
} = React.addons.TestUtils;

describe('Textarea component', () => {
    let textareaComponent;
    let Textarea;

    beforeEach(() => {
        const fieldConfig = {
            key: 'description',
            templateOptions: {
                label: 'description',
            },
        };

        Textarea = injectTheme(TextareaWithoutContent);

        textareaComponent = renderIntoDocument(<Textarea formName={'user-form'} model={{description: 'Description rendered in a textarea...'}} fieldConfig={fieldConfig} validationClasses="validate" />);
        textareaComponent = findRenderedComponentWithType(textareaComponent, TextareaWithoutContent);
    });

    it('should have the component name as a class', () => {
        expect(element(React.findDOMNode(textareaComponent)).hasClass('textarea')).to.be.true;
    });

    it('should render a textarea element', () => {
        expect(element(React.findDOMNode(textareaComponent)).element.tagName).to.equal('DIV');
    });

    // TODO: Check why it renders two textarea boxes
    it('should render the value into the textarea', () => {
        const textArea = React.findDOMNode(scryRenderedDOMComponentsWithTag(textareaComponent, 'textarea')[1]);

        expect(textArea.textContent).to.equal('Description rendered in a textarea...');
    });

    it('should render the id to be the key', () => {
        const textArea = React.findDOMNode(scryRenderedDOMComponentsWithTag(textareaComponent, 'textarea')[1]);

        expect(element(textArea).attr('id')).to.equal('user-form__description');
    });

    it('should render the validate class on the textarea', () => {
        expect(element(textareaComponent).hasClass('validate')).to.be.true;
    });

    it('should render the translated label', () => {
        expect(element(textareaComponent, 'label').element.textContent).to.equal('description_translated');
    });
});
