import React from 'react';
import GroupEditor from './GroupEditor.component';

export default React.createClass({
    render() {
        const wrapStyle = {
            marginTop: '5rem',
        };

        return (
            <div style={wrapStyle}>
                <GroupEditor />
            </div>
        );
    },
});
