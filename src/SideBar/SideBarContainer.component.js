import React from 'react';
import {State, Navigation} from 'react-router';
import sideBarItemsStore from './sideBarItems.store';
import {config} from 'd2/lib/d2';
import Translate from 'd2-ui/lib/i18n/Translate.mixin';
import {camelCaseToUnderscores} from 'd2-utils';
import Sidebar from 'd2-ui/lib/sidebar/Sidebar.component';
import SideBarButtons from './SideBarButtons.component';

config.i18n.strings.add('maintenance');
config.i18n.strings.add('filter_menu_items_by_name');
config.i18n.strings.add('press_enter_to_go_to_first');
config.i18n.strings.add('search');

const SideBarContainer = React.createClass({
    mixins: [State, Navigation, Translate],

    getInitialState() {
        return {
            sideBarItems: [],
            searchString: '',
        };
    },

    componentWillMount() {
        this.disposable = sideBarItemsStore.subscribe(sideBarItems => {
            this.setState({
                sideBarItems: sideBarItems,
            });
        });
    },

    componentWillUnmount() {
        if (this.disposable && this.disposable.dispose) {
            this.disposable.dispose();
        }
    },

    render() {
        const items = this.state.sideBarItems
            .map(listItem => {
                return {
                    label: this.getTranslation(camelCaseToUnderscores(listItem)),
                    key: listItem,
                };
            })
            .filter(listItem => listItem.label.toLowerCase().indexOf(this.state.searchString.toLowerCase()) >= 0);

        return (
            <Sidebar
                sections={items}
                onChangeSection={this.onChangeSection}
                currentSection={this.state.category}
                showSearchField={true}
                onChangeSearchText={this.onChangeSearchText}
                sideBarButtons={<SideBarButtons />}
            />
        );
    },

    onChangeSearchText(searchString) {
        this.setState({searchString});
    },

    onChangeSection(listItem) {
        this.transitionTo('list', {modelType: listItem});
    },

    filterChildren(searchString, child) {
        // Both values are transformed to lowercase so we can do case insensitive search
        return child.toLowerCase().indexOf(searchString.toLowerCase()) >= 0;
    },
});

export default SideBarContainer;
