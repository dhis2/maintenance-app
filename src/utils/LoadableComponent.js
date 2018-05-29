import React from 'react';
import Loadable from 'react-loadable';
import LoadingMask from '../loading-mask/LoadingMask.component';

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
 * HOC that wraps LoadableComponent with
 * additional loaders (any promise), that should
 * always be resolved before the component is loaded.
 * This is useful to load data before the component is rendered.
 *
 * @param {object} loadableOpts Loadable options
 * @param {Promise[]|Promise} loaders Promises that should be resolved.
 * All the loaders will be called with the props of the component.
 */
export const LoadableWithLoaders = (loadableOpts, loaders) => {
    const LoadedComponent = LoadableComponent(loadableOpts);
    const Loader = loadableOpts.loading || LoadingMask;

    return class WithLoaders extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                loading: true,
                error: false,
            };
        }

        componentWillMount() {
            // Start loading the component instead of waiting for loaders to resolve
            LoadedComponent.preload();
            if (typeof loaders === 'function') {
                loaders = [loaders];
            }
        }

        componentDidMount() {
            this.runLoaders();
        }
        componentWillReceiveProps(nextProps) {
            // reload when switching sections
            if (nextProps.params.modelType !== this.props.params.modelType) {
                this.runLoaders(nextProps);
            }
        }

        runLoaders = (propsToUse = this.props) => {
            Promise.all(loaders.map(loader => loader(propsToUse)))
                .then(() => this.setState({ loading: false }))
                .catch(error => this.setState({ error }));
        };

        render() {
            if (!this.state.loading && !this.state.error) {
                return <LoadedComponent {...this.props} />;
            }
            return <Loader error={this.state.error} />;
        }
    };
};
