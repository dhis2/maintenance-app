import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import log from 'loglevel';

import App from './App/App.component';
import MenuCards from './MenuCards/MenuCardsContainer.component';
import List from './List/List.component';
import EditModelContainer from './EditModel/EditModelContainer.component';
import CloneModelContainer from './EditModel/CloneModelContainer.component';
import GroupEditorContainer from './GroupEditor/GroupEditorContainer.component';

import modelToEditStore from './EditModel/modelToEditStore';
import {getInstance} from 'd2/lib/d2';
import objectActions from './EditModel/objectActions';
import listActions from './List/list.actions';

function loadObject({params}, replace, callback) {

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
                    transition.redirect('list', { modelType: params.modelType });
                    snackActions.show({ message: errorMessage });
                    callback();
                }
            );
    }
}

function loadList({params}, replace, callback) {
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
                    transition.redirect('list', { modelType: nonPluralAttempt });
                    callback();
                } else {
                    log.error('No clue where', params.modelType, 'comes from... Redirecting to app root');
                    log.error(message);
                    transition.redirect('/');
                    callback();
                }
            }
        );
}

const routes = (
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={MenuCards}/>
            <Route
                path="list/:modelType"
                component={List}
                onEnter={loadList}
            />
            <Route
                path="edit/:modelType/:modelId"
                component={EditModelContainer}
                onEnter={loadObject}
            />
            <Route
                path="clone/:modelType/:modelId"
                component={CloneModelContainer}
            />
            <Route
                path="group-editor"
                component={GroupEditorContainer}
            />
        </Route>
    </Router>
);

export default routes;
