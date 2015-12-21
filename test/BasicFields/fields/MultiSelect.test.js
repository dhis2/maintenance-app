import Field from '../../src/fields/Field';
import MultiSelect from '../../src/fields/MultiSelectBox';

import MultiSelectComponent from '../../src/MultiSelect.component';

describe('MultiSelect', () => {
    let selectField;
    let fieldOptions;

    it('should inherit from Field', () => {
        expect(new MultiSelect({fieldName: 'aggregationLevels'})).to.be.instanceof(Field);
    });

    describe('new MultiSelect()', () => {
        beforeEach(() => {
            fieldOptions = fixtures.get('modelValidations').aggregationLevels;
            fieldOptions.fieldName = 'aggregationLevels';

            selectField = new MultiSelect(fieldOptions);
        });

        it('should have the correct type', () => {
            expect(selectField.type).to.equal(MultiSelectComponent);
        });
    });
});
