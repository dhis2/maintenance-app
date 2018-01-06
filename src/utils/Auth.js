import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getInstance } from 'd2/lib/d2';
import getDisplayName from './getDisplayName';

export const withAuth = (WrappedComponent) => {

    const WithAuth = (props, { d2 }) => {
        const extraProps = {
            getCurrentUser: () => d2.currentUser,
            getModelDefinitionByName: (modelType) => d2.models[modelType]

        }
        return <WrappedComponent {...props} {...extraProps} />
    }
    WithAuth.displayName = `WithAuth(${getDisplayName(WrappedComponent)})`;
    WithAuth.contextTypes = {
        d2: PropTypes.object
    }
    return WithAuth;
}

export default withAuth;
