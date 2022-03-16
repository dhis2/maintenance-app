import React from 'react';
import PropTypes from 'prop-types';

const Translate = {
    contextTypes: {
        d2: PropTypes.object.isRequired,
    },

    getTranslation(key) {
        return this.context.d2.i18n.getTranslation(key);
    },
};

export default Translate;
