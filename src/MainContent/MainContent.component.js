import React from 'react';
import classes from 'classnames';

const MainContent = React.createClass({
    propTypes: {
        children: React.PropTypes.array.isRequired,
    },

    render() {
        const classList = classes('main-content');

        return (
            <div className={classList}>
                {this.props.children}
            </div>
        );
    },
});

export default MainContent;
