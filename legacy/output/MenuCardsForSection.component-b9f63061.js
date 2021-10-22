import { w as withStateFrom, e as appState, j as _slicedToArray } from './index-44839b1a.js';
import { M as MenuCards, m as menuCardsStore } from './menuCardsStore-f8c434d9.js';

var currentSection$ = appState.map(function (appState) {
  return appState.sideBar.currentSection;
}).distinctUntilChanged();
var sectionItemsForCurrentGroup$ = menuCardsStore.combineLatest(currentSection$) // Filter the section based on the app's currentSection
.flatMap(function (_ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      metaDataSections = _ref2[0],
      currentSection = _ref2[1];

  return metaDataSections.filter(function (metaDataSection) {
    return metaDataSection.key === currentSection;
  });
}) // Map the section items onto the props for the MenuCards component
.map(function (currentSection) {
  return {
    menuItems: currentSection.items
  };
});
var MenuCardsForSection_component = withStateFrom(sectionItemsForCurrentGroup$, MenuCards);

export { MenuCardsForSection_component as default };
