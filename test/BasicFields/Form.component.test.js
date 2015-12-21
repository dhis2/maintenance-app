import React from 'react/addons';
import {element} from 'd2-testutils';

/* eslint-disable no-unused-vars */
import Form from '../src/Form.component';
import FormFieldMixin from '../src/FormField.mixin.js';

const Input = React.createClass({
    mixins: [FormFieldMixin],
    render() {
        return <input {...this.props} {...this.formFieldHandlers} />;
    },
});
/* eslint-enable no-unused-vars */

const TestUtils = React.addons.TestUtils;

describe('Form component', () => {
    let formComponent;

    beforeEach(() => {
        formComponent = TestUtils.renderIntoDocument(
            <Form name="myUserForm" />
        );
    });

    it('should have the component name as a class', () => {
        expect(element(formComponent).hasClass('d2-form')).to.be.true;
    });

    it('should render a form tag', () => {
        expect(element(formComponent).element.tagName).to.equal('FORM');
    });

    it('should render the name property as a dom attribute', () => {
        expect(element(formComponent).attr('name')).to.equal('myUserForm');
    });

    it('should not fail on `undefined` children', () => {
        function renderForm() {
            TestUtils.renderIntoDocument(
                <Form name="myUserForm">
                    <div></div>
                    {null}
                </Form>
            );
        }

        expect(() => renderForm()).not.to.throw();
    });
});
