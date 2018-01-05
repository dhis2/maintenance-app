import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getInstance } from 'd2/lib/d2';


export const withAuth = (Component) => {

    const Auth = (props, { d2 }) => {
        const extraProps = {
            getCurrentUser: () => d2.currentUser,
            getModelDefinitionByName: (modelType) => d2.models[modelType]

        }
        return <Component {...props} {...extraProps} />
    }
    Auth.contextTypes = {
        d2: PropTypes.object
    }
    return Auth;
}

export default withAuth;
