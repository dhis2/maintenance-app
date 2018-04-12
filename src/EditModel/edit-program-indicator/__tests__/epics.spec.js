import { ActionsObservable } from 'redux-observable';
import Store from 'd2-ui/lib/store/Store';
import * as d2 from 'd2/lib/d2';
import { PROGRAM_INDICATOR_LOAD, PROGRAM_INDICATOR_TO_EDIT_FIELD_CHANGED } from '../actions';
import * as epics from '../epics';

describe('Program indicator epics', () => {
    const createActionStreamFor = action => ActionsObservable.of(action);

    let store;
    let mockD2;

    beforeEach(() => {
        d2.getInstance = jest.fn();

        mockD2 = {
            models: {
                programIndicator: {
                    create: jest.fn().mockReturnValue(Promise.resolve({})),
                    get: jest.fn().mockReturnValue(Promise.resolve({
                        id: 'pTo4uMt3xur',
                        name: 'Age at visit - calc from days',
                    })),
                },
            },
        };

        d2.getInstance.mockReturnValue(Promise.resolve(mockD2));

        store = Store.create();

        jest.spyOn(store, 'setState');
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('programIndicatorLoad', () => {
        let epic;

        beforeEach(() => {
            epic = epics.programIndicatorLoad(store);
        });

        test(
            'should load the requested programIndicstor by id from the api',
            (done) => {
                const action = {
                    type: PROGRAM_INDICATOR_LOAD,
                    payload: {
                        id: 'pTo4uMt3xur',
                    },
                };

                epic(createActionStreamFor(action))
                    .subscribe(
                        () => {
                            const fieldFilters = ':all,attributeValues[:all,attribute[id,name,displayName]],program[id,displayName,programType,programTrackedEntityAttributes[id,trackedEntityAttribute[id,displayName,valueType]]]';

                            expect(mockD2.models.programIndicator.get).toBeCalledWith('pTo4uMt3xur', { fields: fieldFilters });

                            done();
                        },
                        done);
            }
        );

        test('should set the programIndicator onto the store', (done) => {
            const action = {
                type: PROGRAM_INDICATOR_LOAD,
                payload: {
                    id: 'pTo4uMt3xur',
                },
            };

            epic(createActionStreamFor(action))
                .subscribe(
                    () => {
                        expect(store.setState).toBeCalledWith({
                            programIndicator: {
                                id: 'pTo4uMt3xur',
                                name: 'Age at visit - calc from days',
                            },
                        });

                        done();
                    },
                    done);
        });

        test(
            'should set a new instance of programIndicator onto the store without calling the api',
            (done) => {
                const action = {
                    type: PROGRAM_INDICATOR_LOAD,
                    payload: {
                        id: 'add',
                    },
                };

                epic(createActionStreamFor(action))
                    .subscribe(
                        () => {
                            expect(store.setState).toBeCalledWith({
                                programIndicator: {},
                            });

                            expect(mockD2.models.programIndicator.get).not.toHaveBeenCalled();
                            expect(mockD2.models.programIndicator.create).toHaveBeenCalled();

                            done();
                        },
                        done);
            }
        );
    });

    describe('programIndicatorEdit', () => {
        let epic;

        beforeEach(() => {
            epic = epics.programIndicatorEdit(store);

            store.setState({
                programIndicator: {
                    id: 'pTo4uMt3xur',
                    name: 'Age at visit - calc from days',
                    attributes: {
                        customName: 'September is over',
                    },
                },
            });
        });

        test('should set update the field on the programIndicator', (done) => {
            const action = {
                type: PROGRAM_INDICATOR_TO_EDIT_FIELD_CHANGED,
                payload: {
                    field: 'name',
                    value: 'Age at the visit',
                },
            };

            epic(createActionStreamFor(action))
                .subscribe(
                    () => {
                        expect(store.setState).toBeCalledWith({
                            programIndicator: {
                                id: 'pTo4uMt3xur',
                                name: 'Age at the visit',
                                attributes: {
                                    customName: 'September is over',
                                },
                            },
                        });

                        done();
                    },
                    done
                );
        });

        test('should update the attribute on the programIndicator', (done) => {
            const action = {
                type: PROGRAM_INDICATOR_TO_EDIT_FIELD_CHANGED,
                payload: {
                    field: 'customName',
                    value: 'December is over',
                },
            };

            epic(createActionStreamFor(action))
                .subscribe(
                    () => {
                        expect(store.setState).toBeCalledWith({
                            programIndicator: {
                                id: 'pTo4uMt3xur',
                                name: 'Age at visit - calc from days',
                                attributes: {
                                    customName: 'December is over',
                                },
                            },
                        });

                        done();
                    },
                    done
                );
        });
    });
});
