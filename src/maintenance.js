import React from 'react';
import Router from 'react-router';
import Action from 'd2-flux/action/Action';
import router from './router';

const routeActions = Action.createActionsFromNames(['transition']);

router.run((Root) => {
    React.render(<Root/>, document.getElementById('app'));
    routeActions.transition(Router.HashLocation.getCurrentPath());
});
