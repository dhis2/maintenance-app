import React from 'react/addons';
import {element} from 'd2-testutils';
import CheckBoxWithoutContext from '../src/CheckBox.component';
import injectTheme from './config/inject-theme';

const TestUtils = React.addons.TestUtils;

describe('CheckBox component', () => {
    let checkBoxComponent;
    let model;

    beforeEach(() => {
        const fieldConfig = {
            key: 'isZeroSignificant',
            templateOptions: {
                label: `is_zero_significant`,
            },
        };

        model = {
            isZeroSignificant: true,
        };

        const CheckBox = injectTheme(CheckBoxWithoutContext);

        checkBoxComponent = TestUtils.renderIntoDocument(<CheckBox fieldConfig={fieldConfig} model={model}/>);
        checkBoxComponent = TestUtils.findRenderedComponentWithType(checkBoxComponent, CheckBoxWithoutContext);
    });

    it('should have the component name as a class', () => {
        expect(element(checkBoxComponent).hasClass('check-box')).to.be.true;
    });

    it('should set the checked value on the checkbox', () => {
        expect(element(checkBoxComponent, 'input').element.checked).to.equal(true);
    });

    it('should set the checked value on the checkbox to false when clicked', () => {
        TestUtils.Simulate.click(element(checkBoxComponent, 'input').element);

        expect(model.isZeroSignificant).to.equal(false);
    });

    it('should set the checked value on the checkbox to true when clicked twice', () => {
        TestUtils.Simulate.click(element(checkBoxComponent, 'input').element);

        expect(model.isZeroSignificant).to.equal(false);

        TestUtils.Simulate.click(element(checkBoxComponent, 'input').element);

        expect(model.isZeroSignificant).to.equal(true);
    });

    it('should run the label through the translation', () => {
        expect(element(checkBoxComponent, 'label').element.textContent).to.equal('is_zero_significant_translated');
    });
});
