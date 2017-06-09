import { ActionsObservable } from 'redux-observable';
import Store from 'd2-ui/lib/store/Store';
import {
    PROGRAM_STAGE_SECTIONS_ORDER_CHANGE,
    PROGRAM_STAGE_SECTIONS_ADD,
    PROGRAM_STAGE_SECTIONS_REMOVE,
    PROGRAM_STAGE_SECTION_NAME_EDIT,
} from './actions';
import createEpicsForStore from './epics';
import { isValidUid } from 'd2/lib/uid';
import * as d2 from 'd2/lib/d2';
import { get, getOr, maxBy } from 'lodash/fp';

const sampleSection = {
    "displayName": "Required fields",
    "sortOrder": 0,
    "name": "Required fields",
    "id": "thQNBTXdCI3",
    "programStage": { "id": "pTo4uMt3xur" },
    "dataElements": [{ "id": "qrur9Dvnyt5" }, { "id": "oZg33kd9taw" }],
};

const anotherSampleSection = {
    "displayName": "Additional details",
    "sortOrder": 1,
    "name": "Additional details",
    "id": "thQNBTXdCI4",
    "programStage": { "id": "pTo4uMt3xur"},
    "dataElements": [{ "id": "F3ogKBuviRA" }],
};

const predefinedState = {
    programStages: [
        {
            id: 'pTo4uMt3xur',
            "programStageDataElements": [
                {
                    "created": "2016-04-01T15:07:12.695",
                    "lastUpdated": "2016-12-06T16:37:46.077",
                    "id": "d9wIqlzSMgE",
                    "displayInReports": true,
                    "compulsory": true,
                    "allowProvidedElsewhere": false,
                    "sortOrder": 0,
                    "allowFutureDate": false,
                    "programStage": {
                        "id": "pTo4uMt3xur"
                    },
                    "dataElement": {
                        "id": "qrur9Dvnyt5",
                        "displayName": "Age in years"
                    }
                },
                {
                    "created": "2016-04-01T15:07:12.723",
                    "lastUpdated": "2016-12-06T16:37:46.104",
                    "id": "FKHaErzkvEF",
                    "displayInReports": true,
                    "compulsory": true,
                    "allowProvidedElsewhere": false,
                    "sortOrder": 1,
                    "allowFutureDate": false,
                    "programStage": {
                        "id": "pTo4uMt3xur"
                    },
                    "dataElement": {
                        "id": "oZg33kd9taw",
                        "displayName": "Gender"
                    }
                },
                {
                    "created": "2016-12-06T16:37:46.115",
                    "lastUpdated": "2016-12-06T16:37:46.116",
                    "id": "Zrem1VAqA8r",
                    "displayInReports": false,
                    "compulsory": false,
                    "allowProvidedElsewhere": false,
                    "sortOrder": 2,
                    "allowFutureDate": false,
                    "programStage": {
                        "id": "pTo4uMt3xur"
                    },
                    "dataElement": {
                        "id": "F3ogKBuviRA",
                        "displayName": "Household location"
                    }
                }
            ],
            programStageSections: {
                add: sinon.stub()
            },
        }
    ],
    programStageSections: [
        sampleSection,
        anotherSampleSection,
    ],
};


describe.only('Section form management epics', () => {
    const createActionStreamFor = action => ActionsObservable.of(action);

    let store;
    let epic;
    let mockD2;

    beforeEach(() => {
        store = Store.create();

        sinon.stub(d2, 'getInstance');
        mockD2 = {
            models: {
                programStageSection: {
                    create: object => object,
                },
            }
        };

        d2.getInstance.returns(Promise.resolve(mockD2));
        epic = createEpicsForStore(store);

        store.setState(predefinedState);
    });

    afterEach(() => {
        d2.getInstance.restore();
    });

    describe('creating a new program stage section', () => {
        it('should add a single program stage section', (done) => {
            const action = {
                type: PROGRAM_STAGE_SECTIONS_ADD,
                payload: {
                    newSectionName: 'Optional data',
                },
            };

            epic(createActionStreamFor(action))
                .subscribe(
                    () => {
                        expect(store.getState().programStageSections).to.have.length(3);
                        const newlyAddedSection = store.getState().programStageSections[2];

                        expect(isValidUid(newlyAddedSection.id)).to.be.true;
                        expect(newlyAddedSection.name).to.equal('Optional data');

                        done();
                    },
                    done);
        });

        it('should emit the state from the store', (done) => {
            const action = {
                type: PROGRAM_STAGE_SECTIONS_ADD,
                payload: {
                    newSectionName: 'Optional data',
                },
            };

            const storeSubscriptionSpy = sinon.spy();
            store.subscribe(storeSubscriptionSpy);

            epic(createActionStreamFor(action))
                .subscribe(
                    () => {
                        expect(storeSubscriptionSpy).to.be.calledTwice;
                        done();
                    },
                    done);
        });
    });

    describe('removing a program stage section', () => {
        it('should remove said program stage section', (done) => {
            const action = {
                type: PROGRAM_STAGE_SECTIONS_REMOVE,
                payload: {
                    programStageSectionId: 'thQNBTXdCI3',
                },
            };

            epic(createActionStreamFor(action))
                .subscribe(
                    () => {
                        const remainingSections = store.getState().programStageSections;
                        expect(remainingSections).to.have.length(1);
                        expect(remainingSections[0].id).to.equal('thQNBTXdCI4');
                        done();
                    },
                    done);
        });

        it('should emit the state from the store', (done) => {
            const action = {
                type: PROGRAM_STAGE_SECTIONS_REMOVE,
                payload: {
                    programStageSectionId: 'thQNBTXdCI3',
                },
            };

            const storeSubscriptionSpy = sinon.spy();
            store.subscribe(storeSubscriptionSpy);

            epic(createActionStreamFor(action))
                .subscribe(
                    () => {
                        expect(storeSubscriptionSpy).to.be.calledTwice;
                        done();
                    },
                    done);
        });
    });

    describe('renaming a program stage section', () => {
        it('should rename the correct program stage section', (done) => {
            const action = {
                type: PROGRAM_STAGE_SECTION_NAME_EDIT,
                payload: {
                    programStageSectionId: 'thQNBTXdCI3',
                    newProgramStageSectionName: 'Mandatory fields',
                },
            };

            epic(createActionStreamFor(action))
                .subscribe(
                    () => {
                        const section = store.getState().programStageSections[0];
                        expect(section).to.deep.equal({
                            ...sampleSection,
                            name: 'Mandatory fields',
                            displayName: 'Mandatory fields',
                        });

                        expect(store.getState().programStageSections[1]).to.deep.equal(anotherSampleSection);
                        done();
                    },
                    done);
        });

        it('should emit the state from the store', (done) => {
            const action = {
                type: PROGRAM_STAGE_SECTION_NAME_EDIT,
                payload: {
                    programStageSectionId: 'thQNBTXdCI3',
                    newProgramStageSectionName: 'Mandatory fields',
                },
            };

            const storeSubscriptionSpy = sinon.spy();
            store.subscribe(storeSubscriptionSpy);

            epic(createActionStreamFor(action))
                .subscribe(
                    () => {
                        expect(storeSubscriptionSpy).to.be.calledTwice;
                        done();
                    },
                    done);
        });
    });

    describe('changing the order of program stage sections', () => {
        it('should correctly reflect in the new list', (done) => {
            const action = {
                type: PROGRAM_STAGE_SECTIONS_ORDER_CHANGE,
                payload: {
                    programStageSections: [
                        { ...sampleSection, sortOrder: 1 },
                        { ...anotherSampleSection, sortOrder: 0 },
                    ],
                },
            };

            epic(createActionStreamFor(action))
                .subscribe(
                    () => {
                        expect(store.getState().programStageSections[0].sortOrder).to.equal(0);
                        expect(store.getState().programStageSections[1].sortOrder).to.equal(1);
                        done();
                    },
                    done);
        });

        it('should emit the state from the store', (done) => {
            const action = {
                type: PROGRAM_STAGE_SECTION_NAME_EDIT,
                payload: {
                    programStageSections: [
                        { ...sampleSection, sortOrder: 1 },
                        { ...anotherSampleSection, sortOrder: 0 },
                    ],
                },
            };

            const storeSubscriptionSpy = sinon.spy();
            store.subscribe(storeSubscriptionSpy);

            epic(createActionStreamFor(action))
                .subscribe(
                    () => {
                        expect(storeSubscriptionSpy).to.be.calledTwice;
                        done();
                    },
                    done);
        });
    });
});
