import React from 'react/addons';
import {element} from 'd2-testutils';
import List from '../../src/List/List.component';

const TestUtils = React.addons.TestUtils;

describe('List component', () => {
    let listComponent;

    beforeEach(() => {
        listComponent = TestUtils.renderIntoDocument(
            <List />
        );
    });

    it('should have the component name as a class', () => {
        expect(element(listComponent.getDOMNode()).hasClass('list')).to.be.true;
    });
});
