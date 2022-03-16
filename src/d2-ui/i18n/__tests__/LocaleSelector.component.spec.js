import React from 'react';
import { shallow } from 'enzyme';
import MuiSelectField from 'material-ui/SelectField/SelectField';
import MenuItem from 'material-ui/MenuItem';

import LocaleSelector from '../LocaleSelector.component';
import { getStubContext } from '../../../config/inject-theme';

describe('LocaleSelector component', () => {
    let Component;
    let onChangeLocaleSpy;
    const locales = [{ locale: 'elf', name: 'Elfish' }, { locale: 'noren', name: 'Norglish' }];

    beforeEach(() => {
        onChangeLocaleSpy = jest.fn();
        Component = shallow(<LocaleSelector locales={locales} onChange={onChangeLocaleSpy} />, {
            context: getStubContext(),
        });
    });

    it('should render a MuiSelectField component', () => {
        expect(Component.type()).toBe(MuiSelectField);
    });

    it('should render items array as menu items', () => {
        expect(Component.contains(<MenuItem value="elf" primaryText="Elfish" />)).toBe(true);
    });

    it('should render list of items with length 1 greater than the passed in list', () => {
        expect(Component.children()).toHaveLength(locales.length + 1);
    });

    it('should call onChange function when field content is changed', () => {
        Component.simulate('change', {}, 2, 'noren');

        expect(onChangeLocaleSpy).toHaveBeenCalled();
        expect(onChangeLocaleSpy.mock.calls[0][0]).toBe('noren');
    });

    it('should change the local state when field content is changed', () => {
        expect(Component.state()).toBeNull();

        Component.simulate('change', {}, 2, 'noren');

        expect(Component.state().locale).toEqual('noren');
    });
});
