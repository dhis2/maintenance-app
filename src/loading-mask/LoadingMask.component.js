import React from 'react';
import CircularProgress from 'd2-ui/lib/circular-progress/CircularProgress';

export default () => {
    const loadingStatusMask = {
        left: '45%',
        position: 'fixed',
        top: '45%',
    };

    return (
        <div style={loadingStatusMask}>
            <CircularProgress />
        </div>
    );
}
