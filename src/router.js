import React from 'react';
import Router from 'react-router';
import {Route} from 'react-router';
import App from './App/App.component';
import List from './List/List.component';
import EditModelContainer from './EditModel/EditModelContainer.component';
import CloneModelContainer from './EditModel/CloneModelContainer.component';

const routes = (
    <Route path="/" handler={App}>
        <Route name="list" path="list/:modelType" handler={List} />
        <Route name="genericEdit" path="edit/:modelType/:modelId" handler={EditModelContainer} />
        <Route name="genericClone" path="clone/:modelType/:modelId" handler={CloneModelContainer} />
    </Route>
);

// we can create a router instance before "running" it
const router = Router.create({
    routes: routes,
    location: Router.HashLocation,
});

export default router;
