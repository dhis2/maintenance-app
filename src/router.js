import React from 'react';
import { Router, Route, IndexRoute, hashHistory, IndexRedirect } from 'react-router';

import { getInstance } from 'd2/lib/d2';
import log from 'loglevel';
import noop from 'lodash/fp/noop';

import modelToEditStore from './EditModel/modelToEditStore';
import objectActions from './EditModel/objectActions';
import listActions from './List/list.actions';
import snackActions from './Snackbar/snack.actions';
import { initAppState, default as appState } from './App/appStateStore';
import App from './App/App.component';
import listStore from './List/list.store';
import store from './store';
import { resetActiveStep } from './EditModel/stepper/stepper.actions';
import { loadEventProgram } from './EditModel/event-program/actions';
import LoadableComponent, { LoadableWithLoaders } from './utils/LoadableComponent';

function initState({ params }) {
    initAppState({
        sideBar: {
            currentSection: params.groupName,
            currentSubSection: params.modelType,
        },
    });
}

function initStateOrgUnitList({ params }) {
    initAppState({
        sideBar: {
            currentSection: params.groupName,
            currentSubSection: 'organisationUnit',
        },
    }, true);
}

function initStateOrgUnitLevels({ params }) {
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

// TODO: We could use an Observable that manages the current modelType
// to load the correct d2.Model. This would clean up the load function
// below.
function loadObject({ params, router: { replace } }) {
    initState({ params });
    return new Promise((resolve, reject) => {
        if (params.modelId === 'add') {
            getInstance().then((d2) => {
                const modelToEdit = d2.models[params.modelType].create();

                // Set the parent for the new organisationUnit to the selected OU
                // TODO: Should probably be able to do this in a different
                // way when this becomes needed for multiple object types
                if (params.modelType === 'organisationUnit') {
                    return appState
                        // Just take the first value as we don't want this
                        // observer to keep updating the state
                        .take(1)
                        .subscribe((state) => {
                            if (state.selectedOrganisationUnit && state.selectedOrganisationUnit.id) {
                                modelToEdit.parent = {
                                    id: state.selectedOrganisationUnit.id,
                                };
                            }

                            modelToEditStore.setState(modelToEdit);
                            resolve(modelToEdit);
                        });
                }

                // Use current list filters as default values for relevant fields
                const listFilters = listStore.getState() && Object.keys(listStore.getState().filters)
                    .filter(fieldName => modelToEdit.hasOwnProperty(fieldName))
                    .filter(fieldName => listStore.getState().filters[fieldName] !== null)
                    .filter(fieldName => modelToEdit.modelDefinition.modelValidations[fieldName].writable)
                    .reduce((out, modelType) => {
                        out[modelType] = listStore.getState().filters[modelType];
                        return out;
                    }, {});

                modelToEditStore.setState(Object.assign(modelToEdit, listFilters));
                resolve(modelToEdit);
            });
        } else {
            objectActions.getObjectOfTypeById({ objectType: params.modelType, objectId: params.modelId })
                .subscribe(
                    resolve,
                    (errorMessage) => {
                        replace(`/list/${params.modelType}`);
                        snackActions.show({ message: errorMessage, action: 'ok' });
                        reject(errorMessage);
                    },
                );
        }
    });
}

function loadOrgUnitObject({ params, router }) {
    return loadObject({
        params: {
            modelType: 'organisationUnit',
            groupName: params.groupName,
            modelId: params.modelId,
        },
        router,
    });
}

function loadOptionSetObject({ params, router }) {
    return loadObject({
        params: {
            modelType: 'optionSet',
            groupName: params.groupName,
            modelId: params.modelId,
        },
        router,
    });
}

function createLoaderForSchema(schema, actionCreatorForLoadingObject, resetActiveStep) {
    return ({ location: { query }, params }, replace) => {
        initState({
            params: {
                modelType: schema,
                groupName: params.groupName,
                modelId: params.modelId,
            },
        });
        // Fire load action for the event program program to be edited
        store.dispatch(actionCreatorForLoadingObject({ schema, id: params.modelId, query }));
        store.dispatch(resetActiveStep());
    };
}

function loadList({ params }, replace) {
    if (params.modelType === 'organisationUnit') {
        // Don't load organisation units as they get loaded through the
        // appState Also load the initialState without cache so we
        // refresh the assigned organisation units These could have
        // changed by adding an organisation unit which would need to be
        // reflected in the organisation unit tree
        initState({ params });
        return;
    }
    initState({ params });

    return listActions
        .loadList(params.modelType)
        .take(1)
        .subscribe(
            noop,
            (message) => {
                if (/^.+s$/.test(params.modelType)) {
                    const nonPluralAttempt = params.modelType.substring(0, params.modelType.length - 1);
                    log.warn(`Could not find requested model type '${params.modelType}' attempting to redirect to '${nonPluralAttempt}'`);
                    replace(`list/${nonPluralAttempt}`);
                } else {
                    log.error('No clue where', params.modelType, 'comes from... Redirecting to app root');
                    log.error(message);

                    replace('/');
                }
            },
        );
}

function cloneObject({ params, router: { replace } }) {
    initState({ params });
    return new Promise((resolve, reject) => {
        objectActions
            .getObjectOfTypeByIdAndClone({ objectType: params.modelType, objectId: params.modelId })
            .subscribe(
                resolve,
                (errorMessage) => {
                    replace(`/list/${params.modelType}`);
                    snackActions.show({ message: errorMessage, action: 'ok' });
                    reject(errorMessage);
                },
            );
    });
}

const routes = (
    <Router history={hashHistory}>
        <Route
            path="/"
            component={App}
        >
            <IndexRedirect to="/list/all" />
            <Route
                path="list/all"
                component={LoadableComponent({ loader: () => import('./MenuCards/MenuCardsForAllSections.component') })}
                onEnter={() => initState({ params: { groupName: 'all' } })}
            />
            <Route path="list/:groupName">
                <IndexRoute
                    component={LoadableComponent({ loader: () => import('./MenuCards/MenuCardsForSection.component') })}
                    onEnter={initState}
                />
                <Route
                    path="organisationUnit"
                    component={LoadableComponent({ loader: () => import('./List/organisation-unit-list/OrganisationUnitList.component.js') })}
                    onEnter={initStateOrgUnitList}
                />
                <Route
                    path="organisationUnitLevel"
                    component={LoadableComponent({ loader: () => import('./OrganisationUnitLevels/OrganisationUnitLevels.component') })}
                    onEnter={initStateOrgUnitLevels}
                />
                <Route
                    path=":modelType"
                    component={LoadableComponent({ loader: () => import('./List/List.component') })}
                    onEnter={loadList}
                />
            </Route>
            <Route path="edit/:groupName">
                <Route
                    path="organisationUnit/:modelId"
                    component={LoadableWithLoaders({ loader: () => import('./EditModel/EditModelContainer.component') },
                        loadOrgUnitObject)}
                    hideSidebar
                    disableTabs
                />
                <Route
                    path="optionSet/:modelId"
                    component={LoadableWithLoaders({ loader: () => import('./EditModel/EditOptionSet.component') },
                        loadOptionSetObject)}
                    hideSidebar
                    disableTabs
                >
                    <IndexRoute />
                    <Route path=":activeView" />
                </Route>
                <Route
                    path="program/:modelId"
                    component={LoadableComponent({ loader: () => import('./EditModel/event-program/EditProgram.component') })}
                    onEnter={createLoaderForSchema('program', loadEventProgram, resetActiveStep)}
                    hideSidebar
                    disableTabs
                />
                <Route
                    path=":modelType/:modelId/sections"
                    component={LoadableWithLoaders({ loader: () => import('./EditModel/EditDataSetSections.component') },
                        loadObject)}
                    hideSidebar
                    disableTabs
                />
                <Route
                    path=":modelType/:modelId/dataEntryForm"
                    component={LoadableWithLoaders({ loader: () => import('./EditModel/EditDataEntryForm.component') },
                        loadObject)}
                    hideSidebar
                    disableTabs
                />
                <Route
                    path=":modelType/:modelId"
                    component={LoadableWithLoaders({ loader: () => import('./EditModel/EditModelContainer.component') }, loadObject)}
                    hideSidebar
                    disableTabs
                />
            </Route>
            <Route
                path="clone/:groupName/:modelType/:modelId"
                component={LoadableWithLoaders({ loader: () => import('./EditModel/EditModelContainer.component') }, cloneObject)}
                hideSidebar
                disableTabs
            />
            <Route
                path="group-editor"
                component={LoadableComponent({ loader: () => import('./GroupEditor/GroupEditor.component') })}
                onEnter={initState}
            />
            <Route
                path="organisationUnitSection/hierarchy"
                component={LoadableComponent({ loader: () => import('./OrganisationUnitHierarchy') })}
                onEnter={initStateOuHierarchy}
            />
            <Route
                path="sqlViews/:modelId"
                component={LoadableComponent({ loader: () => import('./SqlView') })}
                hideSidebar
                disableTabs
            />
        </Route>
    </Router>
);

export default routes;
