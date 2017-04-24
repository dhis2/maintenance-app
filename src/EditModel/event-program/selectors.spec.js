import { activeStepSelector } from './selectors';

describe('Event Program selectors', () => {
    describe('activeStepSelector', () => {
        it('should return the activeStep from the state', () => {
            const state = {
                step: {
                    activeStep: 'details',
                },
            };

            expect(activeStepSelector(state)).to.equal('details');
        });

        it('should return undefined if step does not exist', () => {
            const state = {};

            expect(activeStepSelector(state)).to.be.undefined;
        });

        it('should return undefined if state is undefined', () => {
            let state;

            expect(activeStepSelector(state)).to.be.undefined;
        });
    });
});
