import React from 'react';
import Store from 'd2-ui/lib/store/Store';
import MenuCards from './MenuCards.component';
import Translate from 'd2-ui/lib/i18n/Translate.mixin';
import Auth from 'd2-ui/lib/auth/Auth.mixin';
import Heading from 'd2-ui/lib/headings/Heading.component';
import menuCardsStore from './menuCardsStore';

export default React.createClass({
    mixins: [Translate, Auth],

    getInitialState() {
        return {
            menuItems: [],
        };
    },

    componentWillMount() {
        this.disposable = menuCardsStore
            .subscribe(menuItems => {
                console.log(menuItems);
                this.setState({ menuItems });
            });
    },

    componentWillUnmount() {
        if (this.disposable && this.disposable.dispose) {
            this.disposable.dispose();
        }
    },

    render() {
        return (
            <div>
                {this.state.menuItems
                    .filter(metaDataSection => this.props.params.groupName ? metaDataSection.key === this.props.params.groupName : true)
                    .map((metaDataSection) => {
                        return (
                            <div key={metaDataSection.key}>
                                <Heading text={metaDataSection.name} level={2} />
                                <MenuCards menuItems={metaDataSection.items} />
                            </div>
                        );
                    })}
            </div>
        );
    },
});
