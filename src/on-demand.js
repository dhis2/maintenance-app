import React, { Component, PropTypes } from 'react';
import { Observable } from 'rx';
import log from 'loglevel';

class LoadOnDemand extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    componentDidMount() {
        this.subscription = Observable.fromPromise(this.props.loadComponent())
            .subscribe(component => {
                if (!React.isValidElement(component) && typeof component !== 'function') {
                    throw new Error('LoadOnDemand expects a valid React component');
                }

                this.setState({
                    component,
                });
            });
    }

    componentWillUnmount() {
        if (this.subscription && this.subscription.dispose) {
            this.subscription.dispose();
        }
    }

    render() {
        const {
            loadingComponent: LoadingComponent,
            loadingMessage,
        } = this.props.loadingOptions;

        if (!this.state.component) {
            if (LoadingComponent) {
                return (
                    <LoadingComponent />
                );
            }
            return <div>{loadingMessage}</div>
        }

        return (
            <this.state.component {...this.props} />
        );
    }
}
LoadOnDemand.propTypes = {
    loadingOptions: PropTypes.shape({
        loadingComponent: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.func,
            PropTypes.element,
        ]),
        loadingMessage: PropTypes.string,
    }),
    loadComponent: PropTypes.func.isRequired,
};

export function loadOnDemand(loadComponentFactory, loadingOptions = {}) {
    return function OnDemandLoader(props) {
        return <LoadOnDemand {...props} loadComponent={loadComponentFactory} loadingOptions={loadingOptions} />
    };
}

export function loadDefaultOnDemand(loadComponentFactory, loadingOptions) {
    const loadDefaultFromFactory = () => Promise
        .resolve(loadComponentFactory())
        .then(module => module.default)
        .catch(error => {
            log.error('Failed to load component.', error);
            return Promise.reject(error);
        });

    return loadOnDemand(loadDefaultFromFactory, loadingOptions);
}

export default {
    loadDefault: loadDefaultOnDemand,
    load: loadOnDemand,
    LoadOnDemand,
}
