import ModelCollectionProperty from 'd2/lib/model/ModelCollectionProperty'; // FIXME: Removing this line breaks commonjs require order
import reducer from './reducers';
import * as actions from './actions';
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
        let initialDefaultState;

        beforeEach(() => {
            initialDefaultState = {
                step: {
                    activeStep: steps.STEP_DETAILS,
                },
                stageNotifications: {
                    isDeleting: false,
                },
            };
        });

        describe('STEP_CHANGE', () => {
            it('should change the activeStep when receiving a STEP_CHANGE action', () => {
                const expectedDefaultState = {
                    eventProgram: {},
                    step: {
                        activeStep: steps.STEP_DATA_ELEMENTS,
                    },
                    stageNotifications: {
                        isDeleting: false,
                    },
                };

                expect(reducer(initialDefaultState, {
                    type: actions.STEP_CHANGE,
                    payload: steps.STEP_DATA_ELEMENTS
                })).to.deep.equal(expectedDefaultState);
            });
        });

        describe('STEP_NEXT', () => {
            it('should change the activeStep to data entry', () => {
                const expectedDefaultState = {
                    eventProgram: {},
                    step: {
                        activeStep: steps.STEP_DATA_ENTRY_FORMS,
                    },
                    stageNotifications: {
                        isDeleting: false,
                    },
                };

                initialDefaultState.step.activeStep = steps.STEP_DATA_ELEMENTS;

                expect(reducer(initialDefaultState, { type: actions.STEP_NEXT })).to.deep.equal(expectedDefaultState);
            });

            it('should not go to the next action when already at the last', () => {
                const expectedDefaultState = {
                    eventProgram: {},
                    step: {
                        activeStep: steps.STEP_NOTIFICATIONS,
                    },
                    stageNotifications: {
                        isDeleting: false,
                    },
                };

                initialDefaultState.step.activeStep = steps.STEP_NOTIFICATIONS;

                expect(reducer(initialDefaultState, { type: actions.STEP_NEXT })).to.deep.equal(expectedDefaultState);
            });
        });

        describe('STEP_PREVIOUS', () => {
            it('should go to the next step', () => {
                const expectedDefaultState = {
                    eventProgram: {},
                    step: {
                        activeStep: steps.STEP_DATA_ENTRY_FORMS,
                    },
                    stageNotifications: {
                        isDeleting: false,
                    },
                };

                initialDefaultState.step.activeStep = steps.STEP_ASSIGN_ORGANISATION_UNITS;

                expect(reducer(initialDefaultState, { type: actions.STEP_PREVIOUS })).to.deep.equal(expectedDefaultState);
            });

            it('should not go to the previous action when already at the first', () => {
                const expectedDefaultState = {
                    eventProgram: {},
                    step: {
                        activeStep: steps.STEP_DETAILS,
                    },
                    stageNotifications: {
                        isDeleting: false,
                    },
                };

                expect(reducer(initialDefaultState, { type: actions.STEP_PREVIOUS })).to.deep.equal(expectedDefaultState);
            });
        });
    });
});
