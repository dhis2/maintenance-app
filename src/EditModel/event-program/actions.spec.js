import * as actions from './actions';

describe('Event Program actions', () => {
    describe('action constants', () => {
        it('should have defined the stepper constants', () => {
            expect(actions.STEP_PREVIOUS).to.equal('STEP_PREVIOUS');
            expect(actions.STEP_NEXT).to.equal('STEP_NEXT');
            expect(actions.STEP_CHANGE).to.equal('STEP_CHANGE');
        });

        it('should have defined the model constants', () => {
             expect(actions.MODEL_TO_EDIT_LOADED).to.equal('MODEL_TO_EDIT_LOADED');
        });
    });

    describe('action creators', () => {
        describe('changeStep', () => {
            it('should create the STEP_CHANGE action', () => {
                expect(actions.changeStep()).to.deep.equal({ type: actions.STEP_CHANGE, payload: undefined });
            });

            it('should use the parameter as the payload', () => {
                expect(actions.changeStep('details')).to.deep.equal({ type: actions.STEP_CHANGE, payload: 'details' });
            });
        });

        describe('nextStep', () => {
            it('should create the STEP_NEXT action', () => {
                expect(actions.nextStep()).to.deep.equal({ type: actions.STEP_NEXT });
            });
        });

        describe('previousStep', () => {
            it('should create the STEP_PREVIOUS action', () => {
                expect(actions.previousStep()).to.deep.equal({ type: actions.STEP_PREVIOUS });
            });
        });
    });
});
