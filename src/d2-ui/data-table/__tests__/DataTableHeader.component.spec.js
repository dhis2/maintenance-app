import React from 'react';
import { shallow } from 'enzyme';
import DataTableHeader from '../DataTableHeader.component';

describe('DataTableHeader component', () => {
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
        return shallow(
            <DataTableHeader {...Object.assign({ contextMenuActions: cma }, props)} />,
            {
                context: {
                    d2: {
                        i18n: {
                            getTranslation(key) {
                                return `${key}_translated`;
                            },
                        },
                    },
                },
            },
        );
    }

    beforeEach(() => {
        dataTableComponent = renderComponent({ name: 'lastUpdated' });
    });

    it('should load two columns', () => {
        expect(dataTableComponent).toHaveLength(1);
    });

    it('should transform display as underscores and translate', () => {
        expect(dataTableComponent.text()).toBe('last_updated_translated');
    });

    it('should add the data-table__headers__header--even class', () => {
        expect(dataTableComponent.hasClass('data-table__headers__header--even')).toBe(true);
    });

    it('should add the data-table__headers__header--odd class', () => {
        dataTableComponent = renderComponent({ name: 'lastUpdated', isOdd: true });

        expect(dataTableComponent.hasClass('data-table__headers__header--odd')).toBe(true);
    });
});
