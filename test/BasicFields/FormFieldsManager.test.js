import FormFieldsForModel from '../src/FormFieldsForModel';
import FormFieldsManager from '../src/FormFieldsManager';
import {SELECT, TEXT} from '../src/fields/index';

function initManager(manager) {
    manager.fieldsForModelService.getFormFieldsForModel = sinon.stub();
    manager.fieldsForModelService.getFormFieldsForModel.returns([
        {key: 'name'},
        {key: 'code'},
        {key: 'shortName'},
        {key: 'isZeroSignificant'},
        {key: 'formName'},
    ]);

    manager.setHeaderFields(['name', 'shortName']);
}

describe('FormFieldsManager', () => {
    let manager;

    beforeEach(() => {
        manager = new FormFieldsManager(new FormFieldsForModel({}));
    });

    describe('addFieldOverrideFor', () => {
        it('should add a field override for the given fieldname', () => {
            manager.addFieldOverrideFor('type', {type: SELECT});

            expect(manager.fieldOverrides.type).to.deep.equal({type: SELECT});
        });

        it('should return an the manager for chaining', () => {
            expect(manager.addFieldOverrideFor('type', {type: SELECT})).to.equal(manager);
        });

        it('should set the override with the template options', () => {
            const expectedOptions = ['int', 'string', 'boolean'];
            manager.addFieldOverrideFor('type', {
                type: SELECT,
                templateOptions: {
                    options: ['int', 'string', 'boolean'],
                },
            });

            expect(manager.fieldOverrides.type.templateOptions.options).to.deep.equal(expectedOptions);
        });

        it('should call the getFormFieldsForModel with the overrides', () => {
            manager.fieldsForModelService.getFormFieldsForModel = sinon.spy();

            const overrideConfig = {
                description: {type: TEXT},
                type: {
                    type: SELECT,
                    templateOptions: {
                        options: ['int', 'string', 'boolean'],
                    },
                },
            };
            manager.addFieldOverrideFor('type', overrideConfig.type);
            manager.getFormFieldsForModel({});

            expect(manager.fieldsForModelService.getFormFieldsForModel).to.be.calledWith({}, overrideConfig);
        });
    });

    describe('getFormFieldsForModel', () => {
        let modelMock;

        beforeEach(() => {
            modelMock = {};
            manager.fieldsForModelService.getFormFieldsForModel = sinon.spy();
        });

        it('should call getFormFieldsForModel on the fieldsForModelService', () => {
            manager.getFormFieldsForModel(modelMock);

            expect(manager.fieldsForModelService.getFormFieldsForModel).to.be.called;
        });

        it('should ask for the fields with the passed model', () => {
            manager.getFormFieldsForModel(modelMock);

            expect(manager.fieldsForModelService.getFormFieldsForModel).to.be.calledWith(modelMock, {description: {type: TEXT}});
        });
    });

    describe('setFieldOrder', () => {
        beforeEach(() => {
            manager.fieldsForModelService.setDefaultFieldOrder = sinon.spy();
        });

        it('should be a method', () => {
            expect(manager.setFieldOrder).to.be.instanceof(Function);
        });

        it('should return the manager for chaining', () => {
            expect(manager.setFieldOrder()).to.equal(manager);
        });

        it('should call set the field order on the field transformer', () => {
            manager.setFieldOrder(['name', 'code']);

            expect(manager.fieldsForModelService.setDefaultFieldOrder).to.be.called;
        });
    });

    describe('setHeaderFields', () => {
        it('should be a method', () => {
            expect(manager.setHeaderFields).to.be.instanceof(Function);
        });

        it('should return the manager for chaining', () => {
            expect(manager.setHeaderFields()).to.equal(manager);
        });

        it('should set the headerFields property onto the manager', () => {
            const headerFields = ['name', 'shortName'];

            manager.setHeaderFields(headerFields);

            expect(manager.headerFields).to.deep.equal(headerFields);
        });

        it('should remove duplicate entries from the headerFields', () => {
            const expectedHeaderFields = ['name', 'shortName', 'code'];

            manager.setHeaderFields(['name', 'shortName', 'name', 'code']);

            expect(manager.headerFields).to.deep.equal(expectedHeaderFields);
        });
    });

    describe('getHeaderFields', () => {
        beforeEach(() => {
            initManager(manager);
        });

        it('should be a function', () => {
            expect(manager.getHeaderFieldsForModel).to.be.instanceof(Function);
        });

        it('should return the header field configs', () => {
            expect(manager.getHeaderFieldsForModel().length).to.equal(2);
        });
    });

    describe('getNonHeaderFields', () => {
        beforeEach(() => {
            initManager(manager);
        });
        it('should be a function', () => {
            expect(manager.getNonHeaderFieldsForModel).to.be.instanceof(Function);
        });

        it('should return the non header fields', () => {
            expect(manager.getNonHeaderFieldsForModel().length).to.equal(3);
        });
    });
});
