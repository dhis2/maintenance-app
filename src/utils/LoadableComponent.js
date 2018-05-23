import React from 'react';
import Loadable from 'react-loadable';
import LoadingMask from '../loading-mask/LoadingMask.component';
import modelToEditStore from '../EditModel/modelToEditStore';
import listStore from '../List/list.store';

modelToEditStore.subscribe(state => console.log('modeltoEditStore: ', state));

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

const LoaderHackzorz = opts => {
    const LoadedComponent = LoadableComponent(opts);
    //Handle loading of component here, as we do it once
 /*   let loaded = null;
    if (!loaded) {
        const promise = opts.loader();
        loaded = {
            error: false,
            loading: true,
            loaded: null,
        };
        loaded.promise = promise
            .then(loadedComp => {
                loaded.loading = false;
                loaded.comp = loadedComp.default;
                console.log(loadedComp);
                console.log(loaded.comp)
                return loaded.comp;
            })
            .catch(err => {
                loaded.loading = false;
                loaded.error = err;
                return err;
            });
    } */
    return class LoaderHack extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                loading: true, //loading of extra promises
                component: null,
                error: false,
            };
        }

        componentWillMount() {
            const promise = modelToEditStore
                .filter(
                    state =>
                        state.sections && state.id === this.props.params.modelId
                )
                .take(1)
                .toPromise();

            promise.then(state => {
                console.log('haczors,state', state);
                this.setState({ loading: false });
            });
            /*
            loaded.promise
                .then(comp =>
                    this.setState({component: comp, error: false })
                )
                .catch(err =>
                    this.setState({
                        error: loaded.error,
                        loaded: null,
                        loading: false,
                    })
                ); */
        }

        render() {
            if(!this.state.loading) {
                return <LoadedComponent {...this.props} />
            }  
            return <LoadingMask />
        }
    };
};

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
export const LoadableWithPreloadedStore = ({ loader: load, ...rest }) => {
    console.log('rest', rest);
    return LoaderHackzorz({ loader: load });
    return LoadableMap({
        loader: {
            Comp: load,
            predefinedStore: () =>
                (() => {
                    console.log('predefinedstore');
                    return modelToEditStore.take(1).toPromise();
                })(),
            /*listStore: () => {
                console.log('takeWhile!');
                return modelToEditStore
                    .takeWhile(state => !state.sections)
                    .toPromise();
            },*/
        },
        render(loaded, props) {
            console.log('render loadable!');
            const Comp = loaded.Comp.default;
            return <Comp {...props} />;
        },
        ...rest,
    });
};
