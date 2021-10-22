import MockLogger from '../../logger/Logger';
import MockApi from '../../api/Api';
import ModelValidation from '../ModelValidation';

jest.mock('../../logger/Logger', () => class Logger {
    static getLogger() {
        return new Logger();
    }
});
jest.mock('../../api/Api');
jest.mock('../helpers/json', () => ({
    getOwnedPropertyJSON() {
        return { id: 'R4dd3wwdwdw', name: 'ANC' };
    },
}));

describe('ModelValidations', () => {
    let mockApi;
    let modelValidation;

    beforeEach(() => {
        mockApi = MockApi.getApi();

        modelValidation = new ModelValidation(new MockLogger({}));
    });

    afterEach(() => {
        MockApi.mockReset();
    });

    it('should create a ModelValidation object', () => {
        expect(modelValidation).toBeInstanceOf(ModelValidation);
    });

    it('should not be allowed to be called without new', () => {
        expect(() => ModelValidation()).toThrowError('Cannot call a class as a function');
    });

    describe('getModelValidation', () => {
        it('should return a ModelValidation object', () => {
            expect(ModelValidation.getModelValidation()).toBeInstanceOf(ModelValidation);
        });

        it('should create a singleton and return that', () => {
            expect(ModelValidation.getModelValidation()).toBe(ModelValidation.getModelValidation());
        });
    });

    describe('validateAgainstSchema', () => {
        let modelMock;

        beforeEach(() => {
            modelMock = {
                modelDefinition: {
                    name: 'dataElement',
                    getOwnedPropertyJSON: jest.fn()
                        .mockReturnValueOnce({ id: 'R4dd3wwdwdw', name: 'ANC' }),
                    getOwnedPropertyNames: jest.fn()
                        .mockReturnValueOnce(['id', 'name']),
                    modelValidations: {
                        id: {},
                        name: {},
                    },
                },
                dataValues: { id: 'R4dd3wwdwdw', name: 'ANC' },
                getCollectionChildrenPropertyNames: jest.fn().mockReturnValueOnce([]),
                getReferenceProperties: jest.fn().mockReturnValueOnce([]),
            };
        });

        it('should be a function', () => {
            expect(modelValidation.validateAgainstSchema).toBeInstanceOf(Function);
        });

        it('should return a promise', () => {
            mockApi.post.mockReturnValueOnce(Promise.resolve({}));

            expect(modelValidation.validateAgainstSchema(modelMock)).toBeInstanceOf(Promise);
        });

        it('should return a rejected promise if the model.modelDefinition.name is not present', () => {
            modelValidation.validateAgainstSchema()
                .catch((message) => {
                    expect(message).toBe('model.modelDefinition.name can not be found');
                });
        });

        it('should call the post method on the Api', () => {
            mockApi.post.mockReturnValueOnce(Promise.resolve({
                httpStatus: 'OK',
                httpStatusCode: 200,
                status: 'OK',
                response: {
                    responseType: 'ValidationViolations',
                },
            }));

            return modelValidation.validateAgainstSchema(modelMock)
                .then(() => {
                    expect(mockApi.post).toBeCalled();
                });
        });

        it('should call the post method on the api with the modeldata', () => {
            mockApi.post.mockReturnValueOnce(Promise.resolve({
                httpStatus: 'OK',
                httpStatusCode: 200,
                status: 'OK',
                response: {
                    responseType: 'ValidationViolations',
                },
            }));

            return modelValidation.validateAgainstSchema(modelMock)
                .then(() => {
                    expect(mockApi.post).toBeCalledWith(
                        'schemas/dataElement',
                        { id: 'R4dd3wwdwdw', name: 'ANC' },
                    );
                });
        });

        it('should return the validationViolations array from the webmessage', () => {
            const schemaValidationResult = {
                httpStatus: 'Bad Request',
                httpStatusCode: 400,
                status: 'ERROR',
                response: {
                    responseType: 'ErrorReports',
                    errorReports: [
                        {
                            message: 'Missing required property `domainType`.',
                            mainKlass: 'org.hisp.dhis.dataelement.DataElement',
                            errorKlass: 'org.hisp.dhis.dataelement.DataElementDomain',
                            errorCode: 'E4000',
                        },
                        {
                            message: 'Missing required property `categoryCombo`.',
                            mainKlass: 'org.hisp.dhis.dataelement.DataElement',
                            errorKlass: 'org.hisp.dhis.dataelement.DataElementCategoryCombo',
                            errorCode: 'E4000',
                        },
                        {
                            message: 'Missing required property `name`.',
                            mainKlass: 'org.hisp.dhis.dataelement.DataElement',
                            errorKlass: 'java.lang.String',
                            errorCode: 'E4000',
                        },
                        {
                            message: 'Missing required property `shortName`.',
                            mainKlass: 'org.hisp.dhis.dataelement.DataElement',
                            errorKlass: 'java.lang.String',
                            errorCode: 'E4000',
                        },
                    ],
                },
            };
            mockApi.post.mockReturnValueOnce(Promise.reject(schemaValidationResult));

            return modelValidation.validateAgainstSchema(modelMock)
                .then((validationMessages) => {
                    expect(validationMessages).toBe(schemaValidationResult.response.errorReports);
                });
        });

        it('should return the errorReports array from the webmessage', () => {
            const schemaValidationResult = {
                httpStatus: 'Bad Request',
                httpStatusCode: 400,
                status: 'ERROR',
                response: {
                    errorReports: [{ message: 'Required property missing.', property: 'name' }],
                },
            };
            mockApi.post.mockReturnValueOnce(Promise.reject(schemaValidationResult));

            return modelValidation.validateAgainstSchema(modelMock)
                .then((validationMessages) => {
                    expect(validationMessages).toEqual([{ message: 'Required property missing.', property: 'name' }]);
                });
        });

        it('should return an empty array when the validation passed', (done) => {
            mockApi.post.mockReturnValueOnce(Promise.resolve({
                httpStatus: 'OK',
                httpStatusCode: 200,
                status: 'OK',
                response: {
                    responseType: 'ValidationViolations',
                },
            }));

            modelValidation.validateAgainstSchema(modelMock)
                .then((validationMessages) => {
                    expect(validationMessages).toEqual([]);
                    done();
                })
                .catch(done);
        });

        it('should throw an error when the server does not return the correct WebMessage format', () => {
            const schemaValidationResult = {
                httpStatus: 'Bad Request',
                httpStatusCode: 400,
                status: 'ERROR',
                response: {},
            };
            mockApi.post.mockReturnValueOnce(Promise.reject(schemaValidationResult));

            return modelValidation.validateAgainstSchema(modelMock)
                .catch((errorMessage) => {
                    expect(errorMessage.message).toBe('Response was not a WebMessage with the expected format');
                });
        });

        it('should reject the promise if the server gives a successful status code ' +
            'but the web message status is not the `OK` string', () => {
            mockApi.post.mockReturnValueOnce(Promise.resolve({ data: 'someData' }));

            return modelValidation.validateAgainstSchema(modelMock)
                .catch((errorMessage) => {
                    expect(errorMessage.message).toBe('Response was not a WebMessage with the expected format');
                });
        });
    });
});
