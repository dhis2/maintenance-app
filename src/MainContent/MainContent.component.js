import React from 'react';
import classes from 'classnames';

const MainContent = React.createClass({
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
