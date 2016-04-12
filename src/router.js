import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import log from 'loglevel';
import App from './App/App.component';
import List from './List/List.component';
import EditModelContainer from './EditModel/EditModelContainer.component';
import GroupEditor from './GroupEditor/GroupEditor.component';
import modelToEditStore from './EditModel/modelToEditStore';
import { getInstance } from 'd2/lib/d2';
import objectActions from './EditModel/objectActions';
import listActions from './List/list.actions';
import snackActions from './Snackbar/snack.actions';
import { initAppState, default as appState } from './App/appStateStore';
import OrganisationUnitList from './List/organisation-unit-list/OrganisationUnitList.component.js';
import {fieldFilteringForQuery} from './List/list.store';
import MenuCardsForSection from './MenuCards/MenuCardsForSection.component';
import MenuCardsForAllSections from './MenuCards/MenuCardsForAllSections.component';
import OrganisationUnitHierarchy from './OrganisationUnitHierarchy';

function loadObject({ params }, replace, callback) {
    initState({ params });

    if (params.modelId === 'add') {
        getInstance().then((d2) => {
            const modelToEdit = d2.models[params.modelType].create();

            // Set the parent for the new organisationUnit to the selected OU
            // TODO: Should probably be able to do this in a different way when this becomes needed for multiple object types
            if (params.modelType === 'organisationUnit') {
                appState
                    .subscribe((appState) => {
                        if (appState.selectedOrganisationUnit && appState.selectedOrganisationUnit.id) {
                            modelToEdit.parent = {
                                id: appState.selectedOrganisationUnit.id,
                            };
                        }

                        modelToEditStore.setState(modelToEdit);
                        callback();
                    })
            } else {
                modelToEditStore.setState(modelToEdit);
                callback();
            }
        });
    } else {
        objectActions.getObjectOfTypeById({ objectType: params.modelType, objectId: params.modelId })
            .subscribe(
                () => callback(),
                (errorMessage) => {
                    replace(`/list/${params.modelType}`);
                    snackActions.show({ message: errorMessage });
                    callback();
                }
            );
    }
}

function loadList({ params }, replace, callback) {
    if (params.modelType === 'organisationUnit') {
        // Don't load organisation units as they get loaded through the appState
        // Also load the initialState without cache so we refresh the assigned organisation units
        // These could have changed by adding an organisation unit which would need to be reflexted in the
        // organisation unit tree
        initState({ params }, true);
        return callback();
    }

    initState({ params });
    listActions.loadList(params.modelType)
        .subscribe(
            (message) => {
                log.info(message);
                callback();
            },
            (message) => {
                if (/^.+s$/.test(params.modelType)) {
                    const nonPluralAttempt = params.modelType.substring(0, params.modelType.length - 1);
                    log.warn(`Could not find requested model type '${params.modelType}' attempting to redirect to '${nonPluralAttempt}'`);
                    replace(`list/${nonPluralAttempt}`);
                    callback();
                } else {
                    log.error('No clue where', params.modelType, 'comes from... Redirecting to app root');
                    log.error(message);

                    replace('/');
                    callback();
                }
            }
        );
}

function cloneObject({ params }, replace, callback) {
    initState({ params });

    objectActions.getObjectOfTypeByIdAndClone({ objectType: params.modelType, objectId: params.modelId })
        .subscribe(
            () => callback(),
            (errorMessage) => {
                replace(`/list/${params.modelType}`);
                snackActions.show({ message: errorMessage });
                callback();
            }
        );
}

function initState({ params }) {
    initAppState({
        sideBar: {
            currentSection: params.groupName,
            currentSubSection: params.modelType,
        },
    });
}

async function initStateOrgUnitList({ params }) {
    initAppState({
        sideBar: {
            currentSection: params.groupName,
            currentSubSection: 'organisationUnit',
        },
    }, true);
}

function loadOrgUnitObject({ params }, replace, callback) {
    loadObject({ params: { modelType: 'organisationUnit', groupName: params.groupName, modelId: params.modelId} }, replace, callback);
}

function initStateOuHierarchy() {
    initAppState({
        sideBar: {
            currentSection: 'organisationUnitSection',
            currentSubSection: 'hierarchy',
        },
    });
}

const routes = (
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={MenuCardsForAllSections} onEnter={initState} />
            <Route path="list/:groupName">
                <IndexRoute
                    component={MenuCardsForSection}
                    onEnter={initState}
                />
                <Route
                    path="organisationUnit"
                    component={OrganisationUnitList}
                    onEnter={initStateOrgUnitList}
                />
                <Route
                    path=":modelType"
                    component={List}
                    onEnter={loadList}
                />
            </Route>
            <Route path="edit/:groupName">
                <Route
                    path="organisationUnit/:modelId"
                    component={EditModelContainer}
                    onEnter={loadOrgUnitObject}
                />
                <Route
                    path=":modelType/:modelId"
                    component={EditModelContainer}
                    onEnter={loadObject}
                />
            </Route>
            <Route
                path="clone/:groupName/:modelType/:modelId"
                component={EditModelContainer}
                onEnter={cloneObject}
            />
            <Route
                path="group-editor"
                component={GroupEditor}
                onEnter={initState}
            />
            <Route
                path="organisationUnitSection/hierarchy"
                component={OrganisationUnitHierarchy}
                onEnter={initStateOuHierarchy}
            />
        </Route>
    </Router>
);

export function goToRoute(url) {
    hashHistory.push(url);
}

export function goBack() {
    hashHistory.goBack();
}

export default routes;
