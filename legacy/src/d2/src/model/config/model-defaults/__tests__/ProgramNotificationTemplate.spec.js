import ModelDefinition from '../../../ModelDefinition';
import fixtures from '../../../../__fixtures__/fixtures';

describe('ProgramNotificationTemplate defaults', () => {
    let programNotificationTemplate;

    beforeEach(() => {
        const ProgramNotificationTemplateDefinition = ModelDefinition
            .createFromSchema(fixtures.get('/api/schemas/programNotificationTemplate'));

        programNotificationTemplate = ProgramNotificationTemplateDefinition.create();
    });

    it('should have `version` set to 0', () => {
        expect(programNotificationTemplate.notificationTrigger).toBe('COMPLETION');
    });

    it('should have `completedEventExpiryDays` set to 0', () => {
        expect(programNotificationTemplate.notificationRecipient).toBe('USERS_AT_ORGANISATION_UNIT');
    });
});
