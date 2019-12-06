import React from 'react';
import { Router, Route, hashHistory } from 'react-router';
import { getInstance } from 'd2/lib/d2'
import { redirectToNewAppRoutes } from './config/redirectToNewAppRoutes';

const redirectToNew = (mary, path) => {
    const url = mary + path
    window.location.replace(url)
}

const redirect = async to => {
    const d2 = await getInstance()
    const api = d2.Api.getApi()
    const baseUrl = d2.system.systemInfo.contextPath
    const modulesUrl = `${baseUrl}/dhis-web-commons/menu/getModules.action`

    api.fetch(modulesUrl)
        .then(r => r.json())
        .then(({ modules }) => {
            const mary = modules.find(module => {
                // @TODO
                return module.name === 'mary'
            })

            redirectToNew(mary, to)
        })
}

const redirectByLocation = ({ location }) => redirect(location.pathname)

const createRouteForPath = path => (
    <Route
        key={path}
        path={path}
        onEnter={redirectByLocation}
    />
)

export const RedirectRouter = () => (
    <Router history={hashHistory}>
        {redirectToNewAppRoutes.map(createRouteForPath)}
    </Router>
)
