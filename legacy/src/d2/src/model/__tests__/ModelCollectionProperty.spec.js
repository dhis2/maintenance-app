import fixtures from '../../__fixtures__/fixtures';
import Api from '../../api/Api';
import Model from '../Model';
import ModelDefinition from '../ModelDefinition';
import ModelCollectionProperty from '../ModelCollectionProperty';

describe('ModelCollectionProperty', () => {
    // let ModelCollectionProperty;
    let mockParentModel;
    let mockModelDefinition;
    let mcp;
    let testModels = [];

    beforeEach(() => {
        mockParentModel = {
            id: 'parentModelId',
            plural: 'notArealModel',
            href: 'my.dhis/instance',
            modelDefinition: {
                apiEndpoint: 'http://my.base.url/api/parentModelEndpoint',
            },
        };
        mockModelDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/dataElement'));

        mcp = ModelCollectionProperty.create(mockParentModel, mockModelDefinition, 'dataElementGroups', []);

        testModels.push(mockModelDefinition.create({ id: 'dataEleme01', name: 'Test' }));
        testModels.push(mockModelDefinition.create({ id: 'dataEleme02' }));
        testModels.push(mockModelDefinition.create({ id: 'dataEleme03' }));
    });

    afterEach(() => {
        testModels = [];
    });

    it('Should be an object', () => {
        expect(ModelCollectionProperty).toBeInstanceOf(Object);
    });

    it('Should not be callable as a function', () => {
        expect(() => ModelCollectionProperty()).toThrowError();
    });

    describe('create()', () => {
        it('Supplies the default API implementation', () => {
            expect(mcp.api).toEqual(Api.getApi());
        });

        it('Sets the dirty flag to false', () => {
            expect(mcp.dirty).toBe(false);
        });

        it('Creates empty Sets for added and removed elements', () => {
            expect(mcp.added).toBeInstanceOf(Set);
            expect(mcp.removed).toBeInstanceOf(Set);
            expect(mcp.added.size).toBe(0);
            expect(mcp.removed.size).toBe(0);
        });

        it('Sets the correct parentModel', () => {
            expect(mcp.parentModel).toEqual(mockParentModel);
        });
    });

    describe('add()', () => {
        it('Registers added elements', () => {
            testModels.forEach(model => mcp.add(model));
            expect(mcp.added.size).toBe(testModels.length);
        });

        it('Only registers each added element once', () => {
            testModels.forEach(model => mcp.add(model));
            testModels.forEach(model => mcp.add(model));
            expect(mcp.added.size).toBe(testModels.length);
        });

        it('Updates the dirty flag', () => {
            expect(mcp.dirty).toBe(false);
            mcp.add(testModels[0]);
            expect(mcp.dirty).toBe(true);
        });

        it('Sets the dirty flag to false when an element is added and then removed', () => {
            expect(mcp.dirty).toBe(false);
            mcp.add(testModels[0]);
            expect(mcp.dirty).toBe(true);
            mcp.remove(testModels[0]);
            expect(mcp.dirty).toBe(false);
        });
    });

    describe('remove()', () => {
        beforeEach(() => {
            // Create a new ModelCollectionProperty with existing values
            mcp = ModelCollectionProperty.create(mockParentModel, mockModelDefinition, 'dataElementGroups', testModels);
        });

        it('Registers removed elements', () => {
            expect(mcp.removed.size).toBe(0);
            mcp.remove(testModels[0]);
            expect(mcp.removed.size).toBe(1);
            mcp.remove(testModels[1]);
            expect(mcp.removed.size).toBe(2);
            mcp.remove(testModels[2]);
            expect(mcp.removed.size).toBe(3);
        });

        it('Only registers each removed element once', () => {
            expect(mcp.removed.size).toBe(0);
            mcp.remove(testModels[0]);
            expect(mcp.removed.size).toBe(1);
            mcp.remove(testModels[0]);
            expect(mcp.removed.size).toBe(1);
        });

        it('Updates the dirty flag', () => {
            expect(mcp.dirty).toBe(false);
            mcp.remove(testModels[0]);
            expect(mcp.dirty).toBe(true);
        });

        it('Sets the dirty flag to false when an element is removed and re-added', () => {
            expect(mcp.dirty).toBe(false);
            mcp.remove(testModels[0]);
            expect(mcp.dirty).toBe(true);
            mcp.add(testModels[0]);
            expect(mcp.dirty).toBe(false);
        });
    });

    describe('updateDirty()', () => {
        it('Updates the dirty flag correctly', () => {
            expect(mcp.updateDirty()).toBe(false);
            mcp.added.add({ id: 'not a real model' });
            expect(mcp.updateDirty()).toBe(true);
        });

        it('Returns the updated value of the dirty flag', () => {
            mcp.added.add({ id: 'not a real model' });
            expect(mcp.updateDirty()).toBe(mcp.dirty);
        });
    });

    describe('resetDirtyState()', () => {
        it('Clears all added and removed elements', () => {
            mcp.added.add(testModels[0]);
            mcp.removed.add({ id: 'bah ' });
            expect(mcp.added.size).toBe(1);
            expect(mcp.removed.size).toBe(1);

            mcp.resetDirtyState();
            expect(mcp.added.size).toBe(0);
            expect(mcp.removed.size).toBe(0);
        });

        it('Sets the dirty flag to false', () => {
            expect(mcp.dirty).toBe(false);
            mcp.add(testModels[0]);
            mcp.removed.add({ id: 'bah ' });
            expect(mcp.updateDirty()).toBe(true);
            mcp.resetDirtyState();
            expect(mcp.dirty).toBe(false);
        });
    });

    describe('isDirty()', () => {
        it('Returns the current value of the dirty flag', () => {
            expect(mcp.isDirty()).toBe(mcp.dirty);
            mcp.add(testModels[0]);
            expect(mcp.isDirty()).toBe(true);
            expect(mcp.isDirty()).toBe(mcp.dirty);
        });

        it('Does not update the dirty flag', () => {
            expect(mcp.isDirty()).toBe(false);
            mcp.added.add(testModels[0]);
            expect(mcp.isDirty()).toBe(false);
        });

        it('Should be dirty=true if any model has been edited by default', () => {
            expect(mcp.isDirty()).toBe(false);
            mcp.add(testModels[0]);
            expect(mcp.isDirty()).toBe(true);
            mcp.resetDirtyState();

            expect(mcp.isDirty()).toBe(false);

            testModels[0].name = 'Raccoon';
            expect(testModels[0].isDirty()).toBe(true);
            expect(mcp.isDirty()).toBe(true);
        });

        it('Should be dirty=false if includeValues=false', () => {
            expect(mcp.isDirty()).toBe(false);
            mcp.add(testModels[0]);
            expect(mcp.isDirty()).toBe(true);
            mcp.resetDirtyState();

            expect(mcp.isDirty()).toBe(false);

            testModels[0].name = 'Raccoon';
            expect(testModels[0].isDirty()).toBe(true);
            expect(mcp.isDirty(false)).toBe(false);
        });
    });

    describe('save()', () => {
        const api = {
            get: jest.fn().mockReturnValue(Promise.resolve()),
            post: jest.fn().mockReturnValue(Promise.resolve()),
        };

        beforeEach(() => {
            mcp = new ModelCollectionProperty(
                mockParentModel,
                mockModelDefinition,
                'dataElementGroups',
                [testModels[0]],
                api,
            );
        });

        afterEach(() => {
            api.get.mockClear();
            api.post.mockClear();
        });

        it('Does nothing when the collection not dirty', (done) => {
            mcp.save()
                .then(() => {
                    expect(api.post).toHaveBeenCalledTimes(0);
                    done();
                }).catch(e => done(e));
        });

        it('Sends additions and removals in a single request', (done) => {
            mcp.remove(testModels[0]);
            mcp.add(testModels[1]);
            mcp.save()
                .then(() => {
                    expect(api.get).not.toHaveBeenCalled();
                    expect(api.post).toHaveBeenCalledTimes(1);
                    done();
                }).catch(e => done(e));
        });

        it('Sends an API requests with the correct additions and removals, using the correct URL', (done) => {
            mcp.remove(testModels[0]);
            mcp.add(testModels[1]);
            mcp.save()
                .then(() => {
                    expect(api.get).not.toHaveBeenCalled();
                    expect(api.post).toHaveBeenCalledTimes(1);
                    expect(api.post).toBeCalledWith('my.dhis/instance/dataElements', {
                        additions: [{ id: 'dataEleme02' }],
                        deletions: [{ id: 'dataEleme01' }],
                    });
                    done();
                }).catch(e => done(e));
        });

        it('Resets the dirty flag', (done) => {
            mcp.remove(testModels[0]);
            mcp.add(testModels[1]);
            expect(mcp.dirty).toBe(true);
            mcp.save()
                .then(() => {
                    expect(mcp.dirty).toBe(false);
                    done();
                }).catch(e => done(e));
        });

        it('Does not throw when the API fails', (done) => {
            api.post.mockReturnValue(Promise.reject());
            mcp.add(testModels[1]);
            expect(mcp.dirty).toBe(true);
            expect(() => {
                mcp.save().then(() => done()).catch(() => done());
            }).not.toThrowError();
        });

        it('Rejects the promise when the API fails', (done) => {
            api.post.mockReturnValue(Promise.reject());
            mcp.add(testModels[1]);
            expect(mcp.dirty).toBe(true);
            expect(() => {
                mcp.save().then(() => done('API failure was accepted silently')).catch(() => done());
            }).not.toThrowError();
        });
    });

    describe('load()', () => {
        let loadedWithValues;
        let loadedWithoutValues;
        let unloadedWithValues;
        let unloadedWithoutValues;
        let excludedByFieldFilters;

        const api = {
            get: jest.fn().mockReturnValue(Promise.resolve({
                dataElementGroups: [
                    { id: 'groupNo0001' },
                    { id: 'groupNo0002' },
                    { id: 'groupNo0003' },
                ],
            })),
        };

        const mockMcpPropName = 'dataElementGroups';

        beforeEach(() => {
            loadedWithValues = new ModelCollectionProperty(
                mockParentModel,
                mockModelDefinition,
                mockMcpPropName,
                [ // Loaded, actual values
                    mockModelDefinition.create({ id: 'groupNo0001' }),
                    mockModelDefinition.create({ id: 'groupNo0002' }),
                    mockModelDefinition.create({ id: 'groupNo0003' }),
                ],
                api,
            );

            // A ModelCollectionProperty that has been fully loaded, but contains no values
            loadedWithoutValues = new ModelCollectionProperty(
                mockParentModel,
                mockModelDefinition,
                mockMcpPropName,
                [], // Loaded, no values
                api,
            );

            // A ModelCollectionProperty that has not yet been loaded, but contains values that can be lazy loaded
            unloadedWithValues = new ModelCollectionProperty(
                mockParentModel,
                mockModelDefinition,
                mockMcpPropName,
                true, // Not loaded, has values (meaning the field was loaded with the '::isNotEmpty' transformer)
                api,
            );

            unloadedWithoutValues = new ModelCollectionProperty(
                mockParentModel,
                mockModelDefinition,
                mockMcpPropName,
                false, // Not loaded, no values
                api,
            );

            excludedByFieldFilters = new ModelCollectionProperty(
                mockParentModel,
                mockModelDefinition,
                mockMcpPropName,
                undefined, // This field was not included in the API query
                api,
            );
        });

        afterEach(() => {
            api.get.mockClear();
        });

        it('Sets `hasUnloadedData` correctly', () => {
            expect(loadedWithValues.hasUnloadedData).toBe(false);
            expect(loadedWithoutValues.hasUnloadedData).toBe(false);
            expect(unloadedWithValues.hasUnloadedData).toBe(true);
            expect(unloadedWithoutValues.hasUnloadedData).toBe(false);
            expect(excludedByFieldFilters.hasUnloadedData).toBe(true);
        });

        it('does not query the API when there are no unloaded values', (done) => {
            Promise.all([
                loadedWithValues.load(),
                loadedWithoutValues.load(),
                unloadedWithoutValues.load(),
            ]).then(() => {
                expect(api.get).not.toHaveBeenCalled();
                done();
            }).catch(err => done(err));
        });

        it('performs the correct API call for lazy loading', (done) => {
            unloadedWithValues
                .load()
                .then(() => {
                    expect(api.get).toHaveBeenCalledWith(
                        [mockParentModel.modelDefinition.apiEndpoint, mockParentModel.id].join('/'), {
                            fields: 'dataElementGroups[:all]',
                            paging: false,
                        },
                    );
                    done();
                }).catch(err => done(err));
        });

        it('correctly merges request parameters when lazy loading', (done) => {
            unloadedWithValues
                .load({ paging: false, fields: 'id,displayName' })
                .then(() => {
                    expect(api.get).toHaveBeenCalledWith(
                        [mockParentModel.modelDefinition.apiEndpoint, mockParentModel.id].join('/'), {
                            fields: 'dataElementGroups[id,displayName]',
                            paging: false,
                        },
                    );
                    done();
                })
                .catch(err => done(err));
        });

        it('updates hasUnloadedData when data has been lazy loaded', (done) => {
            expect(unloadedWithValues.hasUnloadedData).toBe(true);
            unloadedWithValues.load().then(() => {
                expect(unloadedWithValues.hasUnloadedData).toBe(false);
                done();
            }).catch(err => done(err));
        });

        it('creates models for lazy loaded objects', (done) => {
            unloadedWithValues
                .load()
                .then(() => {
                    expect(unloadedWithValues.valuesContainerMap.size).toBe(3);
                    unloadedWithValues.toArray().forEach(value => expect(value).toBeInstanceOf(Model));
                    done();
                })
                .catch(err => done(err));
        });

        it('supports lazy loading collection fields that were not included in the original API query', (done) => {
            expect(excludedByFieldFilters.hasUnloadedData).toBe(true);

            excludedByFieldFilters
                .load()
                .then(() => {
                    expect(api.get).toHaveBeenCalled();
                    expect(excludedByFieldFilters.hasUnloadedData).toBe(false);
                    done();
                }).catch(err => done(err));
        });
    });
});
