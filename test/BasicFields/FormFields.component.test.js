import React from 'react/addons';
import {element} from 'd2-testutils';

import FormFields from '../src/FormFields.component';

const TestUtils = React.addons.TestUtils;

describe('FormFields component', () => {
    let formFieldsComponent;

    it('should have the component name as a class', () => {
        formFieldsComponent = TestUtils.renderIntoDocument(<FormFields />);

        expect(element(formFieldsComponent).hasClass('d2-form-fields')).to.be.true;
    });

    it('should add the class that is passed as className', () => {
        formFieldsComponent = TestUtils.renderIntoDocument(<FormFields className="d2-form-header-fields" />);

        expect(element(formFieldsComponent).hasClass('d2-form-header-fields')).to.be.true;
    });

    it('should render the passed children', () => {
        formFieldsComponent = TestUtils.renderIntoDocument(
            <FormFields className="d2-form-header-fields">
                <input />
                <input />
            </FormFields>
        );

        expect(element(formFieldsComponent).element.querySelectorAll('input').length).to.equal(2);
    });

    it('should call grab the updateForm function from the context', (done) => {
        const updateForm = spy();

        React.withContext({updateForm: updateForm}, () => {
            formFieldsComponent = TestUtils.renderIntoDocument(
                <FormFields className="d2-form-header-fields">
                    <input />
                </FormFields>
            );

            expect(formFieldsComponent.context.updateForm).to.equal(updateForm);
            done();
        });
    });
});
