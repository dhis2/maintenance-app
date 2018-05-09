import React from 'react';
import Loadable from 'react-loadable';
import LoadingMask from '../loading-mask/LoadingMask.component';
import modelToEditStore from '../EditModel/modelToEditStore';

const LoadableComponent = opts =>
    Loadable({
        loading: LoadingMask,
        ...opts,
    });

export default LoadableComponent;

export const LoadableMap = opts =>
    Loadable.Map({
        loading: LoadingMask,
        ...opts,
    });

/**
 * A HOC that dynamically loads a component, and ensures modelToEditStore.state being available.
 * Due to removing async routes, and some routes depending on ModelToEditStore.state being available,
    we have a loadable-component-HOC that also makes sure the modelToEditStore is initialized. 
    Preventing race conditions.

    LoadableMap does not complete the loading before both "Comp" (the dynamic-loaded component)
    and predefinedStore-promises resolve.

    @params {object} A react-loadable options object. The only required part of the object is
     'loader': a function with the import() statement.

 */
export const LoadableWithPreloadedStore = ({ loader: load, ...rest }) =>
    LoadableMap({
        loader: {
            Comp: load,
            predefinedStore: () => modelToEditStore.take(1).toPromise(),
        },
        render(loaded, props) {
            const Comp = loaded.Comp.default;
            return <Comp {...props} />;
        },
        ...rest,
    });
