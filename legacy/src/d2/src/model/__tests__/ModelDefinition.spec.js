import fixtures from '../../__fixtures__/fixtures';
import { DIRTY_PROPERTY_LIST } from '../ModelBase';
import Model from '../Model';
import ModelDefinitions from '../ModelDefinitions';
import ModelCollectionProperty from '../ModelCollectionProperty';
import ModelCollection from '../ModelCollection';
import ModelDefinition from '../ModelDefinition';

jest.mock('../ModelCollection');
jest.mock('../ModelCollectionProperty');
jest.mock('../Model');

describe('ModelDefinition', () => {
    let modelDefinition;
    let mockModelCollectionCreate;
    let mockModelCollectionPropertyCreate;

    beforeEach(() => {
        modelDefinition = new ModelDefinition({
            displayName: 'Data Elements',
            singular: 'dataElement',
            plural: 'dataElements',
        });
        mockModelCollectionCreate = jest.fn(ModelCollection, 'create');
        mockModelCollectionCreate.mockReturnValue(new ModelCollection(modelDefinition, [], {}));
        mockModelCollectionPropertyCreate = jest.fn(ModelCollectionProperty, 'create');
        mockModelCollectionPropertyCreate.mockReturnValue(
            new ModelCollectionProperty({}, modelDefinition, 'propName', [], undefined),
        );
    });

    it('should not be allowed to be called without new', () => {
        expect(() => ModelDefinition()).toThrowError('Cannot call a class as a function');
    });

    it('should create a ModelDefinition object', () => {
        expect(modelDefinition).toBeInstanceOf(ModelDefinition);
    });

    it('should not add epiEndpoint when it does not exist', () => {
        expect(modelDefinition.apiEndpoint).toBeUndefined();
    });

    it('should throw an error when a name is not specified', () => {
        function shouldThrow() {
            return new ModelDefinition();
        }
        expect(shouldThrow).toThrowError('Value should be provided');
    });

    it('should throw an error when plural is not specified', () => {
        function shouldThrow() {
            return new ModelDefinition({ displayName: 'Data Elements', singular: 'dataElement' });
        }
        expect(shouldThrow).toThrowError('Plural should be provided');
    });

    describe('instance', () => {
        it('should not be able to change the name', () => {
            const isWritable = Object.getOwnPropertyDescriptor(modelDefinition, 'name').writable;
            const isConfigurable = Object.getOwnPropertyDescriptor(modelDefinition, 'name').configurable;

            expect(isWritable).toBe(false);
            expect(isConfigurable).toBe(false);
        });

        it('should not change the name', () => {
            function shouldThrow() {
                modelDefinition.name = 'anotherName';

                if (modelDefinition.name !== 'anotherName') {
                    throw new Error('');
                }
            }

            expect(shouldThrow).toThrowError();
            expect(modelDefinition.name).toBe('dataElement');
        });

        it('should have the correct displayName', () => {
            expect(modelDefinition.displayName).toBe('Data Elements');
        });

        it('should not change the displayName', () => {
            function shouldThrow() {
                modelDefinition.displayName = 'Another Name';
            }

            expect(shouldThrow).toThrowError();
            expect(modelDefinition.displayName).toBe('Data Elements');
        });

        it('should not be able to change the isMetaData', () => {
            const isWritable = Object.getOwnPropertyDescriptor(modelDefinition, 'isMetaData').writable;
            const isConfigurable = Object.getOwnPropertyDescriptor(modelDefinition, 'isMetaData').configurable;

            expect(isWritable).toBe(false);
            expect(isConfigurable).toBe(false);
        });

        it('should not change the isMetaData', () => {
            function shouldThrow() {
                modelDefinition.isMetaData = true;

                if (modelDefinition.isMetaData !== true) {
                    throw new Error('');
                }
            }

            expect(modelDefinition.isMetaData).toBe(false);
            expect(shouldThrow).toThrowError();
        });
    });

    describe('createFromSchema', () => {
        let dataElementModelDefinition;

        beforeEach(() => {
            dataElementModelDefinition = ModelDefinition.createFromSchema(
                fixtures.get('/api/schemas/dataElement'),
                fixtures.get('/api/attributes').attributes,
            );
        });

        it('should be a method on ModelDefinition', () => {
            expect(ModelDefinition.createFromSchema).toBeDefined();
        });

        it('should throw if the schema is not provided', () => {
            expect(ModelDefinition.createFromSchema).toThrowError('Schema should be provided');
        });

        describe('dataElementSchema', () => {
            it('should return a ModelDefinition object', () => {
                expect(dataElementModelDefinition).toBeInstanceOf(ModelDefinition);
            });

            it('should set the name on the definition', () => {
                expect(dataElementModelDefinition.name).toBe('dataElement');
            });

            it('should set if it is a metadata model', () => {
                expect(dataElementModelDefinition.isMetaData).toBe(true);
            });

            it('should set the epiEndpoint', () => {
                expect(dataElementModelDefinition.apiEndpoint).toBe('https://play.dhis2.org/demo/api/dataElements');
            });

            it('should set metadata to false if it is not a metadata model', () => {
                const nonMetaDataModel = fixtures.get('/api/schemas/dataElement');
                nonMetaDataModel.metadata = false;

                dataElementModelDefinition = ModelDefinition.createFromSchema(nonMetaDataModel);

                expect(dataElementModelDefinition.isMetaData).toBe(false);
            });

            it('should a properties property for each of the schema properties', () => {
                expect(Object.keys(dataElementModelDefinition.modelProperties).length).toBe(37);
            });

            it('should not be able to modify the modelProperties array', () => {
                function shouldThrow() {
                    dataElementModelDefinition.modelProperties.anotherKey = {};

                    // TODO: There is an implementation bug in PhantomJS that does not properly freeze the array
                    if (Object.keys(dataElementModelDefinition.modelProperties).length === 37) {
                        throw new Error();
                    }
                }

                expect(shouldThrow).toThrowError();
                expect(Object.keys(dataElementModelDefinition.modelProperties).length).toBe(37);
            });

            it('should store property constants', () => {
                dataElementModelDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/dataElement'));

                expect(dataElementModelDefinition.modelProperties.aggregationType.constants).toEqual([
                    'SUM',
                    'AVERAGE',
                    'AVERAGE_SUM_ORG_UNIT',
                    'COUNT',
                    'STDDEV',
                    'VARIANCE',
                    'MIN',
                    'MAX',
                    'NONE',
                    'CUSTOM',
                    'DEFAULT',
                    'AVERAGE_SUM_INT',
                    'AVERAGE_SUM_INT_DISAGGREGATION',
                    'AVERAGE_INT',
                    'AVERAGE_INT_DISAGGREGATION',
                    'AVERAGE_BOOL',
                ]);
            });
        });

        describe('modelProperties', () => {
            let modelProperties;

            beforeEach(() => {
                modelProperties = dataElementModelDefinition.modelProperties;
            });

            it('should be an object', () => {
                expect(modelProperties.name).toBeInstanceOf(Object);
            });

            it('should throw an error when a type is not found', () => {
                const schema = fixtures.get('/api/schemas/dataElement');
                function shouldThrow() {
                    ModelDefinition.createFromSchema(schema);
                }

                schema.properties.push({
                    name: 'unknownProperty',
                    propertyType: 'uio.some.unknown.type',
                });

                expect(shouldThrow)
                    .toThrowError('Type from schema "uio.some.unknown.type" not found available type list.');
            });

            it('should not add properties that do not have a name', () => {
                const schema = fixtures.get('/api/schemas/dataElement');
                const expectedProperties = [
                    'aggregationLevels',
                    'zeroIsSignificant',
                    'displayDescription',
                    'optionSet',
                    'id',
                    'created',
                    'description',
                    'displayFormName',
                    'commentOptionSet',
                    'name',
                    'externalAccess',
                    'valueType',
                    'href',
                    'dataElementGroups',
                    'publicAccess',
                    'aggregationType',
                    'formName',
                    'lastUpdated',
                    'dataSetElements',
                    'code',
                    'access',
                    'url',
                    'domainType',
                    'legendSet',
                    'legendSets',
                    'categoryCombo',
                    'attributeValues',
                    'optionSetValue',
                    'userGroupAccesses',
                    'userAccesses',
                    'shortName',
                    'displayName',
                    'displayShortName',
                    'user',
                    'translations',
                    'dimensionItem',
                    'dimensionItemType',
                ];

                schema.properties.push({ propertyType: 'TEXT' });

                const definition = ModelDefinition.createFromSchema(schema);

                expect(Object.keys(definition.modelProperties).sort()).toEqual(expectedProperties.sort());
            });

            it('should use the collection name for collections', () => {
                expect(modelProperties.dataElementGroups).toBeDefined();
                expect(modelProperties.dataElementGroup).toBeUndefined();
            });

            it('should add a get method to the propertyDescriptor', () => {
                expect(modelProperties.name.get).toBeInstanceOf(Function);
            });

            it('should add a set method to the propertyDescriptor for name', () => {
                expect(modelProperties.name.set).toBeInstanceOf(Function);
            });

            it('should not have a set method for dimensionItem', () => {
                expect(modelProperties.dimensionItem.set).not.toBeInstanceOf(Function);
            });

            it('should create getter function on the propertyDescriptor', () => {
                const model = {
                    dataValues: {
                        name: 'Mark',
                    },
                };

                expect(modelProperties.name.get.call(model)).toBe('Mark');
            });

            it('should create setter function on the propertyDescriptor', () => {
                const model = {
                    dataValues: {},
                };
                model[DIRTY_PROPERTY_LIST] = new Set([]);

                modelProperties.name.set.call(model, 'James');

                expect(model.dataValues.name).toBe('James');
            });

            describe('setter', () => {
                let model;

                beforeEach(() => {
                    model = {
                        dirty: false,
                        dataValues: {},
                    };

                    model[DIRTY_PROPERTY_LIST] = new Set([]);
                });

                it('should set the dirty property to true when a value is set', () => {
                    modelProperties.name.set.call(model, 'James');

                    expect(model.dirty).toBe(true);
                });

                it('should not set the dirty property to true when the value is the same', () => {
                    model.dataValues.name = 'James';
                    modelProperties.name.set.call(model, 'James');

                    expect(model.dirty).toBe(false);
                });

                it('should set the dirty property when a different object is added', () => {
                    model.dataValues.name = { name: 'James' };
                    modelProperties.name.set.call(model, { name: 'James', last: 'Doe' });

                    expect(model.dirty).toBe(true);
                });
            });
        });

        describe('modelValidations', () => {
            let modelValidations;

            beforeEach(() => {
                modelValidations = dataElementModelDefinition.modelValidations;
            });

            describe('created', () => {
                it('should set the data object as a type for date fields', () => {
                    expect(modelValidations.created.type).toBe('DATE');
                });

                it('should be owned by this schema', () => {
                    expect(modelValidations.created.owner).toBe(true);
                });
            });

            describe('externalAccess', () => {
                it('should set the boolean datatype for externalAccess', () => {
                    expect(modelValidations.externalAccess.type).toBe('BOOLEAN');
                });

                it('should not be owned by this schema', () => {
                    expect(modelValidations.externalAccess.owner).toBe(false);
                });

                // TODO: This currently has some sort of max value
                // it('should not have a maxLength property', () => {
                //    expect(modelValidations.externalAccess.maxLength).toBe(undefined);
                // });
            });

            describe('id', () => {
                it('should have a maxLength', () => {
                    expect(modelValidations.id.max).toBe(11);
                });
            });

            describe('name', () => {
                it('should have have a type property', () => {
                    expect(modelValidations.name.type).toBe('TEXT');
                });

                it('should have a persisted property', () => {
                    expect(modelValidations.name.persisted).toBe(true);
                });

                it('should have a required property', () => {
                    expect(modelValidations.name.required).toBe(true);
                });

                it('should have an owner property', () => {
                    expect(modelValidations.name.owner).toBe(true);
                });
            });

            it('should add the referenceType to the optionSet and commentOptionSet', () => {
                expect(modelValidations.commentOptionSet.referenceType).toBe('optionSet');
                expect(modelValidations.optionSet.referenceType).toBe('optionSet');
            });

            it('should add the referenceType to the categoryCombo property', () => {
                expect(modelValidations.categoryCombo.referenceType).toBe('categoryCombo');
            });

            it('should add the referenceType to the user property', () => {
                expect(modelValidations.user.referenceType).toBe('user');
            });

            it('should not add a referenceType for a property that are not a reference', () => {
                expect(modelValidations.name.referenceType).toBeUndefined();
            });

            describe('ordered', () => {
                it('should set ordered to false when the property is not available', () => {
                    expect(modelValidations.name.ordered).toBe(false);
                });

                it('should set ordered to false when the ordered property is available and is false', () => {
                    const dataElementSchemaFixture = fixtures.get('/api/schemas/dataElement');
                    dataElementSchemaFixture.properties[0].ordered = false;

                    dataElementModelDefinition = ModelDefinition.createFromSchema(
                        dataElementSchemaFixture,
                        fixtures.get('/api/attributes').attributes,
                    );

                    modelValidations = dataElementModelDefinition.modelValidations;

                    expect(modelValidations.aggregationType.ordered).toBe(false);
                });

                it('should set ordered to true when the ordered property is available and is true', () => {
                    const dataElementSchemaFixture = fixtures.get('/api/schemas/dataElement');
                    dataElementSchemaFixture.properties[0].ordered = true;

                    dataElementModelDefinition = ModelDefinition.createFromSchema(
                        dataElementSchemaFixture,
                        fixtures.get('/api/attributes').attributes,
                    );

                    modelValidations = dataElementModelDefinition.modelValidations;

                    expect(modelValidations.aggregationLevels.ordered).toBe(true);
                });
            });

            describe('collection reference', () => {
                let indicatorGroupModelDefinition;

                beforeEach(() => {
                    const indicatorGroupSchema = fixtures.get('/api/schemas/indicatorGroup');
                    indicatorGroupModelDefinition = ModelDefinition.createFromSchema(indicatorGroupSchema);
                    modelValidations = indicatorGroupModelDefinition.modelValidations;
                });

                it('should add a reference type for a collection of references', () => {
                    expect(modelValidations.indicators.referenceType).toBe('indicator');
                });

                it('should not add a reference type for a collection of complex objects', () => {
                    expect(modelValidations.userGroupAccesses.referenceType).toBeUndefined();
                });
            });

            describe('embedded object property', () => {
                let indicatorGroupModelDefinition;

                beforeEach(() => {
                    const legendSetSchema = fixtures.get('/api/schemas/legendSet');
                    indicatorGroupModelDefinition = ModelDefinition.createFromSchema(legendSetSchema);
                    modelValidations = indicatorGroupModelDefinition.modelValidations;
                });

                it('should have set the embedded property validation for userGroupAcceses to true', () => {
                    expect(modelValidations.userGroupAccesses.embeddedObject).toBe(true);
                });

                it('should have set the embedded property validation for attributeValues to false', () => {
                    expect(modelValidations.attributeValues.embeddedObject).toBe(false);
                });

                it('should set the embedded object to false for simple types', () => {
                    expect(modelValidations.name.embeddedObject).toBe(false);
                });
            });
        });

        describe('specialized definitions', () => {
            let UserModelDefinition;
            let userModelDefinition;

            let DataSetModelDefinition;
            let dataSetModelDefinition;

            beforeEach(() => {
                UserModelDefinition = ModelDefinition.specialClasses.user;
                userModelDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/user'));

                DataSetModelDefinition = ModelDefinition.specialClasses.dataSet;
                dataSetModelDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/dataSet'));
            });

            it('should return a UserModelDefinition for the user schema', () => {
                expect(userModelDefinition).toBeInstanceOf(UserModelDefinition);
            });

            it('should return a DataSetModelDefinition for the data set schema', () => {
                expect(dataSetModelDefinition).toBeInstanceOf(DataSetModelDefinition);
            });
        });

        describe('attribute properties', () => {
            let attributeProperties;

            beforeEach(() => {
                attributeProperties = dataElementModelDefinition.attributeProperties;
            });

            it('should have added the attribute properties onto the model', () => {
                expect(attributeProperties).toBeDefined();
            });

            it('should be descriptor objects', () => {
                expect(attributeProperties.name).toBeInstanceOf(Object);
            });
        });
    });

    describe('create()', () => {
        let dataElementModelDefinition;

        beforeEach(() => {
            dataElementModelDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/dataElement'));
        });

        // TODO: This is currently not a pure unit test as we haven't mocked out Model
        it('should return an instance of Model', () => {
            expect(dataElementModelDefinition.create()).toBeInstanceOf(Model);
        });

        describe('with default values', () => {
            const orgUnitGroupSchema = fixtures.get('/api/schemas/organisationUnitGroupSet');
            const organisationUnitGroupSetModelDefinition = ModelDefinition.createFromSchema(orgUnitGroupSchema);
            let model;

            beforeEach(() => {
                model = organisationUnitGroupSetModelDefinition.create();
            });

            it('should set the default data dimension', () => {
                expect(model.dataDimension).toBe(true);
            });
        });

        describe('collection properties', () => {
            let orgunitModelDefinition;
            let userModelDefinition;

            beforeEach(() => {
                const orgUnitSchema = fixtures.get('/api/schemas/organisationUnit');
                userModelDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/user'));
                orgunitModelDefinition = ModelDefinition.createFromSchema(orgUnitSchema);

                // TODO: Mock the ModelDefinitions singleton, so we can get rid of this logic
                if (!ModelDefinitions.getModelDefinitions().user) {
                    ModelDefinitions.getModelDefinitions().add(userModelDefinition);
                }
                if (!ModelDefinitions.getModelDefinitions().organisationUnit) {
                    ModelDefinitions.getModelDefinitions().add(orgunitModelDefinition);
                }
            });

            afterEach(() => {
                ModelCollectionProperty.create.mockClear();
            });

            describe('with data', () => {
                beforeEach(() => {
                    userModelDefinition.create({
                        organisationUnits: [
                            { name: 'Kenya', id: 'FTRrcoaog83' },
                            { name: 'Oslo', id: 'P3jJH5Tu5VC' },
                        ],
                    });
                });

                it('should create a ModelCollectionProperty.create for a collection of objects', () => {
                    expect(ModelCollectionProperty.create).toHaveBeenCalledTimes(9);
                });

                it('should create a ModelCollectionProperty with the correct values', () => {
                    expect(ModelCollectionProperty.create.mock.calls[0]).toMatchSnapshot();
                });
            });

            describe('without data', () => {
                beforeEach(() => {
                    userModelDefinition.create();
                });

                it('should create a ModelCollectionProperty.create for a collection of objects', () => {
                    expect(ModelCollectionProperty.create).toHaveBeenCalledTimes(3);
                });

                it('should create a ModelCollectionProperty without data', () => {
                    const passedModelInstance = ModelCollectionProperty.create.mock.calls[0][0];
                    const modelDefinitionForCollection = ModelCollectionProperty.create.mock.calls[0][1];
                    const modelCollectionPropName = ModelCollectionProperty.create.mock.calls[0][2];
                    const modelCollectionData = ModelCollectionProperty.create.mock.calls[0][3];

                    // First argument to ModelCollectionPrototype.create
                    expect(passedModelInstance).toMatchSnapshot();

                    // Second argument to ModelCollectionProperty.create
                    expect(modelDefinitionForCollection.name).toBe(orgunitModelDefinition.name);
                    expect(modelDefinitionForCollection.plural).toBe(orgunitModelDefinition.plural);

                    // Third argument to ModelCollectionProperty.create
                    // teiSearchOrganisationUnits is the first collection property on the user model
                    expect(modelCollectionPropName).toEqual('teiSearchOrganisationUnits');

                    // Fourth argument to ModelCollectionProperty.create
                    expect(modelCollectionData).toEqual(undefined);
                });
            });
        });
    });

    describe('get', () => {
        let dataElementModelDefinition;

        beforeEach(() => {
            ModelDefinition.prototype.api = {
                get: jest.fn().mockReturnValue(new Promise((resolve) => {
                    resolve({ name: 'BS_COLL (N, DSD) TARGET: Blood Units Donated' });
                })),
            };

            dataElementModelDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/dataElement'));
        });

        it('should throw an error when the given id is not a string', () => {
            function shouldThrow() {
                dataElementModelDefinition.get();
            }

            expect(shouldThrow).toThrowError('Identifier should be provided');
        });

        it('should return a promise', () => {
            const modelPromise = dataElementModelDefinition
                .get('d4343fsss');

            expect(modelPromise.then).toBeInstanceOf(Function);
        });

        it('should call the api for the requested id', () => {
            dataElementModelDefinition.get('d4343fsss');

            expect(ModelDefinition.prototype.api.get).toBeCalledWith('https://play.dhis2.org/demo/api/dataElements/d4343fsss', { fields: ':all,attributeValues[:all,attribute[id,name,displayName]]' });
        });

        it('should set the data onto the model when it is available', () => dataElementModelDefinition.get('d4343fsss')
            .then((dataElementModel) => {
                expect(dataElementModel.name).toBe('BS_COLL (N, DSD) TARGET: Blood Units Donated');
            }));

        it('should reject the promise with the message when the request fails', () => {
            ModelDefinition.prototype.api.get = jest.fn()
                .mockReturnValue(Promise.reject({
                    httpStatus: 'Not Found',
                    httpStatusCode: 404,
                    status: 'ERROR',
                    message: 'DataElementCategory with id sdfsf could not be found.',
                }));

            return dataElementModelDefinition.get('d4343fsss')
                .catch((dataElementError) => {
                    expect(dataElementError).toBe('DataElementCategory with id sdfsf could not be found.');
                });
        });

        it('should reject with the promise payload when no message was returned', () => {
            const responsePayload = '500 error string';

            ModelDefinition.prototype.api.get = jest.fn().mockReturnValue(Promise.reject(responsePayload));

            return dataElementModelDefinition.get('d4343fsss')
                .catch((dataElementError) => {
                    expect(dataElementError).toBe(responsePayload);
                });
        });

        describe('multiple', () => {
            it('should return a ModelCollection object', () => {
                const dataElementsResult = fixtures.get('/api/dataElements');
                ModelDefinition.prototype.api.get = jest.fn().mockReturnValue(Promise.resolve(dataElementsResult));

                return dataElementModelDefinition.get(['id1', 'id2'])
                    .then((dataElementCollection) => {
                        expect(dataElementCollection).toBeInstanceOf(ModelCollection);
                    });
            });

            it('should call the api with the in filter', () => {
                const dataElementsResult = fixtures.get('/api/dataElements');
                ModelDefinition.prototype.api.get = jest.fn().mockReturnValue(Promise.resolve(dataElementsResult));

                return dataElementModelDefinition.get(['id1', 'id2'])
                    .then(() => {
                        expect(ModelDefinition.prototype.api.get).toBeCalledWith('https://play.dhis2.org/demo/api/dataElements', { filter: ['id:in:[id1,id2]'], fields: ':all' });
                    });
            });
        });
    });

    describe('list', () => {
        const dataElementsResult = fixtures.get('/api/dataElements');
        let dataElementModelDefinition;

        beforeEach(() => {
            ModelDefinition.prototype.api = {
                get: jest.fn().mockReturnValue(new Promise((resolve) => {
                    resolve(dataElementsResult);
                })),
            };

            dataElementModelDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/dataElement'));
        });

        it('should be a function', () => {
            expect(dataElementModelDefinition.list).toBeInstanceOf(Function);
        });

        it('should call the get method on the api', () => {
            dataElementModelDefinition.list();

            expect(ModelDefinition.prototype.api.get).toBeCalled();
        });

        it('should return a promise', () => {
            expect(dataElementModelDefinition.list()).toBeInstanceOf(Promise);
        });

        it('should call the get method on the api with the endpoint of the model', () => {
            dataElementModelDefinition.list();

            expect(ModelDefinition.prototype.api.get).toBeCalledWith('https://play.dhis2.org/demo/api/dataElements', { fields: ':all' });
        });

        it('should return a model collection object', () => dataElementModelDefinition.list()
            .then((dataElementCollection) => {
                expect(dataElementCollection).toBeInstanceOf(ModelCollection);
            }));

        it('should call the model collection constructor with the correct data', () => dataElementModelDefinition.list()
            .then(() => {
                const firstCallArguments = ModelCollection.create.mock.calls[0];

                expect(firstCallArguments).toMatchSnapshot();
            }));

        it('should call the api get method with the correct parameters after filters are set', () => {
            dataElementModelDefinition
                .filter()
                .on('name').like('John')
                .list();

            expect(ModelDefinition.prototype.api.get).toBeCalledWith('https://play.dhis2.org/demo/api/dataElements', { fields: ':all', filter: ['name:like:John'] });
        });

        it('should return a separate modelDefinition when filter is called', () => {
            expect(dataElementModelDefinition.filter).not.toBe(dataElementModelDefinition);
        });

        it('should not influence the list method of the default modelDefinition', () => {
            dataElementModelDefinition
                .filter().on('name').like('John')
                .list();

            dataElementModelDefinition.list();

            expect(ModelDefinition.prototype.api.get).toBeCalledWith('https://play.dhis2.org/demo/api/dataElements', { fields: ':all' });
            expect(ModelDefinition.prototype.api.get).toBeCalledWith('https://play.dhis2.org/demo/api/dataElements', { fields: ':all', filter: ['name:like:John'] });
        });

        it('should support multiple filters', () => {
            dataElementModelDefinition
                .filter()
                .on('name')
                .like('John')
                .filter()
                .on('username')
                .equals('admin')
                .list();

            expect(ModelDefinition.prototype.api.get).toBeCalledWith('https://play.dhis2.org/demo/api/dataElements', { fields: ':all', filter: ['name:like:John', 'username:eq:admin'] });
        });

        it('should work with operator-filter', () => {
            dataElementModelDefinition
                .filter()
                .on('name')
                .operator('like', 'John')
                .list();

            expect(ModelDefinition.prototype.api.get).toBeCalledWith('https://play.dhis2.org/demo/api/dataElements', { fields: ':all', filter: ['name:like:John'] });
        });

        it('should work with chained operator-filter', () => {
            dataElementModelDefinition
                .filter()
                .on('name')
                .operator('like', 'John')
                .filter()
                .on('username')
                .operator('token', 'admin')
                .list();

            expect(ModelDefinition.prototype.api.get).toBeCalledWith('https://play.dhis2.org/demo/api/dataElements', { fields: ':all', filter: ['name:like:John', 'username:token:admin'] });
        });

        it('should work with rootJunction', () => {
            dataElementModelDefinition
                .filter()
                .logicMode('OR')
                .on('name')
                .like('John')
                .filter()
                .logicMode('OR')
                .on('username')
                .token('admin')
                .list();

            expect(ModelDefinition.prototype.api.get).toBeCalledWith('https://play.dhis2.org/demo/api/dataElements', { fields: ':all', filter: ['name:like:John', 'username:token:admin'], rootJunction: 'OR' });
        });

        it('should not try to filter by "undefined"', () => {
            dataElementModelDefinition
                .list({ filter: undefined });

            expect(ModelDefinition.prototype.api.get).toBeCalledWith('https://play.dhis2.org/demo/api/dataElements', { fields: ':all' });
        });

        it('should work by constructing filters before calling list', () => {
            const filters = dataElementModelDefinition.filter();
            filters.logicMode('OR');
            filters.on('name').like('John');
            filters.on('username').token('admin');
            filters.list();

            expect(ModelDefinition.prototype.api.get).toBeCalledWith('https://play.dhis2.org/demo/api/dataElements', { fields: ':all', filter: ['name:like:John', 'username:token:admin'], rootJunction: 'OR' });
        });
    });

    describe('clone', () => {
        const dataElementsResult = fixtures.get('/api/dataElements');
        let dataElementModelDefinition;

        beforeEach(() => {
            ModelDefinition.prototype.api = {
                get: jest.fn().mockReturnValue(new Promise((resolve) => {
                    resolve(dataElementsResult);
                })),
            };

            dataElementModelDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/dataElement'));
        });

        it('should be a method', () => {
            expect(dataElementModelDefinition.clone).toBeInstanceOf(Function);
        });

        it('should return a cloned modelDefinition', () => {
            expect(dataElementModelDefinition.clone()).not.toBe(dataElementModelDefinition);
        });

        it('should deep equal the creator', () => {
            const clonedDefinition = dataElementModelDefinition.clone();

            expect(clonedDefinition.name).toBe(dataElementModelDefinition.name);
            expect(clonedDefinition.plural).toBe(dataElementModelDefinition.plural);
            expect(clonedDefinition.isMetaData).toBe(dataElementModelDefinition.isMetaData);
            expect(clonedDefinition.apiEndpoint).toBe(dataElementModelDefinition.apiEndpoint);
            expect(clonedDefinition.modelProperties).toBe(dataElementModelDefinition.modelProperties);
        });

        it('should not have reset the filter', () => {
            const clonedDefinition = dataElementModelDefinition.clone();

            expect(clonedDefinition.filters).not.toBe(dataElementModelDefinition.filters);
        });

        it('should still work like normal modelDefinition', () => {
            const clonedDefinition = dataElementModelDefinition.clone();

            clonedDefinition.list();

            expect(ModelDefinition.prototype.api.get).toBeCalledWith('https://play.dhis2.org/demo/api/dataElements', { fields: ':all' });
        });
    });

    describe('saving', () => {
        let apiUpdateStub;
        let apiPostStub;
        let model;
        let userModelDefinition;

        beforeEach(() => {
            const singleUserAllFields = fixtures.get('/singleUserAllFields');

            apiUpdateStub = jest.fn().mockReturnValue(new Promise((resolve) => {
                resolve({ name: 'BS_COLL (N, DSD) TARGET: Blood Units Donated' });
            }));
            apiPostStub = jest.fn().mockReturnValue(new Promise((resolve) => {
                resolve({ name: 'BS_COLL (N, DSD) TARGET: Blood Units Donated' });
            }));

            ModelDefinition.prototype.api = {
                update: apiUpdateStub,
                post: apiPostStub,
            };

            userModelDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/user'));

            class Model { // eslint-disable-line no-shadow
                constructor() {
                    this.dataValues = {};
                    this[DIRTY_PROPERTY_LIST] = new Set([]);
                    this.getCollectionChildrenPropertyNames = jest.fn().mockReturnValue([]);
                    this.getEmbeddedObjectCollectionPropertyNames = jest.fn().mockReturnValue([]);
                    this.getReferenceProperties = jest.fn().mockReturnValue([]);
                }
            }
            model = new Model();

            Object.keys(singleUserAllFields).forEach((key) => {
                model.dataValues[key] = singleUserAllFields[key];
                model[key] = singleUserAllFields[key];
            });

            Object.defineProperty(model, 'modelDefinition', { value: userModelDefinition });
        });

        describe('save()', () => {
            it('should be a method that returns a promise', () => {
                expect(userModelDefinition.save(model)).toBeInstanceOf(Promise);
            });

            it('should call the update method on the api', () => {
                userModelDefinition.save(model);

                expect(apiUpdateStub).toBeCalled();
            });

            it('should pass only the properties that are owned to the api', () => {
                const expectedPayload = fixtures.get('/singleUserOwnerFields');

                userModelDefinition.save(model);

                expect(apiUpdateStub.mock.calls[0][1]).toEqual(expectedPayload);
            });

            it('should let a falsy value pass as an owned property', () => {
                const expectedPayload = fixtures.get('/singleUserOwnerFields');
                expectedPayload.surname = '';

                model.dataValues.surname = '';
                userModelDefinition.save(model);

                expect(apiUpdateStub.mock.calls[0][1].surname).toEqual(expectedPayload.surname);
            });

            it('should not let undefined pass as a value', () => {
                const expectedPayload = fixtures.get('/singleUserOwnerFields');
                delete expectedPayload.surname;

                model.dataValues.surname = undefined;
                userModelDefinition.save(model);

                expect(apiUpdateStub.mock.calls[0][1].surname).toEqual(expectedPayload.surname);
            });

            it('should not let null pass as a value', () => {
                const expectedPayload = fixtures.get('/singleUserOwnerFields');
                delete expectedPayload.surname;

                model.dataValues.surname = null;
                userModelDefinition.save(model);

                expect(apiUpdateStub.mock.calls[0][1].surname).toEqual(expectedPayload.surname);
            });

            it('should save to the url set on the model', () => {
                userModelDefinition.save(model);

                expect(apiUpdateStub.mock.calls[0][0]).toBe(fixtures.get('/singleUserAllFields').href);
            });

            it('should be able to construct a valid save url without an href set on the model', () => {
                delete model.dataValues.href;
                userModelDefinition.save(model);
                expect(apiUpdateStub.mock.calls[0][0]).toBe(fixtures.get('/singleUserAllFields').href);
            });

            it('should call the update method on the api with the replace strategy option set to true', () => {
                userModelDefinition.save(model);

                expect(apiUpdateStub.mock.calls[0][2]).toBe(true);
            });

            it('should save a new object using a post', () => {
                // Objects without id are concidered "new"
                delete model.id;

                userModelDefinition.save(model);

                expect(apiPostStub).toBeCalled();
            });

            it('should translate a collection property to an array of ids', () => {
                model.getCollectionChildrenPropertyNames.mockReturnValue(['organisationUnits']);
                model.dataValues.organisationUnits = new Set([
                    { name: 'Kenya', id: 'FTRrcoaog83' },
                    { name: 'Oslo', id: 'P3jJH5Tu5VC' },
                ]);

                userModelDefinition.save(model);

                expect(apiUpdateStub.mock.calls[0][1].organisationUnits)
                    .toEqual([{ id: 'FTRrcoaog83' }, { id: 'P3jJH5Tu5VC' }]);
            });

            it('should not add invalid objects that do not have an id', () => {
                model.getCollectionChildrenPropertyNames.mockReturnValue(['organisationUnits']);
                model.dataValues.organisationUnits = new Set([
                    { name: 'Kenya' },
                    { name: 'Oslo', id: 'P3jJH5Tu5VC' },
                ]);

                userModelDefinition.save(model);

                expect(apiUpdateStub.mock.calls[0][1].organisationUnits).toEqual([{ id: 'P3jJH5Tu5VC' }]);
            });
        });

        describe('saveNew()', () => {
            it('should be a method that returns a promise', () => {
                expect(userModelDefinition.saveNew(model)).toBeInstanceOf(Promise);
            });

            it('should call the update method on the api', () => {
                userModelDefinition.saveNew(model);

                expect(apiPostStub).toBeCalled();
            });

            it('should pass only the properties that are owned to the api', () => {
                const expectedPayload = fixtures.get('/singleUserOwnerFields');

                userModelDefinition.saveNew(model);

                expect(apiPostStub.mock.calls[0][1]).toEqual(expectedPayload);
            });
        });
    });

    describe('delete', () => {
        let apiDeleteStub;
        let model;
        let userModelDefinition;

        beforeEach(() => {
            const singleUserAllFields = fixtures.get('/singleUserAllFields');

            apiDeleteStub = jest.fn().mockReturnValue(new Promise((resolve) => {
                resolve();
            }));

            ModelDefinition.prototype.api = {
                delete: apiDeleteStub,
            };

            userModelDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/user'));

            class Model { // eslint-disable-line no-shadow
                constructor() {
                    this.dataValues = {};
                    this.modelDefinition = userModelDefinition;
                    this[DIRTY_PROPERTY_LIST] = new Set([]);
                }
            }
            model = new Model();

            Object
                .keys(singleUserAllFields)
                .forEach((key) => {
                    model.dataValues[key] = singleUserAllFields[key];
                    model[key] = singleUserAllFields[key];
                });
        });

        it('should call the delete method on the api', () => {
            userModelDefinition.delete(model);

            expect(apiDeleteStub).toBeCalled();
        });

        it('should call delete with the url', () => {
            userModelDefinition.delete(model);

            expect(apiDeleteStub).toBeCalledWith(model.href);
        });

        it('should return a promise', () => {
            expect(userModelDefinition.delete(model)).toBeInstanceOf(Promise);
        });

        it('should create the url from the endpoint and model.id when the href is not available', () => {
            model.dataValues.href = undefined;

            userModelDefinition.delete(model);

            expect(apiDeleteStub).toBeCalledWith('http://localhost:8080/dhis/api/users/aUplAx3DOWy');
        });
    });

    describe('getOwnedPropertyNames', () => {
        let dataElementModelDefinition;

        beforeEach(() => {
            dataElementModelDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/dataElement'));
        });

        it('should return only the owned properties', () => {
            const expectedDataElementProperties = [
                'lastUpdated', 'code', 'id', 'created', 'name', 'formName', 'legendSets',
                'shortName', 'zeroIsSignificant', 'publicAccess', 'commentOptionSet',
                'aggregationType', 'valueType', 'url', 'optionSet',
                'domainType', 'description', 'categoryCombo', 'user',
                'aggregationLevels', 'attributeValues', 'userAccesses', 'userGroupAccesses', 'translations',
            ].sort();
            const ownProperties = dataElementModelDefinition.getOwnedPropertyNames();

            expect(ownProperties.sort()).toEqual(expectedDataElementProperties);
        });
    });

    describe('isTranslatable', () => {
        let dataElementModelDefinition;
        let userModelDefinition;

        beforeEach(() => {
            dataElementModelDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/dataElement'));
            userModelDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/user'));
        });

        it('should be a function', () => {
            expect(typeof dataElementModelDefinition.isTranslatable).toBe('function');
        });

        it('should return true if the schema supports translations', () => {
            expect(dataElementModelDefinition.isTranslatable()).toBe(true);
        });

        it('should return false if the schema can not be translated', () => {
            expect(userModelDefinition.isTranslatable()).toBe(false);
        });
    });

    describe('getTranslatableProperties()', () => {
        let dataElementModelDefinition;

        beforeEach(() => {
            dataElementModelDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/dataElement'));
        });

        it('should be a function', () => {
            expect(typeof dataElementModelDefinition.getTranslatableProperties).toBe('function');
        });

        it('should return the translatable properties', () => {
            expect(dataElementModelDefinition.getTranslatableProperties())
                .toEqual(['description', 'formName', 'name', 'shortName']);
        });

        it('should return only the properties that have a translatableKey', () => {
            const dataElementSchema = fixtures.get('/api/schemas/dataElement');
            dataElementSchema.properties = dataElementSchema.properties
                .map(({ translationKey, ...props }) => ({ ...props }));

            dataElementModelDefinition = ModelDefinition.createFromSchema(dataElementSchema);

            expect(dataElementModelDefinition.getTranslatableProperties()).toEqual([]);
        });
    });

    describe('getTranslatablePropertiesWithKeys()', () => {
        let dataElementModelDefinition;

        beforeEach(() => {
            dataElementModelDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/dataElement'));
        });

        it('should be a function', () => {
            expect(typeof dataElementModelDefinition.getTranslatablePropertiesWithKeys).toBe('function');
        });

        it('should return the translatable properties with their keys', () => {
            expect(dataElementModelDefinition.getTranslatablePropertiesWithKeys()).toEqual([
                { name: 'description', translationKey: 'DESCRIPTION' },
                { name: 'formName', translationKey: 'FORM_NAME' },
                { name: 'name', translationKey: 'NAME' },
                { name: 'shortName', translationKey: 'SHORT_NAME' },
            ]);
        });

        it('should return only the properties that have a translatableKey', () => {
            const dataElementSchema = fixtures.get('/api/schemas/dataElement');
            dataElementSchema.properties = dataElementSchema.properties
                .map(({ translationKey, ...props }) => ({ ...props }));

            dataElementModelDefinition = ModelDefinition.createFromSchema(dataElementSchema);

            expect(dataElementModelDefinition.getTranslatablePropertiesWithKeys()).toEqual([]);
        });
    });
});

describe('ModelDefinition subsclasses', () => {
    let getOnApiStub;

    beforeEach(() => {
        getOnApiStub = jest.fn()
            .mockReturnValue(Promise.resolve());

        ModelDefinition.prototype.api = {
            get: getOnApiStub,
        };
    });

    describe('UserModelDefinition', () => {
        let UserModelDefinitionClass;
        let userModelDefinition;

        beforeEach(() => {
            UserModelDefinitionClass = ModelDefinition.specialClasses.user;

            userModelDefinition = new UserModelDefinitionClass({
                singular: 'user',
                plural: 'users',
                displayName: 'Users',
            },
            {},
            {},
            );
        });

        it('should be instance of Model', () => {
            expect(userModelDefinition).toBeInstanceOf(ModelDefinition);
        });

        it('should call the get function with the extra parameters', () => {
            userModelDefinition.get('myUserId');

            expect(getOnApiStub).toBeCalledWith('/myUserId', { fields: ':all,userCredentials[:owner]' });
        });
    });

    describe('DataSetModelDefinition', () => {
        let DataSetModelDefinitionClass;
        let dataSetModelDefinition;

        beforeEach(() => {
            DataSetModelDefinitionClass = ModelDefinition.specialClasses.dataSet;

            dataSetModelDefinition = new DataSetModelDefinitionClass(
                fixtures.get('/api/schemas/dataSet'),
                {},
                {},
                {},
                {},
            );
        });

        it('handles compulsory data element operands correctly', () => {
            const dataSet = dataSetModelDefinition.create({
                compulsoryDataElementOperands: ['one', 'two', 'three'],
            });
            expect(dataSet).toBeInstanceOf(Model);
            expect(dataSet.dataValues.compulsoryDataElementOperands).toEqual(['one', 'two', 'three']);
        });
    });

    describe('OrganisationUnitDefinition', () => {
        let OrganisationUnitModelDefinitionClass;
        let organisationUnitModelDefinition;

        beforeEach(() => {
            OrganisationUnitModelDefinitionClass = ModelDefinition.specialClasses.organisationUnit;

            organisationUnitModelDefinition = new OrganisationUnitModelDefinitionClass({
                singular: 'organisationUnit',
                plural: 'organisationUnits',
                apiEndpoint: 'organisationUnits',
            },
            {},
            {},
            {},
            {},
            );
        });

        it('should use the special root orgunit id when fetching lists', (done) => {
            organisationUnitModelDefinition.list({ root: 'myRootId' }).catch(() => {
                expect(getOnApiStub).toBeCalledWith('organisationUnits/myRootId', { fields: ':all' });
                done();
            });
        });

        it('should handle list queries without special `root` parameters', (done) => {
            organisationUnitModelDefinition.list().catch(() => {
                expect(getOnApiStub).toBeCalledWith('organisationUnits', { fields: ':all' });
                done();
            });
        });
    });
});
