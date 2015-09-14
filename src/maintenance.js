import React from 'react';
import Router from 'react-router';
import {Route, RouteHandler, DefaultRoute, Navigation} from 'react-router';
import App from './App/App.component';
import List from './List/List.component';
import EditModelForm from './EditModel/EditModel.component';
import Action from 'd2-flux/action/Action';

const routeActions = Action.createActionsFromNames(['transition']);

// declare our routes and their hierarchy
const routes = (
    <Route path="/" handler={App}>
        <Route name="list" path="list/:modelType" handler={List} />
        <Route name="edit" path="edit/:modelType/:modelId" handler={EditModelForm} />
    </Route>
);

Router.run(routes, Router.HashLocation, (Root) => {
    React.render(<Root/>, document.getElementById('app'));
    routeActions.transition(Router.HashLocation.getCurrentPath());
});
