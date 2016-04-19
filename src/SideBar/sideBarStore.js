import React from 'react';
import appStateStore from '../App/appStateStore';
import FontIcon from 'material-ui/lib/font-icon';
import objectActions from '../EditModel/objectActions';
import modelToEditStore from '../EditModel/modelToEditStore';

class DefaultSideBarIcon extends FontIcon {
    shouldComponentUpdate() {
        return false;
    }
}
DefaultSideBarIcon.defaultProps = {
    className: 'material-icons',
    children: 'folder_open',
};

function getAdditionalSideBarFields(currentSection) {
    if (currentSection === 'organisationUnitSection') {
        return [
            {
                key: 'hierarchy',
                label: 'Hierarchy operations',
                icon: (<FontIcon className="material-icons">folder_open</FontIcon>),
            },
        ];
    }
    return [];
}

const sideBarState = appStateStore
    .map(appState => {
        const { userOrganisationUnits, selectedOrganisationUnit } = appState;
        const {
            currentSection,
            currentSubSection,
        } = appState.sideBar;

        return {
            sections: (appState.sideBar[currentSection] || appState.sideBar.mainSections)
                .map(section => Object.assign({ icon: <DefaultSideBarIcon /> }, section))
                .concat(getAdditionalSideBarFields(currentSection)),
            currentSection,
            currentSubSection,
            activeItem: currentSubSection || currentSection,
            selectedOrganisationUnit,
            userOrganisationUnits,
            autoCompleteOrganisationUnits: appState.sideBar.organisationUnits,
        };
    });

export default sideBarState;

export const organisationUnitAdded = objectActions.saveObject
    .map(() => modelToEditStore.state)
    .filter((modelToEdit) => modelToEdit.modelDefinition.name === 'organisationUnit')
    .map((modelToEdit) => modelToEdit.parent);

