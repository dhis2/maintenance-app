import programSchema from '../../../__fixtures__/schemas/program.json';
import ModelDefinition from 'd2/lib/model/ModelDefinition';
import {
    createNormalizrSchema,
    normalizeModel,
    getTypeFromModelDefinition,
    getModelValidationProperty,
} from '../normalizeModel';
import programFixture from './someProgram';
import someTrackerProgram from './trackerProgram';

describe('normalize model', () => {
    let programDefinition;
    let programModel;
    let trackerProgramModel;
    beforeAll(() => {
        programDefinition = ModelDefinition.createFromSchema(programSchema);
        programModel = programDefinition.create(programFixture);
        trackerProgramModel = programDefinition.create(someTrackerProgram);
    });

    describe('createNormnalizrSchema', () => {
        test('it should give a schema with all collection properties by default', () => {
            const schema = createNormalizrSchema(programDefinition);
            expect(schema).toHaveProperty('schema.programStages');
            expect(schema).not.toHaveProperty('schema.trackedEntityType');
        });

        test('it should give a schema with all collection and reference properties if given opts', () => {
            const schema = createNormalizrSchema(programDefinition, {
                includeReference: true,
            });
            expect(schema).toHaveProperty('schema.trackedEntityType');
        });
        test('it should not include collections when includeCollections is false', () => {
            const schema = createNormalizrSchema(programDefinition, {
                includeCollection: false,
            });
            expect(schema).not.toHaveProperty('schema.programStages');
            expect(schema).not.toHaveProperty('schema.trackedEntityType');
        });
    });

    describe('normalizeModel', () => {
        test('it should give an object with all collection properties that have values', () => {
            const normalized = normalizeModel(trackerProgramModel);
            const collectionProps = trackerProgramModel.getCollectionChildrenPropertyNames();
            expect(normalized).toHaveProperty('entities');
            expect(normalized).not.toHaveProperty('entities.trackedEntityType');
            //   expect(Array.isArray(normalized.entities.program.programStages)).toBeTruthy();
            Object.keys(normalized.entities).forEach(
                a => expect(collectionProps.includes(a)).toBeTruthy
            );
        });
    });

    describe('pickTypeFromModelDefinition', () => {
        test('it should return the type', () => {
            const type = getTypeFromModelDefinition(
                'trackedEntityType',
                programDefinition
            );
            expect(type).toBe('REFERENCE');
        });
    });

    describe('getModelValidationProperty', () => {
        test('it should return the modelValidation for property', () => {
            const validation = getModelValidationProperty('trackedEntityType')(
                programDefinition
            );
            expect(validation).toBeInstanceOf(Object);
            expect(validation).toHaveProperty('type');
            expect(validation).toHaveProperty('embeddedObject');
            expect(validation).toHaveProperty('owner');
        });
    });
});
