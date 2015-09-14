import React from 'react/addons';
import {element} from 'd2-testutils';
import App from '../../src/App/App.component';

const TestUtils = React.addons.TestUtils;

describe('App component', () => {
    let appComponent;

    beforeEach(() => {
        appComponent = TestUtils.renderIntoDocument(
            <App />
        );
    });

    it('should have the component name as a class', () => {
        expect(element(appComponent.getDOMNode()).hasClass('app')).to.be.true;
    });
});
