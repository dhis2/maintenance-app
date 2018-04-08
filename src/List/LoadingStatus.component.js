import React from 'react';
import PropTypes from 'prop-types';
import LinearProgress from 'material-ui/LinearProgress/LinearProgress';

const LoadingStatus = ({ isLoading }) => (
    <div>
        {isLoading &&
        <LinearProgress
            mode="indeterminate"
            style={{ backgroundColor: 'lightblue' }}
        />}
    </div>
);

LoadingStatus.propTypes = { isLoading: PropTypes.bool.isRequired };

export default LoadingStatus;
