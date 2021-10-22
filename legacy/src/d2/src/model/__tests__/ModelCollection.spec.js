import Model from '../Model';
import ModelDefinition from '../ModelDefinition';
import Pager from '../../../src/pager/Pager';
import ModelCollection from '../ModelCollection';

jest.mock('../Model');
jest.mock('../../../src/pager/Pager');

describe('ModelCollection', () => {
    const mockSchema = { singular: 'mock', plural: 'mocks' };
    const mockModelDefinition = new ModelDefinition(mockSchema, []);
    let pagerObject;

    beforeEach(() => {
        pagerObject = {
            page: 1,
            pageCount: 10,
            total: 482,
            nextPage: 'http://localhost:8080/dhis/api/dataElements?page=2',
        };

        Pager.mockReset();
        Pager.mockReturnValueOnce(pagerObject);
    });

    describe('extension of Map', () => {
        let firstValue;
        let modelCollection;

        beforeEach(() => {
            firstValue = new Model(mockModelDefinition);
            firstValue.id = 'q2egwkkrfco';

            modelCollection = ModelCollection.create(mockModelDefinition, [], pagerObject);
            modelCollection.add(firstValue);
        });

        it('should have a clear method that clears the list', () => {
            modelCollection.clear();

            expect(modelCollection.size).toBe(0);
        });

        it('should get the values', () => {
            expect(Array.from(modelCollection.values())[0]).toBe(firstValue);
        });

        it('should get the keys', () => {
            expect(Array.from(modelCollection.keys())[0]).toBe('q2egwkkrfco');
        });

        it('should get the entries', () => {
            expect(modelCollection.entries().next().value).toEqual([firstValue.id, firstValue]);
        });

        it('should run the forEach with the correct values', () => {
            const forEachFunc = jest.fn();

            modelCollection.forEach(forEachFunc);

            expect(forEachFunc).toBeCalledWith(firstValue, 'q2egwkkrfco', modelCollection.valuesContainerMap);
        });

        it('should remove the correct value', () => {
            modelCollection.delete('q2egwkkrfco');

            expect(modelCollection.size).toBe(0);
        });

        it('should get the entries', () => {
            expect(Array.from(modelCollection)[0]).toEqual(['q2egwkkrfco', firstValue]);
        });

        it('should return true when the entry is in the collection', () => {
            expect(modelCollection.has('q2egwkkrfco')).toBe(true);
        });

        it('should return the correct value on get', () => {
            expect(modelCollection.get('q2egwkkrfco')).toBe(firstValue);
        });

        it('should throw error when trying to set the size', () => {
            expect(() => { modelCollection.size = 0; }).toThrowError();
        });
    });

    it('should be an object', () => {
        expect(ModelCollection).toBeInstanceOf(Function);
    });

    it('should accept 3 arguments', () => {
        expect(ModelCollection.length).toBe(3);
    });

    describe('class', () => {
        describe('create method', () => {
            it('should be a function', () => {
                expect(ModelCollection.create).toBeInstanceOf(Function);
            });

            it('should return an instance of the class', () => {
                expect(ModelCollection.create(mockModelDefinition)).toBeInstanceOf(ModelCollection);
            });

            it('should instantiate a new pager', () => {
                const collection = ModelCollection.create(mockModelDefinition);

                expect(collection.pager).toBeDefined();
            });

            it('should not be allowed to be called without new', () => {
                expect(() => ModelCollection()).toThrowError('Cannot call a class as a function');
            });
        });

        describe('throwIfContainsOtherThanModelObjects', () => {
            it('should throw when one of the the passed values in the array is not a Model', () => {
                expect(() => ModelCollection.throwIfContainsOtherThanModelObjects([{}]))
                    .toThrowError('Values of a ModelCollection must be instances of Model');
            });

            it('should not throw when the passed value is a model', () => {
                expect(() => ModelCollection.throwIfContainsOtherThanModelObjects([new Model(mockModelDefinition)]))
                    .not.toThrowError();
            });
        });

        describe('throwIfContainsModelWithoutUid', () => {
            it('should throw when the passed array contains a modelWithoutId', () => {
                expect(() => ModelCollection.throwIfContainsModelWithoutUid([new Model(mockModelDefinition)]))
                    .toThrowError('Can not add a Model without id to a ModelCollection');
            });

            it('should accept models with valid UIDs', () => {
                const model = new Model(mockModelDefinition);

                model.id = 'FQ2o8UBlcrS';

                expect(() => ModelCollection.throwIfContainsModelWithoutUid([model])).not.toThrowError();
            });
        });
    });

    describe('instance', () => {
        let modelDefinition;
        let modelCollection;
        let mockyModel1;
        let mockyModel2;
        let mockyModel3;

        beforeEach(() => {
            modelDefinition = new ModelDefinition(mockSchema, []);
            modelCollection = new ModelCollection(modelDefinition);
            mockyModel1 = new Model(mockModelDefinition);
            mockyModel1.id = 'q2egwkkrfc1';
            mockyModel2 = new Model(mockModelDefinition);
            mockyModel2.id = 'q2egwkkrfc2';
            mockyModel3 = new Model(mockModelDefinition);
            mockyModel3.id = 'q2egwkkrfc3';
        });

        it('should throw if being constructed with non Model values', () => {
            expect(() => new ModelCollection(modelDefinition, [
                1,
                2,
                3,
            ])).toThrowError('Values of a ModelCollection must be instances of Model');
        });

        it('should accept an array of Model objects', () => {
            modelCollection = new ModelCollection(modelDefinition, [
                mockyModel1,
                mockyModel2,
                mockyModel3,
            ]);

            expect(modelCollection.size).toBe(3);
        });

        it('should not add the same model twice', () => {
            modelCollection = new ModelCollection(modelDefinition, [
                mockyModel1,
                mockyModel1,
            ]);

            expect(modelCollection.size).toBe(1);
        });

        it('should return the first Model', () => {
            const firstModel = mockyModel1;
            mockyModel2.id = firstModel.id;

            modelCollection = new ModelCollection(modelDefinition, [firstModel, mockyModel2]);

            const firstValue = modelCollection.get('q2egwkkrfc1');

            expect(modelCollection.size).toBe(1);
            expect(firstValue.id).toBe('q2egwkkrfc1');
            expect(firstValue).toBeInstanceOf(Model);
        });

        it('should set the modelDefinition onto the modelCollection', () => {
            expect(modelCollection.modelDefinition).toBe(modelDefinition);
        });

        describe('add', () => {
            it('should accept Model as a value', () => {
                modelCollection.add(mockyModel1);
            });

            it('should not accept a number', () => {
                expect(() => modelCollection.add(1))
                    .toThrowError('Values of a ModelCollection must be instances of Model');
            });

            it('should not accept an empty object', () => {
                expect(() => modelCollection.add({}))
                    .toThrowError('Values of a ModelCollection must be instances of Model');
            });

            it('should not accept an object that was created based on a local class', () => {
                class Model { // eslint-disable-line no-shadow
                    constructor(id) {
                        this.id = id;
                    }
                }

                expect(() => modelCollection.add(new Model('q2egwkkrfco')))
                    .toThrowError('Values of a ModelCollection must be instances of Model');
            });

            it('should accept an object that was create with Model as subclass', () => {
                class MyModel extends Model {
                }
                const myModel = new MyModel(mockModelDefinition);
                myModel.id = 'q2egwkkrfco';

                expect(() => modelCollection.add(myModel))
                    .not.toThrowError('Values of a ModelCollection must be instances of Model');
                expect(modelCollection.size).toBe(1);
            });

            it('should throw if the id is not available', () => {
                expect(() => modelCollection.add(new Model(mockModelDefinition)))
                    .toThrowError('Can not add a Model without id to a ModelCollection');
            });
        });

        describe('toArray', () => {
            it('should return an array of the items', () => {
                const modelArray = [mockyModel1, mockyModel2];

                modelCollection = new ModelCollection(modelDefinition, modelArray);

                expect(modelCollection.toArray()).toEqual(modelArray);
            });
        });
    });
});
