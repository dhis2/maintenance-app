import React from 'react';

export default {
    contextTypes: {
        updateForm: React.PropTypes.func.isRequired,
        setStatus: React.PropTypes.func.isRequired,
    },

    childContextTypes: {
        updateForm: React.PropTypes.func.isRequired,
        setStatus: React.PropTypes.func.isRequired,
    },

    getChildContext() {
        return {
            updateForm: this.context.updateForm,
            setStatus: this.context.setStatus,
        };
    },
};
