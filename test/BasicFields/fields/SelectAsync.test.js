import Field from '../../src/fields/Field';
import SelectBoxAsync from '../../src/fields/SelectBoxAsync';

import Select from '../../src/Select.component';

describe('SelectBoxAsync', () => {
    let selectField;
    let fieldOptions;

    it('should inherit from Field', () => {
        expect(new SelectBoxAsync({fieldName: 'optionSet'})).to.be.instanceof(Field);
    });

    describe('new SelectBoxAsync()', () => {
        beforeEach(() => {
            fieldOptions = fixtures.get('modelValidations').optionSet;
            fieldOptions.fieldName = 'optionSet';
            fieldOptions.referenceType = 'optionSet';

            selectField = new SelectBoxAsync(fieldOptions);
        });

        it('should have the correct type', () => {
            expect(selectField.type).to.equal(Select);
        });

        it('should have an options array', () => {
            expect(selectField.templateOptions.options).to.be.instanceof(Array);
        });

        it('should have set the loading flag to true', () => {
            expect(selectField.data.loading).to.equal(true);
        });
    });

    describe('after loading the values from the source', () => {
        let respondSource;
        let failSource;

        beforeEach(() => {
            fieldOptions.source = new Promise((resolve, reject) => {
                respondSource = resolve;
                failSource = reject;
            });

            selectField = new SelectBoxAsync(fieldOptions);
        });

        it('should set the options that are returned onto onto the templateOptions.options', (done) => {
            respondSource([
                {name: 'int', value: 'int'},
                {name: 'text', value: 'text'},
                {name: 'string', value: 'string'},
            ]);

            selectField.data.sourcePromise
                .then(() => {
                    expect(selectField.templateOptions.options).to.deep.equal([
                        {name: 'int', value: 'int'},
                        {name: 'text', value: 'text'},
                        {name: 'string', value: 'string'},
                    ]);
                })
                .then(done);
        });

        it('should reject with an error when the options can not be loaded', (done) => {
            failSource();

            selectField.data.sourcePromise
                .catch(error => {
                    expect(error.message).to.equal('Unable to load values for: optionSet Error:undefined');
                })
                .then(done);
        });
    });
});
