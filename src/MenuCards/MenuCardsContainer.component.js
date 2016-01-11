import React from 'react';
import sideBarItemsStore from '../SideBar/sideBarItems.store';
import camelCaseToUnderscores from 'd2-utils/camelCaseToUnderscores';
import MenuCards from './MenuCards.component';
import Translate from 'd2-ui/lib/i18n/Translate.mixin';
import Auth from 'd2-ui/lib/auth/Auth.mixin';
import {Navigation} from 'react-router';

export default React.createClass({
    mixins: [Translate, Auth, Navigation],

    getInitialState() {
        return {
            menuItems: [],
        };
    },

    componentWillMount() {
        this.disposable = sideBarItemsStore
            .scan((acc, values) => {
                return acc.concat(values
                    .map(keyName => ({
                        name: this.getTranslation(camelCaseToUnderscores(keyName)),
                        description: this.getTranslation(`intro_${camelCaseToUnderscores(keyName)}`),
                        canCreate: this.getCurrentUser().canCreate(this.getModelDefinitionByName(keyName)),
                        add: () => this.transitionTo('genericEdit', {modelType: keyName, modelId: 'add'}),
                        list: () => this.transitionTo('list', {modelType: keyName}),
                    })));
            }, [])
            .subscribe(menuItems => this.setState({menuItems}));
    },

    componentWillUnmount() {
        if (this.disposable && this.disposable.dispose) {
            this.disposable.dispose();
        }
    },

    render() {
        const wrapStyle = {
            paddingTop: '3rem',
        };

        return (
            <div style={wrapStyle}>
                <MenuCards menuItems={this.state.menuItems} />
            </div>
        );
    },


});
