import fixtures from '../../../__fixtures__/fixtures';
import * as check from '../../../lib/check';
import ModelDefinition from '../../ModelDefinition';
import { getJSONForProperties } from '../json';

const mockModelDefinitions = {};

jest.mock('../../ModelDefinitions', () => ({
    getModelDefinitions() {
        return mockModelDefinitions;
    },
}));

describe('getJSONForProperties', () => {
    describe('for validationRule', () => {
        let validationRuleSchema;
        let validationRuleModelDefinition;

        beforeEach(() => {
            validationRuleSchema = fixtures.get('/api/schemas/validationRule');

            validationRuleModelDefinition = ModelDefinition.createFromSchema(validationRuleSchema);
            mockModelDefinitions.validationRule = validationRuleModelDefinition;
        });

        it('does fancy stuffs', () => {
            const model = validationRuleModelDefinition.create({ id: 'a0123456789', organisationUnitLevels: [1, 2] });

            expect(getJSONForProperties(model, ['organisationUnitLevels'])).toEqual({ organisationUnitLevels: [1, 2] });
        });
    });

    describe('for legendSet', () => {
        let checkTypeStub;
        let legendSetSchema;
        let legendSet;
        let legendSetSchemaDefinition;

        beforeEach(() => {
            checkTypeStub = jest.spyOn(check, 'checkType')
                .mockReturnValue(true);

            legendSetSchema = fixtures.get('/api/schemas/legendSet');

            legendSetSchemaDefinition = ModelDefinition.createFromSchema(legendSetSchema);
            mockModelDefinitions.legendSet = legendSetSchemaDefinition;

            legendSet = fixtures.get('/api/legendSets/k1JHPfXsJND');
        });

        afterEach(() => {
            checkTypeStub.mockRestore();
        });

        it('should embed the legends in the payload', () => {
            const model = legendSetSchemaDefinition.create(legendSet);

            expect(getJSONForProperties(model, ['legends']).legends).toHaveLength(6);
            expect(getJSONForProperties(model, ['legends']).legends).toEqual(legendSet.legends);
        });

        it('should not throw on userGroupAcceses', () => {
            const model = legendSetSchemaDefinition.create(legendSet);

            expect(getJSONForProperties(model, ['userGroupAccesses']).userGroupAccesses).toHaveLength(1);
        });

        it('should maintain the full structure of the userGroupAccesses', () => {
            const model = legendSetSchemaDefinition.create(legendSet);

            expect(getJSONForProperties(model, ['userGroupAccesses']).userGroupAccesses).toEqual([
                {
                    access: 'rw------',
                    userGroupUid: 'wl5cDMuUhmF',
                    displayName: 'Administrators',
                    id: 'wl5cDMuUhmF',
                },
            ]);
        });

        it('should maintain the full structure of the userAccesses', () => {
            legendSetSchemaDefinition = ModelDefinition.createFromSchema(legendSetSchema);
            const model = legendSetSchemaDefinition.create(legendSet);

            expect(getJSONForProperties(model, ['userAccesses']).userAccesses).toEqual([
                {
                    access: 'rw------',
                    userUid: 'UgDpalMTGDr',
                    displayName: 'Kanu Nwankwo',
                    id: 'UgDpalMTGDr',
                },
            ]);
        });

        it('should only use the ID of the user object', () => {
            legendSetSchemaDefinition = ModelDefinition.createFromSchema(legendSetSchema);
            const model = legendSetSchemaDefinition.create(legendSet);

            model.user = {
                id: 'xE7jOejl9FI',
                username: 'admin',
                firstName: 'John',
            };

            expect(getJSONForProperties(model, ['user']).user).toEqual({
                id: 'xE7jOejl9FI',
            });
        });
    });

    describe('property types', () => {
        it('should handle non-embedded collection properties', () => {
            const favoritesPropName = 'favorites';
            const favoritesValue = ['userId1', 'userId2'];
            const model = {
                modelDefinition: {
                    modelValidations: {
                        favorites: {},
                    },
                },
                dataValues: {
                    [favoritesPropName]: favoritesValue,
                },
                getCollectionChildrenPropertyNames: () => [favoritesPropName],
                getReferenceProperties: () => [],
            };
            const actual = getJSONForProperties(model, [favoritesPropName]);

            const expected = {
                [favoritesPropName]: favoritesValue,
            };

            expect(actual).toEqual(expected);
        });
    });
});
