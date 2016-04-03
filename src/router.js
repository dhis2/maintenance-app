import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import log from 'loglevel';
import App from './App/App.component';
import MenuCards from './MenuCards/MenuCardsContainer.component';
import List from './List/List.component';
import EditModelContainer from './EditModel/EditModelContainer.component';
import GroupEditorContainer from './GroupEditor/GroupEditorContainer.component';
import modelToEditStore from './EditModel/modelToEditStore';
import { getInstance } from 'd2/lib/d2';
import objectActions from './EditModel/objectActions';
import listActions from './List/list.actions';
import snackActions from './Snackbar/snack.actions';
import { initAppState } from './App/appStateStore';
import OrganisationUnitList from './List/organisation-unit-list/OrganisationUnitList.component.js';
import {fieldFilteringForQuery} from './List/list.store';

function loadObject({ params }, replace, callback) {
    initState({ params });

    if (params.modelId === 'add') {
        getInstance().then((d2) => {
            const modelToEdit = d2.models[params.modelType].create();

            modelToEditStore.setState(modelToEdit);

            callback();
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
    initState({ params });

    if (params.modelType === 'organisationUnit') {
        // Don't load organisation units as they get loaded through the appState
        return callback();
    }

    // Not sure if loading this list should go on the top? :P
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
    });
}

const routes = (
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={MenuCards} onEnter={initState} />
            <Route
                path="list/:groupName"
                component={MenuCards}
                onEnter={initState}
            />
            <Route
                path="list/:groupName/organisationUnit"
                component={OrganisationUnitList}
                onEnter={initStateOrgUnitList}
            />
            <Route
                path="list/:groupName/:modelType"
                component={List}
                onEnter={loadList}
            />
            <Route
                path="edit/:groupName/:modelType/:modelId"
                component={EditModelContainer}
                onEnter={loadObject}
            />
            <Route
                path="clone/:groupName/:modelType/:modelId"
                component={EditModelContainer}
                onEnter={cloneObject}
            />
            <Route
                path="group-editor"
                component={GroupEditorContainer}
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
