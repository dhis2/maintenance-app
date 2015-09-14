import React from 'react';
import classes from 'classnames';
import {RouteHandler} from 'react-router';

import HeaderBar from '../HeaderBar/HeaderBar.component';
import MainContent from '../MainContent/MainContent.component';
import SideBar from '../SideBar/SideBarContainer.component';

const App = React.createClass({
    render() {
        const classList = classes('app');

        return (
            <div className={classList}>
                <HeaderBar />
                <MainContent>
                    <div className="sidebar-container">
                        <div className="sidebar-container--hide-scroll-bar">
                            <SideBar />
                        </div>
                    </div>
                    <div className="main-container">
                        <RouteHandler />
                    </div>
                </MainContent>
            </div>
        );
    },
});

export default App;
