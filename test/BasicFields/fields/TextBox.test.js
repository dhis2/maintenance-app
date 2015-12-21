import TextBox from '../../src/fields/TextBox';
import Textarea from '../../src/Textarea.component';

describe('TextBox', () => {
    let textField;
    let fieldOptions;

    beforeEach(() => {
        fieldOptions = {fieldName: 'firstName'};
    });

    describe('create method', () => {
        it('should return an instance of Field', () => {
            expect(TextBox.create(fieldOptions)).to.be.instanceof(TextBox);
        });
    });

    describe('new TextBox()', () => {
        beforeEach(() => {
            fieldOptions = fixtures.get('modelValidations').dimensionType;
            fieldOptions.fieldName = 'dimensionType';

            textField = new TextBox(fieldOptions);
        });

        it('should have the correct component', () => {
            expect(textField.type).to.equal(Textarea);
        });

        it('should not set the wrapper to LabelWrapper', () => {
            expect(textField.wrapper).to.equal(undefined);
        });
    });
});
