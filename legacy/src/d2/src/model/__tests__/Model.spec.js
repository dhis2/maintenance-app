import fixtures from '../../__fixtures__/fixtures';
import Model from '../Model';
import ModelDefinition from '../ModelDefinition';

describe('Model', () => {
    let model;

    beforeEach(() => {
        model = new Model({
            modelProperties: [],
        });
    });

    it('should not be allowed to be called without new', () => {
        expect(() => Model()).toThrowError('Cannot call a class as a function');
    });

    it('should throw when modelDefinition is not defined', () => {
        function shouldThrow() {
            return new Model();
        }
        expect(shouldThrow).toThrowError('modelDefinition should be provided');
    });

    it('should throw when modelDefinition.modelProperties is not provided', () => {
        function shouldThrow() {
            return new Model({});
        }
        expect(shouldThrow).toThrowError('modelProperties should be provided');
    });

    it('should have a create method on the class', () => {
        expect(typeof Model.create).toBe('function');
    });

    it('should have a save method', () => {
        expect(typeof model.save).toBe('function');
    });

    it('should have a validate method', () => {
        expect(typeof model.validate).toBe('function');
    });

    it('should have a dirty property that is set to false', () => {
        expect(model.dirty).toBe(false);
    });

    it('should not show the dirty property in the enumerable properties', () => {
        const keys = Object.keys(model);

        expect(keys).not.toContain('dirty');
    });

    it('should add properties based on the modelDefinition', () => {
        // TODO: This fixture is outdated and we should update to a fixture with getters and setters.
        const dataElementModel = Model.create(fixtures.get('/modelDefinitions/dataElement'));

        expect(Object.keys(dataElementModel).length).toBe(34);
    });

    it('should keep a reference to its definition', () => {
        const modelDefinition = { modelProperties: [] };
        const dataElementModel = Model.create(modelDefinition);

        expect(dataElementModel.modelDefinition).toBe(modelDefinition);
    });

    it('should not show the modelDefinition property in the enumerable properties', () => {
        const keys = Object.keys(model);

        expect(keys).not.toContain('modelDefinition');
    });

    it('should not allow the modelDefinition to be changed', () => {
        const modelDefinition = { modelProperties: [] };
        const dataElementModel = Model.create(modelDefinition);

        function shouldThrow() {
            dataElementModel.modelDefinition = {};
        }

        expect(shouldThrow).toThrowError();
    });

    describe('properties based off model definition', () => {
        let modelDefinition;

        beforeEach(() => {
            modelDefinition = {
                modelProperties: {
                    name: {
                        configurable: false,
                        enumerable: true,
                        get() {
                            return this.dataValues.name;
                        },
                        set(value) {
                            this.dataValues.name = value;
                        },
                    },
                },
            };
        });

        it('should call the set method for name', () => {
            modelDefinition.modelProperties.name.set = jest.fn();
            const dataElementModel = Model.create(modelDefinition);

            dataElementModel.name = 'ANC';

            expect(modelDefinition.modelProperties.name.set).toHaveBeenCalledWith('ANC');
        });

        it('should set the correct value', () => {
            const dataElementModel = Model.create(modelDefinition);

            dataElementModel.name = 'ANC';

            expect(dataElementModel.dataValues.name).toBe('ANC');
        });

        it('should call the get method for name', () => {
            modelDefinition.modelProperties.name.get = jest.fn().mockReturnValue('ANC');
            const dataElementModel = Model.create(modelDefinition);
            const name = dataElementModel.name;

            expect(modelDefinition.modelProperties.name.get).toHaveBeenCalled();
            expect(name).toBe('ANC');
        });

        it('should return the correct value', () => {
            const dataElementModel = Model.create(modelDefinition);

            dataElementModel.name = 'ANC';

            expect(dataElementModel.name).toBe('ANC');
        });
    });

    describe('getDirtyPropertyNames', () => {
        let dataElementModel;

        beforeEach(() => {
            const dataElementSchema = fixtures.get('/api/schemas/dataElement');
            const dataElementModelDefinition = ModelDefinition.createFromSchema(dataElementSchema);

            dataElementModel = Model.create(dataElementModelDefinition);
        });

        it('should be a method', () => {
            expect(dataElementModel.getDirtyPropertyNames).toBeInstanceOf(Function);
        });

        it('should return the names of properties that are dirty', () => {
            dataElementModel.name = 'ANC new';

            expect(dataElementModel.getDirtyPropertyNames()).toEqual(['name']);
        });

        it('should return an empty array for a clean model', () => {
            expect(dataElementModel.getDirtyPropertyNames()).toEqual([]);
        });
    });

    describe('attributes', () => {
        let dataElementModel;

        beforeEach(() => {
            const dataElementModelDefinition = ModelDefinition.createFromSchema(
                fixtures.get('/api/schemas/dataElement'),
                fixtures.get('/dataElementAttributes'),
            );

            dataElementModel = Model.create(dataElementModelDefinition);
        });

        it('should not create the property when there are no attributes', () => {
            const dataElementSchema = fixtures.get('/api/schemas/dataElement');
            const dataElementModelDefinition = ModelDefinition.createFromSchema(dataElementSchema);

            dataElementModel = Model.create(dataElementModelDefinition);

            expect(dataElementModel.attributes).toBeUndefined();
        });

        it('should create the property when there are attributes available', () => {
            expect(dataElementModel.attributes).toBeDefined();
        });

        it('should have a property for each of the attributes that belong to this model type', () => {
            expect(Object.keys(dataElementModel.attributes)).toEqual(['marktribute', 'marktribute2', 'name']);
        });

        it('should set the correct value onto the attributeValues properties', () => {
            dataElementModel.attributes.name = 'Mark';

            expect(dataElementModel.attributeValues.length).toBe(1);
            expect(dataElementModel.attributeValues[0].value).toBe('Mark');
            expect(dataElementModel.attributeValues[0].attribute).toEqual({ id: 'S8a2OBRnqEc', name: 'name' });
        });

        it('should get the correct value from the attributeValues property', () => {
            dataElementModel.dataValues.attributeValues = [{
                value: 'Mark',
                attribute: { id: 'FpoWdhxCMwH', name: 'marktribute' },
            }];

            expect(dataElementModel.attributes.marktribute).toBe('Mark');
        });

        it('should not add a value for the same attribute twice', () => {
            dataElementModel.dataValues.attributeValues = [{
                value: 'Mark',
                attribute: { id: 'FpoWdhxCMwH', name: 'marktribute' },
            }];

            dataElementModel.attributes.marktribute = 'John';

            expect(dataElementModel.attributes.marktribute).toBe('John');
            expect(dataElementModel.attributeValues[0].value).toBe('John');
            expect(dataElementModel.attributeValues.length).toBe(1);
        });

        it('should add a value for the attribute when it does not exist yet', () => {
            dataElementModel.dataValues.attributeValues = [{
                value: 'Mark',
                attribute: { id: 'FpoWdhxCMwH', name: 'marktribute' },
            }];

            dataElementModel.attributes.name = 'John';

            expect(dataElementModel.attributes.marktribute).toBe('Mark');
            expect(dataElementModel.attributes.name).toBe('John');
            expect(dataElementModel.attributeValues[0].value).toBe('Mark');
            expect(dataElementModel.attributeValues[1].value).toBe('John');
            expect(dataElementModel.attributeValues.length).toBe(2);
        });

        it('should remove the attributeValue from the attributeValue array when the value is cleared out', () => {
            dataElementModel.dataValues.attributeValues = [{
                value: 'Mark',
                attribute: { id: 'FpoWdhxCMwH', name: 'name' },
            }];

            dataElementModel.attributes.name = '';

            expect(dataElementModel.attributes.name).toBe(undefined);
            expect(dataElementModel.attributeValues.length).toBe(0);
        });

        it('should not remove the attributeValue when the attribute is set to false', () => {
            dataElementModel.dataValues.attributeValues = [{
                value: 'Mark',
                attribute: { id: 'FpoWdhxCMwH', name: 'name' },
            }];

            dataElementModel.attributes.name = false;

            expect(dataElementModel.attributes.name).toBe(false);
            expect(dataElementModel.attributeValues.length).toBe(1);
        });

        it('should not remove the attributeValue when the attribute is set 0', () => {
            dataElementModel.dataValues.attributeValues = [{
                value: 'Mark',
                attribute: { id: 'FpoWdhxCMwH', name: 'name' },
            }];

            dataElementModel.attributes.name = 0;

            expect(dataElementModel.attributes.name).toBe(0);
            expect(dataElementModel.attributeValues.length).toBe(1);
        });

        it('should remove the attributeValue when the attribute is set to undefined', () => {
            dataElementModel.dataValues.attributeValues = [{
                value: 'Mark',
                attribute: { id: 'FpoWdhxCMwH', name: 'name' },
            }];

            dataElementModel.attributes.name = undefined;

            expect(dataElementModel.attributes.name).toBe(undefined);
            expect(dataElementModel.attributeValues.length).toBe(0);
        });

        it('should remove the attributeValue when the attribute is set to null', () => {
            dataElementModel.dataValues.attributeValues = [{
                value: 'Mark',
                attribute: { id: 'FpoWdhxCMwH', name: 'name' },
            }];

            dataElementModel.attributes.name = null;

            expect(dataElementModel.attributes.name).toBe(undefined);
            expect(dataElementModel.attributeValues.length).toBe(0);
        });

        it('should not show up in the list of model keys', () => {
            const modelKeys = Object.keys(dataElementModel);

            expect(modelKeys).not.toContain('attributes');
        });

        it('should not be able to set attributes to something else', () => {
            const changeAttributesProperty = () => { dataElementModel.attributes = 'something else'; };

            expect(changeAttributesProperty).toThrow();
            expect(dataElementModel.attributes).not.toBe('something else');
        });

        it('should set the model to dirty when an attribute was changed', () => {
            dataElementModel.dataValues.attributeValues = [{
                value: 'Mark',
                attribute: { id: 'FpoWdhxCMwH', name: 'marktribute' },
            }];

            expect(dataElementModel.dirty).toBe(false);

            dataElementModel.attributes.marktribute = 'John';

            expect(dataElementModel.dirty).toBe(true);
        });

        it('should not set the model to be dirty when the attribute value is the same', () => {
            dataElementModel.dataValues.attributeValues = [{
                value: 'Mark',
                attribute: { id: 'FpoWdhxCMwH', name: 'marktribute' },
            }];

            dataElementModel.attributes.marktribute = 'Mark';

            expect(dataElementModel.dirty).toBe(false);
        });

        it('should not fail if requesting an attribute but the model has no attributeValues', () => {
            dataElementModel.dataValues.attributeValues = undefined;

            expect(() => dataElementModel.attributes.marktribute).not.toThrowError();
        });

        it('should still correctly set the attributeValue if the model has initially no attributeValues', () => {
            dataElementModel.dataValues.attributeValues = undefined;

            dataElementModel.attributes.marktribute = 'John';

            expect(dataElementModel.attributes.marktribute).toBe('John');
            expect(dataElementModel.attributeValues[0].attribute.id).toBe('FpoWdhxCMwH');
        });
    });
});
