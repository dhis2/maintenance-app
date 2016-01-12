import React from 'react/addons';
import {element} from 'd2-testutils';
import dataElementObjectFixture from './dataElementObject.fixture';
import DetailsBox from '../src/DetailsBox.component';
import injectTheme from './inject-theme';

const TestUtils = React.addons.TestUtils;
const findDOMNode = React.findDOMNode;

describe('DetailsBox component', () => {
    let DetailsBoxWithContext;
    let detailsBoxComponent;
    let dataElementObject;

    beforeEach(() => {
        dataElementObject = dataElementObjectFixture();

        DetailsBoxWithContext = injectTheme(DetailsBox);

        detailsBoxComponent = TestUtils.renderIntoDocument(
            <DetailsBoxWithContext showDetailBox={true} />
        );
    });

    it('should have the component name as a class', () => {
        expect(element(detailsBoxComponent.getDOMNode()).hasClass('details-box')).to.be.true;
    });

    it('should render an empty object when showDetailsBox=false', () => {
        detailsBoxComponent = TestUtils.renderIntoDocument(
            <DetailsBoxWithContext showDetailBox={false} />
        );

        expect(findDOMNode(detailsBoxComponent)).to.equal(null);
    });

    it('should render the details box when showDetailBox=true', () => {
        expect(findDOMNode(detailsBoxComponent)).not.to.equal(null);
    });

    it('should display "No source" if the source is not there yet', () => {
        expect(findDOMNode(detailsBoxComponent).querySelector('.detail-box__status').textContent).to.equal('Loading details...');
    });

    describe('default rendered properties', () => {
        beforeEach(() => {
            detailsBoxComponent = TestUtils.renderIntoDocument(
                <DetailsBoxWithContext showDetailBox={true} source={dataElementObject} />
            );
        });

        it('should render name', () => {
            const nameElement = findDOMNode(detailsBoxComponent).querySelector('.detail-field .detail-field__displayName');
            expect(nameElement.textContent).to.equal('BS_COLL (N, DSD) TARGET: Blood Units Donated');
        });

        it('should render code', () => {
            const nameElement = findDOMNode(detailsBoxComponent).querySelector('.detail-field .detail-field__code');
            expect(nameElement.textContent).to.equal('BS_COLL_N_DSD_TARGET7');
        });

        it('should render description', () => {
            const discriptionElement = findDOMNode(detailsBoxComponent).querySelector('.detail-field .detail-field__displayDescription');
            expect(discriptionElement.textContent).to.equal('Target the total number of blood units that were donated in the country National Blood Transfusion Service (NBTS) network.');
        });

        it('should render created', () => {
            const createdElement = findDOMNode(detailsBoxComponent).querySelector('.detail-field .detail-field__created');
            expect(createdElement.textContent).to.equal('2014-12-21T23:15:50.886+0000');
        });

        it('should render lastUpdated', () => {
            const lastUpdatedElement = findDOMNode(detailsBoxComponent).querySelector('.detail-field .detail-field__lastUpdated');

            expect(lastUpdatedElement.textContent).to.equal('2015-09-15T11:03:24.367+0000');
        });

        it('should render id', () => {
            const idElement = findDOMNode(detailsBoxComponent).querySelector('.detail-field .detail-field__id');
            expect(idElement.textContent).to.equal('umC9U5YGDq4');
        });

        it('should render a the detail-field__label class for each of the labels', () => {
            const elements = findDOMNode(detailsBoxComponent).querySelectorAll('.detail-field .detail-field__label');
            expect(elements.length).to.equal(6);
        });

        it('should render a detail-field__value for each of the value fields', () => {
            const elements = findDOMNode(detailsBoxComponent).querySelectorAll('.detail-field .detail-field__value');
            expect(elements.length).to.equal(6);
        });
    });

    describe('specified fields', () => {
        beforeEach(() => {
            detailsBoxComponent = TestUtils.renderIntoDocument(
                <DetailsBoxWithContext showDetailBox={true} source={dataElementObject} fields={['name', 'domainType', 'dataSets']} />
            );
        });

        it('should have rendered three fields', () => {
            const detailElements = findDOMNode(detailsBoxComponent).querySelectorAll('.detail-field ');
            expect(detailElements.length).to.equal(3);
        });
    });

    describe('rendering values', () => {
        beforeEach(() => {
            detailsBoxComponent = TestUtils.renderIntoDocument(
                <DetailsBoxWithContext showDetailBox={true} source={dataElementObject} fields={['created', 'dataSets']} />
            );
        });

        it('should render an array of objects as a string of names', () => {
            const dataSetNameElements = findDOMNode(detailsBoxComponent).querySelectorAll('.detail-field .detail-field__dataSets ul li');

            expect(dataSetNameElements.length).to.equal(5);
            expect(dataSetNameElements[0].textContent).to.equal('MER Targets: Facility Based - DoD ONLY');
            expect(dataSetNameElements[4].textContent).to.equal('MER Targets: Facility Based');
        });

        it('should render the displayName when it is available', () => {
            dataElementObject.dataSets[0].displayName = 'MER Targets: Facility Based - DoD ONLY: Translated';

            detailsBoxComponent = TestUtils.renderIntoDocument(
                <DetailsBoxWithContext showDetailBox={true} source={dataElementObject} fields={['created', 'dataSets']} />
            );

            const dataSetNameElements = findDOMNode(detailsBoxComponent).querySelectorAll('.detail-field .detail-field__dataSets ul li');
            expect(dataSetNameElements.length).to.equal(5);
            expect(dataSetNameElements[0].textContent).to.equal('MER Targets: Facility Based - DoD ONLY: Translated');
        });

        it('should render the stringified date', () => {
            dataElementObject.created = '2015-09-15';

            detailsBoxComponent = TestUtils.renderIntoDocument(
                <DetailsBoxWithContext showDetailBox={true} source={dataElementObject} fields={['created', 'dataSets']} />
            );
            const createdElement = findDOMNode(detailsBoxComponent).querySelector('.detail-field .detail-field__created');

            expect(createdElement.textContent).to.equal('Tue Sep 15 2015 02:00:00 GMT+0200 (CEST)');
        });

        it('should render a label for each of the values', () => {
            const createdElementLabel = findDOMNode(detailsBoxComponent).querySelector('.detail-field .detail-field__created-label');

            expect(createdElementLabel.textContent).to.equal('created');
        });
    });

    describe('onClose prop', () => {
        let closeButtonCallback;

        beforeEach(() => {
            closeButtonCallback = spy();

            detailsBoxComponent = TestUtils.renderIntoDocument(
                <DetailsBoxWithContext showDetailBox={true} source={dataElementObject} onClose={closeButtonCallback} />
            );
        });

        it('should display the close icon', () => {
            const closeButtonElement = findDOMNode(detailsBoxComponent).querySelector('.details-box__close-button.material-icons');

            expect(closeButtonElement.textContent).to.equal('close');
        });

        it('should just render one close button', () => {
            const closeButtonElement = findDOMNode(detailsBoxComponent).querySelectorAll('.details-box__close-button.material-icons');

            expect(closeButtonElement.length).to.equal(1);
        });

        it('should be called when the close button was called', () => {
            const closeButtonElement = findDOMNode(detailsBoxComponent).querySelector('.details-box__close-button');
            TestUtils.Simulate.click(closeButtonElement);

            expect(closeButtonCallback).to.be.called;
        });
    });
});
