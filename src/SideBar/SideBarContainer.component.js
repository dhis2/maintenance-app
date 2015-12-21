import React from 'react';
import {State, Navigation} from 'react-router';
import sideBarItemsStore from './sideBarItems.store';
import SideBar from './SideBar.component';
import {config} from 'd2/lib/d2';
import Translate from 'd2-ui/lib/i18n/Translate.mixin';
import {camelCaseToUnderscores} from 'd2-utils';

config.i18n.strings.add('maintenance');
config.i18n.strings.add('filter_menu_items_by_name');
config.i18n.strings.add('press_enter_to_go_to_first');

const SideBarContainer = React.createClass({
    mixins: [State, Navigation, Translate],

    getInitialState() {
        return {
            sideBarItems: [],
        };
    },

    componentWillMount() {
        sideBarItemsStore.subscribe(sideBarItems => {
            this.setState({
                sideBarItems: sideBarItems,
            });
        });
    },

    render() {
        const items = this.state.sideBarItems
            .map(listItem => {
                return {
                    primaryText: this.getTranslation(camelCaseToUnderscores(listItem)),
                    modelType: listItem,
                    isActive: this.isActive('list', {modelType: listItem}),
                    onClick: function onClick() {
                        this.transitionTo('list', {modelType: listItem});
                    }.bind(this),
                };
            });

        return (
            <SideBar searchHint={this.getTranslation('search')}
                     filterChildren={this.filterChildren}
                     items={items}
                />
        );
    },

    filterChildren(searchString, child) {
        // Both values are transformed to lowercase so we can do case insensitive search
        return child.toLowerCase().indexOf(searchString.toLowerCase()) >= 0;
    },
});

export default SideBarContainer;
