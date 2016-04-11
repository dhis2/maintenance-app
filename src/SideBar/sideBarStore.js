import React from 'react';
import appStateStore from '../App/appStateStore';
import FontIcon from 'material-ui/lib/font-icon';

function getAdditionalSideBarFields(currentSection) {
    if (currentSection === 'organisationUnitSection') {
        return [
            {
                key: 'hierarchy',
                label: 'Hierarchy operations',
                icon: (<FontIcon className="material-icons">folder_open</FontIcon>),
            }
        ];
    }
    return [];
}

export default appStateStore
    .map(appState => {
        const {userOrganisationUnits, selectedOrganisationUnit} = appState;
        const {
            currentSection,
            currentSubSection,
        } = appState.sideBar;

        return {
            sections: (appState.sideBar[currentSection] || appState.sideBar.mainSections)
                .map(section => {
                    section.icon = (<FontIcon className="material-icons">folder_open</FontIcon>);
                    return section;
                })
                .concat(getAdditionalSideBarFields(currentSection)),
            currentSection,
            currentSubSection,
            activeItem: currentSubSection ? currentSubSection : currentSection,
            selectedOrganisationUnit,
            userOrganisationUnits,
            autoCompleteOrganisationUnits: appState.sideBar.organisationUnits,
        };
    });
