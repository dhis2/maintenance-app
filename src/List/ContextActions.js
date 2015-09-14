'use strict';

import Router from 'react-router';
import Action from 'd2-flux/action/Action';

let contextActions = Action.createActionsFromNames(['edit', 'translate']);

contextActions.edit
    .subscribe(function (action) {
        Router.HashLocation.push(['/edit', action.data.modelDefinition.name, action.data.id].join('/'))
    });

export default contextActions;
