import React from 'react';
import MenuCards from './MenuCards.component';
import Heading from 'd2-ui/lib/headings/Heading.component';
import menuCardsStore from './menuCardsStore';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';

const sectionsForAllCards$ = menuCardsStore
    .map(sections => ({ sections }));

function MenuCardsForAllSections(props) {
    return (
        <div>
            {props.sections
                .map((metaDataSection) => {
                    return (
                        <div key={metaDataSection.key}>
                            <Heading>{metaDataSection.name}</Heading>
                            <MenuCards menuItems={metaDataSection.items} />
                        </div>
                    );
                })}
        </div>
    );
}
MenuCardsForAllSections.defaultProps = {
    sections: [],
};

export default withStateFrom(sectionsForAllCards$, MenuCardsForAllSections);
//
// export default React.createClass({
//    mixins: [Translate, Auth],
//
//    getInitialState() {
//        return {
//            menuItems: [],
//        };
//    },
//
//    componentWillMount() {
//        this.disposable = menuCardsStore
//            .subscribe(menuItems => {
//                this.setState({ menuItems });
//            });
//    },
//
//    componentWillUnmount() {
//        if (this.disposable && this.disposable.dispose) {
//            this.disposable.dispose();
//        }
//    },
//
//    render() {
//        return (
//            <div>
//                {this.state.sections
//                    .map((metaDataSection) => {
//                        return (
//                            <div key={metaDataSection.key}>
//                                <Heading>metaDataSection.label</Heading>
//                                <MenuCards menuItems={metaDataSection.items} />
//                            </div>
//                        );
//                    })}
//            </div>
//        );
//    },
// });
