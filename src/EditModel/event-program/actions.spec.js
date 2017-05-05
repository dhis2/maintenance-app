import * as actions from './actions';

describe('Event Program actions', () => {
    describe('for stepper', () => {
        it('should have defined the stepper constants', () => {
            expect(actions.EVENT_PROGRAM_STEP_PREVIOUS).to.equal('EVENT_PROGRAM_STEP_PREVIOUS');
            expect(actions.EVENT_PROGRAM_STEP_NEXT).to.equal('EVENT_PROGRAM_STEP_NEXT');
            expect(actions.EVENT_PROGRAM_STEP_CHANGE).to.equal('EVENT_PROGRAM_STEP_CHANGE');
        });

        it('should create the EVENT_PROGRAM_STEP_CHANGE action', () => {
            expect(actions.changeStep()).to.deep.equal({ type: actions.EVENT_PROGRAM_STEP_CHANGE, payload: undefined });
        });

        it('should use the parameter as the payload', () => {
            expect(actions.changeStep('details')).to.deep.equal({ type: actions.EVENT_PROGRAM_STEP_CHANGE, payload: 'details' });
        });

        it('should create the EVENT_PROGRAM_STEP_NEXT action', () => {
            expect(actions.nextStep()).to.deep.equal({ type: actions.EVENT_PROGRAM_STEP_NEXT });
        });

        it('should create the EVENT_PROGRAM_STEP_PREVIOUS action', () => {
            expect(actions.previousStep()).to.deep.equal({ type: actions.EVENT_PROGRAM_STEP_PREVIOUS });
        });
    });

    describe('for loading a event program', () => {
        it('should have the event program load constants', () => {
            expect(actions.EVENT_PROGRAM_LOAD).to.equal('EVENT_PROGRAM_LOAD');
            expect(actions.EVENT_PROGRAM_LOAD_SUCCESS).to.equal('EVENT_PROGRAM_LOAD_SUCCESS');
            expect(actions.EVENT_PROGRAM_LOAD_ERROR).to.equal('EVENT_PROGRAM_LOAD_ERROR');
        });

        it('should create the EVENT_PROGRAM_LOAD action', () => {
            expect(actions.loadEventProgram()).to.deep.equal({ type: actions.EVENT_PROGRAM_LOAD, payload: undefined });
        });

        it('should create the EVENT_PROGRAM_LOAD_SUCCESS action', () => {
            expect(actions.loadEventProgramSuccess()).to.deep.equal({ type: actions.EVENT_PROGRAM_LOAD_SUCCESS, payload: undefined });
        });

        it('should create the EVENT_PROGRAM_LOAD_SUCCESS action', () => {
            expect(actions.loadEventProgramFailure()).to.deep.equal({ type: actions.EVENT_PROGRAM_LOAD_ERROR, payload: undefined });
        });
    });

    describe('for editing models', () => {
        it('should have defined the model constants', () => {
            expect(actions.MODEL_TO_EDIT_LOADED).to.equal('MODEL_TO_EDIT_LOADED');
            expect(actions.MODEL_TO_EDIT_FIELD_CHANGED).to.equal('MODEL_TO_EDIT_FIELD_CHANGED');
        });

        it('should create the action when calling editFieldChanged', () => {
            const expectedAction = {
                type: 'MODEL_TO_EDIT_FIELD_CHANGED',
                payload: {
                    field: 'name',
                    value: 'John',
                },
            };

            expect(actions.editFieldChanged('name', 'John')).to.deep.equal(expectedAction);
        });
    });

    describe('for saving an event program', () => {
        it('should have defined the constants', () => {
            expect(actions.EVENT_PROGRAM_SAVE).to.equal('EVENT_PROGRAM_SAVE');
            expect(actions.EVENT_PROGRAM_SAVE_SUCCESS).to.equal('EVENT_PROGRAM_SAVE_SUCCESS');
            expect(actions.EVENT_PROGRAM_SAVE_ERROR).to.equal('EVENT_PROGRAM_SAVE_ERROR');
        });

        it('should create the save action when calling saveEventProgram', () => {
            const expectedAction = {
                type: actions.EVENT_PROGRAM_SAVE,
                payload: undefined,
            };

            expect(actions.saveEventProgram()).to.deep.equal(expectedAction);
        });

        it('should create the save success action when calling saveEventProgramSuccess', () => {
            const expectedAction = {
                type: actions.EVENT_PROGRAM_SAVE_SUCCESS,
                payload: undefined,
            };

            expect(actions.saveEventProgramSuccess()).to.deep.equal(expectedAction);
        });

        it('should create the save error action when calling saveEventProgramError', () => {
            const expectedAction = {
                type: actions.EVENT_PROGRAM_SAVE_ERROR,
                payload: new Error('Could not load'),
            };

            expect(actions.saveEventProgramError(new Error('Could not load'))).to.deep.equal(expectedAction);
        });
    });

    describe('for notifying users', () => {
        it('should defined the notification constants', () => {
            expect(actions.NOTIFY_USER).to.equal('NOTIFY_USER');
        });

        it('should create a notify user action when calling notifyUser', () => {
            const expectedAction = {
                type: actions.NOTIFY_USER,
                payload: undefined,
            };

            expect(actions.notifyUser()).to.deep.equal(expectedAction);
        });
    });
});
