import React from 'react/addons';
import {element} from 'd2-testutils';
import MainContent from '../../src/MainContent/MainContent.component';

const TestUtils = React.addons.TestUtils;

describe('MainContent component', () => {
    let mainContentComponent;

    beforeEach(() => {
        mainContentComponent = TestUtils.renderIntoDocument(
            <MainContent />
        );
    });

    it('should have the component name as a class', () => {
        expect(element(mainContentComponent.getDOMNode()).hasClass('main-content')).to.be.true;
    });
});
