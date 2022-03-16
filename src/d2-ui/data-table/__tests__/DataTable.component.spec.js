import React from 'react';
import { describeWithDOM, shallow } from 'enzyme';
import DataTable from '../DataTable.component';
import DataTableHeader from '../DataTableHeader.component';
import DataTableContextMenu from '../DataTableContextMenu.component';

import Popover from 'material-ui/Popover/Popover';

describe('DataTable component', () => {
    let dataTableComponent;
    const cma = {
        edit(...args) {
            console.log('Edit', ...args);
        },
        remove(...args) {
            console.log('Remove', ...args);
        },
    };

    function renderComponent(props = {}) {
        return shallow(<DataTable {...Object.assign({ contextMenuActions: cma }, props)} />);
    }

    beforeEach(() => {
        dataTableComponent = renderComponent();
    });

    describe('initial state', () => {
        it('should have set the default columns', () => {
            expect(dataTableComponent.state('columns')).toEqual(['name', 'lastUpdated']);
        });

        it('should have a data-table row', () => {
            expect(dataTableComponent.hasClass('data-table')).toBe(true);
        });
    });

    describe('with headers', () => {
        it('should have set the passed columns', () => {
            const columns = ['name', 'code', 'lastUpdated'];

            dataTableComponent = renderComponent({ columns });

            expect(dataTableComponent.state('columns')).toEqual(['name', 'code', 'lastUpdated']);
        });

        it('should not set the columns if the column value is not an array of strings', () => {
            const columns = ['name', 'code', 'lastUpdated', {}];

            dataTableComponent = renderComponent({ columns });

            expect(dataTableComponent.state('columns')).toEqual(['name', 'lastUpdated']);
        });

        it('should generate the headers wrap', () => {
            expect(dataTableComponent.find('.data-table__headers')).toHaveLength(1);
        });

        it('should generate the correct number of headers', () => {
            expect(dataTableComponent.find(DataTableHeader)).toHaveLength(3);
        });
    });

    it('should have a property for rows that is empty', () => {
        expect(Array.isArray(dataTableComponent.state().dataRows)).toBe(true);
    });

    describe('with source', () => {
        beforeEach(() => {
            const dataTableSource = [
                { uid: 'b1', name: 'BDC', lastUpdated: 'Tomorrow' },
                { uid: 'f1', name: 'BFG', lastUpdated: 'Last year' },
                { uid: 'c1', name: 'BFG', lastUpdated: 'Today' },
            ];

            dataTableComponent = renderComponent({ rows: dataTableSource });
        });

        it('should have set the dataRows onto the state', () => {
            expect(dataTableComponent.state('dataRows')).toHaveLength(3);
        });

        it('should not set the dataRows when the received value is not iterable', () => {
            dataTableComponent = renderComponent({ rows: {} });

            expect(dataTableComponent.state('dataRows')).toHaveLength(0);
        });

        it('should generate a row wrap', () => {
            expect(dataTableComponent.find('.data-table__rows')).toHaveLength(1);
        });

        it('should update the source when the rows property changes', () => {
            dataTableComponent.setProps({ rows: [{ uid: 'b1', name: 'BDC', lastUpdated: 'Tomorrow' }] });

            expect(dataTableComponent.state('dataRows').length).toBe(1);
        });

        it('should correctly render a map', () => {
            dataTableComponent.setProps({
                rows: new Map([
                    ['b1', { uid: 'b1', name: 'BDC', lastUpdated: 'Tomorrow' }],
                    ['f1', { uid: 'f1', name: 'BFG', lastUpdated: 'Last year' }],
                    ['c1', { uid: 'c1', name: 'BFG', lastUpdated: 'Today' }],
                ]),
            });

            expect(dataTableComponent.state('dataRows')).toHaveLength(3);
        });
    });

    describe('interaction', () => {
        beforeEach(() => {
            const dataTableSource = [
                { uid: 'b1', name: 'BDC', lastUpdated: 'Tomorrow' },
                { uid: 'f1', name: 'BFG', lastUpdated: 'Last year' },
                { uid: 'c1', name: 'BFG', lastUpdated: 'Today' },
            ];

            dataTableComponent = renderComponent({ source: dataTableSource });
        });

        it('should show the context menu when the activeRow state is set', () => {
            const fakeRowSource = { name: 'My item' };

            expect(dataTableComponent.find('.data-table__context-menu')).toHaveLength(0);

            dataTableComponent.instance()
                .handleRowClick(
                    { currentTarget: dataTableComponent },
                    fakeRowSource,
                );
            dataTableComponent.update();

            const contextMenuComponent = dataTableComponent.find(DataTableContextMenu);

            expect(contextMenuComponent).toHaveLength(1);
            expect(contextMenuComponent.props().target).toEqual(dataTableComponent);
        });

        it('should hide the context menu when handleRowClick is called twice with the same source', () => {
            const fakeRowSource = { name: 'My item' };

            dataTableComponent.instance().handleRowClick({ clientY: 100, clientX: 100 }, fakeRowSource);
            dataTableComponent.update();
            dataTableComponent.instance().handleRowClick({ clientY: 100, clientX: 100 }, fakeRowSource);
            dataTableComponent.update();

            const contextMenuComponent = dataTableComponent.find('.data-table__context-menu');

            expect(contextMenuComponent).toHaveLength(0);
        });

        it('should not render the context menu when the activeRow is undefined', () => {
            const fakeRowSource = { name: 'My item' };
            dataTableComponent.setState({ contextMenuTarget: {}, activeRow: fakeRowSource });

            dataTableComponent.instance().hideContextMenu();
            dataTableComponent.update();

            const contextMenuComponent = dataTableComponent.find('.data-table__context-menu');

            expect(contextMenuComponent).toHaveLength(0);
            expect(dataTableComponent.state('activeRow')).toBe(undefined);
        });

        it('should initially not show the contextmenu', () => {
            expect(dataTableComponent.find('.data-table__context-menu')).toHaveLength(0);
        });

        // TODO: The Popover requires a dom element as a targetEl prop. Figure out how to test this without a DOM.
        xit('should hide the contextmenu when left clicking outside the contextmenu', () => {
            const fakeRowSource = { name: 'My item' };

            dataTableComponent.instance()
                .handleRowClick(
                    { currentTarget: dataTableComponent },
                    fakeRowSource,
                );
            dataTableComponent.update();

            expect(dataTableComponent.find('.data-table__context-menu')).toHaveLength(1);

            // onRequestClose is called when clicking outside the menu
            dataTableComponent.find(Popover).props().onRequestClose();
            dataTableComponent.update();

            expect(dataTableComponent.find('.data-table__context-menu')).toHaveLength(0);
        });
    });

    describe('context menu action filtering', () => {
        let isContextActionAllowed;
        let contextMenuActions;
        let fakeRowSource;

        beforeEach(() => {
            fakeRowSource = { name: 'My item' };

            isContextActionAllowed = jest.fn().mockReturnValue(true);
            contextMenuActions = {
                edit: () => {},
                delete: () => {},
                translate: () => {},
            };

            dataTableComponent = renderComponent({ isContextActionAllowed, contextMenuActions });
        });

        it('should pass through when the actions are allowed', () => {
            // Show context menu initially
            dataTableComponent.setState({ contextMenuTarget: {}, activeRow: fakeRowSource });
            const passedContextMenuActions = dataTableComponent.find(DataTableContextMenu).props().actions;

            expect(Object.keys(passedContextMenuActions)).toEqual(['edit', 'delete', 'translate']);
        });

        it('should not pass actions that are not allowed', () => {
            const falseForDeleteActionType = (source, action) => action !== 'delete';

            isContextActionAllowed
                .mockReset()
                .mockImplementation(falseForDeleteActionType);

            dataTableComponent = renderComponent({ isContextActionAllowed, contextMenuActions });

            // Show context menu initially
            dataTableComponent.setState({ contextMenuTarget: {}, activeRow: fakeRowSource });
            const passedContextMenuActions = dataTableComponent.find(DataTableContextMenu).props().actions;

            expect(Object.keys(passedContextMenuActions)).toEqual(['edit', 'translate']);
        });
    });
});
