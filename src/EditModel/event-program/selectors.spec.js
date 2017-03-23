import { activeStepSelector, modelSelector } from './selectors';

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

    describe('modelSelector', () => {
        it('should return the model from the state', () => {
            const fakeModel = {};
            const state = {
                model: fakeModel,
            };

            expect(modelSelector(state)).to.equal(fakeModel);
        });

        it('should return undefined if state is undefined', () => {
            let state;

            expect(modelSelector(state)).to.be.undefined;
        });
    });
});
