import React from 'react';
import CircularProgress from 'material-ui/CircularProgress/CircularProgress';

export default React.createClass({
    render() {
        const loadingStatusMask = {
            left: '45%',
            position: 'fixed',
            top: '45%',
        };

        return (
            <CircularProgress
                mode="indeterminate"
                size={1.5}
                style={loadingStatusMask}
            />
        );
    },
});
