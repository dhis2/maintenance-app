import React from 'react';
import {State, Link} from 'react-router';

import sideBarItemsStore from './sideBarItems.store';

import SideBar from './SideBar.component';

let SideBarContainer = React.createClass({
    mixins: [State],

    getInitialState() {
        return {
            sideBarItems: []
        };
    },

    componentWillMount() {
        sideBarItemsStore.subscribe(sideBarItems => {
            this.setState({
                sideBarItems: sideBarItems,
            });
        });
    },

    filterChildren(searchString, child) {
        //Both values are transformed to lowercase so we can do case insensitive search
        return child.props.params.modelType.toLowerCase().indexOf(searchString.toLowerCase()) >= 0;
    },

    render() {
        return (
            <SideBar title="Maintenance" filterChildren={this.filterChildren}>
                {this.state.sideBarItems.map(modelType => {
                   return (<Link key={'list-' + modelType} to="list" params={{modelType: modelType}}><span>{modelType}</span></Link>);
                })}
            </SideBar>
        );
    }
});

export default SideBarContainer;
