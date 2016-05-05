import React from 'react';
import EditModelContainer from './EditModelContainer.component';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import OptionManagement from './option-set/OptionManagement.component';

export default function EditOptionSet(props) {
    const params = Object.assign({}, props.params, { modelType: 'optionSet' });

    return (
        <Tabs>
            <Tab label="Option set">
                <EditModelContainer {...props} params={params} />
            </Tab>
            <Tab label="Option management">
                <OptionManagement />
            </Tab>
        </Tabs>
    );
}
