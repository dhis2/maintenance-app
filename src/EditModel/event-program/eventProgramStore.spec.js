import { Observable } from 'rxjs';
import store,  { isStoreStateDirty, getMetaDataToSend } from './eventProgramStore';
import ModelDefinition from 'd2/lib/model/ModelDefinition';
import ModelDefinitions from 'd2/lib/model/ModelDefinitions';
import programSchema from '../../../test/fixtures/schemas/program';
import programStageSchema from '../../../test/fixtures/schemas/programStage';
import programNotificationTemplateSchema from '../../../test/fixtures/schemas/programNotificationTemplate';
import dataEntryFormSchema from '../../../test/fixtures/schemas/dataEntryForm';
import { noop, memoize } from 'lodash/fp';

describe('Event Program Store', () => {
    let mockState;
    let program;
    let programStage;
    let dataEntryForm;
    let programStageNotification;
    let modelDefinitions;

    before(() => {
        // Mock fetch
        global.fetch = noop;

        program = ModelDefinition.createFromSchema(programSchema);
        programStage = ModelDefinition.createFromSchema(programStageSchema);
        programStageNotification = ModelDefinition.createFromSchema(programNotificationTemplateSchema);
        dataEntryForm = ModelDefinition.createFromSchema(dataEntryFormSchema);

        modelDefinitions = ModelDefinitions.getModelDefinitions();

        // Only add the modelDefs when they have not yet been added (This is kind of funky due to ModelDefinitions being a singleton)
        modelDefinitions.program || modelDefinitions.add(program);
        modelDefinitions.programStage || modelDefinitions.add(programStage);
        modelDefinitions.programNotificationTemplate || modelDefinitions.add(programStageNotification);
        modelDefinitions.programNotificationTemplate || modelDefinitions.add(dataEntryForm);
    });

    beforeEach(() => {
        mockState = {
            program: program.create(),
            programStages: [programStage.create({ id: 'selCNHPqm5g', notificationTemplates: [] })],
            programStageNotifications: {
                ['selCNHPqm5g']: [
                    programStageNotification.create(),
                ]
            },
            dataEntryFormForProgramStage: {
                ['selCNHPqm5g']: dataEntryForm.create(),
            },
        };

        store.setState(mockState);
    });

    after(() => {
        delete global.fetch;
    });

    it('should be an Observable', () => {
        expect(store).to.be.instanceof(Observable);
    });

    it('should return the current state when requesting it', () => {
        expect(store.getState()).to.deep.equal(mockState);
    });

    it('should emit the status after subscribing to it', (done) => {
        store
            .take(1)
            .do(state => expect(state).to.deep.equal(mockState))
            .subscribe(() => done(), done);
    });

    it('should not accept invalid properties for the state', () => {
        expect(() => store.setState({ name: 'John' })).to.throw('You are attempting to set an invalid state onto the eventProgramStore');
    });

    it('should throw if the passed state is not an object', () => {
        expect(() => store.setState()).to.throw('You are attempting to set a state that is a non object');
    });

    xit('should merge the state with the old state', () => {

    });

    describe('helpers', () => {
        describe('isStoreStateDirty', () => {
            it('should return false when the state has not changed', () => {
                expect(isStoreStateDirty(mockState)).to.be.false;
            });

            it('should return true when the program has changed', () => {
                expect(isStoreStateDirty(mockState)).to.be.false;

                mockState.program.name = 'Malaria Prevention';

                expect(isStoreStateDirty(mockState)).to.be.true;
            });

            it('should return true when the programStage has changed', () => {
                expect(isStoreStateDirty(mockState)).to.be.false;

                mockState.programStages[0].name = 'Stage 1';

                expect(isStoreStateDirty(mockState)).to.be.true;
            });

            it('should return true when a programStageNotification was changed', () => {
                expect(isStoreStateDirty(mockState)).to.be.false;

                mockState.programStageNotifications['selCNHPqm5g'][0].name = 'Email on completion';

                expect(isStoreStateDirty(mockState)).to.be.true;
            });

            it('should return true when a dataEntryForm was changed', () => {
                expect(isStoreStateDirty(mockState)).to.be.false;

                mockState.dataEntryFormForProgramStage['selCNHPqm5g'].htmlCode = '<input id="id-id-val" />';

                expect(isStoreStateDirty(mockState)).to.be.true;
            });
        });

        describe('getMetaDataToSend', () => {
            it('should return an empty payload when nothing was updated', () => {
                expect(getMetaDataToSend(mockState)).to.deep.equal({});
            });

            it('should return the programs array with a single program when the program was updated', () => {
                mockState.program.name = 'Malaria Prevention';

                expect(getMetaDataToSend(mockState)).to.deep.equal({
                    programs: [{
                        name: 'Malaria Prevention',
                        notificationTemplates: [],
                        programStages: [],
                        expiryDays: 0,
                        completeEventsExpiryDays: 0,
                        version: 0,
                    }],
                });
            });

            it('should return the programStage array when a programStage was updated', () => {
                mockState.programStages[0].name = 'Stage 1';

                expect(getMetaDataToSend(mockState)).to.deep.equal({
                    programStages: [{
                        id: 'selCNHPqm5g',
                        name: 'Stage 1',
                        notificationTemplates: [],
                    }],
                });
            });

            it('should return the programStage and the programNotificationTemplate when a programNotificationTemplate was added', () => {
                const notification = programStageNotification.create({ id: 'pdKXh2PmaLs' });
                notification.name = 'Sms template';

                mockState.programStages[0].notificationTemplates.add(notification);
                mockState.programStageNotifications.selCNHPqm5g = [notification];

                expect(getMetaDataToSend(mockState)).to.deep.equal({
                    programStages: [{
                        id: 'selCNHPqm5g',
                        notificationTemplates: [
                            { id: 'pdKXh2PmaLs' },
                        ],
                    }],
                    programNotificationTemplates: [{
                        id: 'pdKXh2PmaLs',
                        name: 'Sms template',
                    }],
                });
            });
        });
    });
});
