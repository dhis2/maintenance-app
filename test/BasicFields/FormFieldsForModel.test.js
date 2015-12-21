import FormFieldsForModel from '../src/FormFieldsForModel';

import {SELECT} from '../src/fields/index';
import InputBox from '../src/fields/InputBox';
import SelectBox from '../src/fields/SelectBox';
import MultiSelect from '../src/MultiSelect.component';

describe('FormFieldsForModel', () => {
    const FIELDS_TO_IGNORE_ON_DISPLAY = ['id', 'publicAccess', 'created', 'lastUpdated', 'user', 'userGroupAccesses'];
    let modelMock;
    let service;
    let modelsMock;

    beforeEach(() => {
        const modelDefinition = {
            list: sinon.stub().returns(new Promise((resolve) => {
                resolve([]);
            })),
        };
        modelsMock = {
            optionSet: modelDefinition,
            legendSet: modelDefinition,
            categoryCombo: modelDefinition,
            user: modelDefinition,
        };
        modelMock = {
            modelDefinition: {
                modelValidations: fixtures.get('modelValidations'),
            },
        };

        service = new FormFieldsForModel(modelsMock, FIELDS_TO_IGNORE_ON_DISPLAY);
    });

    it('should have a getFormFieldsForModel method', () => {
        expect(service.getFormFieldsForModel).to.be.instanceof(Function);
    });

    it('should return an array of formly fields', () => {
        expect(service.getFormFieldsForModel(modelMock)).to.be.instanceof(Array);
    });

    it('should throw an error when the modelValidations object is not available', () => {
        expect(() => service.getFormFieldsForModel()).to.throw('Passed model does not seem to adhere to ' +
            'the d2 model structure (model.modelDefinition.modelValidations is not available)');
    });

    it('should return the correct amount of fields', () => {
        expect(service.getFormFieldsForModel(modelMock).length).to.equal(18);
    });

    it('should return the fields in the formly structure', () => {
        const firstFormlyField = service.getFormFieldsForModel(modelMock)[0];

        expect(firstFormlyField.key).to.equal('aggregationLevels');
        expect(firstFormlyField.type).to.equal(MultiSelect);
    });

    it('should return the correct templateOptions', () => {
        const firstFormlyField = service.getFormFieldsForModel(modelMock)[0];

        expect(firstFormlyField.templateOptions.label).to.equal('aggregation_levels');
        expect(firstFormlyField.templateOptions.required).to.equal(false);
    });

    it('should set the minLength property', () => {
        const firstFormlyField = service.getFormFieldsForModel(modelMock)[0];

        expect(firstFormlyField.templateOptions.minLength).to.equal(-2147483648);
    });

    it('should set the maxLength property', () => {
        const firstFormlyField = service.getFormFieldsForModel(modelMock)[0];

        expect(firstFormlyField.templateOptions.maxLength).to.equal(2147483647);
    });

    describe('field order', () => {
        let formFields;

        beforeEach(() => {
            service.setDefaultFieldOrder(['name', 'shortName', 'code']);
            formFields = service.getFormFieldsForModel(modelMock);
        });

        it('should respect the set field order', () => {
            expect(formFields[0].key).to.equal('name');
            expect(formFields[1].key).to.equal('shortName');
            expect(formFields[2].key).to.equal('code');
        });

        it('should not remove any fields when no order is used', () => {
            const serviceWithoutOrder = new FormFieldsForModel(modelsMock, FIELDS_TO_IGNORE_ON_DISPLAY);
            const formlyFieldsWithoutOrder = serviceWithoutOrder.getFormFieldsForModel(modelMock);

            expect(formlyFieldsWithoutOrder.length).to.equal(18);
        });

        it('should remove unspecified fields if an order is used', () => {
            expect(formFields.length).to.equal(3);
        });
    });

    describe('field overrides', () => {
        let overrideConfig;

        beforeEach(() => {
            modelMock = {
                modelDefinition: {
                    modelValidations: {type: fixtures.get('modelValidations').type},
                },
            };

            service = new FormFieldsForModel(modelsMock, FIELDS_TO_IGNORE_ON_DISPLAY);

            overrideConfig = {
                type: {
                    type: SELECT,
                    templateOptions: {
                        options: ['int', 'string', 'boolean'],
                    },
                },
            };
        });

        it('should return the field without override', () => {
            const formlyFields = service.getFormFieldsForModel(modelMock);

            expect(formlyFields[0].key).to.equal('type');
            expect(formlyFields[0]).to.be.instanceof(InputBox);
        });

        it('should return the correct overriden field', () => {
            const formlyFields = service.getFormFieldsForModel(modelMock, overrideConfig);
            const expectedOptions = [
                {name: 'int', value: 'int'},
                {name: 'string', value: 'string'},
                {name: 'boolean', value: 'boolean'},
            ];

            expect(formlyFields[0].key).to.equal('type');
            expect(formlyFields[0]).to.be.instanceof(SelectBox);
            expect(formlyFields[0].templateOptions.options).to.deep.equal(expectedOptions);
        });
    });
});
