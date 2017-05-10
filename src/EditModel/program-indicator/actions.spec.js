import * as actions from './actions';

describe('Program indicator actions', () => {
    describe('for stepper', () => {
        it('should have defined the stepper constants', () => {
            expect(actions.PROGRAM_INDICATOR_STEP_PREVIOUS).to.equal('PROGRAM_INDICATOR_STEP_PREVIOUS');
            expect(actions.PROGRAM_INDICATOR_STEP_NEXT).to.equal('PROGRAM_INDICATOR_STEP_NEXT');
            expect(actions.PROGRAM_INDICATOR_STEP_CHANGE).to.equal('PROGRAM_INDICATOR_STEP_CHANGE');
        });

        it('should create the PROGRAM_INDICATOR_STEP_CHANGE action', () => {
            expect(actions.changeStep()).to.deep.equal({ type: actions.PROGRAM_INDICATOR_STEP_CHANGE, payload: undefined });
        });

        it('should use the parameter as the payload', () => {
            expect(actions.changeStep('details')).to.deep.equal({ type: actions.PROGRAM_INDICATOR_STEP_CHANGE, payload: 'details' });
        });

        it('should create the PROGRAM_INDICATOR_STEP_NEXT action', () => {
            expect(actions.nextStep()).to.deep.equal({ type: actions.PROGRAM_INDICATOR_STEP_NEXT });
        });

        it('should create the PROGRAM_INDICATOR_STEP_PREVIOUS action', () => {
            expect(actions.previousStep()).to.deep.equal({ type: actions.PROGRAM_INDICATOR_STEP_PREVIOUS });
        });
    });

    describe('for loading a program indicator', () => {
        it('should have the program indicator load constants', () => {
            expect(actions.PROGRAM_INDICATOR_LOAD).to.equal('PROGRAM_INDICATOR_LOAD');
            expect(actions.PROGRAM_INDICATOR_LOAD_SUCCESS).to.equal('PROGRAM_INDICATOR_LOAD_SUCCESS');
            expect(actions.PROGRAM_INDICATOR_LOAD_ERROR).to.equal('PROGRAM_INDICATOR_LOAD_ERROR');
        });

        it('should create the PROGRAM_INDICATOR_LOAD action', () => {
            expect(actions.loadProgramIndicator()).to.deep.equal({ type: actions.PROGRAM_INDICATOR_LOAD, payload: undefined });
        });

        it('should create the PROGRAM_INDICATOR_LOAD_SUCCESS action', () => {
            expect(actions.loadProgramIndicatorSuccess()).to.deep.equal({ type: actions.PROGRAM_INDICATOR_LOAD_SUCCESS, payload: undefined });
        });

        it('should create the PROGRAM_INDICATOR_LOAD_SUCCESS action', () => {
            expect(actions.loadProgramIndicatorFailure()).to.deep.equal({ type: actions.PROGRAM_INDICATOR_LOAD_ERROR, payload: undefined });
        });
    });

    describe('for editing models', () => {
        it('should have defined the model constants', () => {
            expect(actions.PROGRAM_INDICATOR_LOAD).to.equal('PROGRAM_INDICATOR_LOAD');
            expect(actions.PROGRAM_INDICATOR_TO_EDIT_FIELD_CHANGED).to.equal('PROGRAM_INDICATOR_TO_EDIT_FIELD_CHANGED');
        });

        it('should create the action when calling editFieldChanged', () => {
            const expectedAction = {
                type: 'PROGRAM_INDICATOR_TO_EDIT_FIELD_CHANGED',
                payload: {
                    field: 'name',
                    value: 'John',
                },
            };

            expect(actions.editFieldChanged('name', 'John')).to.deep.equal(expectedAction);
        });
    });

    describe('for saving an program indicator', () => {
        it('should have defined the constants', () => {
            expect(actions.PROGRAM_INDICATOR_SAVE).to.equal('PROGRAM_INDICATOR_SAVE');
            expect(actions.PROGRAM_INDICATOR_SAVE_SUCCESS).to.equal('PROGRAM_INDICATOR_SAVE_SUCCESS');
            expect(actions.PROGRAM_INDICATOR_SAVE_ERROR).to.equal('PROGRAM_INDICATOR_SAVE_ERROR');
        });

        it('should create the save action when calling saveProgramIndicator', () => {
            const expectedAction = {
                type: actions.PROGRAM_INDICATOR_SAVE,
                payload: undefined,
            };

            expect(actions.saveProgramIndicator()).to.deep.equal(expectedAction);
        });

        it('should create the save success action when calling saveProgramIndicatorSuccess', () => {
            const expectedAction = {
                type: actions.PROGRAM_INDICATOR_SAVE_SUCCESS,
                payload: undefined,
            };

            expect(actions.saveProgramIndicatorSuccess()).to.deep.equal(expectedAction);
        });

        it('should create the save error action when calling saveProgramIndicatorError', () => {
            const expectedAction = {
                type: actions.PROGRAM_INDICATOR_SAVE_ERROR,
                payload: new Error('Could not load'),
            };

            expect(actions.saveProgramIndicatorError(new Error('Could not load'))).to.deep.equal(expectedAction);
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
