import React from 'react';

import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import Paper from 'material-ui/lib/paper';

import ItemsInGroupManager from './ItemsInGroupManager.component';
import GroupsForItemManager from './GroupsForItemManager.component';

export default React.createClass({
    render() {
        return (
            <Paper>
                <Tabs onChange={this._tabChanged}>
                    <Tab label="Manage items in group">
                        <ItemsInGroupManager ref="itemsForGroup" />
                    </Tab>
                    <Tab label="Manage groups for item">
                        <GroupsForItemManager ref="groupsForItem" />
                    </Tab>
                </Tabs>
            </Paper>
        );
    },

    _tabChanged() {
        this.refs.itemsForGroup.reset();
        this.refs.groupsForItem.reset();
    },
});
