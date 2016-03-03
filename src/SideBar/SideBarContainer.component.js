import React from 'react';
import { hashHistory } from 'react-router';
import sideBarItemsStore from './sideBarItems.store';
import { config } from 'd2/lib/d2';
import Translate from 'd2-ui/lib/i18n/Translate.mixin';
import camelCaseToUnderscores from 'd2-utilizr/lib/camelCaseToUnderscores';
import Sidebar from 'd2-ui/lib/sidebar/Sidebar.component';
import SideBarButtons from './SideBarButtons.component';

config.i18n.strings.add('maintenance');
config.i18n.strings.add('filter_menu_items_by_name');
config.i18n.strings.add('press_enter_to_go_to_first');
config.i18n.strings.add('search');

const SideBarContainer = React.createClass({
    mixins: [Translate],

    // The react-router
    contextTypes: {
        router: React.PropTypes.object,
    },

    getInitialState() {
        return {
            sideBarItems: [],
            searchString: '',
        };
    },

    componentWillMount() {
        this.disposable = sideBarItemsStore.subscribe(sideBarItems => {
            this.setState({
                sideBarItems,
            });
        });
    },

    componentWillUnmount() {
        if (this.disposable && this.disposable.dispose) {
            this.disposable.dispose();
        }
    },

    onChangeSearchText(searchString) {
        this.setState({ searchString });
    },

    onChangeSection(listItem) {
        hashHistory.push(`/list/${listItem}`);
    },

    filterChildren(searchString, child) {
        // Both values are transformed to lowercase so we can do case insensitive search
        return child.toLowerCase().indexOf(searchString.toLowerCase()) >= 0;
    },

    render() {
        const items = this.state.sideBarItems
            .map(listItem => ({
                label: this.getTranslation(camelCaseToUnderscores(listItem)),
                key: listItem,
            }))
            .filter(listItem => listItem.label.toLowerCase().indexOf(this.state.searchString.toLowerCase()) >= 0);

        const activeItem = this.state.sideBarItems
            .reduce((acc, item) => {
                // Stick to the first found
                if (acc !== '') {
                    return acc;
                }

                // Check if the route is an active list route
                if (this.context.router.isActive(`/list/${item}`)) {
                    return item;
                }

                return '';
            }, '');

        return (
            <Sidebar
                sections={items}
                onChangeSection={this.onChangeSection}
                currentSection={activeItem || '--not-set--'}
                showSearchField
                onChangeSearchText={this.onChangeSearchText}
                sideBarButtons={<SideBarButtons />}
            />
        );
    },
});

export default SideBarContainer;
