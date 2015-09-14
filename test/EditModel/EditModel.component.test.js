import React from 'react/addons';
import {element} from 'd2-testutils';
import EditModel from '../../src/EditModel/EditModel.component';

const TestUtils = React.addons.TestUtils;

describe('EditModel component', () => {
    let editModelComponent;

    beforeEach(() => {
        editModelComponent = TestUtils.renderIntoDocument(
            <EditModel />
        );
    });

    it('should have the component name as a class', () => {
        expect(element(editModelComponent.getDOMNode()).hasClass('edit-model')).to.be.true;
    });
});
