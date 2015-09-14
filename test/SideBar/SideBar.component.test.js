import React from 'react/addons';
import {element} from 'd2-testutils';
import SideBar from '../../src/SideBar/SideBar.component';

const TestUtils = React.addons.TestUtils;

describe('SideBar component', () => {
    let sideBarComponent;

    beforeEach(() => {
        sideBarComponent = TestUtils.renderIntoDocument(
            <SideBar />
        );
    });

    it('should have the component name as a class', () => {
        expect(element(sideBarComponent.getDOMNode()).hasClass('side-bar')).to.be.true;
    });
});
