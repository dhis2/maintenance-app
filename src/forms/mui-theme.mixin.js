import React from 'react';
import PropTypes from 'prop-types'

import AppTheme from '../App/app.theme';

export default {
    childContextTypes: {
        muiTheme: PropTypes.object,
    },

    getChildContext() {
        return {
            muiTheme: AppTheme,
        };
    },
};
