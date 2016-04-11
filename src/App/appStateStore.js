import Store from 'd2-ui/lib/store/Store';
import { getInstance } from 'd2/lib/d2';
import camelCaseToUnderscores from 'd2-utilizr/lib/camelCaseToUnderscores';
import isObject from 'd2-utilizr/lib/isObject';

import maintenanceModels from '../config/maintenance-models';
const sideBarConfig = maintenanceModels.getSideBarConfig();

const appState = Store.create();

function isInPredefinedList(predefinedList) {
    return function isInPredefinedListFunc(name) {
        return predefinedList.indexOf(name) >= 0;
    };
}

async function loadSideBarState() {
    const d2 = await getInstance();
    const modelDefinitionNames = d2.models.mapThroughDefinitions(definition => definition.name);

    return Object.keys(sideBarConfig)
        .map(sideBarCategory => {
            return {
                name: sideBarCategory,
                items: sideBarConfig[sideBarCategory].items
                    .filter(isInPredefinedList(modelDefinitionNames))
                    .map(key => ({
                        key,
                        label: d2.i18n.getTranslation(camelCaseToUnderscores(key)),
                    }))
            };
        })
        .reduce((acc, sideBarCategory) => {
            acc[sideBarCategory.name] = sideBarCategory.items;
            return acc;
        }, {
            mainSections: Object.keys(sideBarConfig)
                .map(sideBarCategory => {
                    return {
                        key: sideBarCategory,
                        label: d2.i18n.getTranslation(camelCaseToUnderscores(sideBarCategory)),
                    };
                }),
        });
}

// TODO: Move the caching of these organisation units to d2.currentUser instead
async function getCurrentUserOrganisationUnits(disableCache = false) {
    if (!disableCache && getCurrentUserOrganisationUnits.currentUserOrganisationUnits) {
        return getCurrentUserOrganisationUnits.currentUserOrganisationUnits;
    }

    const d2 = await getInstance();
    const organisationUnitsCollection = await d2.currentUser.getOrganisationUnits();

    getCurrentUserOrganisationUnits.currentUserOrganisationUnits = organisationUnitsCollection;

    return organisationUnitsCollection;
}

async function loadSelectedOrganisationUnitState() {
    if (appState.state && appState.state.selectedOrganisationUnit) {
        return appState.state.selectedOrganisationUnit;
    }

    const organisationUnitsCollection = await getCurrentUserOrganisationUnits();

    return organisationUnitsCollection.toArray()
        .reduce((selectedOU, orgUnit) => {
            if (!selectedOU.path || (selectedOU.path.length > orgUnit.path.length)) {
                return orgUnit;
            }
            return selectedOU;
        }, {});
}

export async function initAppState(startState, disableCache) {
    const [sideBar, selectedOrganisationUnit, userOrganisationUnits] = await Promise.all([
        loadSideBarState(),
        loadSelectedOrganisationUnitState(),
        getCurrentUserOrganisationUnits(disableCache),
    ]);

    const loadedState = {
        selectedOrganisationUnit,
        sideBar,
        mainSections: sideBar.mainSections,
        userOrganisationUnits,
        hierarchy: {
            selectedLeft: [],
            selectedRight: [],
            isProcessing: false,
            leftRoots: userOrganisationUnits.toArray(),
            rightRoots: userOrganisationUnits.toArray(),
        },
    };

    const completeInitState = Object.keys(startState)
        .reduce((newAppState, stateKey) => {
            if (newAppState[stateKey]) {
                if (isObject(newAppState[stateKey])) {
                    newAppState[stateKey] = Object.assign({}, newAppState[stateKey], startState[stateKey]);
                } else {
                    newAppState[stateKey] = startState[stateKey];
                }
            }
            return newAppState;
        }, loadedState);

    appState.setState(completeInitState);
}

export default appState;

export function setAppState(newPartialState) {
    appState.setState(Object.assign({}, appState.state, newPartialState));
}
