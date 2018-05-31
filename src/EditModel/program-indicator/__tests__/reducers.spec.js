import reducer from '../reducers';
import * as actions from '../actions';
import { STEPPER_RESET_ACTIVE_STEP } from '../../actions';
import * as iterator from '../../stepper/stepIterator';

describe('Program Indicator', () => {
    beforeAll(() => {
        iterator.nextStep = jest.fn();
        iterator.prevStep = jest.fn();
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    describe('combined reducer', () => {
        test('should return the default state', () => {
            const stepKey = 0;

            const actualState = reducer(undefined, {});

            const expectedState = {
                activeStep: stepKey,
                fieldConfigs: [],
                isLoading: true,
                isSaving: false,
            };

            expect(actualState).toEqual(expectedState);
        });

        describe('when receiving actions', () => {
            const initialState = {
                activeStep: 0,
                fieldConfigs: [],
                isLoading: true,
                isSaving: false,
            };

            test('should change the activeStep when receiving an PROGRAM_INDICATOR_STEP_CHANGE action', () => {
                const expectedStepKey = 2;

                const expectedState = {
                    activeStep: expectedStepKey,
                    fieldConfigs: [],
                    isLoading: true,
                    isSaving: false,
                };

                const actualState = reducer(initialState, {
                    type: actions.PROGRAM_INDICATOR_STEP_CHANGE,
                    payload: expectedStepKey,
                });

                expect(actualState).toEqual(expectedState);
            });

            test('should request the next step when receiving an PROGRAM_INDICATOR_STEP_NEXT action', () => {
                const expectedStepKey = 1;
                iterator.nextStep.mockReturnValue(1);

                const expectedState = {
                    activeStep: expectedStepKey,
                    fieldConfigs: [],
                    isLoading: true,
                    isSaving: false,
                };

                const actualState = reducer(initialState, { type: actions.PROGRAM_INDICATOR_STEP_NEXT });

                expect(iterator.nextStep).toHaveBeenCalledTimes(2);
                expect(iterator.prevStep).toHaveBeenCalledTimes(0);
                expect(actualState).toEqual(expectedState);
            });

            test('should request the previous step when receiving an PROGRAM_INDICATOR_STEP_PREVIOUS action', () => {
                const expectedStepKey = 0;
                iterator.prevStep.mockReturnValue(0);

                const expectedState = {
                    activeStep: expectedStepKey,
                    fieldConfigs: [],
                    isLoading: true,
                    isSaving: false,
                };

                const actualState = reducer(initialState, { type: actions.PROGRAM_INDICATOR_STEP_PREVIOUS });

                expect(iterator.nextStep).toHaveBeenCalledTimes(0);
                expect(iterator.prevStep).toHaveBeenCalledTimes(2);
                expect(actualState).toEqual(expectedState);
            });

            test('shoud request the first step when receiving an STEPPER_RESET_ACTIVE_STEP action', () => {
                const expectedStepKey = 0;

                const expectedState = {
                    activeStep: expectedStepKey,
                    fieldConfigs: [],
                    isLoading: true,
                    isSaving: false,
                };

                const actualState = reducer(initialState, { type: STEPPER_RESET_ACTIVE_STEP });

                expect(iterator.nextStep).toHaveBeenCalledTimes(0);
                expect(iterator.prevStep).toHaveBeenCalledTimes(0);
                expect(actualState).toEqual(expectedState);
            });
        });
    });
});
