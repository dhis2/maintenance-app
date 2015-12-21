import Field from '../../src/fields/Field';
import SelectBox from '../../src/fields/SelectBox';

import Select from '../../src/Select.component';

describe('SelectBox', () => {
    let selectField;
    let fieldOptions;

    it('should inherit from Field', () => {
        expect(new SelectBox({fieldName: 'dimensionType'})).to.be.instanceof(Field);
    });

    describe('new SelectBox()', () => {
        beforeEach(() => {
            fieldOptions = fixtures.get('modelValidations').dimensionType;
            fieldOptions.fieldName = 'dimensionType';

            selectField = new SelectBox(fieldOptions);
        });

        it('should have the correct type', () => {
            expect(selectField.type).to.equal(Select);
        });

        it('should have an options array', () => {
            expect(selectField.templateOptions.options).to.be.instanceof(Array);
        });

        it('should set the constants from the fieldOptions as the options property', () => {
            expect(selectField.templateOptions.options[0]).to.deep.equal({name: 'INDICATOR', value: 'INDICATOR'});
        });

        it('should set an empty array if the constants array does not exist', () => {
            delete fieldOptions.constants;
            selectField = new SelectBox(fieldOptions);

            expect(selectField.templateOptions.options).to.deep.equal([]);
        });
    });
});
