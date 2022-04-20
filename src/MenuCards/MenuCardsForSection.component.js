import MenuCards from './MenuCards.component';
import { withStateFrom } from '@dhis2/d2-ui-core';
import menuCardsStore from './menuCardsStore';
import appState from '../App/appStateStore';

const currentSection$ = appState
    .map(appState => appState.sideBar.currentSection)
    .distinctUntilChanged();

const sectionItemsForCurrentGroup$ = menuCardsStore
    .combineLatest(currentSection$)
    // Filter the section based on the app's currentSection
    .flatMap(([metaDataSections, currentSection]) => metaDataSections.filter(metaDataSection => metaDataSection.key === currentSection))
    // Map the section items onto the props for the MenuCards component
    .map(currentSection => ({ menuItems: currentSection.items }));

export default withStateFrom(sectionItemsForCurrentGroup$, MenuCards);
