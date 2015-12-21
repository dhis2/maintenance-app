import Field from '../../src/fields/Field';
import Input from '../../src/Input.component';

describe('Field', () => {
    let field;
    let fieldOptions;

    beforeEach(() => {
        fieldOptions = {fieldName: 'firstName'};
    });

    describe('create method', () => {
        it('should return an instance of Field', () => {
            expect(Field.create(fieldOptions)).to.be.instanceof(Field);
        });
    });

    describe('new Field()', () => {
        beforeEach(() => {
            field = new Field(fieldOptions);
        });

        it('should throw error when no fieldName is specified', () => {
            expect(() => new Field()).to.throw('fieldName is a required option to supply');
        });

        it('should set the fieldName as a key onto the result object', () => {
            expect(field.key).to.equal('firstName');
        });

        it('should set the default type', () => {
            expect(field.type).to.equal(Input);
        });

        describe('templateOptions', () => {
            it('should be defined on the object', () => {
                expect(field.templateOptions).to.be.instanceof(Object);
            });

            it('should have a label that equals the fieldName transformed by upperCaseToUnderscore', () => {
                expect(field.templateOptions.label).to.equal('first_name');
            });
        });

        describe('properties on options object', () => {
            it('should set hideExpression to be set on the Field instance', () => {
                fieldOptions.hideExpression = () => false;

                expect(Field.create(fieldOptions).hideExpression).to.equal(fieldOptions.hideExpression);
            });

            it('should set some random property onto the Field instance', () => {
                fieldOptions.randomProperty = '!model.name';

                expect(Field.create(fieldOptions).randomProperty).to.equal('!model.name');
            });
        });
    });
});
