import React from 'react';
import PropTypes from 'prop-types';
import addD2Context from '../addD2Context';

describe('addD2Context', () => {
    it('should be a function', () => {
        expect(typeof addD2Context).toBe('function');
    });

    it('should be return the passed in class with the context added to it', () => {
        class Component extends React.Component {}

        const componentWithD2Context = addD2Context(Component, {
            name: PropTypes.object,
        });

        expect(componentWithD2Context.contextTypes).toEqual({ d2: PropTypes.object });
    });

    it('should also add the contextTypes to a function component', () => {
        function App() {}

        const componentWithD2Context = addD2Context(App);

        expect(componentWithD2Context.contextTypes).toEqual({ d2: PropTypes.object });
    });
});
