import ModelDefinition from '../../../ModelDefinition';
import fixtures from '../../../../__fixtures__/fixtures';

describe('ValidationRule defaults', () => {
    let validationRule;

    beforeEach(() => {
        const ValidationRuleDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/validationRule'));
        validationRule = ValidationRuleDefinition.create();
    });

    it('should have `importance` set to `MEDIUM`', () => {
        expect(validationRule.importance).toBe('MEDIUM');
    });

    it('should have `periodType` set to `Monthly`', () => {
        expect(validationRule.periodType).toBe('Monthly');
    });

    it('should have `operator` set to `not_equal_to`', () => {
        expect(validationRule.operator).toBe('not_equal_to');
    });

    it('should have `leftSide` set to the correct values', () => {
        const correctValues = {
            missingValueStrategy: 'NEVER_SKIP',
            description: '',
            expression: '',
        };

        expect(validationRule.leftSide).toEqual(correctValues);
    });

    it('should have `rightSide` set to the correct values', () => {
        const correctValues = {
            missingValueStrategy: 'NEVER_SKIP',
            description: '',
            expression: '',
        };

        expect(validationRule.rightSide).toEqual(correctValues);
    });
});
