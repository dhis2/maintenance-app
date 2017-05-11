import { ActionsObservable } from 'redux-observable';
import Store from 'd2-ui/lib/store/Store';
import { PROGRAM_STAGE_DATA_ELEMENTS_ADD, PROGRAM_STAGE_DATA_ELEMENTS_REMOVE, PROGRAM_STAGE_DATA_ELEMENT_EDIT } from './actions';
import createEpicsForStore from './epics';
import { isValidUid } from 'd2/lib/uid';

describe('Assign data elements epics', () => {
    const createActionStreamFor = action => ActionsObservable.of(action);

    let store;
    let epic;

    beforeEach(() => {
        store = Store.create();
        epic = createEpicsForStore(store);

        store.setState({
            programStages: [
                {
                    id: 'pTo4uMt3xur',
                    "programStageDataElements": [{
                        "lastUpdated": "2017-05-03T13:32:17.730",
                        "id": "d9wIqlzSMgE",
                        "created": "2016-04-01T15:07:12.695",
                        "displayInReports": true,
                        "externalAccess": false,
                        "renderOptionsAsRadio": false,
                        "allowFutureDate": false,
                        "compulsory": true,
                        "allowProvidedElsewhere": false,
                        "sortOrder": 0,
                        "lastUpdatedBy": {"id": "xE7jOejl9FI"},
                        "programStage": {"id": "pTo4uMt3xur"},
                        "dataElement": {"id": "qrur9Dvnyt5"},
                        "translations": [],
                        "userGroupAccesses": [],
                        "attributeValues": [],
                        "userAccesses": []
                    }, {
                        "lastUpdated": "2017-05-03T13:32:17.729",
                        "id": "FKHaErzkvEF",
                        "created": "2016-04-01T15:07:12.723",
                        "displayInReports": true,
                        "externalAccess": false,
                        "renderOptionsAsRadio": true,
                        "allowFutureDate": false,
                        "compulsory": true,
                        "allowProvidedElsewhere": false,
                        "sortOrder": 1,
                        "lastUpdatedBy": {"id": "xE7jOejl9FI"},
                        "programStage": {"id": "pTo4uMt3xur"},
                        "dataElement": {"id": "oZg33kd9taw"},
                        "translations": [],
                        "userGroupAccesses": [],
                        "attributeValues": [],
                        "userAccesses": []
                    }]
                }
            ],
        });
    });

    describe('adding new data elements to the program stage', () => {
        it('should add a single programStageDataElement', (done) => {
            const action = {
                type: PROGRAM_STAGE_DATA_ELEMENTS_ADD,
                payload: {
                    programStage: 'pTo4uMt3xur',
                    dataElements: ['eMyVanycQSC'],
                },
            };

            epic(createActionStreamFor(action))
                .subscribe(
                    () => {
                        expect(store.getState().programStages[0].programStageDataElements).to.have.length(3);
                        const newlyAddedDataElement = store.getState().programStages[0].programStageDataElements[2];

                        expect(isValidUid(newlyAddedDataElement.id)).to.be.true;
                        expect(newlyAddedDataElement.dataElement).to.deep.equal({
                            id: 'eMyVanycQSC',
                        });
                        done();
                    },
                    done);
        });

        it('should add multiple programStageDataElement', (done) => {
            const action = {
                type: PROGRAM_STAGE_DATA_ELEMENTS_ADD,
                payload: {
                    programStage: 'pTo4uMt3xur',
                    dataElements: ['eMyVanycQSC', 'd68jOejl9FI'],
                },
            };

            epic(createActionStreamFor(action))
                .subscribe(
                    () => {
                        expect(store.getState().programStages[0].programStageDataElements).to.have.length(4);
                        const newlyAddedDataElementOne = store.getState().programStages[0].programStageDataElements[2];
                        const newlyAddedDataElementTwo = store.getState().programStages[0].programStageDataElements[3];

                        expect(isValidUid(newlyAddedDataElementOne.id)).to.be.true;
                        expect(isValidUid(newlyAddedDataElementTwo.id)).to.be.true;

                        expect(newlyAddedDataElementOne.dataElement).to.deep.equal({
                            id: 'eMyVanycQSC',
                        });
                        expect(newlyAddedDataElementTwo.dataElement).to.deep.equal({
                            id: 'd68jOejl9FI',
                        });
                        done();
                    },
                    done
                );
        });

        it('should emit the state from the store', (done) => {
            const action = {
                type: PROGRAM_STAGE_DATA_ELEMENTS_ADD,
                payload: {
                    programStage: 'pTo4uMt3xur',
                    dataElements: ['eMyVanycQSC'],
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
                    done
                );
        });
    });

    describe('removing data elements from the program stage', () => {
        it('should remove the provided data element', (done) => {
            const action = {
                type: PROGRAM_STAGE_DATA_ELEMENTS_REMOVE,
                payload: {
                    programStage: 'pTo4uMt3xur',
                    dataElements: ['qrur9Dvnyt5'],
                },
            };

            epic(createActionStreamFor(action))
                .subscribe(
                    () => {
                        expect(store.getState().programStages[0].programStageDataElements).to.have.length(1);
                        const remainingDataElement = store.getState().programStages[0].programStageDataElements[0];

                        expect(isValidUid(remainingDataElement.id)).to.be.true;
                        expect(remainingDataElement).to.deep.equal({
                            "lastUpdated": "2017-05-03T13:32:17.729",
                            "id": "FKHaErzkvEF",
                            "created": "2016-04-01T15:07:12.723",
                            "displayInReports": true,
                            "externalAccess": false,
                            "renderOptionsAsRadio": true,
                            "allowFutureDate": false,
                            "compulsory": true,
                            "allowProvidedElsewhere": false,
                            "sortOrder": 1,
                            "lastUpdatedBy": {"id": "xE7jOejl9FI"},
                            "programStage": {"id": "pTo4uMt3xur"},
                            "dataElement": {"id": "oZg33kd9taw"},
                            "translations": [],
                            "userGroupAccesses": [],
                            "attributeValues": [],
                            "userAccesses": []
                        });
                        done();
                    },
                    done
                );
        });

        it('should remove all the provided dataElements', (done) => {
            const action = {
                type: PROGRAM_STAGE_DATA_ELEMENTS_REMOVE,
                payload: {
                    programStage: 'pTo4uMt3xur',
                    dataElements: ['qrur9Dvnyt5', 'oZg33kd9taw'],
                },
            };

            epic(createActionStreamFor(action))
                .subscribe(
                    () => {
                        expect(store.getState().programStages[0].programStageDataElements).to.have.length(0);
                        done();
                    },
                    done
                );
        });

        it('should emit the state from the store', (done) => {
            const action = {
                type: PROGRAM_STAGE_DATA_ELEMENTS_REMOVE,
                payload: {
                    programStage: 'pTo4uMt3xur',
                    dataElements: ['eMyVanycQSC'],
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
                    done
                );
        });
    });

    describe('editing programStageDataElement', () => {
        it('should update the programStageDataElement with the new values', (done) => {
            const action = {
                type: PROGRAM_STAGE_DATA_ELEMENT_EDIT,
                payload: {
                    programStage: 'pTo4uMt3xur',
                    programStageDataElement: {
                        "lastUpdated": "2017-05-03T13:32:17.730",
                        "id": "d9wIqlzSMgE",
                        "created": "2016-04-01T15:07:12.695",
                        "displayInReports": false,
                        "externalAccess": false,
                        "renderOptionsAsRadio": false,
                        "allowFutureDate": false,
                        "compulsory": false,
                        "allowProvidedElsewhere": true,
                        "sortOrder": 0,
                        "lastUpdatedBy": {"id": "xE7jOejl9FI"},
                        "programStage": {"id": "pTo4uMt3xur"},
                        "dataElement": {"id": "qrur9Dvnyt5"},
                        "translations": [],
                        "userGroupAccesses": [],
                        "attributeValues": [],
                        "userAccesses": []
                    },
                },
            };

            epic(createActionStreamFor(action))
                .subscribe(
                    () => {
                        const editedDataElement = store.getState().programStages[0].programStageDataElements[0];

                        expect(editedDataElement).to.deep.equal({
                            "lastUpdated": "2017-05-03T13:32:17.730",
                            "id": "d9wIqlzSMgE",
                            "created": "2016-04-01T15:07:12.695",
                            "displayInReports": false,
                            "externalAccess": false,
                            "renderOptionsAsRadio": false,
                            "allowFutureDate": false,
                            "compulsory": false,
                            "allowProvidedElsewhere": true,
                            "sortOrder": 0,
                            "lastUpdatedBy": {"id": "xE7jOejl9FI"},
                            "programStage": {"id": "pTo4uMt3xur"},
                            "dataElement": {"id": "qrur9Dvnyt5"},
                            "translations": [],
                            "userGroupAccesses": [],
                            "attributeValues": [],
                            "userAccesses": []
                        });
                        done();
                    },
                    done
                );
        });

        it('should not modify the other dataElements', (done) => {
            const action = {
                type: PROGRAM_STAGE_DATA_ELEMENT_EDIT,
                payload: {
                    programStage: 'pTo4uMt3xur',
                    programStageDataElement: {
                        "lastUpdated": "2017-05-03T13:32:17.730",
                        "id": "d9wIqlzSMgE",
                        "created": "2016-04-01T15:07:12.695",
                        "displayInReports": false,
                        "externalAccess": false,
                        "renderOptionsAsRadio": false,
                        "allowFutureDate": false,
                        "compulsory": false,
                        "allowProvidedElsewhere": true,
                        "sortOrder": 0,
                        "lastUpdatedBy": {"id": "xE7jOejl9FI"},
                        "programStage": {"id": "pTo4uMt3xur"},
                        "dataElement": {"id": "qrur9Dvnyt5"},
                        "translations": [],
                        "userGroupAccesses": [],
                        "attributeValues": [],
                        "userAccesses": []
                    },
                },
            };

            epic(createActionStreamFor(action))
                .subscribe(
                    () => {
                        const editedDataElement = store.getState().programStages[0].programStageDataElements[1];

                        expect(editedDataElement).to.deep.equal({
                            "lastUpdated": "2017-05-03T13:32:17.729",
                            "id": "FKHaErzkvEF",
                            "created": "2016-04-01T15:07:12.723",
                            "displayInReports": true,
                            "externalAccess": false,
                            "renderOptionsAsRadio": true,
                            "allowFutureDate": false,
                            "compulsory": true,
                            "allowProvidedElsewhere": false,
                            "sortOrder": 1,
                            "lastUpdatedBy": {"id": "xE7jOejl9FI"},
                            "programStage": {"id": "pTo4uMt3xur"},
                            "dataElement": {"id": "oZg33kd9taw"},
                            "translations": [],
                            "userGroupAccesses": [],
                            "attributeValues": [],
                            "userAccesses": []
                        });
                        done();
                    },
                    done
                );
        });

        it('should emit the state from the store', (done) => {
            const action = {
                type: PROGRAM_STAGE_DATA_ELEMENT_EDIT,
                payload: {
                    programStage: 'pTo4uMt3xur',
                    programStageDataElement: {
                        "lastUpdated": "2017-05-03T13:32:17.730",
                        "id": "d9wIqlzSMgE",
                        "created": "2016-04-01T15:07:12.695",
                        "displayInReports": false,
                        "externalAccess": false,
                        "renderOptionsAsRadio": false,
                        "allowFutureDate": false,
                        "compulsory": false,
                        "allowProvidedElsewhere": true,
                        "sortOrder": 0,
                        "lastUpdatedBy": {"id": "xE7jOejl9FI"},
                        "programStage": {"id": "pTo4uMt3xur"},
                        "dataElement": {"id": "qrur9Dvnyt5"},
                        "translations": [],
                        "userGroupAccesses": [],
                        "attributeValues": [],
                        "userAccesses": []
                    },
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
                    done
                );
        });
    });
});
