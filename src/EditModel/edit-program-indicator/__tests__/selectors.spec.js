import { activeStepSelector } from '../selectors';

describe('Program indicator selectors', () => {
    describe('activeStepSelector', () => {
        test('should return the activeStep from the state', () => {
            const state = {
                programIndicator: {
                    step: {
                        activeStep: 'details',
                    },
                },
            };

            expect(activeStepSelector(state)).toBe('details');
        });

        test('should return undefined if step does not exist', () => {
            const state = {};

            expect(activeStepSelector(state)).toBeUndefined();
        });

        test('should return undefined if state is undefined', () => {
            let state;

            expect(activeStepSelector(state)).toBeUndefined();
        });
    });
});
