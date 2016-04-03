import React from 'react';
import classes from 'classnames';

const MainContent = React.createClass({
    propTypes: {
        children: React.PropTypes.array.isRequired,
    },

    render() {
        const mainContentStyle = {
            marginTop: '4rem',
            marginBottom: '4rem',
        };

        return (
            <div style={mainContentStyle}>
                {this.props.children}
            </div>
        );
    },
});

export default MainContent;
