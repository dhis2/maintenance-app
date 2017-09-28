import * as actions from '../actions';

describe('Program indicator actions', () => {
    describe('for stepper', () => {
        test('should have defined the stepper constants', () => {
            expect(actions.PROGRAM_INDICATOR_STEP_PREVIOUS).toBe('PROGRAM_INDICATOR_STEP_PREVIOUS');
            expect(actions.PROGRAM_INDICATOR_STEP_NEXT).toBe('PROGRAM_INDICATOR_STEP_NEXT');
            expect(actions.PROGRAM_INDICATOR_STEP_CHANGE).toBe('PROGRAM_INDICATOR_STEP_CHANGE');
        });

        test('should create the PROGRAM_INDICATOR_STEP_CHANGE action', () => {
            expect(actions.changeStep()).toEqual({ type: actions.PROGRAM_INDICATOR_STEP_CHANGE, payload: undefined });
        });

        test('should use the parameter as the payload', () => {
            expect(actions.changeStep('details')).toEqual({ type: actions.PROGRAM_INDICATOR_STEP_CHANGE, payload: 'details' });
        });

        test('should create the PROGRAM_INDICATOR_STEP_NEXT action', () => {
            expect(actions.nextStep()).toEqual({ type: actions.PROGRAM_INDICATOR_STEP_NEXT });
        });

        test('should create the PROGRAM_INDICATOR_STEP_PREVIOUS action', () => {
            expect(actions.previousStep()).toEqual({ type: actions.PROGRAM_INDICATOR_STEP_PREVIOUS });
        });
    });

    describe('for loading a program indicator', () => {
        test('should have the program indicator load constants', () => {
            expect(actions.PROGRAM_INDICATOR_LOAD).toBe('PROGRAM_INDICATOR_LOAD');
            expect(actions.PROGRAM_INDICATOR_LOAD_SUCCESS).toBe('PROGRAM_INDICATOR_LOAD_SUCCESS');
            expect(actions.PROGRAM_INDICATOR_LOAD_ERROR).toBe('PROGRAM_INDICATOR_LOAD_ERROR');
        });

        test('should create the PROGRAM_INDICATOR_LOAD action', () => {
            expect(actions.loadProgramIndicator()).toEqual({ type: actions.PROGRAM_INDICATOR_LOAD, payload: undefined });
        });

        test('should create the PROGRAM_INDICATOR_LOAD_SUCCESS action', () => {
            expect(actions.loadProgramIndicatorSuccess()).toEqual({ type: actions.PROGRAM_INDICATOR_LOAD_SUCCESS, payload: undefined });
        });

        test('should create the PROGRAM_INDICATOR_LOAD_SUCCESS action', () => {
            expect(actions.loadProgramIndicatorFailure()).toEqual({ type: actions.PROGRAM_INDICATOR_LOAD_ERROR, payload: undefined });
        });
    });

    describe('for editing models', () => {
        test('should have defined the model constants', () => {
            expect(actions.PROGRAM_INDICATOR_LOAD).toBe('PROGRAM_INDICATOR_LOAD');
            expect(actions.PROGRAM_INDICATOR_TO_EDIT_FIELD_CHANGED).toBe('PROGRAM_INDICATOR_TO_EDIT_FIELD_CHANGED');
        });

        test('should create the action when calling editFieldChanged', () => {
            const expectedAction = {
                type: 'PROGRAM_INDICATOR_TO_EDIT_FIELD_CHANGED',
                payload: {
                    field: 'name',
                    value: 'John',
                },
            };

            expect(actions.editFieldChanged('name', 'John')).toEqual(expectedAction);
        });
    });

    describe('for saving an program indicator', () => {
        test('should have defined the constants', () => {
            expect(actions.PROGRAM_INDICATOR_SAVE).toBe('PROGRAM_INDICATOR_SAVE');
            expect(actions.PROGRAM_INDICATOR_SAVE_SUCCESS).toBe('PROGRAM_INDICATOR_SAVE_SUCCESS');
            expect(actions.PROGRAM_INDICATOR_SAVE_ERROR).toBe('PROGRAM_INDICATOR_SAVE_ERROR');
        });

        test('should create the save action when calling saveProgramIndicator', () => {
            const expectedAction = {
                type: actions.PROGRAM_INDICATOR_SAVE,
                payload: undefined,
            };

            expect(actions.saveProgramIndicator()).toEqual(expectedAction);
        });

        test(
            'should create the save success action when calling saveProgramIndicatorSuccess',
            () => {
                const expectedAction = {
                    type: actions.PROGRAM_INDICATOR_SAVE_SUCCESS,
                    payload: undefined,
                };

                expect(actions.saveProgramIndicatorSuccess()).toEqual(expectedAction);
            }
        );

        test(
            'should create the save error action when calling saveProgramIndicatorError',
            () => {
                const expectedAction = {
                    type: actions.PROGRAM_INDICATOR_SAVE_ERROR,
                    payload: new Error('Could not load'),
                };

                expect(actions.saveProgramIndicatorError(new Error('Could not load'))).toEqual(expectedAction);
            }
        );
    });

    describe('for notifying users', () => {
        test('should defined the notification constants', () => {
            expect(actions.NOTIFY_USER).toBe('NOTIFY_USER');
        });

        test('should create a notify user action when calling notifyUser', () => {
            const expectedAction = {
                type: actions.NOTIFY_USER,
                payload: undefined,
            };

            expect(actions.notifyUser()).toEqual(expectedAction);
        });
    });
});
