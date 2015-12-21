import React from 'react/addons';
import {element} from 'd2-testutils';
import log from 'loglevel';
import injectTheme from './config/inject-theme';

import MultiSelectWithoutContext from '../src/MultiSelect.component';

const TestUtils = React.addons.TestUtils;
const {
    findRenderedComponentWithType,
    Simulate,
} = TestUtils;

describe('MultiSelect component', () => {
    let fieldConfig;
    let multiSelectComponent;
    let model;
    let MultiSelect;

    beforeEach((done) => {
        stub(log, 'warn');
        stub(log, 'error');

        fieldConfig = {
            key: 'MyKey',
            data: {
                source: [
                    {id: 1},
                    {id: 2},
                    {id: 3},
                ],
            },
        };
        model = {
            MyKey: [{id: 3}],
        };

        MultiSelect = injectTheme(MultiSelectWithoutContext);

        multiSelectComponent = TestUtils.renderIntoDocument(
            <MultiSelect fieldConfig={fieldConfig} model={model} />
        );
        multiSelectComponent = findRenderedComponentWithType(multiSelectComponent, MultiSelectWithoutContext);

        // Delay till the next event loop to resolve promises
        setTimeout(() => done(), 10);
    });

    it('should have the component name as a class', () => {
        expect(element(multiSelectComponent).hasClass('multi-select')).to.be.true;
    });

    it('should have initialized the collection list to the passed source', (done) => {
        setTimeout(() => {
            expect(multiSelectComponent.collection).to.deep.equal([{id: 1}, {id: 2}, {id: 3}]);
            done();
        });
    });

    it('should have initialized the selected list to the passed source', () => {
        expect(multiSelectComponent.selected).to.deep.equal([{id: 3}]);
    });

    it('should render the available box as the collection without the selected', () => {
        expect(element(multiSelectComponent, '.multi-select--available-list').element.querySelectorAll('option').length).to.equal(2);
    });

    it('should render the initialize the lists from a promise source', (done) => {
        fieldConfig.data.source = () => {
            return new Promise((resolve) => {
                resolve([{id: 4}, {id: 5}, {id: 6}]);
            });
        };

        multiSelectComponent = TestUtils.renderIntoDocument(
            <MultiSelect fieldConfig={fieldConfig} model={model} />
        );
        multiSelectComponent = findRenderedComponentWithType(multiSelectComponent, MultiSelectWithoutContext);

        setTimeout(() => {
            expect(multiSelectComponent.collection).to.deep.equal([{id: 4}, {id: 5}, {id: 6}]);
            expect(multiSelectComponent.selected).to.deep.equal([{id: 3}]);
            done();
        });
    });

    it('should log a warning if the source is not an array or a function', () => {
        fieldConfig.data.source = {};

        multiSelectComponent = TestUtils.renderIntoDocument(
            <MultiSelect fieldConfig={fieldConfig} model={model} />
        );
        multiSelectComponent = findRenderedComponentWithType(multiSelectComponent, MultiSelectWithoutContext);

        expect(log.warn).to.be.calledWith(`Warning: The source for the MultiSelectBox with key 'MyKey' is not a function or an array.`);
    });

    it('should run the fromModelTransformer on the model values if it is provided', (done) => {
        fieldConfig.fromModelTransformer = modelValue => {
            return Object.assign({name: 'Mark'}, modelValue);
        };

        multiSelectComponent = TestUtils.renderIntoDocument(
            <MultiSelect fieldConfig={fieldConfig} model={model} />
        );
        multiSelectComponent = findRenderedComponentWithType(multiSelectComponent, MultiSelectWithoutContext);

        setTimeout(() => {
            expect(multiSelectComponent.selected).to.deep.equal([{id: 3, name: 'Mark'}]);
            done();
        });
    });

    it('should update the selected list when an available one is moved', () => {
        const firstAvailableOption = element(multiSelectComponent, '.multi-select--available-list').element.querySelector('option');

        TestUtils.Simulate.doubleClick(firstAvailableOption);

        expect(multiSelectComponent.selected).to.deep.equal([{id: 3}, {id: 1}]);
    });

    it('should update the selected list when an select one is moved to available', () => {
        const firstAvailableOption = element(multiSelectComponent, '.multi-select--selected-list').element.querySelector('option');

        TestUtils.Simulate.doubleClick(firstAvailableOption);

        expect(multiSelectComponent.selected).to.deep.equal([]);
    });

    it('should move an item to the selected list when clicking the => arrow', (done) => {
        const firstAvailableOption = element(multiSelectComponent, '.multi-select--available-list').element.querySelector('option');
        const moveToSelectedButton = element(multiSelectComponent, '.multi-select--controls').element.querySelector('button');

        firstAvailableOption.selected = true;
        TestUtils.Simulate.click(moveToSelectedButton);

        setTimeout(() => {
            expect(multiSelectComponent.selected).to.deep.equal([{id: 3}, {id: 1}]);
            done();
        }, 10);
    });

    it('should move an item from the selected list when clicking the <= arrow', (done) => {
        const firstSelectedOption = element(multiSelectComponent, '.multi-select--selected-list').element.querySelector('option');
        const moveToSelectedButton = element(multiSelectComponent, '.multi-select--controls').element.querySelectorAll('button')[1];

        firstSelectedOption.selected = true;
        TestUtils.Simulate.click(moveToSelectedButton);

        setTimeout(() => {
            expect(multiSelectComponent.selected).to.deep.equal([]);
            done();
        }, 10);
    });

    it('should move all items to selected when the select all is clicked', (done) => {
        const moveToSelectedButton = element(multiSelectComponent, '.multi-select--controls').element.querySelectorAll('button')[2];

        TestUtils.Simulate.click(moveToSelectedButton);

        setTimeout(() => {
            expect(multiSelectComponent.selected).to.deep.equal([{id: 3}, {id: 1}, {id: 2}]);
            done();
        }, 10);
    });

    it('should remove all selected items when select none is clicked', () => {
        const unselectAllButton = element(multiSelectComponent, '.multi-select--controls').element.querySelectorAll('button')[3];

        TestUtils.Simulate.click(unselectAllButton);

        expect(multiSelectComponent.selected).to.deep.equal([]);
    });

    it('should render the selected values even when they are not in the available list', (done) => {
        model.MyKey = [
            {id: 3},
            {id: 4},
        ];

        multiSelectComponent = TestUtils.renderIntoDocument(
            <MultiSelect fieldConfig={fieldConfig} model={model} />
        );
        multiSelectComponent = findRenderedComponentWithType(multiSelectComponent, MultiSelectWithoutContext);

        setTimeout(() => {
            const selectedOptions = element(multiSelectComponent, '.multi-select--selected-list').element.querySelectorAll('option');

            expect(multiSelectComponent.selected).to.deep.equal([{id: 3}, {id: 4}]);
            expect(selectedOptions.length).to.equal(2);
            done();
        });
    });

    it('should move selected item to the available list when not yet loaded', (done) => {
        model.MyKey = [
            {id: 3},
            {id: 4},
        ];

        multiSelectComponent = TestUtils.renderIntoDocument(
            <MultiSelect fieldConfig={fieldConfig} model={model} />
        );
        multiSelectComponent = findRenderedComponentWithType(multiSelectComponent, MultiSelectWithoutContext);

        setTimeout(() => {
            const selectedOptions = element(multiSelectComponent, '.multi-select--selected-list').element.querySelectorAll('option');
            const lastSelectedOption = selectedOptions[1];

            TestUtils.Simulate.doubleClick(lastSelectedOption);

            expect(multiSelectComponent.selected).to.deep.equal([{id: 3}]);
            expect(multiSelectComponent.collection).to.deep.equal([{id: 1}, {id: 2}, {id: 3}, {id: 4}]);

            done();
        });
    });

    it('should not add an item to the collection twice', (done) => {
        model.MyKey = [
            {id: 3},
            {id: 4},
        ];

        multiSelectComponent = TestUtils.renderIntoDocument(
            <MultiSelect fieldConfig={fieldConfig} model={model} />
        );
        multiSelectComponent = findRenderedComponentWithType(multiSelectComponent, MultiSelectWithoutContext);

        setTimeout(() => {
            const selectedOptions = element(multiSelectComponent, '.multi-select--selected-list').element.querySelectorAll('option');
            const lastSelectedOption = selectedOptions[1];
            multiSelectComponent.collection = [{id: 1}, {id: 2}, {id: 3}, {id: 4}];

            TestUtils.Simulate.doubleClick(lastSelectedOption);

            expect(multiSelectComponent.selected).to.deep.equal([{id: 3}]);
            expect(multiSelectComponent.collection).to.deep.equal([{id: 1}, {id: 2}, {id: 3}, {id: 4}]);
            done();
        });
    });

    it('should order the selected values by name', (done) => {
        fieldConfig.data = {
            source: [
                {id: 1, name: 'Foo'},
                {id: 2, name: 'Baz'},
                {id: 3, name: 'cee'},
            ],
        };
        model.MyKey = [
            {id: 1, name: 'Foo'},
            {id: 2, name: 'Baz'},
            {id: 3, name: 'cee'},
        ];

        multiSelectComponent = TestUtils.renderIntoDocument(
            <MultiSelect fieldConfig={fieldConfig} model={model} />
        );
        multiSelectComponent = findRenderedComponentWithType(multiSelectComponent, MultiSelectWithoutContext);

        setTimeout(() => {
            const selectedOptions = element(multiSelectComponent, '.multi-select--selected-list').element.querySelectorAll('option');
            expect(selectedOptions[0].textContent).to.equal('Baz');
            expect(selectedOptions[1].textContent).to.equal('cee');
            expect(selectedOptions[2].textContent).to.equal('Foo');
            done();
        });
    });

    describe('loadMoreAsync', () => {
        let fakePager;
        let resolveGetNextPage;
        let rejectGetNextPage;

        beforeEach((done) => {
            fakePager = {
                hasNextPage: stub().returns(true),
                getNextPage: stub().returns(new Promise((resolve, reject) => {
                    resolveGetNextPage = resolve;
                    rejectGetNextPage = reject;
                })),
            };

            fieldConfig.data.source = () => {
                return Promise.resolve({
                    modelDefinition: {
                        list: stub().returns(Promise.resolve({
                            toArray: stub().returns([
                                {id: 1},
                                {id: 2},
                                {id: 3},
                                {id: 4},
                                {id: 5},
                                {id: 6},
                                {id: 7},
                                {id: 8},
                                {id: 9},
                                {id: 10},
                                {id: 11},
                                {id: 12},
                                {id: 13},
                                {id: 14},
                                {id: 15},
                                {id: 16},
                                {id: 17},
                                {id: 18},
                                {id: 19},
                                {id: 20},
                                {id: 21},
                                {id: 22},
                                {id: 23},
                                {id: 24},
                                {id: 25},
                                {id: 26},
                                {id: 27},
                            ]),
                        })),
                    },
                    toArray: () => [
                        {id: 1},
                        {id: 2},
                        {id: 3},
                        {id: 4},
                        {id: 5},
                        {id: 6},
                        {id: 7},
                        {id: 8},
                        {id: 9},
                        {id: 10},
                        {id: 11},
                        {id: 12},
                        {id: 13},
                        {id: 14},
                        {id: 15},
                    ],
                    pager: fakePager,
                });
            };

            multiSelectComponent = TestUtils.renderIntoDocument(
                <MultiSelect fieldConfig={fieldConfig} model={model} />
            );
            multiSelectComponent = findRenderedComponentWithType(multiSelectComponent, MultiSelectWithoutContext);

            // Deplay till next eventloop
            setTimeout(() => done());
        });

        it('should set the pager on the component if the source is a function', () => {
            expect(multiSelectComponent.pager).not.to.be.undefined;
        });

        it('should ask if the pager if it has a next page', () => {
            Simulate.scroll(multiSelectComponent.refs.available);

            expect(fakePager.hasNextPage).to.be.called;
        });

        it('should call getNextPage() on the pager', () => {
            Simulate.scroll(multiSelectComponent.refs.available);

            expect(fakePager.getNextPage).to.be.called;
        });

        it('should not call getNextPage twice if it has not yet been resolved', () => {
            Simulate.scroll(multiSelectComponent.refs.available);
            Simulate.scroll(multiSelectComponent.refs.available);

            expect(fakePager.getNextPage).to.be.calledOnce;
        });

        describe('after async returns successfully', () => {
            let newFakePager;

            beforeEach((done) => {
                newFakePager = {};

                Simulate.scroll(multiSelectComponent.refs.available);

                resolveGetNextPage({
                    modelDefinition: {},
                    pager: newFakePager,
                    toArray() {
                        return [
                            {id: 16},
                            {id: 17},
                            {id: 18},
                        ];
                    },
                });

                setTimeout(() => {
                    done();
                });
            });

            it('should set isLoadingMore to false', () => {
                expect(multiSelectComponent.isLoadingMore).to.be.false;
            });

            it('should set the returned items onto the collection', () => {
                const expectedCollection = [
                    {id: 1},
                    {id: 2},
                    {id: 3},
                    {id: 4},
                    {id: 5},
                    {id: 6},
                    {id: 7},
                    {id: 8},
                    {id: 9},
                    {id: 10},
                    {id: 11},
                    {id: 12},
                    {id: 13},
                    {id: 14},
                    {id: 15},
                    {id: 16},
                    {id: 17},
                    {id: 18},
                ];

                expect(multiSelectComponent.collection).to.deep.equal(expectedCollection);
            });

            it('should update the lists in the ui', () => {
                const availableOptions = element(multiSelectComponent, '.multi-select--available-list').element.querySelectorAll('option');

                expect(availableOptions.length).to.equal(17);
            });

            it('should set the new pager as the current pager', () => {
                expect(multiSelectComponent.pager).to.equal(newFakePager);
            });
        });

        describe('after async errors', () => {
            beforeEach((done) => {
                Simulate.scroll(multiSelectComponent.refs.available);

                rejectGetNextPage('Server down');

                setTimeout(() => {
                    done();
                });
            });

            it('should log the error', () => {
                expect(log.error).to.be.calledWith('Failed to load more for the multiselect box', 'Server down');
            });
        });

        describe('move all to selected', () => {
            beforeEach((done) => {
                const moveToSelectedButton = element(multiSelectComponent, '.multi-select--controls').element.querySelectorAll('button')[2];

                TestUtils.Simulate.click(moveToSelectedButton);

                setTimeout(() => {
                    done();
                });
            });

            it('should have the modelDefinition available on the object', () => {
                expect(multiSelectComponent.modelDefinition).to.not.be.undefined;
            });

            it('should call the api to load everything when the select all is clicked', () => {
                const selectedOptions = element(multiSelectComponent, '.multi-select--selected-list').element.querySelectorAll('option');

                expect(multiSelectComponent.modelDefinition.list).to.be.calledWith({paging: false});
                expect(selectedOptions.length).to.equal(27);
            });

            it('should update the collection to be fully loaded', () => {
                expect(multiSelectComponent.collection.length).to.equal(27);
            });

            it('should set the pager to have no more pages', () => {
                expect(multiSelectComponent.pager).to.equal.undefined;
            });

            it('should set allLoaded to true', () => {
                expect(multiSelectComponent.state.allLoaded).to.equal(true);
            });
        });

        describe('should load more on render if the available list has less than 50 items and there is a pager', () => {
            // TODO: Tests...
        });
    });
});
