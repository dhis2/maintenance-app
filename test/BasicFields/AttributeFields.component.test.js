import React from 'react/addons';
import {element} from 'd2-testutils';
import AttributeFields from '../src/AttributeFields.component';

const TestUtils = React.addons.TestUtils;

describe('AttributeFields component', () => {
    let attributeFieldsComponent;

    beforeEach(() => {
        attributeFieldsComponent = TestUtils.renderIntoDocument(
            <AttributeFields />
        );
    });

    it('should have the component name as a class', () => {
        expect(element(attributeFieldsComponent));
    });
});
