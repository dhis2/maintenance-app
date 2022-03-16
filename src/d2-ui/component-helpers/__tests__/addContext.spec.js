import React from 'react';
import PropTypes from 'prop-types';
import addContext from '../addContext';

describe('addContext', () => {
    it('should be a function', () => {
        expect(typeof addContext).toBe('function');
    });

    it('should be return the passed in class with the context added to it', () => {
        class Component extends React.Component {}

        const componentWithContext = addContext(Component, {
            name: PropTypes.object,
        });

        expect(componentWithContext.contextTypes).toEqual({ name: PropTypes.object });
    });

    it('should also add the contextTypes to a function component', () => {
        function App() {}

        const componentWithD2Context = addContext(App, {
            name: PropTypes.string,
        });

        expect(componentWithD2Context.contextTypes).toEqual({ name: PropTypes.string });
    });

    it('should respect the contextTypes added earlier', () => {
        function App() {}
        App.contextTypes = { isAmazing: PropTypes.bool };

        const componentWithD2Context = addContext(App, {
            name: PropTypes.string,
        });

        expect(componentWithD2Context.contextTypes).toEqual({ name: PropTypes.string, isAmazing: PropTypes.bool });
    });
});
