import React from 'react';
import PropTypes from 'prop-types'
import LinearProgress from 'material-ui/LinearProgress/LinearProgress';

export default React.createClass({
    propTypes: {
        isLoading: PropTypes.bool.isRequired,
    },

    getDefaultProps() {
        return {
            isLoading: false,
        };
    },

    render() {
        if (!this.props.isLoading) { return null; }

        return (
            <LinearProgress mode="indeterminate" style={{ backgroundColor: 'lightblue' }} />
        );
    },
});
