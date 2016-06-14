import React from 'react';
import appStateStore, { reloadUserOrganisationUnits } from '../App/appStateStore';
import FontIcon from 'material-ui/lib/font-icon';
import objectActions from '../EditModel/objectActions';
import modelToEditStore from '../EditModel/modelToEditStore';
import { afterDeleteHook$ } from '../List/ContextActions.js';
import { Observable } from 'rx';

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
                label: 'hierarchyOperations',
                icon: (<FontIcon className="material-icons">folder_open</FontIcon>),
            },
        ];
    } else if (currentSection === 'dataSet') {
        return [
            {
                key: 'assignment',
                label: 'assignmentEditor',
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

const organisationUnitAdded$ = objectActions.saveObject
    .map(() => modelToEditStore.state)
    .filter((modelToEdit) => modelToEdit.modelDefinition.name === 'organisationUnit')
    .map((modelToEdit) => modelToEdit.parent);

const afterOrganisationUnitDeleted$ = afterDeleteHook$
    .filter(data => data.modelType && data.modelType === 'organisationUnit')
    .flatMap(() => Observable.fromPromise(reloadUserOrganisationUnits()))
    .map(() => appStateStore.getState().selectedOrganisationUnit);

export const organisationUnitTreeChanged$ = Observable.merge(organisationUnitAdded$, afterOrganisationUnitDeleted$);

