import React from 'react'
import { CircularProgress } from '@dhis2/d2-ui-core';

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
