import React from 'react/addons';
import {element} from 'd2-testutils';
import HeaderBar from '../../src/HeaderBar/HeaderBar.component';

const TestUtils = React.addons.TestUtils;

describe('HeaderBar component', () => {
    let headerBarComponent;

    beforeEach(() => {
        headerBarComponent = TestUtils.renderIntoDocument(
            <HeaderBar />
        );
    });

    it('should have the component name as a class', () => {
        expect(element(headerBarComponent.getDOMNode()).hasClass('header-bar')).to.be.true;
    });
});
