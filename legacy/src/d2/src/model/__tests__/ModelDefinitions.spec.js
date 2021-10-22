import ModelDefinitions from '../ModelDefinitions';

describe('D2 models', () => {
    let models;

    class ModelDefinition {
        constructor(name, plural) {
            this.name = name;
            this.plural = plural;
        }
    }

    beforeEach(() => {
        models = new ModelDefinitions();
    });

    it('should be an object', () => {
        expect(models).toBeInstanceOf(Object);
    });

    it('should not be allowed to be called without new', () => {
        expect(() => ModelDefinitions()).toThrowError('Cannot call a class as a function');
    });

    describe('add method', () => {
        let dataElementModelDefinition;

        beforeEach(() => {
            dataElementModelDefinition = new ModelDefinition('dataElement');
        });

        it('should be a function', () => {
            expect(models.add).toBeInstanceOf(Function);
        });

        it('should add a property to the models object', () => {
            models.add(dataElementModelDefinition);

            expect(models.dataElement).toBeInstanceOf(ModelDefinition);
        });

        it('should throw an error when trying to add something that already exists', () => {
            function shouldThrow() {
                models.add(dataElementModelDefinition);
            }
            models.add(dataElementModelDefinition);

            expect(shouldThrow).toThrowError('Model dataElement already exists');
        });

        it('should reject a ModelDefinition that does not have a name property', () => {
            function shouldThrow() {
                models.add({ apiEndPoint: '/dataElement' });
            }
            models.add(dataElementModelDefinition);

            expect(shouldThrow).toThrowError('Name should be set on the passed ModelDefinition to add one');
        });

        it('should add the plural version to the object', () => {
            const indicatorDefinition = new ModelDefinition('indicator', 'indicators');

            models.add(indicatorDefinition);

            expect(models.indicator).toBeInstanceOf(ModelDefinition);
            expect(models.indicator).toBe(models.indicators);
        });
    });

    describe('mapThroughDefinitions method', () => {
        beforeEach(() => {
            models.add({ name: 'dataElement' });
            models.add({ name: 'dataValue' });
            models.add({ name: 'user' });
            models.add({ name: 'userGroup' });
        });

        it('should should be a function', () => {
            expect(models.mapThroughDefinitions).toBeInstanceOf(Function);
        });

        it('should return an array of ModelDefinitions', () => {
            const expectedArray = [
                { name: 'dataElement' },
                { name: 'dataValue' },
                { name: 'user' },
                { name: 'userGroup' },
            ];
            function returnValue(item) {
                return item;
            }

            expect(models.mapThroughDefinitions(returnValue)).toEqual(expectedArray);
        });

        it('should throw if the transformer passed is not a function', () => {
            expect(() => models.mapThroughDefinitions('')).toThrowError('Expected transformer to have type function');
            expect(() => models.mapThroughDefinitions({})).toThrowError('Expected transformer to have type function');
        });

        it('should not map through properties that are the plural versions', () => {
            const iterator = jest.fn();

            models.add({ name: 'indicator', plural: 'indicators' });

            models.mapThroughDefinitions(iterator);

            expect(iterator).toHaveBeenCalledTimes(5);
        });
    });
});
