import ModelValidation from '../ModelValidation';
import modelBase, { DIRTY_PROPERTY_LIST } from '../ModelBase';

jest.mock('../ModelValidation');

describe('ModelBase', () => {
    // TODO: For some reason we have to setup the mock before the beforeEach and reset the spy, should figure out a way to perhaps do this differently.
    let validateAgainstSchemaSpy;

    beforeEach(() => {
        validateAgainstSchemaSpy = ModelValidation.getModelValidation().validateAgainstSchema;
        validateAgainstSchemaSpy.mockReset();
    });

    it('should have a save method', () => {
        expect(typeof modelBase.save).toBe('function');
    });

    it('should have a validate method', () => {
        expect(typeof modelBase.validate).toBe('function');
    });

    it('should have a clone method', () => {
        expect(typeof modelBase.clone).toBe('function');
    });

    describe('saving', () => {
        let modelDefinition;
        let model;
        let validateFunction;

        beforeEach(() => {
            validateFunction = jest.fn();


            modelDefinition = {
                apiEndpoint: '/dataElements',
                save: jest.fn().mockReturnValue(Promise.resolve()),
                saveNew: jest.fn().mockReturnValue(Promise.resolve()),
            };

            class Model {
                constructor(modelDef) {
                    this.modelDefinition = modelDef;
                    this.validate = validateFunction;
                    this.dirty = true;
                    this[DIRTY_PROPERTY_LIST] = new Set(['name']);
                    this.dataValues = {};
                }
            }

            Model.prototype = modelBase;
            model = new Model(modelDefinition);
            Object.defineProperty(model, 'id', {
                get() {
                    return this.dataValues.id;
                },
            });
        });

        describe('create()', () => {
            it('should call validate before calling save', () => {
                validateFunction.mockReturnValue(Promise.resolve({ status: true }));

                model.create();

                // TODO: Fix assertion when the .toBeCalledBefore(model.save) is available https://github.com/facebook/jest/issues/4402
                expect(model.validate).toBeCalled();
            });

            it('should call saveNew on the model', () => {
                validateFunction.mockReturnValue(Promise.resolve({ status: true }));

                return model.create()
                    .then(() => {
                        expect(modelDefinition.saveNew).toBeCalledWith(model);
                    });
            });

            it('should not call saveNew when validate fails', () => {
                validateFunction.mockReturnValue(Promise.resolve({ status: false }));

                return model.create()
                    .catch(e => e)
                    .then(() => {
                        expect(modelDefinition.save).not.toBeCalled();
                    });
            });
        });

        describe('save()', () => {
            beforeEach(() => {
                model.validate.mockReturnValue(Promise.resolve({ status: true }));
            });

            it('should call the save on the model modelDefinition with itself as a parameter', () => model.save()
                .then(() => {
                    expect(modelDefinition.save).toBeCalledWith(model);
                }));

            it('should call validate before calling save', () => {
                model.save();

                expect(model.validate).toBeCalled();
            });

            it('should not call save when validate fails', () => {
                model.validate.mockReturnValue(Promise.resolve({ status: false }));

                return model.save()
                    .catch(e => e)
                    .then(() => {
                        expect(modelDefinition.save).not.toBeCalled();
                    });
            });

            it('should not call save when the model is not dirty', () => {
                model.dirty = false;

                model.save();

                expect(modelDefinition.save).not.toBeCalled();
            });

            it('should reset dirty to false after save', (done) => {
                model.save()
                    .then(() => {
                        expect(model.dirty).toBe(false);
                        done();
                    }).catch((err) => {
                        done(err);
                    });
            });

            it('should reset the DIRTY_PROPERTY_LIST to an empty set after save', (done) => {
                model.save()
                    .then(() => {
                        expect(model[DIRTY_PROPERTY_LIST].size).toBe(0);
                        done();
                    }).catch((err) => {
                        done(err);
                    });
            });

            it('should return a promise that resolves to an empty object when the model is not dirty', (done) => {
                model.dirty = false;

                model.save()
                    .then((result) => {
                        expect(result).toEqual({});
                        done();
                    })
                    .catch(done);
            });

            it('should return rejected promise when the model is not valid', (done) => {
                model.validate.mockReturnValue(Promise.resolve({ status: false }));

                model.save()
                    .catch((message) => {
                        expect(message).toEqual({ status: false });
                        done();
                    });
            });

            it('should set the newly created id onto the model', () => {
                modelDefinition.save.mockReturnValue(Promise.resolve({
                    httpStatus: 'Created',
                    response: {
                        uid: 'DXyJmlo9rge',
                    },
                }));

                return model.save()
                    .then(() => {
                        expect(model.id).toBe('DXyJmlo9rge');
                    });
            });

            it('should set the correct href property onto the object', () => {
                modelDefinition.save.mockReturnValue(Promise.resolve({
                    httpStatus: 'Created',
                    response: {
                        uid: 'DXyJmlo9rge',
                    },
                }));

                return model.save()
                    .then(() => {
                        expect(model.dataValues.href).toBe('/dataElements/DXyJmlo9rge');
                    });
            });

            it('should set the dirty children\'s dirty flag back to false', () => {
                model.modelDefinition.modelValidations = {
                    organisationUnits: {
                        owner: true,
                    },
                };
                model.organisationUnits = {
                    size: 1,
                    dirty: true,
                };

                return model.save()
                    .then(() => {
                        expect(model.organisationUnits.dirty).toBe(false);
                    });
            });
        });
    });

    describe('validate', () => {
        let modelValidations;
        let model;

        beforeEach(() => {
            modelValidations = {
                age: {
                    persisted: true,
                    type: 'NUMBER',
                    required: true,
                    min: 0,
                    max: 2342,
                    owner: true,
                    unique: false,
                },
            };

            class Model {
                constructor(validations) {
                    this.modelDefinition = {};
                    this.modelDefinition.modelValidations = validations;
                    this.dataValues = {
                        age: 4,
                    };
                }
            }

            Model.prototype = modelBase;
            model = new Model(modelValidations);

            validateAgainstSchemaSpy.mockReturnValue(Promise.resolve([]));
        });

        it('should fail when the async validate fails', (done) => {
            validateAgainstSchemaSpy.mockReturnValue(Promise.reject('Validation against schema endpoint failed.'));

            model.validate()
                .catch((message) => {
                    expect(message).toBe('Validation against schema endpoint failed.');
                    done();
                });
        });

        it('should call the validateAgainstSchema method on the modelValidator', (done) => {
            model.validate()
                .then(() => {
                    expect(validateAgainstSchemaSpy).toBeCalled();
                    done();
                });
        });

        it('should call validateAgainstSchema with the model', (done) => {
            model.validate()
                .then(() => {
                    expect(validateAgainstSchemaSpy).toBeCalledWith(model);
                    done();
                });
        });

        it('should return false when there are the asyncValidation against the schema failed', (done) => {
            validateAgainstSchemaSpy
                .mockReturnValue(Promise.resolve([
                    { message: 'Required property missing.', property: 'name' },
                ]));

            model.validate()
                .then((validationState) => {
                    expect(validationState.status).toBe(false);
                    done();
                })
                .catch(done);
        });

        it('should return false when there are the asyncValidation against the schema failed', (done) => {
            validateAgainstSchemaSpy.mockReturnValue(Promise.resolve([]));

            model.validate()
                .then((validationState) => {
                    expect(validationState.status).toBe(true);
                    done();
                })
                .catch(done);
        });
    });


    describe('clone', () => {
        let modelDefinition;
        let model;

        class Model {
            constructor(modelDef) {
                this.modelDefinition = modelDef;
                this.validate = jest.fn().mockReturnValue(Promise.resolve({ status: true }));
                this.dirty = false;
                this[DIRTY_PROPERTY_LIST] = new Set([]);
                this.dataValues = {
                    id: 'DXyJmlo9rge',
                    name: 'My metadata object',
                };
            }

            static create(modelDef) {
                model = new Model(modelDef);

                Object.defineProperty(model, 'id', {
                    get() {
                        return this.dataValues.id;
                    },
                    enumerable: true,
                });
                Object.defineProperty(model, 'name', {
                    get() {
                        return this.dataValues.name;
                    },
                    set(newValue) {
                        this.dataValues.name = newValue;
                    },
                    enumerable: true,
                });
                Object.defineProperty(model, 'userGroups', {
                    get() {
                        return this.dataValues.userGroups;
                    },
                    enumerable: true,
                });

                return model;
            }
        }

        beforeEach(() => {
            modelDefinition = {
                apiEndpoint: '/dataElements',
                save: jest.fn().mockReturnValue(Promise.resolve()),
                saveNew: jest.fn().mockReturnValue(Promise.resolve()),
                create: jest.fn().mockReturnValue(Model.create(modelDefinition)),
                modelValidations: {
                    id: {},
                    name: {},
                    userGroups: {
                        type: 'COLLECTION',
                    },
                },
            };

            Model.prototype = modelBase;
            model = Model.create(modelDefinition);
        });

        it('should call create on the modelDefinition', () => {
            model.clone();

            expect(modelDefinition.create).toBeCalled();
        });

        it('should pass all the dataValues to the create function', () => {
            model.clone();

            expect(modelDefinition.create).toBeCalledWith({
                id: 'DXyJmlo9rge',
                name: 'My metadata object',
            });
        });

        it('should pass collections arrays of ids', () => {
            // Would generally be a ModelCollection, but it extends Map so for simplicity we use Map directly.
            model.dataValues.userGroups = new Map([
                ['P3jJH5Tu5VC', { id: 'P3jJH5Tu5VC' }],
                ['FQ2o8UBlcrS', { id: 'FQ2o8UBlcrS' }],
            ]);

            model.clone();

            expect(modelDefinition.create).toBeCalledWith({
                id: 'DXyJmlo9rge',
                name: 'My metadata object',
                userGroups: [
                    { id: 'P3jJH5Tu5VC' },
                    { id: 'FQ2o8UBlcrS' },
                ],
            });
        });

        it('should retain all of the values in the child collections', () => {
            model.dataValues.userGroups = new Map([
                ['P3jJH5Tu5VC', { id: 'P3jJH5Tu5VC',
                    name: 'Administrators',
                    clone() {
                        return { id: 'P3jJH5Tu5VC', name: 'Administrators' };
                    } }],
                ['FQ2o8UBlcrS', { id: 'FQ2o8UBlcrS',
                    name: 'Super users',
                    clone() {
                        return { id: 'FQ2o8UBlcrS', name: 'Super users' };
                    } }],
            ]);

            model.clone();

            expect(modelDefinition.create).toBeCalledWith({
                id: 'DXyJmlo9rge',
                name: 'My metadata object',
                userGroups: [
                    { id: 'P3jJH5Tu5VC', name: 'Administrators' },
                    { id: 'FQ2o8UBlcrS', name: 'Super users' },
                ],
            });
        });

        it('should return an independent clone', () => {
            const modelClone = model.clone();

            expect(model).not.toBe(modelClone);

            modelClone.name = 'NewName';

            expect(modelClone.dataValues.name).toBe('NewName');
            expect(model.dataValues.name).toBe('My metadata object');
        });

        it('should preserve the dirty state of the original model', () => {
            model.dirty = true;
            model[DIRTY_PROPERTY_LIST] = new Set(['name']);

            const modelClone = model.clone();

            expect(modelClone.dirty).toBe(true);
        });
    });

    describe('delete', () => {
        let modelDefinition;
        let model;

        beforeEach(() => {
            modelDefinition = {
                delete: jest.fn().mockReturnValue(new Promise((resolve) => { resolve(); })),
            };

            class Model {
                constructor(modelDef) {
                    this.modelDefinition = modelDef;
                    this.validate = jest.fn().mockReturnValue(Promise.resolve({ status: true }));
                    this.dirty = true;
                    this[DIRTY_PROPERTY_LIST] = new Set(['name']);
                }
            }

            Model.prototype = modelBase;
            model = new Model(modelDefinition);
        });

        it('should have a delete method', () => {
            expect(model.delete).toBeInstanceOf(Function);
        });

        it('should call delete on the modeldefinition when called', () => {
            model.delete();

            expect(model.modelDefinition.delete).toBeCalled();
        });

        it('should call the modelDefinition.delete method with the model', () => {
            model.delete();

            expect(model.modelDefinition.delete).toBeCalledWith(model);
        });

        it('should return a promise', () => {
            expect(model.delete()).toBeInstanceOf(Promise);
        });
    });

    describe('getCollectionChildren', () => {
        let model;

        beforeEach(() => {
            model = Object.create(modelBase);
            model.modelDefinition = {
                modelValidations: {
                    dataElements: {
                        owner: true,
                    },
                    userGroups: {

                    },
                },
            };
            model.dataElements = {
                name: 'dataElements',
                dirty: true,
                size: 2,
            };

            model.userGroups = {
                name: 'userGroups',
            };
        });

        it('should return the collection children', () => {
            expect(model.getCollectionChildren()).toContain(model.dataElements);
        });

        it('should not return the children that are not collections', () => {
            expect(model.getCollectionChildren()).not.toContain(model.userGroups);
        });
    });

    describe('getCollectionChildrenPropertyNames', () => {
        let model;

        beforeEach(() => {
            model = Object.create(modelBase);
            model.modelDefinition = {
                modelValidations: {
                    dataElements: {
                        type: 'COLLECTION',
                    },
                    dataEntryForm: {
                        type: 'COMPLEX',
                    },
                },
            };

            model.dataElements = [];
        });

        it('should return the correct property collections', () => {
            expect(model.getCollectionChildrenPropertyNames()).toContain('dataElements');
        });

        it('should not return the collection for the property if there is no modelValidation for the property', () => {
            model.indicators = [];

            expect(model.getCollectionChildrenPropertyNames()).not.toContain('indicators');
        });

        it('should not return the collection for the property if there is no modelValidation for the property', () => {
            model.modelDefinition.modelValidations.indicators = {
                type: 'COLLECTION',
            };

            expect(model.getCollectionChildrenPropertyNames()).not.toContain('indicators');
        });
    });

    describe('getReferenceProperties', () => {
        let model;

        beforeEach(() => {
            model = Object.create(modelBase);
            model.modelDefinition = {
                modelValidations: {
                    dataElements: {
                        type: 'COLLECTION',
                        embeddedObject: false,
                    },
                    dataEntryForm: {
                        type: 'COMPLEX',
                    },
                    user: {
                        type: 'REFERENCE',
                        embeddedObject: false,
                    },
                    accesses: {
                        type: 'REFERENCE',
                        embeddedObject: true,
                    },
                },
            };

            model.dataElements = [];
            model.user = {
                id: 'xE7jOejl9FI',
                firstName: 'John',
            };
            model.accesses = {
                read: true,
                write: true,
            };
        });

        it('should return the correct reference properties', () => {
            expect(model.getReferenceProperties()).toContain('user');
        });

        it('should not return the reference property if there is no modelValidation for the property', () => {
            model.randomObject = {};

            expect(model.getReferenceProperties()).not.toContain('randomObject');
        });

        it('should not return the reference property if there is no value for the property', () => {
            model.modelDefinition.modelValidations.randomObject = {
                type: 'REFERENCE',
            };

            expect(model.getReferenceProperties()).not.toContain('randomObject');
        });

        it('should not return the property if the reference property is embedded', () => {
            expect(model.getReferenceProperties()).not.toContain('accesses');
        });
    });

    describe('getEmbeddedObjectCollectionPropertyNames', () => {
        let model;

        beforeEach(() => {
            model = Object.create(modelBase);
            model.modelDefinition = {
                modelValidations: {
                    dataElements: {
                        type: 'COLLECTION',
                        embeddedObject: false,
                    },
                    dataEntryForm: {
                        type: 'COMPLEX',
                    },
                    legends: {
                        type: 'COLLECTION',
                        embeddedObject: true,
                    },
                },
            };

            model.dataElements = [];
            model.legends = [];
        });

        it('should include the embedded collection', () => {
            expect(model.getEmbeddedObjectCollectionPropertyNames()).toContain('legends');
        });

        it('should not include non embedded object collections', () => {
            expect(model.getEmbeddedObjectCollectionPropertyNames()).not.toContain('dataElements');
        });
    });

    describe('getDirtyChildren', () => {
        let model;

        beforeEach(() => {
            model = Object.create(modelBase);
            model.modelDefinition = {
                modelValidations: {
                    dataElements: {
                        owner: true,
                    },
                },
            };
            model.dataElements = {
                name: 'dataElements',
                dirty: true,
                size: 2,
            };
        });

        it('should return the dirty children properties', () => {
            expect(model.getDirtyChildren()).toEqual([model.dataElements]);
        });
    });

    describe('toJSON', () => {
        let model;

        beforeEach(() => {
            model = Object.create(modelBase);
        });

        it('should be a function', () => {
            expect(typeof model.toJSON).toBe('function');
        });

        it('should not throw an exception on `toJSON` for base models', () => {
            expect(model.toJSON()).toEqual({});
        });

        it('should return a json representation of the model', () => {
            model.modelDefinition = {
                modelValidations: {
                    name: {
                        owner: true,
                    },
                    dataElements: {
                        owner: true,
                        type: 'COLLECTION',
                    },
                },
            };
            model.dataValues = {
                name: 'ANC',
                dataElements: new Map([
                    ['P3jJH5Tu5VC', { id: 'P3jJH5Tu5VC', name: 'anc1' }],
                    ['FQ2o8UBlcrS', { id: 'FQ2o8UBlcrS', name: 'anc2' }],
                ]),
            };

            model.name = model.dataValues.name;
            model.dataElements = model.dataValues.dataElements;
            const expected = ({
                name: 'ANC',
                dataElements: [
                    { id: 'P3jJH5Tu5VC' },
                    { id: 'FQ2o8UBlcrS' },
                ],
            });

            expect(model.toJSON()).toEqual(expected);
        });
    });
});
