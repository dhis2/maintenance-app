import ModelCollectionProperty from 'd2/lib/model/ModelCollectionProperty'; // FIXME: Removing this line breaks commonjs require order
import reducer from './reducers';
import * as actions from './actions';
import { STEPPER_RESET_ACTIVE_STEP } from '../actions';
import * as steps from './event-program-steps';

describe('Event Program reducer', () => {
    it('should return the default state', () => {
        const expectedDefaultState = {
            eventProgram: {},
            step: {
                activeStep: 'details',
            },
            stageNotifications: {
                isDeleting: false,
            },
        };

        expect(reducer(undefined, {})).to.deep.equal(expectedDefaultState);
    });

    describe('when receiving actions', () => {
        const nextStub = sinon.stub(steps, 'nextStep');
        const previousStub = sinon.stub(steps, 'previousStep');

        beforeEach(() => {
            nextStub.reset();
            previousStub.reset();
        });

        it('should change the activeStep when receiving a EVENT_PROGRAM_STEP_CHANGE action', () => {
            const expectedStepName = 'step-data-elements';

            const initialDefaultState = {
                step: {
                    activeStep: 'details',
                },
                stageNotifications: {
                    isDeleting: false,
                },
            };

            const expectedState = {
                eventProgram: {},
                step: {
                    activeStep: expectedStepName,
                },
                stageNotifications: {
                    isDeleting: false,
                },
            };

            expect(reducer(initialDefaultState, {
                type: actions.EVENT_PROGRAM_STEP_CHANGE,
                payload: expectedStepName,
            })).to.deep.equal(expectedState);
        });

        it('should request the next step when receiving a EVENT_PROGRAM_STEP_NEXT action', () => {
            reducer({}, { type: actions.EVENT_PROGRAM_STEP_NEXT });

            expect(nextStub).to.have.been.called;
            expect(previousStub).not.to.have.been.called;
        });

        it('should request the previous step when receiving a EVENT_PROGRAM_STEP_PREVIOUS action', () => {
            reducer({}, { type: actions.EVENT_PROGRAM_STEP_PREVIOUS });

            expect(nextStub).not.to.have.been.called;
            expect(previousStub).to.have.been.called;
        });

        it('shoud request the first step when receiving a STEPPER_RESET_ACTIVE_STEP action', () => {
            const expectedStepKey = 'the-first-step-key';
            const firstStub = sinon.stub(steps, 'firstStep');
            firstStub.returns(expectedStepKey);

            const initialState = {
                step: {
                    activeStep: 'limp',
                },
            };

            const actualState = reducer(initialState, { type: STEPPER_RESET_ACTIVE_STEP });

            expect(nextStub).not.to.have.been.called;
            expect(previousStub).not.to.have.been.called;
            expect(actualState.step.activeStep).to.equal(expectedStepKey);
        });
    });
});
