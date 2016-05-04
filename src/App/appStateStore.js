import Store from 'd2-ui/lib/store/Store';
import { getInstance } from 'd2/lib/d2';
import camelCaseToUnderscores from 'd2-utilizr/lib/camelCaseToUnderscores';
import isObject from 'd2-utilizr/lib/isObject';
import snackActions from '../Snackbar/snack.actions';

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
        .map(sideBarCategory => ({
            name: sideBarCategory,
            items: sideBarConfig[sideBarCategory].items
                .filter(isInPredefinedList(modelDefinitionNames))
                .map(key => ({
                    key,
                    label: d2.i18n.getTranslation(camelCaseToUnderscores(key)),
                })),
        }))
        .reduce((acc, sideBarCategory) => {
            acc[sideBarCategory.name] = sideBarCategory.items; // eslint-disable-line no-param-reassign
            return acc;
        }, {
            mainSections: Object.keys(sideBarConfig)
                .map(sideBarCategory => ({
                    key: sideBarCategory,
                    label: d2.i18n.getTranslation(camelCaseToUnderscores(sideBarCategory)),
                })),
        });
}

// TODO: Move the caching of these organisation units to d2.currentUser instead
async function getCurrentUserOrganisationUnits(disableCache = false) {
    if (!disableCache && getCurrentUserOrganisationUnits.currentUserOrganisationUnits) {
        return getCurrentUserOrganisationUnits.currentUserOrganisationUnits;
    }

    const d2 = await getInstance();
    const organisationUnitsCollection = await d2.currentUser.getOrganisationUnits();

    if (d2.currentUser.authorities.has('ALL') && !organisationUnitsCollection.size) {
        const rootLevelOrgUnits = await d2.models.organisationUnits.list({level: 1});

        getCurrentUserOrganisationUnits.currentUserOrganisationUnits = rootLevelOrgUnits;

        if (rootLevelOrgUnits.size === 0) {
            snackActions.show({
                message: 'no_org_units_add_one_to_get_started',
                translate: true,
            });
        }

        return rootLevelOrgUnits;
    }

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

export async function reloadUserOrganisationUnits() {
    const userOrganisationUnits = await getCurrentUserOrganisationUnits(true);

    appState.setState({
        ...appState.getState(),
        userOrganisationUnits,
    });
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
                    newAppState[stateKey] = Object.assign({}, newAppState[stateKey], startState[stateKey]);  // eslint-disable-line no-param-reassign
                } else {
                    newAppState[stateKey] = startState[stateKey];  // eslint-disable-line no-param-reassign
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

export const currentSubSection$ = appState
    .map(state => state.sideBar.currentSubSection)
    .distinctUntilChanged();
