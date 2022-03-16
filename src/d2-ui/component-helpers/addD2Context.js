import React from 'react';
import PropTypes from 'prop-types';
import addContext from './addContext';

export default function addD2Context(Component) {
    return addContext(Component, { d2: PropTypes.object });
}
