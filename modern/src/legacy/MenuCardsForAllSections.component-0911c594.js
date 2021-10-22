import { w as withStateFrom, r as react, H as Heading } from './index-44839b1a.js';
import { m as menuCardsStore, M as MenuCards } from './menuCardsStore-f8c434d9.js';

var sectionsForAllCards$ = menuCardsStore.map(function (sections) {
  return {
    sections: sections
  };
});

function MenuCardsForAllSections(props) {
  return /*#__PURE__*/react.createElement("div", null, props.sections // Only show sections that have items
  .filter(function (metaDataSection) {
    return metaDataSection.items.length > 0;
  }).map(function (metaDataSection) {
    return /*#__PURE__*/react.createElement("div", {
      key: metaDataSection.key
    }, /*#__PURE__*/react.createElement(Heading, null, metaDataSection.name), /*#__PURE__*/react.createElement(MenuCards, {
      menuItems: metaDataSection.items
    }));
  }));
}

MenuCardsForAllSections.defaultProps = {
  sections: []
};
var MenuCardsForAllSections_component = withStateFrom(sectionsForAllCards$, MenuCardsForAllSections);

export { MenuCardsForAllSections_component as default };
