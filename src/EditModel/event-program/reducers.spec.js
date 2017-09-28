/* global sinon, expect */

import reducer from './reducers';
import * as actions from './actions';
import { STEPPER_RESET_ACTIVE_STEP } from '../actions';
import * as iterator from '../stepper/stepIterator';

describe('Event Program', () => {
    let sandbox;
    let nextStub;
    let previousStub;
    let firstStub;

    before(() => {
        sandbox = sinon.sandbox.create();
        nextStub = sandbox.stub(iterator, 'next');
        previousStub = sandbox.stub(iterator, 'previous');
        firstStub = sandbox.stub(iterator, 'first');
    });

    beforeEach(() => {
        nextStub.reset();
        previousStub.reset();
        firstStub.reset();
    });

    after(() => {
        sandbox.restore();
    });

    describe('combined reducer', () => {
        it('should return the event program state', () => {
            const stepKey = 'shuffle';
            firstStub.returns(stepKey);

            const actualState = reducer(undefined, {});

            const expectedState = {
                step: {
                    activeStep: stepKey,
                },
                stageNotifications: {
                    isDeleting: false,
                },
            };

            expect(actualState).to.deep.equal(expectedState);
        });
    });

    describe('stepper reducer', () => {
        it('should return the default state', () => {
            const stepKey = 'sprint';
            firstStub.returns(stepKey);

            const expectedStepState = {
                activeStep: stepKey,
            };

            const actualState = reducer(undefined, {});

            expect(actualState.step).to.deep.equal(expectedStepState);
        });

        describe('when receiving actions', () => {
            const initialState = {
                step: {
                    activeStep: 'slow-walk',
                },
            };

            it('should change the activeStep when receiving an EVENT_PROGRAM_STEP_CHANGE action', () => {
                const expectedStepKey = 'hop';

                const expectedState = {
                    activeStep: expectedStepKey,
                };

                const actualState = reducer(initialState, {
                    type: actions.EVENT_PROGRAM_STEP_CHANGE,
                    payload: expectedStepKey,
                });

                expect(actualState.step).to.deep.equal(expectedState);
            });

            it('should request the next step when receiving an EVENT_PROGRAM_STEP_NEXT action', () => {
                const expectedStepKey = 'march';
                nextStub.returns(expectedStepKey);

                const expectedState = {
                    activeStep: expectedStepKey,
                };

                const actualState = reducer(initialState, { type: actions.EVENT_PROGRAM_STEP_NEXT });

                expect(nextStub).to.have.been.called;
                expect(previousStub).not.to.have.been.called;
                expect(actualState.step).to.deep.equal(expectedState);
            });

            it('should request the previous step when receiving an EVENT_PROGRAM_STEP_PREVIOUS action', () => {
                const expectedStepKey = 'jog';
                previousStub.returns(expectedStepKey);

                const expectedState = {
                    activeStep: expectedStepKey,
                };

                const actualState = reducer(initialState, { type: actions.EVENT_PROGRAM_STEP_PREVIOUS });

                expect(nextStub).not.to.have.been.called;
                expect(previousStub).to.have.been.called;
                expect(actualState.step).to.deep.equal(expectedState);
            });

            it('shoud request the first step when receiving an STEPPER_RESET_ACTIVE_STEP action', () => {
                const expectedStepKey = 'sprint';
                firstStub.returns(expectedStepKey);

                const expectedState = {
                    activeStep: expectedStepKey,
                };

                const actualState = reducer(initialState, { type: STEPPER_RESET_ACTIVE_STEP });

                expect(nextStub).not.to.have.been.called;
                expect(previousStub).not.to.have.been.called;
                expect(actualState.step).to.deep.equal(expectedState);
            });
        });
    });

});
