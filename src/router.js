import React from 'react';
import {Router, Route, IndexRoute, hashHistory, IndexRedirect} from 'react-router';
import log from 'loglevel';
import modelToEditStore from './EditModel/modelToEditStore';
import {getInstance} from 'd2/lib/d2';
import objectActions from './EditModel/objectActions';
import listActions from './List/list.actions';
import snackActions from './Snackbar/snack.actions';
import {initAppState, default as appState} from './App/appStateStore';
import LinearProgress from 'material-ui/LinearProgress';
import App from './App/App.component';

import onDemand from './on-demand';

function initState({params}) {
    initAppState({
        sideBar: {
            currentSection: params.groupName,
            currentSubSection: params.modelType,
        },
    });
}

function initStateOrgUnitList({params}) {
    initAppState({
        sideBar: {
            currentSection: params.groupName,
            currentSubSection: 'organisationUnit',
        },
    }, true);
}

function initStateOrgUnitLevels({params}) {
    initAppState({
        sideBar: {
            currentSection: params.groupName,
            currentSubSection: 'organisationUnitLevel',
        },
    });
}

function initStateOuHierarchy() {
    initAppState({
        sideBar: {
            currentSection: 'organisationUnitSection',
            currentSubSection: 'hierarchy',
        },
    });
}

// TODO: We could use an Observable that manages the current modelType to load the correct d2.Model. This would clean up the load function below.
function loadObject({params}, replace, callback) {
    initState({params});

    if (params.modelId === 'add') {
        getInstance().then((d2) => {
            const modelToEdit = d2.models[params.modelType].create();

            // Set the parent for the new organisationUnit to the selected OU
            // TODO: Should probably be able to do this in a different way when this becomes needed for multiple object types
            if (params.modelType === 'organisationUnit') {
                return appState
                // Just take the first value as we don't want this observer to keep updating the state
                    .take(1)
                    .subscribe((state) => {
                        if (state.selectedOrganisationUnit && state.selectedOrganisationUnit.id) {
                            modelToEdit.parent = {
                                id: state.selectedOrganisationUnit.id,
                            };
                        }

                        modelToEditStore.setState(modelToEdit);
                        callback();
                    });
            }

            modelToEditStore.setState(modelToEdit);
            return callback();
        });
    } else {
        objectActions.getObjectOfTypeById({objectType: params.modelType, objectId: params.modelId})
            .subscribe(
                () => callback(),
                (errorMessage) => {
                    replace(`/list/${params.modelType}`);
                    snackActions.show({message: errorMessage, action: 'ok'});
                    callback();
                }
            );
    }
}

function loadOrgUnitObject({params}, replace, callback) {
    loadObject({
        params: {
            modelType: 'organisationUnit',
            groupName: params.groupName,
            modelId: params.modelId
        }
    }, replace, callback);
}

function loadOptionSetObject({params}, replace, callback) {
    loadObject({
        params: {
            modelType: 'optionSet',
            groupName: params.groupName,
            modelId: params.modelId
        }
    }, replace, callback);
}

function loadList({params}, replace, callback) {
    if (params.modelType === 'organisationUnit') {
        // Don't load organisation units as they get loaded through the appState
        // Also load the initialState without cache so we refresh the assigned organisation units
        // These could have changed by adding an organisation unit which would need to be reflected in the
        // organisation unit tree
        initState({params}, true);
        return callback();
    }

    initState({params});
    return listActions.loadList(params.modelType)
        .subscribe(
            (message) => {
                log.debug(message);
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

function cloneObject({params}, replace, callback) {
    initState({params});

    objectActions.getObjectOfTypeByIdAndClone({objectType: params.modelType, objectId: params.modelId})
        .subscribe(
            () => callback(),
            (errorMessage) => {
                replace(`/list/${params.modelType}`);
                snackActions.show({message: errorMessage, action: 'ok'});
                callback();
            }
        );
}

function delayRender(importFactory, loadingComponent = <LinearProgress />) {
    return (props) => {
        const BaseComponent = onDemand.loadDefault(importFactory, {loadingComponent: () => loadingComponent})

        return <BaseComponent {...props} />
    };
}

const routes = (
    <Router history={hashHistory}>
        <Route
            path="/"
            component={App}
        >
            <IndexRedirect to="/list/all"/>
            <Route
                path="list/all"
                component={delayRender(() => System.import('./MenuCards/MenuCardsForAllSections.component'))}
                onEnter={() => initState({ params: { groupName: 'all' } })}
            />
            <Route path="list/:groupName">
                <IndexRoute
                    component={delayRender(() => System.import('./MenuCards/MenuCardsForSection.component'))}
                    onEnter={initState}
                />
                <Route
                    path="organisationUnit"
                    component={delayRender(() => System.import('./List/organisation-unit-list/OrganisationUnitList.component.js'))}
                    onEnter={initStateOrgUnitList}
                />
                <Route
                    path="organisationUnitLevel"
                    component={delayRender(() => System.import('./OrganisationUnitLevels/OrganisationUnitLevels.component'))}
                    onEnter={initStateOrgUnitLevels}
                />
                <Route
                    path=":modelType"
                    component={delayRender(() => System.import('./List/List.component'))}
                    onEnter={loadList}
                />
            </Route>
            <Route path="edit/:groupName">
                <Route
                    path="organisationUnit/:modelId"
                    component={delayRender(() => System.import('./EditModel/EditModelContainer.component'))}
                    onEnter={loadOrgUnitObject}
                />
                <Route
                    path="optionSet/:modelId"
                    component={delayRender(() => System.import('./EditModel/EditOptionSet.component'))}
                    onEnter={loadOptionSetObject}
                >
                    <IndexRoute />
                    <Route path=":activeView"/>
                </Route>
                <Route
                    path=":modelType/:modelId/sections"
                    component={delayRender(() => System.import('./EditModel/EditDataSetSections.component'))}
                    onEnter={loadObject}
                />
                <Route
                    path=":modelType/:modelId/dataEntryForm"
                    component={delayRender(() => System.import('./EditModel/EditDataEntryForm.component'))}
                    onEnter={loadObject}
                    disableSidebar
                />
                <Route
                    path=":modelType/:modelId"
                    component={delayRender(() => System.import('./EditModel/EditModelContainer.component'))}
                    onEnter={loadObject}
                />
            </Route>
            <Route
                path="clone/:groupName/:modelType/:modelId"
                component={delayRender(() => System.import('./EditModel/EditModelContainer.component'))}
                onEnter={cloneObject}
            />
            <Route
                path="group-editor"
                component={delayRender(() => System.import('./GroupEditor/GroupEditor.component'))}
                onEnter={initState}
            />
            <Route
                path="organisationUnitSection/hierarchy"
                component={delayRender(() => System.import('./OrganisationUnitHierarchy'))}
                onEnter={initStateOuHierarchy}
            />
        </Route>
    </Router>
);

export default routes;
